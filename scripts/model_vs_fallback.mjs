import * as tf from '@tensorflow/tfjs-node';
import { loadPlayModel, getModelPlayWithConfidence } from '../js/play_model.js';

// Suppress verbose model debug logs while preserving benchmark summary output
const __origConsoleLog = console.log.bind(console);
console.log = (...args) => {
    try {
        if (args?.[0] && typeof args[0] === 'string' && args[0].startsWith('DEBUG play choice')) return;
    } catch (_) { }
    return __origConsoleLog(...args);
};

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
const SUITS = ['S', 'H', 'D', 'C'];
const RANK_POINTS = { J: 1, Q: 2, K: 3, A: 4 };
const SEAT_ORDER = ['N', 'E', 'S', 'W'];
const SEAT_NUMBER = { N: 0, E: 1, S: 2, W: 3 };

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function deal() {
    const deck = [];
    for (const s of SUITS) {
        for (const r of RANKS) deck.push(`${r}${s}`);
    }
    shuffle(deck);
    const hands = { N: [], E: [], S: [], W: [] };
    SEAT_ORDER.forEach((seat, i) => {
        hands[seat] = deck.slice(i * 13, (i + 1) * 13);
    });
    return hands;
}

function cloneHands(hands) {
    return {
        N: (hands?.N || []).slice(),
        E: (hands?.E || []).slice(),
        S: (hands?.S || []).slice(),
        W: (hands?.W || []).slice()
    };
}

function hcp(cards) {
    return cards.reduce((sum, c) => sum + (RANK_POINTS[c[0]] || 0), 0);
}

function chooseDeclarer(hands) {
    let bestSeat = 'N';
    let bestPts = -1;
    for (const seat of SEAT_ORDER) {
        const pts = hcp(hands[seat]);
        if (pts > bestPts) { bestPts = pts; bestSeat = seat; }
    }
    return bestSeat;
}

function partnerOf(seat) { return seat === 'N' ? 'S' : seat === 'S' ? 'N' : seat === 'E' ? 'W' : 'E'; }
function leftOf(seat) { return seat === 'N' ? 'E' : seat === 'E' ? 'S' : seat === 'S' ? 'W' : 'N'; }

function suitLength(cards, suit) {
    return cards.filter(c => c.endsWith(suit)).length;
}

function chooseTrump(hands, declarer, dummy) {
    const order = ['S', 'H', 'D', 'C'];
    for (const s of order) {
        if (suitLength(hands[declarer], s) + suitLength(hands[dummy], s) >= 8) return s;
    }
    return null; // NT
}

function codeToIndex(code) {
    if (!code) return -1;
    const r = RANKS.indexOf(code[0]);
    const s = SUITS.indexOf(code.slice(-1));
    if (r === -1 || s === -1) return -1;
    return s * 13 + r;
}

function indexToCode(idx) {
    if (idx < 0 || idx > 51) return null;
    const s = SUITS[Math.floor(idx / 13)];
    const r = RANKS[idx % 13];
    return `${r}${s}`;
}

function legalPlays(hand, leadSuit) {
    if (!leadSuit) return hand.slice();
    const follow = hand.filter(c => c.endsWith(leadSuit));
    return follow.length ? follow : hand.slice();
}

function selectFallbackCard({
    legal,
    trick,
    trump,
    seat,
    contractSide,
    handsMutable,
    lastLeadSuit,
    planSuits,
    defenseSignals,
    finessePlan,
    holdUpState,
    throwInState
}) {
    const rankIndex = (code) => RANKS.indexOf(code[0]);
    const sortAsc = (arr) => arr.slice().sort((a, b) => rankIndex(a) - rankIndex(b));
    const sortDesc = (arr) => arr.slice().sort((a, b) => rankIndex(b) - rankIndex(a));
    const sameSide = (s) => contractSide === 'NS' ? (s === 'N' || s === 'S') : (s === 'E' || s === 'W');
    const lead = trick[0] || null;
    const leadSuit = lead ? lead.code.slice(-1) : null;
    const hasLead = leadSuit && legal.some(c => c.endsWith(leadSuit));
    const leaderSideMatches = lead ? sameSide(lead.seat) === sameSide(seat) : false;
    const partner = partnerOf(seat);
    const ourSide = sameSide(seat);
    const activeFinessePlan = finessePlan?.current || null;
    const trickTargetSuit = (!leadSuit) ? null : (trump && trick.some(t => t.code.endsWith(trump)) ? trump : leadSuit);
    const highestInTarget = (!trickTargetSuit) ? -1 : Math.max(-1, ...trick.filter(t => t.code.endsWith(trickTargetSuit)).map(t => rankIndex(t.code)));
    const winningCards = (cards) => cards.filter(c => c.endsWith(trickTargetSuit) && rankIndex(c) > highestInTarget);
    const suitLen = (s, hand) => hand.filter(c => c.endsWith(s)).length;
    const combinedLen = (s) => suitLen(s, handsMutable[seat] || []) + suitLen(s, handsMutable[partner] || []);
    const planSuit = planSuits ? planSuits[seat] : null;
    const combinedTrumpLen = (() => {
        if (!trump) return 0;
        const ours = suitLen(trump, handsMutable[seat] || []);
        const partnerLen = suitLen(trump, handsMutable[partner] || []);
        return ours + partnerLen;
    })();
    const oppTrumpLeft = (() => {
        if (!trump) return 0;
        const oppSeats = SEAT_ORDER.filter(s => !sameSide(s));
        return oppSeats.reduce((sum, s) => sum + suitLen(trump, handsMutable[s] || []), 0);
    })();
    const trumpHonorCount = (() => {
        if (!trump) return 0;
        const honors = new Set(['A', 'K', 'Q', 'J']);
        let count = 0;
        (handsMutable[seat] || []).forEach(c => { if (c.endsWith(trump) && honors.has(c[0])) count++; });
        (handsMutable[partner] || []).forEach(c => { if (c.endsWith(trump) && honors.has(c[0])) count++; });
        return count;
    })();
    const shortSuitRuffPotential = (() => {
        if (!trump) return false;
        for (const s of SUITS) {
            if (s === trump) continue;
            const lenSeat = suitLen(s, handsMutable[seat] || []);
            const lenPartner = suitLen(s, handsMutable[partner] || []);
            if (Math.min(lenSeat, lenPartner) <= 1 && Math.max(lenSeat, lenPartner) >= 3) return true;
        }
        return false;
    })();
    const entryCount = (() => {
        let c = 0;
        for (const s of SUITS) {
            if (s === trump) continue;
            if (suitLen(s, handsMutable[seat] || []) > 0) c++;
            if (suitLen(s, handsMutable[partner] || []) > 0) c++;
        }
        return c;
    })();
    const defensePreferredSuit = defenseSignals?.preferred || null;
    const defenseDiscourageSuit = defenseSignals?.discourage || null;
    const holdUps = holdUpState?.counts || null;
    const throwIns = throwInState?.counts || null;
    const cardsInSuit = (s, who) => (handsMutable[who] || []).filter(c => c.endsWith(s));
    const pickLowest = (arr) => sortAsc(arr)[0];
    const pickLowestSpot = (arr) => {
        const spots = arr.filter(c => !['A', 'K', 'Q', 'J', 'T'].includes(c[0]));
        return spots.length ? pickLowest(spots) : pickLowest(arr);
    };
    const handCount = (handsMutable[seat] || []).length;

    // Simple declarer finesse plan: if partner holds a tenace (AQ, KJ with ace support, QJ with top cover) and we can lead toward it,
    // lead a low card from this hand and mark the honor for partner to play third hand.
    const chooseFinesseLead = () => {
        if (leadSuit) return null;
        if (!ourSide) return null;
        const suits = SUITS.filter(s => s !== trump);
        for (const s of suits) {
            const myCards = cardsInSuit(s, seat);
            if (!myCards.length) continue;
            const partnerCards = cardsInSuit(s, partner);
            if (partnerCards.length < 2) continue;
            const partnerRanks = new Set(partnerCards.map(c => c[0]));
            const combinedRanks = new Set([...myCards, ...partnerCards].map(c => c[0]));
            const setPlan = (targetHonor) => {
                if (finessePlan) finessePlan.current = { suit: s, target: targetHonor, honorSeat: partner };
                return pickLowestSpot(myCards);
            };
            if (partnerRanks.has('A') && partnerRanks.has('Q') && !combinedRanks.has('K')) {
                return setPlan('Q');
            }
            if (partnerRanks.has('K') && partnerRanks.has('J') && combinedRanks.has('A') && !combinedRanks.has('Q')) {
                return setPlan('J');
            }
            if (partnerRanks.has('Q') && partnerRanks.has('J') && combinedRanks.has('A') && !combinedRanks.has('K')) {
                return setPlan('Q');
            }
        }
        return null;
    };

    // Lead selection with NT/trump awareness and honor safety
    if (!leadSuit) {
        // Endplay-style throw-in: when holding a tenace (AQx missing K) and a garbage exit suit, toss them in late to force a return
        if (ourSide && throwIns) {
            const tenaceSuits = SUITS.filter(s => {
                const ranks = new Set(cardsInSuit(s, seat).concat(cardsInSuit(s, partner)).map(c => c[0]));
                return ranks.has('A') && ranks.has('Q') && !ranks.has('K');
            });
            const exitSuit = SUITS
                .map(s => {
                    const cards = legal.filter(c => c.endsWith(s));
                    if (!cards.length) return null;
                    const honorCount = cards.filter(c => ['A', 'K', 'Q', 'J', 'T'].includes(c[0])).length;
                    return { suit: s, cards, honorCount };
                })
                .filter(Boolean)
                .filter(o => o.honorCount === 0 && !tenaceSuits.includes(o.suit));
            const nearEnd = handCount <= 6;
            if (tenaceSuits.length && exitSuit.length) {
                const pickExit = exitSuit.find(o => (throwIns[o.suit] || 0) < 1 && o.cards.length);
                const oppTrumpsGone = (!trump || oppTrumpLeft === 0);
                const haveEntryAfter = legal.some(c => ['A', 'K', 'Q', 'J'].includes(c[0]));
                if (pickExit && (nearEnd || oppTrumpsGone) && haveEntryAfter) {
                    throwIns[pickExit.suit] = (throwIns[pickExit.suit] || 0) + 1;
                    return sortAsc(pickExit.cards)[0];
                }
            }
        }

        // Late-stage squeeze pressure: cash top winners from longest honor suit when trumps are gone or in NT
        if (ourSide) {
            const late = handCount <= 5;
            const trumpsGone = (!trump || oppTrumpLeft === 0);
            if (late && trumpsGone) {
                const squeezeSuit = SUITS
                    .map(s => {
                        const cards = legal.filter(c => c.endsWith(s));
                        if (!cards.length) return null;
                        const honorCount = cards.filter(c => ['A', 'K', 'Q', 'J', 'T'].includes(c[0])).length;
                        return { suit: s, cards, honorCount };
                    })
                    .filter(Boolean)
                    .filter(o => o.honorCount > 0)
                    .sort((a, b) => b.honorCount - a.honorCount || b.cards.length - a.cards.length || rankIndex(sortDesc(a.cards)[0]) - rankIndex(sortDesc(b.cards)[0]));
                const pick = squeezeSuit[0];
                if (pick) {
                    const desc = sortDesc(pick.cards);
                    let topSequenceCard = null;
                    for (let i = 0; i < desc.length - 1; i++) {
                        if (rankIndex(desc[i]) - rankIndex(desc[i + 1]) === 1) { topSequenceCard = desc[i]; break; }
                    }
                    return topSequenceCard || desc[0];
                }
            }
        }

        const finesseLead = chooseFinesseLead();
        if (finesseLead) return finesseLead;
        const suitChoices = SUITS
            .map(s => {
                const cards = legal.filter(c => c.endsWith(s));
                if (!cards.length) return null;
                const honorCount = cards.filter(c => ['A', 'K', 'Q', 'J', 'T'].includes(c[0])).length;
                const length = cards.length;
                let score = length * 2 + honorCount;
                const hasHighHonor = cards.some(c => ['A', 'K', 'Q'].includes(c[0]));
                const hasHonor = honorCount > 0;
                const loneOrShortHonor = hasHighHonor && length <= 3 && honorCount === 1;
                const isNT = !trump;
                if (trump && s === trump) {
                    if (ourSide) {
                        const wantToDraw = oppTrumpLeft > 0 && trumpHonorCount >= 2 && !shortSuitRuffPotential;
                        if (wantToDraw) {
                            score += (combinedTrumpLen >= 4 ? 12 : 8);
                            if (entryCount >= 3) score += 2;
                        } else score -= 4;
                    } else {
                        score -= (length >= 5 ? 0 : 6);
                    }
                } else if (trump && ourSide && s !== trump) {
                    if (length >= 5 && honorCount > 0 && entryCount >= 2) score += 2;
                } else if (isNT) {
                    const seqBonus = (() => {
                        const desc = cards.slice().sort((a, b) => rankIndex(b) - rankIndex(a));
                        for (let i = 0; i < desc.length - 1; i++) {
                            if (rankIndex(desc[i]) - rankIndex(desc[i + 1]) === 1) return 3;
                        }
                        return 0;
                    })();
                    score += (length >= 4 ? 6 : 0) + (honorCount ? 2 : 0) + seqBonus;
                    if (loneOrShortHonor) score -= 4;
                    const hasAceOnly = cards.some(c => c[0] === 'A') && honorCount === 1;
                    if (!ourSide && hasAceOnly) score -= 3;
                    if (ourSide) {
                        score += combinedLen(s);
                        if (entryCount >= 2 && length >= 4) score += 3;
                        if (hasAceOnly && planSuit && planSuit !== s) score -= 5;
                    }
                    if (!ourSide) {
                        if (!hasHonor) score -= 3;
                        if (length >= 5 && hasHonor) score += 4;
                        if (length <= 2 && hasHonor) score -= 5;
                    }
                }
                if (isNT && ourSide && planSuit && planSuit === s) score += 5;
                if (isNT && ourSide && planSuit && planSuit !== s && combinedLen(planSuit) > combinedLen(s)) score -= 5;
                if (!ourSide && defensePreferredSuit && defensePreferredSuit === s) score += 4;
                if (!ourSide && defenseDiscourageSuit && defenseDiscourageSuit === s) score -= 3;
                if (!ourSide && lastLeadSuit && lastLeadSuit === s) score += 5;
                if (!ourSide && hasHighHonor && length <= 2) score -= 4;
                if (!ourSide && loneOrShortHonor) score -= 3;
                if (hasHighHonor && length <= 2) score -= 2;
                return { suit: s, cards, score, length, honorCount };
            })
            .filter(Boolean)
            .sort((a, b) => b.score - a.score || b.length - a.length || b.honorCount - a.honorCount);
        const pick = suitChoices[0];
        if (pick) {
            const desc = sortDesc(pick.cards);
            let topSequenceCard = null;
            for (let i = 0; i < desc.length - 1; i++) {
                if (rankIndex(desc[i]) - rankIndex(desc[i + 1]) === 1) {
                    topSequenceCard = desc[i];
                    break;
                }
            }
            const isNT = !trump;
            const trumpLeadAsDeclarer = ourSide && trump && pick.suit === trump && oppTrumpLeft > 0;
            if (isNT && ourSide && planSuits && !planSuits[seat]) planSuits[seat] = pick.suit;
            if (trumpLeadAsDeclarer) return topSequenceCard || desc[0];
            if (isNT) {
                if (topSequenceCard) return topSequenceCard;
                const asc = sortAsc(pick.cards);
                if (!ourSide) {
                    if (pick.length >= 4 && pick.honorCount > 0) {
                        const idx = Math.min(3, asc.length - 1);
                        return asc[idx];
                    }
                    return asc[0];
                }
                const idx = Math.min(3, asc.length - 1);
                return idx >= 0 ? asc[idx] : asc[0];
            }
            if (!ourSide && trump && pick.suit !== trump && pick.length >= 4) {
                const asc = sortAsc(pick.cards);
                const idx = Math.min(3, asc.length - 1);
                return asc[idx];
            }
            return topSequenceCard || sortAsc(pick.cards)[0];
        }
    }

    if (hasLead) {
        const leadPlays = legal.filter(c => c.endsWith(leadSuit));
        const leadIsHonor = lead ? rankIndex(lead.code) >= rankIndex('J') : false;
        const winningOptions = trickTargetSuit ? winningCards(leadPlays) : [];
        if (leaderSideMatches && ourSide && activeFinessePlan && activeFinessePlan.suit === leadSuit && activeFinessePlan.honorSeat === seat) {
            const targetCard = leadPlays.find(c => c[0] === activeFinessePlan.target);
            if (targetCard) return targetCard;
            const altHonor = leadPlays.find(c => ['A', 'K', 'Q', 'J'].includes(c[0]));
            if (altHonor) return altHonor;
        }
        if (leaderSideMatches && !ourSide && !winningOptions.length) {
            const hasHonorInSuit = leadPlays.some(c => ['A', 'K', 'Q'].includes(c[0]));
            const encourage = hasHonorInSuit || leadPlays.length >= 4;
            const asc = sortAsc(leadPlays);
            const desc = sortDesc(leadPlays);
            if (defenseSignals) {
                if (encourage) { defenseSignals.preferred = leadSuit; defenseSignals.discourage = null; }
                else defenseSignals.discourage = leadSuit;
            }
            return encourage ? desc[0] : asc[0];
        }
        if (!trump && ourSide && !leaderSideMatches && trickTargetSuit === leadSuit) {
            const hasAce = leadPlays.some(c => c[0] === 'A');
            if (hasAce && leadPlays.length >= 2 && holdUps) {
                const used = holdUps[leadSuit] || 0;
                if (used < 1) {
                    holdUps[leadSuit] = used + 1;
                    return sortAsc(leadPlays)[0];
                }
            }
        }
        if (!leaderSideMatches && leadIsHonor && trickTargetSuit === leadSuit) {
            const touching = leadPlays.filter(c => rankIndex(c) === rankIndex(lead.code) + 1);
            if (touching.length) return touching.sort((a, b) => rankIndex(a) - rankIndex(b))[0];
            const higher = winningOptions.filter(c => rankIndex(c) <= rankIndex(lead.code) + 2);
            if (higher.length) return higher.sort((a, b) => rankIndex(a) - rankIndex(b))[0];
            return sortAsc(leadPlays)[0];
        }
        if (trump && leadSuit === trump && ourSide) {
            return winningOptions.length
                ? winningOptions.sort((a, b) => rankIndex(b) - rankIndex(a))[0]
                : sortDesc(leadPlays)[0];
        }
        if (leaderSideMatches && leadIsHonor) {
            return winningOptions.length ? winningOptions.sort((a, b) => rankIndex(b) - rankIndex(a))[0] : sortAsc(leadPlays)[0];
        }
        if (leaderSideMatches && !leadIsHonor) {
            return winningOptions.length ? winningOptions.sort((a, b) => rankIndex(b) - rankIndex(a))[0] : sortAsc(leadPlays)[0];
        }
        return winningOptions.length ? winningOptions.sort((a, b) => rankIndex(a) - rankIndex(b))[0] : sortAsc(leadPlays)[0];
    }

    // Void in lead suit
    const currentLeader = trick.length ? computeTrickWinner(trick, trump) : null;
    const leaderOnOurSide = currentLeader ? sameSide(currentLeader) : false;
    const trumpCards = trump ? legal.filter(c => c.endsWith(trump)) : [];
    if (leaderOnOurSide) {
        const discards = trump ? legal.filter(c => !c.endsWith(trump)) : legal.slice();
        if (discards.length) {
            const suits = SUITS.filter(s => s !== trump);
            let bestSuit = null;
            let bestLen = -1;
            for (const s of suits) {
                const len = discards.filter(c => c.endsWith(s)).length;
                if (len > bestLen) { bestLen = len; bestSuit = s; }
            }
            const suitCards = bestSuit ? discards.filter(c => c.endsWith(bestSuit)) : [];
            if (defenseSignals && bestSuit) defenseSignals.preferred = bestSuit;
            if (suitCards.length) return sortDesc(suitCards)[0];
            return sortAsc(discards)[0];
        }
    }
    if (trumpCards.length) {
        const highestTrump = Math.max(-1, ...trick.filter(t => t.code.endsWith(trump)).map(t => rankIndex(t.code)));
        const winningTrumps = trumpCards.filter(c => rankIndex(c) > highestTrump);
        if (winningTrumps.length) return sortAsc(winningTrumps)[0];
        const pitch = legal.filter(c => !c.endsWith(trump));
        if (pitch.length) return sortAsc(pitch)[0];
        return sortAsc(trumpCards)[0];
    }
    return sortAsc(legal)[0];
}

function computeTrickWinner(trick, trump) {
    if (!trick.length) return null;
    const leadSuit = trick[0].code.slice(-1);
    const pool = (trump && trick.some(t => t.code.endsWith(trump)))
        ? trick.filter(t => t.code.endsWith(trump))
        : trick.filter(t => t.code.endsWith(leadSuit));
    const rankIndex = (code) => RANKS.indexOf(code[0]);
    return pool.reduce((best, cur) => (rankIndex(cur.code) > rankIndex(best.code) ? cur : best)).seat;
}

function computeDuplicateScore(contract, _side, tricksWon, vul) {
    const level = contract.level;
    const strain = contract.strain; // 'C','D','H','S','NT'
    const required = 6 + level;
    const over = tricksWon - required;
    const isMajor = (strain === 'H' || strain === 'S');
    const dbl = contract.dbl || 0; // 0/1/2
    const multiplier = dbl === 0 ? 1 : (dbl === 1 ? 2 : 4);
    const trickValue = strain === 'NT' ? 30 : isMajor ? 30 : 20;
    const firstNTBonus = strain === 'NT' ? 10 : 0;
    const breakdown = { trickPoints: 0, insult: 0, gameBonus: 0, partScoreBonus: 0, slamBonus: 0, overtricks: 0, penalties: 0 };

    if (over < 0) {
        const u = -over;
        if (dbl === 0) {
            breakdown.penalties = (vul ? 100 : 50) * u;
            return { total: -breakdown.penalties, breakdown };
        }
        const first = vul ? 200 : 100;
        const secondThird = vul ? 300 : 200;
        const subsequent = 300; // both vul and non-vul
        let pen = 0;
        if (u >= 1) pen += first;
        if (u >= 2) pen += secondThird;
        if (u >= 3) pen += secondThird;
        if (u >= 4) pen += subsequent * (u - 3);
        if (dbl === 2) pen *= 2;
        breakdown.penalties = pen;
        return { total: -pen, breakdown };
    }

    let baseTrickPoints = (strain === 'NT' ? (firstNTBonus + trickValue * level) : (trickValue * level));
    let trickPoints = baseTrickPoints * multiplier;
    let score = trickPoints;
    breakdown.trickPoints = trickPoints;
    if (dbl === 1) { score += 50; breakdown.insult = 50; }
    if (dbl === 2) { score += 100; breakdown.insult = 100; }
    if (trickPoints >= 100) {
        const gb = vul ? 500 : 300;
        score += gb; breakdown.gameBonus = gb;
    } else {
        score += 50; breakdown.partScoreBonus = 50;
    }
    if (over > 0) {
        if (dbl === 0) {
            const val = over * (strain === 'NT' ? 30 : isMajor ? 30 : 20);
            score += val; breakdown.overtricks = val;
        } else if (dbl === 1) {
            const val = over * (vul ? 200 : 100);
            score += val; breakdown.overtricks = val;
        } else {
            const val = over * (vul ? 400 : 200);
            score += val; breakdown.overtricks = val;
        }
    }
    if (level === 6) { const b = vul ? 750 : 500; score += b; breakdown.slamBonus = b; }
    if (level === 7) { const b = vul ? 1500 : 1000; score += b; breakdown.slamBonus = b; }
    return { total: score, breakdown };
}

async function playHand({ useModel, hands: providedHands, captureLog = false }) {
    const hands = providedHands ? cloneHands(providedHands) : deal();
    const initialHands = cloneHands(hands);
    const declarer = chooseDeclarer(hands);
    const dummy = partnerOf(declarer);
    const trump = chooseTrump(hands, declarer, dummy);
    const strain = trump ? trump : 'NT';
    const contract = { level: trump ? (trump === 'S' || trump === 'H' ? 4 : 5) : 3, strain, dbl: 0 };
    const contractSide = (declarer === 'N' || declarer === 'S') ? 'NS' : 'EW';
    let leader = leftOf(declarer);
    let tricksNS = 0, tricksEW = 0;
    const handsMutable = Object.fromEntries(SEAT_ORDER.map(s => [s, hands[s].slice()]));
    const playedIdx = new Set();

    const trickLog = [];
    let lastLeadSuit = null;
    const planSuits = { N: null, E: null, S: null, W: null };
    const defenseSignals = { preferred: null, discourage: null };
    const finessePlan = { current: null };
    const holdUpState = { counts: { S: 0, H: 0, D: 0, C: 0 } };
    const throwInState = { counts: { S: 0, H: 0, D: 0, C: 0 } };
    const modelConfidences = [];
    for (let trickNo = 0; trickNo < 13; trickNo++) {
        const trick = [];
        finessePlan.current = null;
        for (let i = 0; i < 4; i++) {
            const seat = (i === 0) ? leader : leftOf(trick[i - 1].seat);
            const hand = handsMutable[seat];
            const leadSuit = trick.length ? trick[0].code.slice(-1) : null;
            const legal = legalPlays(hand, leadSuit);
            let card = selectFallbackCard({
                legal,
                trick,
                trump,
                seat,
                contractSide,
                handsMutable,
                lastLeadSuit,
                planSuits,
                defenseSignals,
                finessePlan,
                holdUpState,
                throwInState
            });
            if (useModel) {
                const legalIdx = legal.map(codeToIndex).filter(i => i >= 0);
                const gameState = {
                    hand: Array.from({ length: 52 }, (_, idx) => hand.some(c => codeToIndex(c) === idx)),
                    contract: [contract.level, contract.strain, declarer, contract.dbl, 0, 0, 1],
                    trickHistory: Array.from(playedIdx),
                    currentTrick: trick.map(p => codeToIndex(p.code)).filter(i => i >= 0),
                    currentPlayer: SEAT_NUMBER[seat],
                    vulnerability: 0
                };
                const result = await getModelPlayWithConfidence(gameState, legalIdx);
                const modelChoice = result?.card;
                if (modelChoice !== null && modelChoice !== undefined) {
                    const fromModel = (typeof modelChoice === 'number') ? indexToCode(modelChoice) : modelChoice;
                    if (fromModel && legal.includes(fromModel)) {
                        card = fromModel;
                        if (typeof result?.confidence === 'number') modelConfidences.push(result.confidence * 100);
                    }
                }
            }
            // remove card
            const idx = hand.indexOf(card);
            if (idx >= 0) hand.splice(idx, 1);
            trick.push({ seat, code: card });
            playedIdx.add(codeToIndex(card));
            if (trick.length === 1) lastLeadSuit = card.slice(-1);
        }
        const winner = computeTrickWinner(trick, trump);
        if (captureLog) {
            trickLog.push({
                trickNo,
                lead: trick[0]?.code.slice(-1) || null,
                plays: trick.map(p => ({ seat: p.seat, code: p.code })),
                winner
            });
        }
        if (winner === 'N' || winner === 'S') tricksNS++; else tricksEW++;
        leader = winner;
    }
    const tricksDecl = contractSide === 'NS' ? tricksNS : tricksEW;
    const score = computeDuplicateScore(contract, contractSide, tricksDecl, false).total;
    const avgConfidence = modelConfidences.length
        ? modelConfidences.reduce((sum, c) => sum + c, 0) / modelConfidences.length
        : null;
    return {
        score,
        contractSide,
        declarer,
        dummy,
        trump,
        contract,
        tricksNS,
        tricksEW,
        avgConfidence,
        hands: initialHands,
        trickLog: captureLog ? trickLog : undefined
    };
}

async function main() {
    globalThis.tf = tf;
    await loadPlayModel();
    let modelBetter = 0;
    let fallbackBetter = 0;
    let ties = 0;
    const confBetter = [];
    const confWorse = [];
    const confTies = [];
    const betterStats = {
        total: 0,
        nt: 0,
        suit: 0,
        level3: 0,
        level4: 0,
        level5: 0,
        badTrumpBreak: 0,
        unbalancedDeclarer: 0
    };
    const iterations = Number.parseInt(process.env.DEALS ?? process.argv[2] ?? '100', 10) || 100;
    const losingSamples = [];
    for (let i = 0; i < iterations; i++) {
        const hands = deal();
        const withModel = await playHand({ useModel: true, hands });
        const withFallback = await playHand({ useModel: false, hands });
        if (withModel.score > withFallback.score) {
            modelBetter++;
            if (withModel.avgConfidence !== null) confBetter.push(withModel.avgConfidence);
            // categorize outcome for model-better deals
            betterStats.total++;
            const strain = withModel.contract?.strain || null;
            const level = withModel.contract?.level || null;
            if (strain === 'NT') betterStats.nt++; else betterStats.suit++;
            if (level === 3) betterStats.level3++; else if (level === 4) betterStats.level4++; else if (level === 5) betterStats.level5++;
            const trump = withModel.trump;
            if (trump) {
                const oppSeats = ['N', 'E', 'S', 'W'].filter(s => !((withModel.contractSide === 'NS' && (s === 'N' || s === 'S')) || (withModel.contractSide === 'EW' && (s === 'E' || s === 'W'))));
                const oppLens = oppSeats.map(s => hands[s].filter(c => c.endsWith(trump)).length);
                const maxOpp = Math.max(...oppLens);
                const minOpp = Math.min(...oppLens);
                if (maxOpp >= 5 || (maxOpp - minOpp) >= 3) betterStats.badTrumpBreak++;
            }
            // Declarer unbalanced if has 6+ card suit or any singleton/void
            const declarerHand = hands[withModel.declarer] || [];
            const suitLens = SUITS.map(s => declarerHand.filter(c => c.endsWith(s)).length);
            const hasLong = suitLens.some(l => l >= 6);
            const hasShort = suitLens.some(l => l <= 1);
            if (hasLong || hasShort) betterStats.unbalancedDeclarer++;
        } else if (withFallback.score > withModel.score) {
            fallbackBetter++;
            if (withModel.avgConfidence !== null) confWorse.push(withModel.avgConfidence);
        } else {
            ties++;
            if (withModel.avgConfidence !== null) confTies.push(withModel.avgConfidence);
        }
        if (withModel.score > withFallback.score && losingSamples.length < 5) {
            // Re-run to capture trick-by-trick logs for inspection
            const modelLog = await playHand({ useModel: true, hands, captureLog: true });
            const fallbackLog = await playHand({ useModel: false, hands, captureLog: true });
            losingSamples.push({
                deal: i + 1,
                trump: fallbackLog.trump,
                contract: fallbackLog.contract,
                modelScore: modelLog.score,
                fallbackScore: fallbackLog.score,
                hands,
                modelTricks: modelLog.trickLog,
                fallbackTricks: fallbackLog.trickLog
            });
        }
    }
    console.log(`Model vs fallback over ${iterations} deals`);
    console.log({ modelBetter, fallbackBetter, ties });
    const avg = (arr) => arr.length ? (arr.reduce((s, v) => s + v, 0) / arr.length) : null;
    console.log('Model confidence averages by outcome (%):');
    console.log({ modelBetter: avg(confBetter), ties: avg(confTies), modelWorse: avg(confWorse) });
    console.log('Model confidence sample counts:', {
        modelBetter: confBetter.length,
        ties: confTies.length,
        modelWorse: confWorse.length
    });
    if (betterStats.total > 0) {
        const pct = (v) => Math.round((v / betterStats.total) * 1000) / 10; // one decimal percent
        console.log('Model-better deal makeup (% of modelBetter):');
        console.log({
            nt: pct(betterStats.nt),
            suit: pct(betterStats.suit),
            level3: pct(betterStats.level3),
            level4: pct(betterStats.level4),
            level5: pct(betterStats.level5),
            badTrumpBreak: pct(betterStats.badTrumpBreak),
            unbalancedDeclarer: pct(betterStats.unbalancedDeclarer)
        });
    }
    if (losingSamples.length) {
        console.log('Sample losing deals (model better):');
        console.log(JSON.stringify(losingSamples, null, 2));
    }
}

main().catch(err => {
    console.error('Comparison run failed:', err);
    process.exit(1);
});
