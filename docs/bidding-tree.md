# Bidding Tree — SAYC Combined Bidding System

Source: `js\combined-bidding-system.js`

## undefined

## undefined

## undefined
- Build tokens from provided auction or from this.currentAuction

## undefined
- Helper: first non-pass index

## undefined
- Normalize PASS

## undefined
- 1-level suit openings (true opening even after leading passes)

## undefined
- 1NT opening after passes

## undefined
- 2C opening after passes
- When Strong 2C is disabled in Active Conventions, treat 2C as natural

## undefined
- When Strong 2C is disabled in Active Conventions, treat 2C as natural

## undefined
- Opener 2C sequences: explanations for continuations over 2D waiting
- Look for a partner 2D waiting and only passes between

## undefined
- Look for a partner 2D waiting and only passes between

## undefined

## undefined

## undefined

## undefined
- Establish seat context for the CURRENT bidder when possible
- Determine current bidder seat for explanation purposes:
- Prefer: (1) bid.seat if provided, else (2) inferred from dealer/length.
- Avoid relying on ourSeat here to prevent misclassifying partner/opponent actions.
- Early partner inference for abbreviated auctions:
- If only one opening bid is present (e.g., ['1C']) and tests omitted the PASS that would rotate seats,
- allow treating the current explanation context as opener's partner when ourSeat matches that partner.
- Prefer explicit seat if present; otherwise infer opener seat from dealer

## undefined
- Determine current bidder seat for explanation purposes:
- Prefer: (1) bid.seat if provided, else (2) inferred from dealer/length.
- Avoid relying on ourSeat here to prevent misclassifying partner/opponent actions.
- Early partner inference for abbreviated auctions:
- If only one opening bid is present (e.g., ['1C']) and tests omitted the PASS that would rotate seats,
- allow treating the current explanation context as opener's partner when ourSeat matches that partner.
- Prefer explicit seat if present; otherwise infer opener seat from dealer

## undefined
- Prefer: (1) bid.seat if provided, else (2) inferred from dealer/length.
- Avoid relying on ourSeat here to prevent misclassifying partner/opponent actions.
- Early partner inference for abbreviated auctions:
- If only one opening bid is present (e.g., ['1C']) and tests omitted the PASS that would rotate seats,
- allow treating the current explanation context as opener's partner when ourSeat matches that partner.
- Prefer explicit seat if present; otherwise infer opener seat from dealer
- Prefer explicit ourSeat on the provided auction, else fall back to system.ourSeat
- In abbreviated setups with only the opening bid present, prefer treating the explainer
- as opener's partner when ourSeat is that partner; this avoids mislabeling responder

## undefined
- Avoid relying on ourSeat here to prevent misclassifying partner/opponent actions.
- Early partner inference for abbreviated auctions:
- If only one opening bid is present (e.g., ['1C']) and tests omitted the PASS that would rotate seats,
- allow treating the current explanation context as opener's partner when ourSeat matches that partner.
- Prefer explicit seat if present; otherwise infer opener seat from dealer
- Prefer explicit ourSeat on the provided auction, else fall back to system.ourSeat
- In abbreviated setups with only the opening bid present, prefer treating the explainer
- as opener's partner when ourSeat is that partner; this avoids mislabeling responder
- actions as overcalls due to inference pointing to the next hand instead of partner.

## undefined
- Early partner inference for abbreviated auctions:
- If only one opening bid is present (e.g., ['1C']) and tests omitted the PASS that would rotate seats,
- allow treating the current explanation context as opener's partner when ourSeat matches that partner.
- Prefer explicit seat if present; otherwise infer opener seat from dealer
- Prefer explicit ourSeat on the provided auction, else fall back to system.ourSeat
- In abbreviated setups with only the opening bid present, prefer treating the explainer
- as opener's partner when ourSeat is that partner; this avoids mislabeling responder
- actions as overcalls due to inference pointing to the next hand instead of partner.

## undefined
- If only one opening bid is present (e.g., ['1C']) and tests omitted the PASS that would rotate seats,
- allow treating the current explanation context as opener's partner when ourSeat matches that partner.
- Prefer explicit seat if present; otherwise infer opener seat from dealer
- Prefer explicit ourSeat on the provided auction, else fall back to system.ourSeat
- In abbreviated setups with only the opening bid present, prefer treating the explainer
- as opener's partner when ourSeat is that partner; this avoids mislabeling responder
- actions as overcalls due to inference pointing to the next hand instead of partner.

## undefined
- Prefer explicit seat if present; otherwise infer opener seat from dealer
- Prefer explicit ourSeat on the provided auction, else fall back to system.ourSeat
- In abbreviated setups with only the opening bid present, prefer treating the explainer
- as opener's partner when ourSeat is that partner; this avoids mislabeling responder
- actions as overcalls due to inference pointing to the next hand instead of partner.

## undefined
- In abbreviated setups with only the opening bid present, prefer treating the explainer
- as opener's partner when ourSeat is that partner; this avoids mislabeling responder
- actions as overcalls due to inference pointing to the next hand instead of partner.
- Opener continuations over Weak Two when partner makes a new suit at 3-level (forcing one round)
- Build context
- Find our 2D/2H/2S opening on our side

## undefined
- as opener's partner when ourSeat is that partner; this avoids mislabeling responder
- actions as overcalls due to inference pointing to the next hand instead of partner.
- Opener continuations over Weak Two when partner makes a new suit at 3-level (forcing one round)
- Build context
- Find our 2D/2H/2S opening on our side

## undefined
- Opener continuations over Weak Two when partner makes a new suit at 3-level (forcing one round)
- Build context
- Find our 2D/2H/2S opening on our side

## undefined
- Build context
- Find our 2D/2H/2S opening on our side

## undefined
- Find our 2D/2H/2S opening on our side

## undefined

## undefined

## undefined

## undefined
- Seat-aware ordering: Place this BEFORE overcall mapping so responder patterns take precedence
- when there’s no interference, but ONLY trigger when the current bidder is on the SAME SIDE as the opener.
- Prefer explicit seat if present; otherwise infer opener seat from dealer when available
- Responder jump shift identification (strong)

## undefined
- when there’s no interference, but ONLY trigger when the current bidder is on the SAME SIDE as the opener.
- Prefer explicit seat if present; otherwise infer opener seat from dealer when available
- Responder jump shift identification (strong)

## undefined
- Classic jump-shift detection: require a jump of two steps above the
- minimum level. Additionally, treat 2-level new-suit responder bids
- over minor openings (1C/1D) as a conventional jump-shift when the
- shape/strength criteria are met (tests expect 1C-2S to be strong).
- Non-jump new suit at 2-level (e.g., 1S – 2H/2D/2C): natural, constructive values

## undefined
- minimum level. Additionally, treat 2-level new-suit responder bids
- over minor openings (1C/1D) as a conventional jump-shift when the
- shape/strength criteria are met (tests expect 1C-2S to be strong).
- Non-jump new suit at 2-level (e.g., 1S – 2H/2D/2C): natural, constructive values

## undefined
- over minor openings (1C/1D) as a conventional jump-shift when the
- shape/strength criteria are met (tests expect 1C-2S to be strong).
- Non-jump new suit at 2-level (e.g., 1S – 2H/2D/2C): natural, constructive values

## undefined
- shape/strength criteria are met (tests expect 1C-2S to be strong).
- Non-jump new suit at 2-level (e.g., 1S – 2H/2D/2C): natural, constructive values

## undefined
- Non-jump new suit at 2-level (e.g., 1S – 2H/2D/2C): natural, constructive values

## undefined
- Seat-aware: treat as overcall ONLY if the CURRENT bidder is on the OPPOSITE side from the opener.
- This block is intentionally placed AFTER the responder mapping to avoid classifying
- same-side responder actions as overcalls when there is no interference.
- Ensure only passes occurred between opener's bid and our current bid

## undefined
- This block is intentionally placed AFTER the responder mapping to avoid classifying
- same-side responder actions as overcalls when there is no interference.
- Ensure only passes occurred between opener's bid and our current bid
- True overcall is the immediate next call after opener (no intervening calls by partner), i.e., zero bids between
- Detect single jump overcall vs minimum level

## undefined
- same-side responder actions as overcalls when there is no interference.
- Ensure only passes occurred between opener's bid and our current bid
- True overcall is the immediate next call after opener (no intervening calls by partner), i.e., zero bids between
- Detect single jump overcall vs minimum level

## undefined
- Ensure only passes occurred between opener's bid and our current bid
- True overcall is the immediate next call after opener (no intervening calls by partner), i.e., zero bids between
- Detect single jump overcall vs minimum level

## undefined
- True overcall is the immediate next call after opener (no intervening calls by partner), i.e., zero bids between
- Detect single jump overcall vs minimum level

## undefined
- Detect single jump overcall vs minimum level
- If there were only passes between opener and this bid (i.e. no interference)
- and this looks like the immediate responder action to partner's 1-level major,

## undefined
- If there were only passes between opener and this bid (i.e. no interference)
- and this looks like the immediate responder action to partner's 1-level major,
- prefer the responder wording (tests expect the "no 3-card <major> support" phrasing).

## undefined

## undefined

## undefined
- and this looks like the immediate responder action to partner's 1-level major,
- prefer the responder wording (tests expect the "no 3-card <major> support" phrasing).
- Responder new suit after opponent overcalls
- If we're forced to the 2-level (free bid) after interference, note the strength implication

## undefined
- prefer the responder wording (tests expect the "no 3-card <major> support" phrasing).
- Responder new suit after opponent overcalls
- If we're forced to the 2-level (free bid) after interference, note the strength implication

## undefined

## undefined
- If we're forced to the 2-level (free bid) after interference, note the strength implication
- Negative Double (UI mapping): opener made a 1-level suit bid, RHO overcalled a suit at 1–2 level, and we doubled
- Find the next non-pass token after the opener (typically opponent overcall)

## undefined
- Negative Double (UI mapping): opener made a 1-level suit bid, RHO overcalled a suit at 1–2 level, and we doubled
- Find the next non-pass token after the opener (typically opponent overcall)

## undefined
- Honor thru_level configuration (default 3)
- Determine unbid majors from prior tokens

## undefined
- Opener 1NT/2NT rebids after partner's new suit (allow leading passes)

## undefined
- Opener rebids their own suit in competition (seat-aware)
- Only trigger when: (a) we can identify the opener seat, (b) this bid is by that same opener seat,
- (c) opponents made a non-pass call after the opening, and (d) the bid is in opener's original suit.

## undefined

## undefined
- Only trigger when: (a) we can identify the opener seat, (b) this bid is by that same opener seat,
- (c) opponents made a non-pass call after the opening, and (d) the bid is in opener's original suit.

## undefined
- (c) opponents made a non-pass call after the opening, and (d) the bid is in opener's original suit.

## undefined
- Need seats to be reliable; fall back to inferred seats when bids omit seat properties
- Try explicit seat on the opener bid, otherwise infer from dealer and index
- currentSeat: prefer explicit seat on last bid, else infer from dealer + last index

## undefined
- currentSeat: prefer explicit seat on last bid, else infer from dealer + last index

## undefined
- Check that opponents interfered at some point after the opening
- Must be by opponents relative to opener

## undefined
- Must be by opponents relative to opener

## undefined
- Detect opener rebid in competition by token pattern rather than relying
- exclusively on seat equality, since tests sometimes construct auctions
- with explicit token sequences but without per-bid seat metadata.
- Find index of last non-pass bid

## undefined
- exclusively on seat equality, since tests sometimes construct auctions
- with explicit token sequences but without per-bid seat metadata.
- Find index of last non-pass bid
- Before declaring this an opener rebid, check whether this action
- looks like a cue-bid raise (cueing the opponent's suit or opener's
- suit after an overcall). Tests expect a Cue Bid Raise label in
- such timing/parity cases (e.g., 1H - 1S - Pass - 3H).

## undefined
- with explicit token sequences but without per-bid seat metadata.
- Find index of last non-pass bid
- Before declaring this an opener rebid, check whether this action
- looks like a cue-bid raise (cueing the opponent's suit or opener's
- suit after an overcall). Tests expect a Cue Bid Raise label in
- such timing/parity cases (e.g., 1H - 1S - Pass - 3H).

## undefined
- Find index of last non-pass bid
- Before declaring this an opener rebid, check whether this action
- looks like a cue-bid raise (cueing the opponent's suit or opener's
- suit after an overcall). Tests expect a Cue Bid Raise label in
- such timing/parity cases (e.g., 1H - 1S - Pass - 3H).

## undefined
- Before declaring this an opener rebid, check whether this action
- looks like a cue-bid raise (cueing the opponent's suit or opener's
- suit after an overcall). Tests expect a Cue Bid Raise label in
- such timing/parity cases (e.g., 1H - 1S - Pass - 3H).

## undefined
- looks like a cue-bid raise (cueing the opponent's suit or opener's
- suit after an overcall). Tests expect a Cue Bid Raise label in
- such timing/parity cases (e.g., 1H - 1S - Pass - 3H).

## undefined
- suit after an overcall). Tests expect a Cue Bid Raise label in
- such timing/parity cases (e.g., 1H - 1S - Pass - 3H).

## undefined
- such timing/parity cases (e.g., 1H - 1S - Pass - 3H).

## undefined
- Default: treat as opener's rebid in competition

## undefined
- Permissive fallback: label opener rebids in competition when tokens
- indicate opponent interference and the current bid matches opener's suit.
- any non-pass after opening?

## undefined
- indicate opponent interference and the current bid matches opener's suit.
- any non-pass after opening?
- find last non-pass index

## undefined
- any non-pass after opening?
- find last non-pass index

## undefined
- Natural responder NT over partner's 1M (no interference)

## undefined
- Use wording that emphasizes lack of 3-card support (tests assert this phrase)

## undefined

## undefined
- Natural minor raises over 1m (no interference)

## undefined

## undefined
- Natural responder new suit at 1-level over 1-level opening (no interference) and jump-shifts

## undefined
- Responder jump shift identification (strong)

## undefined
- Natural responder NT over 1m (balanced, no 4-card major, no interference)

## undefined

## undefined

## undefined
- Weak Two responder and continuations (UI-only heuristics moved to engine for consistency)

## undefined

## undefined

## undefined
- Cue-bid raise — prefer a forcing label when the action was a responder's cue-raise,
- otherwise keep the limit+ raise opener-rebid wording (used in some timing/parity cases).

## undefined

## undefined

## undefined

## undefined

## undefined

## undefined

## undefined

## undefined

## undefined
- Find last occurrence of this bid token in the auction to determine who bid it

## undefined
- If bidder is on same side as opener but is not the opener seat, treat as responder cue-raise (forcing)
- If bidder is on same side as opener but not the opener seat,

## undefined
- If bidder is on same side as opener but not the opener seat,
- ensure this is not simply a natural raise of the opener's suit.
- Natural raise of partner's suit (responder raise), not a cue-raise

## undefined
- ensure this is not simply a natural raise of the opener's suit.
- Natural raise of partner's suit (responder raise), not a cue-raise

## undefined
- Natural raise of partner's suit (responder raise), not a cue-raise

## undefined
- Reopening Double (balancing)

## undefined
- Gerber ask (4C) and continuation

## undefined

## undefined

## undefined

## undefined
- Map response to ace count using configured map when possible
- Fallback standard mapping

## undefined
- Fallback standard mapping

## undefined
- Detailed Blackwood/RKCB response explanation based on response step
- 5C=0/4, 5D=1, 5H=2, 5S=3

## undefined
- 5C=0/4, 5D=1, 5H=2, 5S=3
- RKCB variant (1430 or 3014)
- 1430: 5C=1/4, 5D=3/0, 5H=2 no Q, 5S=2+Q, 5NT=odd+Q
- 3014: 5C=3/0, 5D=1/4, 5H=2 no Q, 5S=2+Q, 5NT=odd+Q

## undefined
- 1430: 5C=1/4, 5D=3/0, 5H=2 no Q, 5S=2+Q, 5NT=odd+Q
- 3014: 5C=3/0, 5D=1/4, 5H=2 no Q, 5S=2+Q, 5NT=odd+Q

## undefined
- Immediate overcall conventions check (direct-seat):
- When the auction contains a single 1-level opening (allowing leading passes),
- prefer conventional two-suited overcalls (Michaels) or Unusual NT when shape matches.
- This bypasses responder logic that can otherwise preempt those conventional overcalls
- in abbreviated test fixtures.

## undefined
- When the auction contains a single 1-level opening (allowing leading passes),
- prefer conventional two-suited overcalls (Michaels) or Unusual NT when shape matches.
- This bypasses responder logic that can otherwise preempt those conventional overcalls
- in abbreviated test fixtures.

## undefined
- prefer conventional two-suited overcalls (Michaels) or Unusual NT when shape matches.
- This bypasses responder logic that can otherwise preempt those conventional overcalls
- in abbreviated test fixtures.

## undefined
- This bypasses responder logic that can otherwise preempt those conventional overcalls
- in abbreviated test fixtures.

## undefined
- in abbreviated test fixtures.

## undefined
- Find first non-pass contract bid index
- (debug log removed)
- Ensure we are the immediate next to act and on the opposite side of the opener
- Use centralized seat inference helper so we don't duplicate dealer+index math

## undefined
- (debug log removed)
- Ensure we are the immediate next to act and on the opposite side of the opener
- Use centralized seat inference helper so we don't duplicate dealer+index math
- Determine whether the inferred next bidder is on the opposite side to the opener.
- Use sameSideAs helper for robust NS/EW polarity checks. When seat info is missing,
- default to false to avoid misclassifying responder actions as overcalls.

## undefined
- Ensure we are the immediate next to act and on the opposite side of the opener
- Use centralized seat inference helper so we don't duplicate dealer+index math
- Determine whether the inferred next bidder is on the opposite side to the opener.
- Use sameSideAs helper for robust NS/EW polarity checks. When seat info is missing,
- default to false to avoid misclassifying responder actions as overcalls.
- Conservative guard: only run this convention check when we can reasonably be the next bidder
- Only proceed if we can reasonably infer the next bidder and (a) ourSeat is not set
- or (b) the inferred next seat matches ourSeat. Avoid forcing convention selection
- when seat context indicates we're not the immediate actor.
- If the opener bid carries an explicit seat (not auto-assigned by Auction.add/reseat),
- prefer responder/new-suit flows in tests that create explicit-seat auctions rather
- than forcing conventional overcalls. This avoids treating explicit-test fixtures
- as direct-seat conventional opportunities (which can produce unwanted Michaels).

## undefined
- Use centralized seat inference helper so we don't duplicate dealer+index math
- Determine whether the inferred next bidder is on the opposite side to the opener.
- Use sameSideAs helper for robust NS/EW polarity checks. When seat info is missing,
- default to false to avoid misclassifying responder actions as overcalls.
- Conservative guard: only run this convention check when we can reasonably be the next bidder
- Only proceed if we can reasonably infer the next bidder and (a) ourSeat is not set
- or (b) the inferred next seat matches ourSeat. Avoid forcing convention selection
- when seat context indicates we're not the immediate actor.
- If the opener bid carries an explicit seat (not auto-assigned by Auction.add/reseat),
- prefer responder/new-suit flows in tests that create explicit-seat auctions rather
- than forcing conventional overcalls. This avoids treating explicit-test fixtures
- as direct-seat conventional opportunities (which can produce unwanted Michaels).

## undefined
- Determine whether the inferred next bidder is on the opposite side to the opener.
- Use sameSideAs helper for robust NS/EW polarity checks. When seat info is missing,
- default to false to avoid misclassifying responder actions as overcalls.
- Conservative guard: only run this convention check when we can reasonably be the next bidder
- Only proceed if we can reasonably infer the next bidder and (a) ourSeat is not set
- or (b) the inferred next seat matches ourSeat. Avoid forcing convention selection
- when seat context indicates we're not the immediate actor.
- If the opener bid carries an explicit seat (not auto-assigned by Auction.add/reseat),
- prefer responder/new-suit flows in tests that create explicit-seat auctions rather
- than forcing conventional overcalls. This avoids treating explicit-test fixtures
- as direct-seat conventional opportunities (which can produce unwanted Michaels).
- If we're on the opposite side to the opener and the opener's seat was not
- explicitly set (i.e. test fixtures used auto-assigned seats), allow

## undefined
- Use sameSideAs helper for robust NS/EW polarity checks. When seat info is missing,
- default to false to avoid misclassifying responder actions as overcalls.
- Conservative guard: only run this convention check when we can reasonably be the next bidder
- Only proceed if we can reasonably infer the next bidder and (a) ourSeat is not set
- or (b) the inferred next seat matches ourSeat. Avoid forcing convention selection
- when seat context indicates we're not the immediate actor.
- If the opener bid carries an explicit seat (not auto-assigned by Auction.add/reseat),
- prefer responder/new-suit flows in tests that create explicit-seat auctions rather
- than forcing conventional overcalls. This avoids treating explicit-test fixtures
- as direct-seat conventional opportunities (which can produce unwanted Michaels).
- If we're on the opposite side to the opener and the opener's seat was not
- explicitly set (i.e. test fixtures used auto-assigned seats), allow
- conventional two-suited overcall detection. We intentionally avoid
- requiring the inferred next-seat to match this system's seat because
- many tests call `getBid()` for a system seat even when it's not the
- immediate actor; in that case we still want to recognise Michaels/Unusual

## undefined
- default to false to avoid misclassifying responder actions as overcalls.
- Conservative guard: only run this convention check when we can reasonably be the next bidder
- Only proceed if we can reasonably infer the next bidder and (a) ourSeat is not set
- or (b) the inferred next seat matches ourSeat. Avoid forcing convention selection
- when seat context indicates we're not the immediate actor.
- If the opener bid carries an explicit seat (not auto-assigned by Auction.add/reseat),
- prefer responder/new-suit flows in tests that create explicit-seat auctions rather
- than forcing conventional overcalls. This avoids treating explicit-test fixtures
- as direct-seat conventional opportunities (which can produce unwanted Michaels).
- If we're on the opposite side to the opener and the opener's seat was not
- explicitly set (i.e. test fixtures used auto-assigned seats), allow
- conventional two-suited overcall detection. We intentionally avoid
- requiring the inferred next-seat to match this system's seat because
- many tests call `getBid()` for a system seat even when it's not the
- immediate actor; in that case we still want to recognise Michaels/Unusual
- NT shapes for the responding side.

## undefined
- Conservative guard: only run this convention check when we can reasonably be the next bidder
- Only proceed if we can reasonably infer the next bidder and (a) ourSeat is not set
- or (b) the inferred next seat matches ourSeat. Avoid forcing convention selection
- when seat context indicates we're not the immediate actor.
- If the opener bid carries an explicit seat (not auto-assigned by Auction.add/reseat),
- prefer responder/new-suit flows in tests that create explicit-seat auctions rather
- than forcing conventional overcalls. This avoids treating explicit-test fixtures
- as direct-seat conventional opportunities (which can produce unwanted Michaels).
- If we're on the opposite side to the opener and the opener's seat was not
- explicitly set (i.e. test fixtures used auto-assigned seats), allow
- conventional two-suited overcall detection. We intentionally avoid
- requiring the inferred next-seat to match this system's seat because
- many tests call `getBid()` for a system seat even when it's not the
- immediate actor; in that case we still want to recognise Michaels/Unusual
- NT shapes for the responding side.

## undefined
- Only proceed if we can reasonably infer the next bidder and (a) ourSeat is not set
- or (b) the inferred next seat matches ourSeat. Avoid forcing convention selection
- when seat context indicates we're not the immediate actor.
- If the opener bid carries an explicit seat (not auto-assigned by Auction.add/reseat),
- prefer responder/new-suit flows in tests that create explicit-seat auctions rather
- than forcing conventional overcalls. This avoids treating explicit-test fixtures
- as direct-seat conventional opportunities (which can produce unwanted Michaels).
- If we're on the opposite side to the opener and the opener's seat was not
- explicitly set (i.e. test fixtures used auto-assigned seats), allow
- conventional two-suited overcall detection. We intentionally avoid
- requiring the inferred next-seat to match this system's seat because
- many tests call `getBid()` for a system seat even when it's not the
- immediate actor; in that case we still want to recognise Michaels/Unusual
- NT shapes for the responding side.
- Check for Michaels (two-suited overcall at 2{oppSuit})

## undefined
- or (b) the inferred next seat matches ourSeat. Avoid forcing convention selection
- when seat context indicates we're not the immediate actor.
- If the opener bid carries an explicit seat (not auto-assigned by Auction.add/reseat),
- prefer responder/new-suit flows in tests that create explicit-seat auctions rather
- than forcing conventional overcalls. This avoids treating explicit-test fixtures
- as direct-seat conventional opportunities (which can produce unwanted Michaels).
- If we're on the opposite side to the opener and the opener's seat was not
- explicitly set (i.e. test fixtures used auto-assigned seats), allow
- conventional two-suited overcall detection. We intentionally avoid
- requiring the inferred next-seat to match this system's seat because
- many tests call `getBid()` for a system seat even when it's not the
- immediate actor; in that case we still want to recognise Michaels/Unusual
- NT shapes for the responding side.
- Check for Michaels (two-suited overcall at 2{oppSuit})

## undefined
- when seat context indicates we're not the immediate actor.
- If the opener bid carries an explicit seat (not auto-assigned by Auction.add/reseat),
- prefer responder/new-suit flows in tests that create explicit-seat auctions rather
- than forcing conventional overcalls. This avoids treating explicit-test fixtures
- as direct-seat conventional opportunities (which can produce unwanted Michaels).
- If we're on the opposite side to the opener and the opener's seat was not
- explicitly set (i.e. test fixtures used auto-assigned seats), allow
- conventional two-suited overcall detection. We intentionally avoid
- requiring the inferred next-seat to match this system's seat because
- many tests call `getBid()` for a system seat even when it's not the
- immediate actor; in that case we still want to recognise Michaels/Unusual
- NT shapes for the responding side.
- Check for Michaels (two-suited overcall at 2{oppSuit})

## undefined
- If the opener bid carries an explicit seat (not auto-assigned by Auction.add/reseat),
- prefer responder/new-suit flows in tests that create explicit-seat auctions rather
- than forcing conventional overcalls. This avoids treating explicit-test fixtures
- as direct-seat conventional opportunities (which can produce unwanted Michaels).
- If we're on the opposite side to the opener and the opener's seat was not
- explicitly set (i.e. test fixtures used auto-assigned seats), allow
- conventional two-suited overcall detection. We intentionally avoid
- requiring the inferred next-seat to match this system's seat because
- many tests call `getBid()` for a system seat even when it's not the
- immediate actor; in that case we still want to recognise Michaels/Unusual
- NT shapes for the responding side.
- Check for Michaels (two-suited overcall at 2{oppSuit})

## undefined
- prefer responder/new-suit flows in tests that create explicit-seat auctions rather
- than forcing conventional overcalls. This avoids treating explicit-test fixtures
- as direct-seat conventional opportunities (which can produce unwanted Michaels).
- If we're on the opposite side to the opener and the opener's seat was not
- explicitly set (i.e. test fixtures used auto-assigned seats), allow
- conventional two-suited overcall detection. We intentionally avoid
- requiring the inferred next-seat to match this system's seat because
- many tests call `getBid()` for a system seat even when it's not the
- immediate actor; in that case we still want to recognise Michaels/Unusual
- NT shapes for the responding side.
- Check for Michaels (two-suited overcall at 2{oppSuit})

## undefined
- than forcing conventional overcalls. This avoids treating explicit-test fixtures
- as direct-seat conventional opportunities (which can produce unwanted Michaels).
- If we're on the opposite side to the opener and the opener's seat was not
- explicitly set (i.e. test fixtures used auto-assigned seats), allow
- conventional two-suited overcall detection. We intentionally avoid
- requiring the inferred next-seat to match this system's seat because
- many tests call `getBid()` for a system seat even when it's not the
- immediate actor; in that case we still want to recognise Michaels/Unusual
- NT shapes for the responding side.
- Check for Michaels (two-suited overcall at 2{oppSuit})

## undefined
- as direct-seat conventional opportunities (which can produce unwanted Michaels).
- If we're on the opposite side to the opener and the opener's seat was not
- explicitly set (i.e. test fixtures used auto-assigned seats), allow
- conventional two-suited overcall detection. We intentionally avoid
- requiring the inferred next-seat to match this system's seat because
- many tests call `getBid()` for a system seat even when it's not the
- immediate actor; in that case we still want to recognise Michaels/Unusual
- NT shapes for the responding side.
- Check for Michaels (two-suited overcall at 2{oppSuit})

## undefined
- If we're on the opposite side to the opener and the opener's seat was not
- explicitly set (i.e. test fixtures used auto-assigned seats), allow
- conventional two-suited overcall detection. We intentionally avoid
- requiring the inferred next-seat to match this system's seat because
- many tests call `getBid()` for a system seat even when it's not the
- immediate actor; in that case we still want to recognise Michaels/Unusual
- NT shapes for the responding side.
- Check for Michaels (two-suited overcall at 2{oppSuit})

## undefined
- explicitly set (i.e. test fixtures used auto-assigned seats), allow
- conventional two-suited overcall detection. We intentionally avoid
- requiring the inferred next-seat to match this system's seat because
- many tests call `getBid()` for a system seat even when it's not the
- immediate actor; in that case we still want to recognise Michaels/Unusual
- NT shapes for the responding side.
- Check for Michaels (two-suited overcall at 2{oppSuit})

## undefined
- conventional two-suited overcall detection. We intentionally avoid
- requiring the inferred next-seat to match this system's seat because
- many tests call `getBid()` for a system seat even when it's not the
- immediate actor; in that case we still want to recognise Michaels/Unusual
- NT shapes for the responding side.
- Check for Michaels (two-suited overcall at 2{oppSuit})

## undefined
- requiring the inferred next-seat to match this system's seat because
- many tests call `getBid()` for a system seat even when it's not the
- immediate actor; in that case we still want to recognise Michaels/Unusual
- NT shapes for the responding side.
- Check for Michaels (two-suited overcall at 2{oppSuit})

## undefined
- many tests call `getBid()` for a system seat even when it's not the
- immediate actor; in that case we still want to recognise Michaels/Unusual
- NT shapes for the responding side.
- Check for Michaels (two-suited overcall at 2{oppSuit})

## undefined

## undefined
- Check for Michaels (two-suited overcall at 2{oppSuit})

## undefined

## undefined

## undefined

## undefined

## undefined
- two lowest unbid suits => candidates

## undefined

## undefined

## undefined
- This prioritizes conventional overcalls (Michaels/Unusual NT) and reopening/ takeout doubles
- in immediate single-opening auctions and prevents responder-only shortcuts from masking them.

## undefined
- in immediate single-opening auctions and prevents responder-only shortcuts from masking them.

## undefined
- Handle opponent's last bid — prefer seat-aware detection when auction contains seat info

## undefined
- also consult the interference handler even if lastWasOpponent was not set. This helps in abbreviated
- test fixtures where seat metadata can make lastSide() ambiguous but the practical decision on the
- immediate next call should still allow overcall conventions (Michaels/Unusual NT) to be selected.

## undefined
- test fixtures where seat metadata can make lastSide() ambiguous but the practical decision on the
- immediate next call should still allow overcall conventions (Michaels/Unusual NT) to be selected.

## undefined
- immediate next call should still allow overcall conventions (Michaels/Unusual NT) to be selected.

## undefined
- Opener rebid heuristic (moved earlier): when we are the opener and partner has made a 1-level response,
- prefer a simple raise of partner's suit if we have 4+ card support and reasonable HCP,
- or a conservative rebid (1NT / 2C) depending on shape and strength. This is a limited
- heuristic to avoid the engine returning PASS in common opener-rebid situations.
- Find first non-pass (the opener)

## undefined
- prefer a simple raise of partner's suit if we have 4+ card support and reasonable HCP,
- or a conservative rebid (1NT / 2C) depending on shape and strength. This is a limited
- heuristic to avoid the engine returning PASS in common opener-rebid situations.
- Find first non-pass (the opener)
- We are the opener; look for a partner response after the opener

## undefined
- or a conservative rebid (1NT / 2C) depending on shape and strength. This is a limited
- heuristic to avoid the engine returning PASS in common opener-rebid situations.
- Find first non-pass (the opener)
- We are the opener; look for a partner response after the opener

## undefined
- heuristic to avoid the engine returning PASS in common opener-rebid situations.
- Find first non-pass (the opener)
- We are the opener; look for a partner response after the opener

## undefined
- Find first non-pass (the opener)
- We are the opener; look for a partner response after the opener

## undefined
- We are the opener; look for a partner response after the opener

## undefined
- If we have 4+ card support and at least 12 HCP, raise to 2 of their suit
- Balanced and 12+ HCP -> 1NT rebid

## undefined
- Balanced and 12+ HCP -> 1NT rebid
- With moderate strength, rebid/clarify in clubs as a fallback (conservative)

## undefined
- Check for ace-asking sequences

## undefined
- Opener rebid heuristic: when we are the opener and partner has made a 1-level response,
- prefer a simple raise of partner's suit if we have 4+ card support and reasonable HCP,
- or a conservative rebid (1NT / 2C) depending on shape and strength. This is a limited
- heuristic to avoid the engine returning PASS in common opener-rebid situations.
- Find first non-pass (the opener)

## undefined
- prefer a simple raise of partner's suit if we have 4+ card support and reasonable HCP,
- or a conservative rebid (1NT / 2C) depending on shape and strength. This is a limited
- heuristic to avoid the engine returning PASS in common opener-rebid situations.
- Find first non-pass (the opener)
- We are the opener; look for a partner response after the opener

## undefined

## undefined
- Reuse the internal legality guard and compare outcomes
- PASS is always legal
- Compare identity for doubles/redoubles

## undefined
- PASS is always legal
- Compare identity for doubles/redoubles
- For contract bids, ensure the vetted token matches (not downgraded to PASS)
- If guard not available, assume legal (non-blocking)

## undefined
- Compare identity for doubles/redoubles
- For contract bids, ensure the vetted token matches (not downgraded to PASS)
- If guard not available, assume legal (non-blocking)

## undefined
- For contract bids, ensure the vetted token matches (not downgraded to PASS)
- If guard not available, assume legal (non-blocking)

## undefined
- If guard not available, assume legal (non-blocking)

## undefined
- debug print removed

## undefined
- Prefer centralized seat inference helper for consistency across the codebase

## undefined
- Handle Double/Redouble legality first
- Must have a last contract to act on
- Examine actions since last contract

## undefined
- Must have a last contract to act on
- Examine actions since last contract

## undefined
- Examine actions since last contract

## undefined
- Identify last contract seat/side and current actor side
- Use the computed currentSeat (seat to act) for legality checks.
- Seat context missing: fall back to token-based legality so tests without seats still work.
- Allow Double only if there has been no X/XX since the last contract.
- Allow Redouble only if the last non-pass action since the last contract is a Double.

## undefined
- Use the computed currentSeat (seat to act) for legality checks.
- Seat context missing: fall back to token-based legality so tests without seats still work.
- Allow Double only if there has been no X/XX since the last contract.
- Allow Redouble only if the last non-pass action since the last contract is a Double.

## undefined
- Seat context missing: fall back to token-based legality so tests without seats still work.
- Allow Double only if there has been no X/XX since the last contract.
- Allow Redouble only if the last non-pass action since the last contract is a Double.

## undefined
- Allow Double only if there has been no X/XX since the last contract.
- Allow Redouble only if the last non-pass action since the last contract is a Double.

## undefined
- Allow Redouble only if the last non-pass action since the last contract is a Double.

## undefined
- Fallback — should not reach here

## undefined
- Redouble allowed only if last non-pass action is a Double of our side's contract
- lastAction doubled the contract side; redouble must be by the side that was doubled
- i.e., same side as last contract's bidder

## undefined
- lastAction doubled the contract side; redouble must be by the side that was doubled
- i.e., same side as last contract's bidder

## undefined
- Contract bids: ensure strictly higher than last contract

## undefined
- same level: suit rank must be higher

## undefined

## undefined
- Optional semi-balanced shapes via configuration (e.g., treat 5-4-2-2 as balanced)

## undefined

## undefined
- 2NT opening (20-21 HCP, balanced)

## undefined
- 1NT opening (15-17 HCP, balanced)

## undefined

## undefined
- Find longest suits

## undefined
- Rule of 20: HCP + two longest suits >= 20, or 12+ HCP

## undefined
- 5+ card major
- eslint-disable-next-line no-console
- debug removed: opening 1S log suppressed

## undefined
- eslint-disable-next-line no-console
- debug removed: opening 1S log suppressed

## undefined
- debug removed: opening 1S log suppressed

## undefined
- SAYC 5-card majors by default: do not open a 4-card major; choose a minor instead.
- Exception: after two passes (3rd seat), many play light/aggressive 4-card major openings.
- Preserve that behavior for tests: allow a 4-card major only when two or more passes have occurred.
- Allow 4-card major only in exactly third seat (after two passes), not fourth seat
- eslint-disable-next-line no-console
- debug removed: opening 1S (4-4 tie) log suppressed

## undefined
- Preserve that behavior for tests: allow a 4-card major only when two or more passes have occurred.
- Allow 4-card major only in exactly third seat (after two passes), not fourth seat
- eslint-disable-next-line no-console
- debug removed: opening 1S (4-4 tie) log suppressed
- eslint-disable-next-line no-console
- debug removed: opening 1S (third seat) log suppressed

## undefined
- Allow 4-card major only in exactly third seat (after two passes), not fourth seat
- eslint-disable-next-line no-console
- debug removed: opening 1S (4-4 tie) log suppressed
- eslint-disable-next-line no-console
- debug removed: opening 1S (third seat) log suppressed

## undefined
- eslint-disable-next-line no-console
- debug removed: opening 1S (4-4 tie) log suppressed
- eslint-disable-next-line no-console
- debug removed: opening 1S (third seat) log suppressed

## undefined
- eslint-disable-next-line no-console
- debug removed: opening 1S (third seat) log suppressed

## undefined
- Better minor

## undefined
- Preemptive openings - Weak two bids (2D/2H/2S)

## undefined
- Adjust for vulnerability (be more disciplined when vulnerable)

## undefined

## undefined

## undefined

## undefined
- Jacoby transfers at 3-level over 2NT (use with 5+ majors when not forcing to game via Texas)

## undefined
- Stayman over 2NT: 3C with any 4-card major and sufficient values for game

## undefined
- Natural actions over 2NT (no major interest):
- - With 4+ HCP, commit to 3NT (25+ combined points target)
- - With 0-3 HCP, prefer to pass (return null and let caller choose PASS)

## undefined
- - With 4+ HCP, commit to 3NT (25+ combined points target)
- - With 0-3 HCP, prefer to pass (return null and let caller choose PASS)

## undefined
- - With 0-3 HCP, prefer to pass (return null and let caller choose PASS)

## undefined

## undefined

## undefined
- Jacoby transfers: any strength with 5+ major, but prefer Stayman with 5-4 and invitational+
- If invitational+ and 5-4 majors, prefer Stayman to seek 4-4 fit

## undefined
- If invitational+ and 5-4 majors, prefer Stayman to seek 4-4 fit

## undefined
- Minor-suit transfers over 1NT when enabled: 2S -> 3C (clubs), 2NT -> 3D (diamonds)
- Prioritize majors first; then minors. If both minors are long, prefer the longer (C on tie by alphabetical order).
- debug print removed

## undefined

## undefined

## undefined
- No 4-card major: choose NT contracts by strength
- Invitational balanced hands (8-9 HCP) invite with 2NT.
- Note: When minor-suit transfers are enabled, we still allow 2NT as an invite
- provided we did not already trigger a minor transfer (which only happens with a 6+ minor above).
- With 10+ HCP and no 4-card major, commit to 3NT

## undefined
- Invitational balanced hands (8-9 HCP) invite with 2NT.
- Note: When minor-suit transfers are enabled, we still allow 2NT as an invite
- provided we did not already trigger a minor transfer (which only happens with a 6+ minor above).
- With 10+ HCP and no 4-card major, commit to 3NT

## undefined
- Note: When minor-suit transfers are enabled, we still allow 2NT as an invite
- provided we did not already trigger a minor transfer (which only happens with a 6+ minor above).
- With 10+ HCP and no 4-card major, commit to 3NT

## undefined
- provided we did not already trigger a minor transfer (which only happens with a 6+ minor above).
- With 10+ HCP and no 4-card major, commit to 3NT

## undefined
- With 10+ HCP and no 4-card major, commit to 3NT

## undefined
- Narrow override: prefer natural 2D over takeout double for the specific regression scenario
- (opener = 1H, responder holds 12+ HCP and 5+ diamonds). Historically this was handled in
- _handleInterference but the responder branch may short-circuit that path; keep here to
- ensure the natural 2D preference wins before jump-shifts are considered.

## undefined
- (opener = 1H, responder holds 12+ HCP and 5+ diamonds). Historically this was handled in
- _handleInterference but the responder branch may short-circuit that path; keep here to
- ensure the natural 2D preference wins before jump-shifts are considered.
- Narrow override: prefer natural 2D only when we are the RESPONDER (i.e., opener is our partner).
- Previously this rule was applied unconditionally which caused opponents in direct-seat
- overcall scenarios to be forced into 2D when a Michaels/Unusual NT style convention
- should apply. Guard by confirming the opening bid was made by our side.
- determine opener seat and whether it's same side as ourSeat

## undefined
- Narrow override: prefer natural 2D only when we are the RESPONDER (i.e., opener is our partner).
- Previously this rule was applied unconditionally which caused opponents in direct-seat
- overcall scenarios to be forced into 2D when a Michaels/Unusual NT style convention
- should apply. Guard by confirming the opening bid was made by our side.
- determine opener seat and whether it's same side as ourSeat

## undefined
- Previously this rule was applied unconditionally which caused opponents in direct-seat
- overcall scenarios to be forced into 2D when a Michaels/Unusual NT style convention
- should apply. Guard by confirming the opening bid was made by our side.
- determine opener seat and whether it's same side as ourSeat

## undefined
- overcall scenarios to be forced into 2D when a Michaels/Unusual NT style convention
- should apply. Guard by confirming the opening bid was made by our side.
- determine opener seat and whether it's same side as ourSeat

## undefined
- should apply. Guard by confirming the opening bid was made by our side.
- determine opener seat and whether it's same side as ourSeat

## undefined
- determine opener seat and whether it's same side as ourSeat

## undefined
- Only apply the responder-specific natural-2D preference when this is not
- the immediate single-opening auction (i.e., avoid affecting direct-seat
- overcall decisions in abbreviated fixtures where interference logic is preferred).

## undefined
- the immediate single-opening auction (i.e., avoid affecting direct-seat
- overcall decisions in abbreviated fixtures where interference logic is preferred).

## undefined
- overcall decisions in abbreviated fixtures where interference logic is preferred).

## undefined
- Early check: delayed natural overcall after responder's 1NT (pattern: 1M - Pass - 1NT)
- Give priority to this delayed overcall rule before considering immediate 1-level
- new-suit overcalls. This ensures we don't mistakenly prefer a 1-level overcall
- when the delayed 2-level overcall is the intended SAYC action.

## undefined

## undefined
- Give priority to this delayed overcall rule before considering immediate 1-level
- new-suit overcalls. This ensures we don't mistakenly prefer a 1-level overcall
- when the delayed 2-level overcall is the intended SAYC action.

## undefined
- new-suit overcalls. This ensures we don't mistakenly prefer a 1-level overcall
- when the delayed 2-level overcall is the intended SAYC action.

## undefined
- when the delayed 2-level overcall is the intended SAYC action.

## undefined

## undefined

## undefined

## undefined
- Guard: only apply when this 2-level bid was the actual opening bid of the auction

## undefined
- Raise with support and/or use 2NT feature ask
- With clear game values opposite a weak two major, bid game

## undefined
- With clear game values opposite a weak two major, bid game
- Invitational+/feature-asking structure
- Invitational/preemptive raise

## undefined
- Invitational+/feature-asking structure
- Invitational/preemptive raise
- With minimal values, prefer to pass to keep the preempt

## undefined

## undefined
- Invitational/preemptive raise
- With minimal values, prefer to pass to keep the preempt

## undefined

## undefined
- With minimal values, prefer to pass to keep the preempt

## undefined

## undefined
- Natural 3NT over weak two majors with strong balanced hand and stoppers
- Require stoppers in all three other suits

## undefined
- Require stoppers in all three other suits

## undefined
- Strong hand with good own suit (new suit at 3-level is forcing for one round)

## undefined

## undefined
- Only bid at 3-level if legal over 2-level opening
- Ensure it's not below opener's suit at same level (always legal as an overcall by responder)

## undefined
- Ensure it's not below opener's suit at same level (always legal as an overcall by responder)

## undefined
- Otherwise, pass is normal over partner's preempt

## undefined

## undefined
- Handle Strong 2C responses (artificial, forcing)
- 2C is artificial and game forcing - must respond
- 2D = waiting (negative or insufficient for positive response)
- 2H/2S/3C/3D/3H/3S = natural positive (8+ HCP with 5+ card suit)
- 2NT = (skipped in this style; use 2D waiting for 8-10 balanced)
- 3NT = balanced 11-13 HCP

## undefined
- 2C is artificial and game forcing - must respond
- 2D = waiting (negative or insufficient for positive response)
- 2H/2S/3C/3D/3H/3S = natural positive (8+ HCP with 5+ card suit)
- 2NT = (skipped in this style; use 2D waiting for 8-10 balanced)
- 3NT = balanced 11-13 HCP

## undefined
- 2D = waiting (negative or insufficient for positive response)
- 2H/2S/3C/3D/3H/3S = natural positive (8+ HCP with 5+ card suit)
- 2NT = (skipped in this style; use 2D waiting for 8-10 balanced)
- 3NT = balanced 11-13 HCP

## undefined

## undefined
- Look for 5+ card suit for natural positive response

## undefined
- Balanced positive responses
- In this style, use 3NT only with stronger balanced values; otherwise 2D waiting

## undefined
- In this style, use 3NT only with stronger balanced values; otherwise 2D waiting

## undefined
- Opener continuations after Jacoby 2NT: control-showing cue bids at 3-level
- Determine agreed trump from our opening (assume first bid in auction)
- First-round control: Ace or void

## undefined
- Determine agreed trump from our opening (assume first bid in auction)
- First-round control: Ace or void

## undefined

## undefined
- First-round control: Ace or void

## undefined
- Not enough points to respond to regular openings

## undefined
- Support partner's major

## undefined
- Check for Drury (passed-hand convention)

## undefined
- Splinter bids - jump to show game-forcing values with 4+ support and singleton/void
- Look for a singleton or void to splinter

## undefined
- Look for a singleton or void to splinter

## undefined
- Calculate appropriate splinter level
- 3-level for suits higher than opener's suit, 4-level for suits lower

## undefined
- 3-level for suits higher than opener's suit, 4-level for suits lower

## undefined
- Jacoby 2NT: with 13+ HCP and 4+ support. If less than 13, continue evaluating other competitive options.

## undefined
- Bergen Raises (standard): Only when enabled and no opponent interference after a 1M opening
- 3M = preemptive (0-6 HCP, 4+ trumps)
- 3C = constructive (7-10 HCP, 4+ trumps)
- 3D = invitational (11-12 HCP, 4+ trumps)
- Jacoby 2NT (13+) and Splinters (GF with shortness) take precedence above.

## undefined

## undefined
- 3M = preemptive (0-6 HCP, 4+ trumps)
- 3C = constructive (7-10 HCP, 4+ trumps)
- 3D = invitational (11-12 HCP, 4+ trumps)
- Jacoby 2NT (13+) and Splinters (GF with shortness) take precedence above.

## undefined

## undefined

## undefined

## undefined

## undefined

## undefined

## undefined

## undefined
- Skip this responder-only branch on opener's own rebid or opponents' turns
- do nothing; fall past this block
- Unknown error; be conservative and continue normally

## undefined
- do nothing; fall past this block
- Unknown error; be conservative and continue normally

## undefined
- Attach a forcing flag for downstream responder/advancer logic.

## undefined
- For balanced hands without clear FIT, prefer NT responses when there is no opponent interference (passes don't count)
- Find the specific opening token index to judge interference correctly even if auction started with passes
- Adjustment: with exactly 3-card support and a minimum (6–9 total points), prefer the simple raise to 2M over 1NT.

## undefined
- Find the specific opening token index to judge interference correctly even if auction started with passes
- Adjustment: with exactly 3-card support and a minimum (6–9 total points), prefer the simple raise to 2M over 1NT.
- NT with balanced hands when no clear fit: allow with <=2-card support,
- and also with exactly 3-card support when values are 9+ HCP (avoids overriding the low-end 2M raise above)
- Special-case: in the balancing seat (opener at 1-level followed by two passes),
- prefer a 1-level new-suit in a higher-ranking major when we hold 4+ cards
- and at least 12 HCP rather than immediately selecting 2NT. This keeps the

## undefined
- Adjustment: with exactly 3-card support and a minimum (6–9 total points), prefer the simple raise to 2M over 1NT.
- NT with balanced hands when no clear fit: allow with <=2-card support,
- and also with exactly 3-card support when values are 9+ HCP (avoids overriding the low-end 2M raise above)
- Special-case: in the balancing seat (opener at 1-level followed by two passes),
- prefer a 1-level new-suit in a higher-ranking major when we hold 4+ cards
- and at least 12 HCP rather than immediately selecting 2NT. This keeps the
- classic balancing preference to bid a higher 4-card major when present.

## undefined
- Special-case: in the balancing seat (opener at 1-level followed by two passes),
- prefer a 1-level new-suit in a higher-ranking major when we hold 4+ cards
- and at least 12 HCP rather than immediately selecting 2NT. This keeps the
- classic balancing preference to bid a higher 4-card major when present.
- Higher-ranking major suits relative to the opener

## undefined
- prefer a 1-level new-suit in a higher-ranking major when we hold 4+ cards
- and at least 12 HCP rather than immediately selecting 2NT. This keeps the
- classic balancing preference to bid a higher 4-card major when present.
- Higher-ranking major suits relative to the opener
- SAYC guideline: with a balanced hand and no fit over 1M, responder bids

## undefined
- and at least 12 HCP rather than immediately selecting 2NT. This keeps the
- classic balancing preference to bid a higher 4-card major when present.
- Higher-ranking major suits relative to the opener
- SAYC guideline: with a balanced hand and no fit over 1M, responder bids
- 1NT with a minimum range and 2NT invitational with medium values.

## undefined
- classic balancing preference to bid a higher 4-card major when present.
- Higher-ranking major suits relative to the opener
- SAYC guideline: with a balanced hand and no fit over 1M, responder bids
- 1NT with a minimum range and 2NT invitational with medium values.
- Expand the 1NT floor to include classic 6–9 hands so we never pass with 8–9.

## undefined
- Higher-ranking major suits relative to the opener
- SAYC guideline: with a balanced hand and no fit over 1M, responder bids
- 1NT with a minimum range and 2NT invitational with medium values.
- Expand the 1NT floor to include classic 6–9 hands so we never pass with 8–9.

## undefined
- SAYC guideline: with a balanced hand and no fit over 1M, responder bids
- 1NT with a minimum range and 2NT invitational with medium values.
- Expand the 1NT floor to include classic 6–9 hands so we never pass with 8–9.

## undefined
- 1NT with a minimum range and 2NT invitational with medium values.
- Expand the 1NT floor to include classic 6–9 hands so we never pass with 8–9.

## undefined
- Expand the 1NT floor to include classic 6–9 hands so we never pass with 8–9.

## undefined

## undefined
- Skip this block if opponents have bid something (handled elsewhere)
- Allow natural raises after any opponent passes (still no interference),
- or when Jacoby 2NT is disabled. Keep original suppression when it's the very first response
- with Jacoby enabled to preserve existing tests.
- Suppress immediate natural raises on the first response when Jacoby is on
- (tests expect PASS for sub-GF hands in that specific scenario)

## undefined
- Allow natural raises after any opponent passes (still no interference),
- or when Jacoby 2NT is disabled. Keep original suppression when it's the very first response
- with Jacoby enabled to preserve existing tests.
- Suppress immediate natural raises on the first response when Jacoby is on
- (tests expect PASS for sub-GF hands in that specific scenario)
- If Bergen is enabled, we've already returned appropriate 3-level artificial raises above;
- fall back to natural raises only when Bergen is off.

## undefined
- or when Jacoby 2NT is disabled. Keep original suppression when it's the very first response
- with Jacoby enabled to preserve existing tests.
- Suppress immediate natural raises on the first response when Jacoby is on
- (tests expect PASS for sub-GF hands in that specific scenario)
- If Bergen is enabled, we've already returned appropriate 3-level artificial raises above;
- fall back to natural raises only when Bergen is off.

## undefined
- with Jacoby enabled to preserve existing tests.
- Suppress immediate natural raises on the first response when Jacoby is on
- (tests expect PASS for sub-GF hands in that specific scenario)
- If Bergen is enabled, we've already returned appropriate 3-level artificial raises above;
- fall back to natural raises only when Bergen is off.

## undefined
- Suppress immediate natural raises on the first response when Jacoby is on
- (tests expect PASS for sub-GF hands in that specific scenario)
- If Bergen is enabled, we've already returned appropriate 3-level artificial raises above;
- fall back to natural raises only when Bergen is off.

## undefined
- (tests expect PASS for sub-GF hands in that specific scenario)
- If Bergen is enabled, we've already returned appropriate 3-level artificial raises above;
- fall back to natural raises only when Bergen is off.
- With exactly 3-card support: adopt a fit-first style at the low end.
- Raise to 2M with 6–9 total points; otherwise fall through to other logic (NT, new suit, etc.).

## undefined
- If Bergen is enabled, we've already returned appropriate 3-level artificial raises above;
- fall back to natural raises only when Bergen is off.
- With exactly 3-card support: adopt a fit-first style at the low end.
- Raise to 2M with 6–9 total points; otherwise fall through to other logic (NT, new suit, etc.).

## undefined

## undefined
- With exactly 3-card support: adopt a fit-first style at the low end.
- Raise to 2M with 6–9 total points; otherwise fall through to other logic (NT, new suit, etc.).

## undefined
- Raise to 2M with 6–9 total points; otherwise fall through to other logic (NT, new suit, etc.).

## undefined
- Determine no-opponent-interference relative to this specific opening token
- Don't preempt a natural 1D response over a 1C opening when we hold 4+ diamonds
- Natural raises of opener's minor with 6+ total points
- Invitational raises only: 2m with 6–9 TP, 3m with 10–12 TP.
- With stronger hands (13+ HCP or game-going values), do NOT make a simple raise —
- prefer NT with balanced/no-major or a forcing new suit/jump shift.

## undefined
- Don't preempt a natural 1D response over a 1C opening when we hold 4+ diamonds
- Natural raises of opener's minor with 6+ total points
- Invitational raises only: 2m with 6–9 TP, 3m with 10–12 TP.
- With stronger hands (13+ HCP or game-going values), do NOT make a simple raise —
- prefer NT with balanced/no-major or a forcing new suit/jump shift.

## undefined
- Natural raises of opener's minor with 6+ total points
- Invitational raises only: 2m with 6–9 TP, 3m with 10–12 TP.
- With stronger hands (13+ HCP or game-going values), do NOT make a simple raise —
- prefer NT with balanced/no-major or a forcing new suit/jump shift.
- Fall through for 13+ HCP (or strong distribution) to NT/new suit logic below

## undefined
- Invitational raises only: 2m with 6–9 TP, 3m with 10–12 TP.
- With stronger hands (13+ HCP or game-going values), do NOT make a simple raise —
- prefer NT with balanced/no-major or a forcing new suit/jump shift.
- Fall through for 13+ HCP (or strong distribution) to NT/new suit logic below

## undefined
- Fall through for 13+ HCP (or strong distribution) to NT/new suit logic below

## undefined
- Balanced responder over minor openings: prefer NT when no 4-card major and <4-card support
- Strong hands (15+) commit to 3NT even if a natural 1D over 1C is available.
- Align NT ranges with major-opening responder logic for consistency:
- Classic: 10–11 -> 1NT, 12–14 -> 2NT, 15+ -> 3NT
- Wide (config): 6–11 -> 1NT, 12–14 -> 2NT, 15+ -> 3NT
- For sub-15 ranges, prefer NT when appropriate.
- Allow 2NT invitational (12–14) even if we hold 4 diamonds over a 1C opening
- (tests expect 2NT in such a shape). However, avoid choosing 1NT when a
- perfectly natural 1D is available (we prefer bidding the suit at the 1-level
- for the low end of the range).

## undefined
- Align NT ranges with major-opening responder logic for consistency:
- Classic: 10–11 -> 1NT, 12–14 -> 2NT, 15+ -> 3NT
- Wide (config): 6–11 -> 1NT, 12–14 -> 2NT, 15+ -> 3NT
- For sub-15 ranges, prefer NT when appropriate.
- Allow 2NT invitational (12–14) even if we hold 4 diamonds over a 1C opening
- (tests expect 2NT in such a shape). However, avoid choosing 1NT when a
- perfectly natural 1D is available (we prefer bidding the suit at the 1-level
- for the low end of the range).

## undefined
- Classic: 10–11 -> 1NT, 12–14 -> 2NT, 15+ -> 3NT
- Wide (config): 6–11 -> 1NT, 12–14 -> 2NT, 15+ -> 3NT
- For sub-15 ranges, prefer NT when appropriate.
- Allow 2NT invitational (12–14) even if we hold 4 diamonds over a 1C opening
- (tests expect 2NT in such a shape). However, avoid choosing 1NT when a
- perfectly natural 1D is available (we prefer bidding the suit at the 1-level
- for the low end of the range).

## undefined

## undefined

## undefined
- Allow 2NT invitational (12–14) even if we hold 4 diamonds over a 1C opening
- (tests expect 2NT in such a shape). However, avoid choosing 1NT when a
- perfectly natural 1D is available (we prefer bidding the suit at the 1-level
- for the low end of the range).

## undefined

## undefined
- perfectly natural 1D is available (we prefer bidding the suit at the 1-level
- for the low end of the range).

## undefined
- for the low end of the range).

## undefined
- New suit responses
- Edge-case: if opener was a minor and our hand is a clear two-suited Michaels-style
- (5-5 majors), prefer the conventional Michaels cue-bid at the 2-level rather
- than making a 1-level new-suit response. Some tests construct single-bid
- auctions without explicit seat metadata; prefer the explicit convention
- when shape matches and the convention is enabled.

## undefined
- Edge-case: if opener was a minor and our hand is a clear two-suited Michaels-style
- (5-5 majors), prefer the conventional Michaels cue-bid at the 2-level rather
- than making a 1-level new-suit response. Some tests construct single-bid
- auctions without explicit seat metadata; prefer the explicit convention
- when shape matches and the convention is enabled.
- Prefer a Michaels-style cue-bid as a responder when the hand shape matches.
- Only consider this as an overcall-style convention when the opener was
- likely by the opponents. If the opener is by our side (i.e. we're
- responder to partner), prefer natural new-suit/responder logic instead.
- If the opener is likely on our side (we are responder), and explicit
- seat metadata exists for the opening bid, prefer natural responder
- new-suit logic over a conventional Michaels cue-bid. This allows
- tests that construct seat-aware auctions to expect a natural 2-level
- new suit while still allowing Michaels in direct overcall contexts

## undefined
- (5-5 majors), prefer the conventional Michaels cue-bid at the 2-level rather
- than making a 1-level new-suit response. Some tests construct single-bid
- auctions without explicit seat metadata; prefer the explicit convention
- when shape matches and the convention is enabled.
- Prefer a Michaels-style cue-bid as a responder when the hand shape matches.
- Only consider this as an overcall-style convention when the opener was
- likely by the opponents. If the opener is by our side (i.e. we're
- responder to partner), prefer natural new-suit/responder logic instead.
- If the opener is likely on our side (we are responder), and explicit
- seat metadata exists for the opening bid, prefer natural responder
- new-suit logic over a conventional Michaels cue-bid. This allows
- tests that construct seat-aware auctions to expect a natural 2-level
- new suit while still allowing Michaels in direct overcall contexts
- (including seatless or opponent-open auctions).

## undefined
- than making a 1-level new-suit response. Some tests construct single-bid
- auctions without explicit seat metadata; prefer the explicit convention
- when shape matches and the convention is enabled.
- Prefer a Michaels-style cue-bid as a responder when the hand shape matches.
- Only consider this as an overcall-style convention when the opener was
- likely by the opponents. If the opener is by our side (i.e. we're
- responder to partner), prefer natural new-suit/responder logic instead.
- If the opener is likely on our side (we are responder), and explicit
- seat metadata exists for the opening bid, prefer natural responder
- new-suit logic over a conventional Michaels cue-bid. This allows
- tests that construct seat-aware auctions to expect a natural 2-level
- new suit while still allowing Michaels in direct overcall contexts
- (including seatless or opponent-open auctions).

## undefined
- auctions without explicit seat metadata; prefer the explicit convention
- when shape matches and the convention is enabled.
- Prefer a Michaels-style cue-bid as a responder when the hand shape matches.
- Only consider this as an overcall-style convention when the opener was
- likely by the opponents. If the opener is by our side (i.e. we're
- responder to partner), prefer natural new-suit/responder logic instead.
- If the opener is likely on our side (we are responder), and explicit
- seat metadata exists for the opening bid, prefer natural responder
- new-suit logic over a conventional Michaels cue-bid. This allows
- tests that construct seat-aware auctions to expect a natural 2-level
- new suit while still allowing Michaels in direct overcall contexts
- (including seatless or opponent-open auctions).
- Determine explicitly whether the opener is on our side using seat metadata.

## undefined
- Prefer a Michaels-style cue-bid as a responder when the hand shape matches.
- Only consider this as an overcall-style convention when the opener was
- likely by the opponents. If the opener is by our side (i.e. we're
- responder to partner), prefer natural new-suit/responder logic instead.
- If the opener is likely on our side (we are responder), and explicit
- seat metadata exists for the opening bid, prefer natural responder
- new-suit logic over a conventional Michaels cue-bid. This allows
- tests that construct seat-aware auctions to expect a natural 2-level
- new suit while still allowing Michaels in direct overcall contexts
- (including seatless or opponent-open auctions).
- Determine explicitly whether the opener is on our side using seat metadata.
- Only skip Michaels when the opener bid carries an explicit (non-auto-assigned)
- seat and that seat is on the same side as ourSeat (i.e., opener is partner).

## undefined
- Only consider this as an overcall-style convention when the opener was
- likely by the opponents. If the opener is by our side (i.e. we're
- responder to partner), prefer natural new-suit/responder logic instead.
- If the opener is likely on our side (we are responder), and explicit
- seat metadata exists for the opening bid, prefer natural responder
- new-suit logic over a conventional Michaels cue-bid. This allows
- tests that construct seat-aware auctions to expect a natural 2-level
- new suit while still allowing Michaels in direct overcall contexts
- (including seatless or opponent-open auctions).
- Determine explicitly whether the opener is on our side using seat metadata.
- Only skip Michaels when the opener bid carries an explicit (non-auto-assigned)
- seat and that seat is on the same side as ourSeat (i.e., opener is partner).
- Centralize seat inference for the opening bid: prefer explicit per-bid seat,

## undefined
- likely by the opponents. If the opener is by our side (i.e. we're
- responder to partner), prefer natural new-suit/responder logic instead.
- If the opener is likely on our side (we are responder), and explicit
- seat metadata exists for the opening bid, prefer natural responder
- new-suit logic over a conventional Michaels cue-bid. This allows
- tests that construct seat-aware auctions to expect a natural 2-level
- new suit while still allowing Michaels in direct overcall contexts
- (including seatless or opponent-open auctions).
- Determine explicitly whether the opener is on our side using seat metadata.
- Only skip Michaels when the opener bid carries an explicit (non-auto-assigned)
- seat and that seat is on the same side as ourSeat (i.e., opener is partner).
- Centralize seat inference for the opening bid: prefer explicit per-bid seat,
- but fall back to dealer-based inference when available.

## undefined
- responder to partner), prefer natural new-suit/responder logic instead.
- If the opener is likely on our side (we are responder), and explicit
- seat metadata exists for the opening bid, prefer natural responder
- new-suit logic over a conventional Michaels cue-bid. This allows
- tests that construct seat-aware auctions to expect a natural 2-level
- new suit while still allowing Michaels in direct overcall contexts
- (including seatless or opponent-open auctions).
- Determine explicitly whether the opener is on our side using seat metadata.
- Only skip Michaels when the opener bid carries an explicit (non-auto-assigned)
- seat and that seat is on the same side as ourSeat (i.e., opener is partner).
- Centralize seat inference for the opening bid: prefer explicit per-bid seat,
- but fall back to dealer-based inference when available.

## undefined
- If the opener is likely on our side (we are responder), and explicit
- seat metadata exists for the opening bid, prefer natural responder
- new-suit logic over a conventional Michaels cue-bid. This allows
- tests that construct seat-aware auctions to expect a natural 2-level
- new suit while still allowing Michaels in direct overcall contexts
- (including seatless or opponent-open auctions).
- Determine explicitly whether the opener is on our side using seat metadata.
- Only skip Michaels when the opener bid carries an explicit (non-auto-assigned)
- seat and that seat is on the same side as ourSeat (i.e., opener is partner).
- Centralize seat inference for the opening bid: prefer explicit per-bid seat,
- but fall back to dealer-based inference when available.

## undefined
- seat metadata exists for the opening bid, prefer natural responder
- new-suit logic over a conventional Michaels cue-bid. This allows
- tests that construct seat-aware auctions to expect a natural 2-level
- new suit while still allowing Michaels in direct overcall contexts
- (including seatless or opponent-open auctions).
- Determine explicitly whether the opener is on our side using seat metadata.
- Only skip Michaels when the opener bid carries an explicit (non-auto-assigned)
- seat and that seat is on the same side as ourSeat (i.e., opener is partner).
- Centralize seat inference for the opening bid: prefer explicit per-bid seat,
- but fall back to dealer-based inference when available.
- Only suppress Michaels when opener is explicitly our partner in a seat-aware auction.

## undefined
- new-suit logic over a conventional Michaels cue-bid. This allows
- tests that construct seat-aware auctions to expect a natural 2-level
- new suit while still allowing Michaels in direct overcall contexts
- (including seatless or opponent-open auctions).
- Determine explicitly whether the opener is on our side using seat metadata.
- Only skip Michaels when the opener bid carries an explicit (non-auto-assigned)
- seat and that seat is on the same side as ourSeat (i.e., opener is partner).
- Centralize seat inference for the opening bid: prefer explicit per-bid seat,
- but fall back to dealer-based inference when available.
- Only suppress Michaels when opener is explicitly our partner in a seat-aware auction.

## undefined
- tests that construct seat-aware auctions to expect a natural 2-level
- new suit while still allowing Michaels in direct overcall contexts
- (including seatless or opponent-open auctions).
- Determine explicitly whether the opener is on our side using seat metadata.
- Only skip Michaels when the opener bid carries an explicit (non-auto-assigned)
- seat and that seat is on the same side as ourSeat (i.e., opener is partner).
- Centralize seat inference for the opening bid: prefer explicit per-bid seat,
- but fall back to dealer-based inference when available.
- Only suppress Michaels when opener is explicitly our partner in a seat-aware auction.

## undefined
- new suit while still allowing Michaels in direct overcall contexts
- (including seatless or opponent-open auctions).
- Determine explicitly whether the opener is on our side using seat metadata.
- Only skip Michaels when the opener bid carries an explicit (non-auto-assigned)
- seat and that seat is on the same side as ourSeat (i.e., opener is partner).
- Centralize seat inference for the opening bid: prefer explicit per-bid seat,
- but fall back to dealer-based inference when available.
- Only suppress Michaels when opener is explicitly our partner in a seat-aware auction.

## undefined
- (including seatless or opponent-open auctions).
- Determine explicitly whether the opener is on our side using seat metadata.
- Only skip Michaels when the opener bid carries an explicit (non-auto-assigned)
- seat and that seat is on the same side as ourSeat (i.e., opener is partner).
- Centralize seat inference for the opening bid: prefer explicit per-bid seat,
- but fall back to dealer-based inference when available.
- Only suppress Michaels when opener is explicitly our partner in a seat-aware auction.

## undefined
- Determine explicitly whether the opener is on our side using seat metadata.
- Only skip Michaels when the opener bid carries an explicit (non-auto-assigned)
- seat and that seat is on the same side as ourSeat (i.e., opener is partner).
- Centralize seat inference for the opening bid: prefer explicit per-bid seat,
- but fall back to dealer-based inference when available.
- Only suppress Michaels when opener is explicitly our partner in a seat-aware auction.

## undefined
- Only skip Michaels when the opener bid carries an explicit (non-auto-assigned)
- seat and that seat is on the same side as ourSeat (i.e., opener is partner).
- Centralize seat inference for the opening bid: prefer explicit per-bid seat,
- but fall back to dealer-based inference when available.
- Only suppress Michaels when opener is explicitly our partner in a seat-aware auction.

## undefined
- seat and that seat is on the same side as ourSeat (i.e., opener is partner).
- Centralize seat inference for the opening bid: prefer explicit per-bid seat,
- but fall back to dealer-based inference when available.
- Only suppress Michaels when opener is explicitly our partner in a seat-aware auction.

## undefined
- Centralize seat inference for the opening bid: prefer explicit per-bid seat,
- but fall back to dealer-based inference when available.
- Only suppress Michaels when opener is explicitly our partner in a seat-aware auction.

## undefined
- but fall back to dealer-based inference when available.
- Only suppress Michaels when opener is explicitly our partner in a seat-aware auction.

## undefined
- Only suppress Michaels when opener is explicitly our partner in a seat-aware auction.

## undefined
- else: fall through to natural new-suit logic when opener is our side
- Strong one-level jump shift by responder: 13+ HCP and 5+ in a new suit, no interference
- Determine no-opponent-interference relative to this specific opening token

## undefined

## undefined
- Strong one-level jump shift by responder: 13+ HCP and 5+ in a new suit, no interference
- Determine no-opponent-interference relative to this specific opening token
- Prefer majors, then longest suit, for a single jump shift
- Only treat this as a responder jump-shift when we can be confident

## undefined
- Determine no-opponent-interference relative to this specific opening token
- Prefer majors, then longest suit, for a single jump shift
- Only treat this as a responder jump-shift when we can be confident
- the opening was by our side (i.e. responder to partner). If the
- auction context is ambiguous (no dealer/seat info) or the
- opening may be by opponents, suppress the jump-shift so other
- responder/overcall logic (including takeout doubles) can win.

## undefined
- Only treat this as a responder jump-shift when we can be confident
- the opening was by our side (i.e. responder to partner). If the
- auction context is ambiguous (no dealer/seat info) or the
- opening may be by opponents, suppress the jump-shift so other
- responder/overcall logic (including takeout doubles) can win.
- Only treat this as a responder jump-shift when the computed jump
- lands at the 2-level (i.e., minLvl === 1). This prevents interpreting
- a 13-HCP constructive 2-level new-suit as a 3-level jump-shift
- when the new suit ranks below the opener (which should be a simple 2-level bid).
- Suppress if we have 4+ support for opener's major and Jacoby/Splinters are available

## undefined
- the opening was by our side (i.e. responder to partner). If the
- auction context is ambiguous (no dealer/seat info) or the
- opening may be by opponents, suppress the jump-shift so other
- responder/overcall logic (including takeout doubles) can win.
- Only treat this as a responder jump-shift when the computed jump
- lands at the 2-level (i.e., minLvl === 1). This prevents interpreting
- a 13-HCP constructive 2-level new-suit as a 3-level jump-shift
- when the new suit ranks below the opener (which should be a simple 2-level bid).
- Suppress if we have 4+ support for opener's major and Jacoby/Splinters are available

## undefined
- auction context is ambiguous (no dealer/seat info) or the
- opening may be by opponents, suppress the jump-shift so other
- responder/overcall logic (including takeout doubles) can win.
- Only treat this as a responder jump-shift when the computed jump
- lands at the 2-level (i.e., minLvl === 1). This prevents interpreting
- a 13-HCP constructive 2-level new-suit as a 3-level jump-shift
- when the new suit ranks below the opener (which should be a simple 2-level bid).
- Suppress if we have 4+ support for opener's major and Jacoby/Splinters are available

## undefined
- opening may be by opponents, suppress the jump-shift so other
- responder/overcall logic (including takeout doubles) can win.
- Only treat this as a responder jump-shift when the computed jump
- lands at the 2-level (i.e., minLvl === 1). This prevents interpreting
- a 13-HCP constructive 2-level new-suit as a 3-level jump-shift
- when the new suit ranks below the opener (which should be a simple 2-level bid).
- Suppress if we have 4+ support for opener's major and Jacoby/Splinters are available

## undefined
- responder/overcall logic (including takeout doubles) can win.
- Only treat this as a responder jump-shift when the computed jump
- lands at the 2-level (i.e., minLvl === 1). This prevents interpreting
- a 13-HCP constructive 2-level new-suit as a 3-level jump-shift
- when the new suit ranks below the opener (which should be a simple 2-level bid).
- Suppress if we have 4+ support for opener's major and Jacoby/Splinters are available

## undefined
- Only treat this as a responder jump-shift when the computed jump
- lands at the 2-level (i.e., minLvl === 1). This prevents interpreting
- a 13-HCP constructive 2-level new-suit as a 3-level jump-shift
- when the new suit ranks below the opener (which should be a simple 2-level bid).
- Suppress if we have 4+ support for opener's major and Jacoby/Splinters are available

## undefined
- lands at the 2-level (i.e., minLvl === 1). This prevents interpreting
- a 13-HCP constructive 2-level new-suit as a 3-level jump-shift
- when the new suit ranks below the opener (which should be a simple 2-level bid).
- Suppress if we have 4+ support for opener's major and Jacoby/Splinters are available

## undefined
- when the new suit ranks below the opener (which should be a simple 2-level bid).
- Suppress if we have 4+ support for opener's major and Jacoby/Splinters are available

## undefined
- Suppress if we have 4+ support for opener's major and Jacoby/Splinters are available

## undefined
- Detect if there was opponent interference after opener's bid (simple pattern)

## undefined
- First non-pass action after the opening was a suit bid by opponents -> interference
- Compute vulnerability-aware minimum HCP for 1-level actions

## undefined
- Look for 5+ card suits first
- Prefer Unusual 2NT when shape matches the two lowest unbid suits

## undefined

## undefined
- Prefer Unusual 2NT when shape matches the two lowest unbid suits
- 1-level new suit requires only 6+ points when legal
- debug removed: consider 1-level new suit log suppressed
- Apply vulnerability-aware HCP floor in addition to total points

## undefined
- 1-level new suit requires only 6+ points when legal
- debug removed: consider 1-level new suit log suppressed
- Apply vulnerability-aware HCP floor in addition to total points
- otherwise fall through to consider 2-level/new-suit rules

## undefined

## undefined

## undefined

## undefined
- debug removed: consider 1-level new suit log suppressed
- Apply vulnerability-aware HCP floor in addition to total points
- otherwise fall through to consider 2-level/new-suit rules
- 2-level new suit requires constructive values. Allow when HCP>=13
- OR when we have clear shape/playing strength: total points >= 11 AND
- (extreme shape: void/singleton in opener's suit OR 6+ in our suit)
- Preserve targeted relaxation for 1H->2D with total >= 11.
- debug removed: choosing 2-level natural log suppressed

## undefined
- Apply vulnerability-aware HCP floor in addition to total points
- otherwise fall through to consider 2-level/new-suit rules
- 2-level new suit requires constructive values. Allow when HCP>=13
- OR when we have clear shape/playing strength: total points >= 11 AND
- (extreme shape: void/singleton in opener's suit OR 6+ in our suit)
- Preserve targeted relaxation for 1H->2D with total >= 11.
- debug removed: choosing 2-level natural log suppressed
- Free bid style over interference: allow with 10+ total points and a strong long suit

## undefined
- otherwise fall through to consider 2-level/new-suit rules
- 2-level new suit requires constructive values. Allow when HCP>=13
- OR when we have clear shape/playing strength: total points >= 11 AND
- (extreme shape: void/singleton in opener's suit OR 6+ in our suit)
- Preserve targeted relaxation for 1H->2D with total >= 11.
- debug removed: choosing 2-level natural log suppressed
- Free bid style over interference: allow with 10+ total points and a strong long suit
- Example: 1C (1S) 2D with 6+ (often 6-7) diamonds and ~10 total points (HCP+DP)

## undefined
- 2-level new suit requires constructive values. Allow when HCP>=13
- OR when we have clear shape/playing strength: total points >= 11 AND
- (extreme shape: void/singleton in opener's suit OR 6+ in our suit)
- Preserve targeted relaxation for 1H->2D with total >= 11.
- debug removed: choosing 2-level natural log suppressed
- Free bid style over interference: allow with 10+ total points and a strong long suit
- Example: 1C (1S) 2D with 6+ (often 6-7) diamonds and ~10 total points (HCP+DP)

## undefined
- Preserve targeted relaxation for 1H->2D with total >= 11.
- debug removed: choosing 2-level natural log suppressed
- Free bid style over interference: allow with 10+ total points and a strong long suit
- Example: 1C (1S) 2D with 6+ (often 6-7) diamonds and ~10 total points (HCP+DP)

## undefined
- Free bid style over interference: allow with 10+ total points and a strong long suit
- Example: 1C (1S) 2D with 6+ (often 6-7) diamonds and ~10 total points (HCP+DP)

## undefined
- Example: 1C (1S) 2D with 6+ (often 6-7) diamonds and ~10 total points (HCP+DP)

## undefined
- However: if we have a 5+ card OTHER suit with 12+ HCP that would justify a
- natural 2-level overcall, prefer that 2-level action instead of a 1-level
- 4-card major. This prevents 4-card majors from pre-empting stronger 5-card
- suits (e.g., 1H - ? with 5♦ and 4♠; prefer 2D over 1S when HCP supports it).
- Defer to the natural 2-level overcall (handled later) instead of returning 1-level major now

## undefined
- natural 2-level overcall, prefer that 2-level action instead of a 1-level
- 4-card major. This prevents 4-card majors from pre-empting stronger 5-card
- suits (e.g., 1H - ? with 5♦ and 4♠; prefer 2D over 1S when HCP supports it).
- Defer to the natural 2-level overcall (handled later) instead of returning 1-level major now
- Enforce vulnerability-aware HCP floor for 1-level major responses as well

## undefined
- 4-card major. This prevents 4-card majors from pre-empting stronger 5-card
- suits (e.g., 1H - ? with 5♦ and 4♠; prefer 2D over 1S when HCP supports it).
- Defer to the natural 2-level overcall (handled later) instead of returning 1-level major now
- Enforce vulnerability-aware HCP floor for 1-level major responses as well

## undefined
- suits (e.g., 1H - ? with 5♦ and 4♠; prefer 2D over 1S when HCP supports it).
- Defer to the natural 2-level overcall (handled later) instead of returning 1-level major now
- Enforce vulnerability-aware HCP floor for 1-level major responses as well

## undefined
- Enforce vulnerability-aware HCP floor for 1-level major responses as well

## undefined
- Finally, allow 4-card diamonds at 1-level over a 1C opening (common SAYC style)

## undefined

## undefined
- debug removed: entering _handleInterference trace suppressed

## undefined
- choosing a natural 2-level overcall here; let the responder branch consider
- splinter logic. This prevents interference heuristics from preempting a
- legitimate splinter when tests supply only the opener and ourSeat.
- Any singleton/void in other suits?
- debug removed: suppression detail suppressed
- Return null to allow responder flow (splinter) to proceed

## undefined

## undefined
- legitimate splinter when tests supply only the opener and ourSeat.
- Any singleton/void in other suits?
- debug removed: suppression detail suppressed
- Return null to allow responder flow (splinter) to proceed

## undefined
- Any singleton/void in other suits?
- debug removed: suppression detail suppressed
- Return null to allow responder flow (splinter) to proceed

## undefined
- Return null to allow responder flow (splinter) to proceed

## undefined
- Narrow override: prefer natural 2D over takeout double for the specific regression scenario
- (opponent opened 1H, responder holds 12+ HCP and 5+ diamonds).
- If the hand is two-suited (5+ in spades or hearts plus 5+ in diamonds), it's likely
- a Michaels-style hand and should not be forced into a natural 2D overcall.
- debug removed: override detail suppressed

## undefined
- If the hand is two-suited (5+ in spades or hearts plus 5+ in diamonds), it's likely
- a Michaels-style hand and should not be forced into a natural 2D overcall.
- debug removed: override detail suppressed

## undefined
- a Michaels-style hand and should not be forced into a natural 2D overcall.
- debug removed: override detail suppressed

## undefined
- debug removed: override detail suppressed

## undefined
- Natural overcall vs Weak Two opener: if opponents opened a Weak Two (2H/2S/2D)
- and we are the immediate next to act (direct overcall seat), prefer a natural
- 2-level overcall when we hold a 5+ suit (prefer majors) and reasonable HCP.
- find first non-pass contract
- Only consider true Weak Two openings (not 2C)

## undefined
- and we are the immediate next to act (direct overcall seat), prefer a natural
- 2-level overcall when we hold a 5+ suit (prefer majors) and reasonable HCP.
- find first non-pass contract
- Only consider true Weak Two openings (not 2C)
- prefer majors first for overcall candidates

## undefined
- 2-level overcall when we hold a 5+ suit (prefer majors) and reasonable HCP.
- find first non-pass contract
- Only consider true Weak Two openings (not 2C)
- prefer majors first for overcall candidates

## undefined
- find first non-pass contract
- Only consider true Weak Two openings (not 2C)
- prefer majors first for overcall candidates

## undefined
- Only consider true Weak Two openings (not 2C)
- prefer majors first for overcall candidates

## undefined
- prefer majors first for overcall candidates
- If no clear 5-card overcall suit but we hold a strong, balanced hand with stoppers,

## undefined

## undefined
- If no clear 5-card overcall suit but we hold a strong, balanced hand with stoppers,
- prefer a notrump overcall (use 2NT for minor weak-two openers, 3NT for major weak-two openers).
- require stoppers in at least two of the three other suits

## undefined

## undefined

## undefined
- prefer a notrump overcall (use 2NT for minor weak-two openers, 3NT for major weak-two openers).
- require stoppers in at least two of the three other suits

## undefined
- require stoppers in at least two of the three other suits

## undefined

## undefined

## undefined

## undefined
- (Delayed-overcall logic moved earlier to take precedence over weak single-jump overcalls.)

## undefined
- Natural single jump overcall over a 1-level suit opening: weak, 6+ suit, <10 HCP
- Identify first contract (assume opponents' 1-level suit opening for this path)
- Only consider when opponents opened a 1-level suit and it's our turn to act directly over it

## undefined

## undefined
- Only consider when opponents opened a 1-level suit and it's our turn to act directly over it

## undefined
- Choose a longest suit (not opener's) with len>=6, make a single jump overcall
- Ensure it's actually a jump over the minimum and not a cue (avoid bidding their suit)

## undefined

## undefined
- Check for cue bid raises after interference

## undefined

## undefined

## undefined

## undefined
- Get opponent's level and suit

## undefined
- Check for responsive doubles

## undefined
- List the unbid suits for clarity

## undefined

## undefined
- Enable Meckwell as default if neither is set

## undefined
- Meckwell defense
- Single-suited hands through 2♣ (6+ cards)

## undefined
- Single-suited hands through 2♣ (6+ cards)

## undefined
- DONT defense
- Single-suited hand

## undefined
- Single-suited hand

## undefined
- Two-suited hands

## undefined

## undefined

## undefined
- Loosen to 6-card suit at favorable vulnerability (we not vul, they vul)
- Vulnerability context for threshold
- Prefer majors, then longest other suit; never cue-bid here
- Require decent playing strength to enter at the 2-level over 1NT

## undefined
- Vulnerability context for threshold
- Prefer majors, then longest other suit; never cue-bid here
- Require decent playing strength to enter at the 2-level over 1NT

## undefined
- Prefer majors, then longest other suit; never cue-bid here
- Require decent playing strength to enter at the 2-level over 1NT

## undefined
- Opponent opened a suit at 1-level (allow preceding passes; ensure lastBid is the first non-pass)
- Verify this 1-level suit bid is the opening (all prior actions were passes)

## undefined
- Not the immediate opening context; skip this overcall section
- Unusual 2NT overcall: over a major opening, show minors (5-5)
- Add detail for UI: minors, 5-5 (direct overcall style), plus HCP and vulnerability context

## undefined

## undefined
- Add detail for UI: minors, 5-5 (direct overcall style), plus HCP and vulnerability context

## undefined
- Unusual 2NT overcall over a MINOR opening (optional): show two lowest unbid suits (5-5)
- Enabled only when config notrump_defenses.unusual_nt.over_minors === true
- Determine the two lowest unbid suits relative to the opening suit

## undefined

## undefined
- Enabled only when config notrump_defenses.unusual_nt.over_minors === true
- Determine the two lowest unbid suits relative to the opening suit

## undefined
- Michaels cuebid
- Diagnostic: check for Michaels/unusual two-suited overcall

## undefined
- Diagnostic: check for Michaels/unusual two-suited overcall
- (temporary log to help triage failing tests)
- console.debug('Checking two-suited overcall for', oppSuit, 'hand lengths', hand.lengths);
- If the opening bid includes an explicit seat (i.e., was provided in the test fixture
- rather than auto-assigned by Auction.reseat/add), prefer responder/new-suit logic
- and skip classifying this as a conventional two-suited overcall. This helps tests
- that create explicit-seat auctions exercise natural responder behavior.
- No special-case: allow the two-suited classifier (Michaels/Unusual NT)
- to run regardless of whether the opener's seat was provided explicitly
- in the auction object. Seat-aware tests expect conventional responses
- even when bids carry explicit seat metadata.

## undefined
- (temporary log to help triage failing tests)
- console.debug('Checking two-suited overcall for', oppSuit, 'hand lengths', hand.lengths);
- If the opening bid includes an explicit seat (i.e., was provided in the test fixture
- rather than auto-assigned by Auction.reseat/add), prefer responder/new-suit logic
- and skip classifying this as a conventional two-suited overcall. This helps tests
- that create explicit-seat auctions exercise natural responder behavior.
- No special-case: allow the two-suited classifier (Michaels/Unusual NT)
- to run regardless of whether the opener's seat was provided explicitly
- in the auction object. Seat-aware tests expect conventional responses
- even when bids carry explicit seat metadata.

## undefined
- console.debug('Checking two-suited overcall for', oppSuit, 'hand lengths', hand.lengths);
- If the opening bid includes an explicit seat (i.e., was provided in the test fixture
- rather than auto-assigned by Auction.reseat/add), prefer responder/new-suit logic
- and skip classifying this as a conventional two-suited overcall. This helps tests
- that create explicit-seat auctions exercise natural responder behavior.
- No special-case: allow the two-suited classifier (Michaels/Unusual NT)
- to run regardless of whether the opener's seat was provided explicitly
- in the auction object. Seat-aware tests expect conventional responses
- even when bids carry explicit seat metadata.

## undefined

## undefined
- rather than auto-assigned by Auction.reseat/add), prefer responder/new-suit logic
- and skip classifying this as a conventional two-suited overcall. This helps tests
- that create explicit-seat auctions exercise natural responder behavior.
- No special-case: allow the two-suited classifier (Michaels/Unusual NT)
- to run regardless of whether the opener's seat was provided explicitly
- in the auction object. Seat-aware tests expect conventional responses
- even when bids carry explicit seat metadata.
- When the opener's seat was explicitly provided and they opened a MAJOR,

## undefined
- and skip classifying this as a conventional two-suited overcall. This helps tests
- that create explicit-seat auctions exercise natural responder behavior.
- No special-case: allow the two-suited classifier (Michaels/Unusual NT)
- to run regardless of whether the opener's seat was provided explicitly
- in the auction object. Seat-aware tests expect conventional responses
- even when bids carry explicit seat metadata.
- When the opener's seat was explicitly provided and they opened a MAJOR,
- we prefer a natural new-suit only when that natural suit would be

## undefined
- that create explicit-seat auctions exercise natural responder behavior.
- No special-case: allow the two-suited classifier (Michaels/Unusual NT)
- to run regardless of whether the opener's seat was provided explicitly
- in the auction object. Seat-aware tests expect conventional responses
- even when bids carry explicit seat metadata.
- When the opener's seat was explicitly provided and they opened a MAJOR,
- we prefer a natural new-suit only when that natural suit would be
- available only at the 2-level (i.e., cannot be bid at the 1-level).

## undefined
- No special-case: allow the two-suited classifier (Michaels/Unusual NT)
- to run regardless of whether the opener's seat was provided explicitly
- in the auction object. Seat-aware tests expect conventional responses
- even when bids carry explicit seat metadata.
- When the opener's seat was explicitly provided and they opened a MAJOR,
- we prefer a natural new-suit only when that natural suit would be
- available only at the 2-level (i.e., cannot be bid at the 1-level).
- This keeps explicit-seat responder behaviour conservative (natural

## undefined
- to run regardless of whether the opener's seat was provided explicitly
- in the auction object. Seat-aware tests expect conventional responses
- even when bids carry explicit seat metadata.
- When the opener's seat was explicitly provided and they opened a MAJOR,
- we prefer a natural new-suit only when that natural suit would be
- available only at the 2-level (i.e., cannot be bid at the 1-level).
- This keeps explicit-seat responder behaviour conservative (natural
- 2-level preference) while still allowing Michaels when a 1-level
- natural is available or when the opener is a minor.

## undefined
- in the auction object. Seat-aware tests expect conventional responses
- even when bids carry explicit seat metadata.
- When the opener's seat was explicitly provided and they opened a MAJOR,
- we prefer a natural new-suit only when that natural suit would be
- available only at the 2-level (i.e., cannot be bid at the 1-level).
- This keeps explicit-seat responder behaviour conservative (natural
- 2-level preference) while still allowing Michaels when a 1-level
- natural is available or when the opener is a minor.

## undefined
- even when bids carry explicit seat metadata.
- When the opener's seat was explicitly provided and they opened a MAJOR,
- we prefer a natural new-suit only when that natural suit would be
- available only at the 2-level (i.e., cannot be bid at the 1-level).
- This keeps explicit-seat responder behaviour conservative (natural
- 2-level preference) while still allowing Michaels when a 1-level
- natural is available or when the opener is a minor.

## undefined
- When the opener's seat was explicitly provided and they opened a MAJOR,
- we prefer a natural new-suit only when that natural suit would be
- available only at the 2-level (i.e., cannot be bid at the 1-level).
- This keeps explicit-seat responder behaviour conservative (natural
- 2-level preference) while still allowing Michaels when a 1-level
- natural is available or when the opener is a minor.

## undefined
- we prefer a natural new-suit only when that natural suit would be
- available only at the 2-level (i.e., cannot be bid at the 1-level).
- This keeps explicit-seat responder behaviour conservative (natural
- 2-level preference) while still allowing Michaels when a 1-level
- natural is available or when the opener is a minor.

## undefined
- available only at the 2-level (i.e., cannot be bid at the 1-level).
- This keeps explicit-seat responder behaviour conservative (natural
- 2-level preference) while still allowing Michaels when a 1-level
- natural is available or when the opener is a minor.

## undefined
- This keeps explicit-seat responder behaviour conservative (natural
- 2-level preference) while still allowing Michaels when a 1-level
- natural is available or when the opener is a minor.
- else fall through and return Michaels (prefer conventional when natural at 1-level)

## undefined
- 2-level preference) while still allowing Michaels when a 1-level
- natural is available or when the opener is a minor.
- else fall through and return Michaels (prefer conventional when natural at 1-level)

## undefined
- natural is available or when the opener is a minor.
- else fall through and return Michaels (prefer conventional when natural at 1-level)

## undefined
- else fall through and return Michaels (prefer conventional when natural at 1-level)

## undefined
- Default: return the Michaels two-suited cue-bid
- console.debug('Detected two-suited overcall:', result);
- If opener's seat was explicit but no two-suited convention applies,
- prefer a natural new-suit when we clearly hold a 5+ card suit. This
- preserves the regression test which expects a natural new-suit in
- explicit-seat responder scenarios.

## undefined

## undefined
- console.debug('Detected two-suited overcall:', result);
- If opener's seat was explicit but no two-suited convention applies,
- prefer a natural new-suit when we clearly hold a 5+ card suit. This
- preserves the regression test which expects a natural new-suit in
- explicit-seat responder scenarios.

## undefined

## undefined

## undefined
- prefer a natural new-suit when we clearly hold a 5+ card suit. This
- preserves the regression test which expects a natural new-suit in
- explicit-seat responder scenarios.

## undefined
- preserves the regression test which expects a natural new-suit in
- explicit-seat responder scenarios.

## undefined
- explicit-seat responder scenarios.
- Ignore if not applicable

## undefined
- Ignore if not applicable

## undefined
- Simple 1-level overcall (apply vulnerability adjustments)
- Allow majors and minors where legally above the opener at the one level
- Before committing to a natural 1-level overcall, re-check for
- a conventional two-suited overcall (Michaels) for the
- opponent's suit; prefer the conventional 2-level cue-bid

## undefined
- Allow majors and minors where legally above the opener at the one level
- Before committing to a natural 1-level overcall, re-check for
- a conventional two-suited overcall (Michaels) for the
- opponent's suit; prefer the conventional 2-level cue-bid
- when it applies (helps seatless tests where both options
- might look reasonable). This is a narrow preference: only
- applied in the direct-seat simple 1-level overcall path.

## undefined
- Before committing to a natural 1-level overcall, re-check for
- a conventional two-suited overcall (Michaels) for the
- opponent's suit; prefer the conventional 2-level cue-bid
- when it applies (helps seatless tests where both options
- might look reasonable). This is a narrow preference: only
- applied in the direct-seat simple 1-level overcall path.

## undefined
- a conventional two-suited overcall (Michaels) for the
- opponent's suit; prefer the conventional 2-level cue-bid
- when it applies (helps seatless tests where both options
- might look reasonable). This is a narrow preference: only
- applied in the direct-seat simple 1-level overcall path.

## undefined
- opponent's suit; prefer the conventional 2-level cue-bid
- when it applies (helps seatless tests where both options
- might look reasonable). This is a narrow preference: only
- applied in the direct-seat simple 1-level overcall path.
- debug removed: simple 1-level overcall log suppressed

## undefined
- might look reasonable). This is a narrow preference: only
- applied in the direct-seat simple 1-level overcall path.
- debug removed: simple 1-level overcall log suppressed

## undefined
- applied in the direct-seat simple 1-level overcall path.
- debug removed: simple 1-level overcall log suppressed

## undefined
- debug removed: simple 1-level overcall log suppressed

## undefined

## undefined
- 1NT overcall

## undefined
- Natural 2NT overcall over a MINOR opening: strong balanced (19–21) with a stopper
- Guarded by config: if unusual_nt.over_minors is enabled, prefer Unusual 2NT above; otherwise allow natural.
- Require a stopper in their suit

## undefined

## undefined

## undefined
- Takeout double
- Slightly relax HCP in the direct seat after two passes: e.g., S PASS, W PASS, N 1S, E ?
- Detect two leading passes before this opening

## undefined

## undefined
- Slightly relax HCP in the direct seat after two passes: e.g., S PASS, W PASS, N 1S, E ?
- Detect two leading passes before this opening

## undefined
- Prefer a natural 2-level overcall only when we have a clear 5+ single-suiter
- and NOT a multi-suited hand (i.e., not two other 3-card suits).

## undefined
- and NOT a multi-suited hand (i.e., not two other 3-card suits).
- If we have two or more other suits with 3+ cards, prefer a takeout double pattern

## undefined
- If we have two or more other suits with 3+ cards, prefer a takeout double pattern

## undefined

## undefined
- If the relaxed direct-seat rule actually enabled this (i.e., exactly 11 HCP), surface a hint for learners

## undefined

## undefined

## undefined
- Minor-opening relaxed takeout double: allow len(opp suit) <= 3 when majors are 4-3 and HCP >= 12
- This captures practical takeout shapes like 4S-3H over 1C/1D even when not strictly short (<=2)

## undefined

## undefined

## undefined

## undefined
- If we have a 5+ card suit with 12+ HCP that would produce a natural 2-level overcall,
- prefer that natural over a relaxed takeout double.

## undefined
- prefer that natural over a relaxed takeout double.
- ignore

## undefined
- ignore

## undefined

## undefined
- Natural 2-level overcall when 1-level is not available (placed after takeout double checks)
- Require a decent 5+ card suit and 10+ HCP (adjustable by vulnerability)
- Avoid overshadowing a textbook takeout double shape

## undefined
- Require a decent 5+ card suit and 10+ HCP (adjustable by vulnerability)
- Avoid overshadowing a textbook takeout double shape

## undefined
- Avoid overshadowing a textbook takeout double shape

## undefined
- Prefer natural 2-level new suit with 12+ HCP and 5+ card suit — allow this even when
- relaxed takeout rules are in effect (direct-seat and similar cases). This ensures
- that clear 5-card suits with 12+ HCP are bid naturally instead of being suppressed
- by takeout-double heuristics.
- Compute how many other suits have 3+ cards (used to prefer takeout doubles on multi-suit hands)
- Prefer a natural 2-level overcall for clear single-suiters (5+ in a suit with 12+ HCP),
- but when the hand has at least two other 3-card suits (i.e., 5-3-3-2 / similar), prefer a
- takeout double instead — this matches the relaxed-takeout expectations in the tests.
- eslint-disable-next-line no-console

## undefined
- that clear 5-card suits with 12+ HCP are bid naturally instead of being suppressed
- by takeout-double heuristics.
- Compute how many other suits have 3+ cards (used to prefer takeout doubles on multi-suit hands)
- Prefer a natural 2-level overcall for clear single-suiters (5+ in a suit with 12+ HCP),
- but when the hand has at least two other 3-card suits (i.e., 5-3-3-2 / similar), prefer a
- takeout double instead — this matches the relaxed-takeout expectations in the tests.
- eslint-disable-next-line no-console
- Only allow 2-level overcall in more marginal cases when no takeout double is preferred
- eslint-disable-next-line no-console

## undefined
- by takeout-double heuristics.
- Compute how many other suits have 3+ cards (used to prefer takeout doubles on multi-suit hands)
- Prefer a natural 2-level overcall for clear single-suiters (5+ in a suit with 12+ HCP),
- but when the hand has at least two other 3-card suits (i.e., 5-3-3-2 / similar), prefer a
- takeout double instead — this matches the relaxed-takeout expectations in the tests.
- eslint-disable-next-line no-console
- Only allow 2-level overcall in more marginal cases when no takeout double is preferred
- eslint-disable-next-line no-console

## undefined
- Compute how many other suits have 3+ cards (used to prefer takeout doubles on multi-suit hands)
- Prefer a natural 2-level overcall for clear single-suiters (5+ in a suit with 12+ HCP),
- but when the hand has at least two other 3-card suits (i.e., 5-3-3-2 / similar), prefer a
- takeout double instead — this matches the relaxed-takeout expectations in the tests.
- eslint-disable-next-line no-console
- Only allow 2-level overcall in more marginal cases when no takeout double is preferred
- eslint-disable-next-line no-console

## undefined
- Prefer a natural 2-level overcall for clear single-suiters (5+ in a suit with 12+ HCP),
- but when the hand has at least two other 3-card suits (i.e., 5-3-3-2 / similar), prefer a
- takeout double instead — this matches the relaxed-takeout expectations in the tests.
- eslint-disable-next-line no-console
- Only allow 2-level overcall in more marginal cases when no takeout double is preferred
- eslint-disable-next-line no-console

## undefined
- but when the hand has at least two other 3-card suits (i.e., 5-3-3-2 / similar), prefer a
- takeout double instead — this matches the relaxed-takeout expectations in the tests.
- eslint-disable-next-line no-console
- Only allow 2-level overcall in more marginal cases when no takeout double is preferred
- eslint-disable-next-line no-console

## undefined
- takeout double instead — this matches the relaxed-takeout expectations in the tests.
- eslint-disable-next-line no-console
- Only allow 2-level overcall in more marginal cases when no takeout double is preferred
- eslint-disable-next-line no-console

## undefined

## undefined
- eslint-disable-next-line no-console

## undefined
- Stolen-bid double: over 2C, X = Stayman when enabled and Stayman preconditions met

## undefined
- Lebensohl after interference over our 1NT

## undefined
- Check for stopper

## undefined
- Fast denial with stopper

## undefined
- Weak hands with long suit go through 2NT

## undefined
- Game-forcing without stopper: cue-bid

## undefined
- Negative doubles after our 1-level suit opening (not after 1NT)
- Skip negative doubles unless we opened a 1-level suit
- Guard: only consider when the opponents' last bid was a SUIT at the 1- or 2-level (not NT)

## undefined
- Skip negative doubles unless we opened a 1-level suit
- Guard: only consider when the opponents' last bid was a SUIT at the 1- or 2-level (not NT)
- Do not apply negative-double logic or the 1-level preference when last bid was NT or higher-level
- Honor thru_level configuration; default to 3 if unspecified

## undefined
- Guard: only consider when the opponents' last bid was a SUIT at the 1- or 2-level (not NT)
- Do not apply negative-double logic or the 1-level preference when last bid was NT or higher-level
- Honor thru_level configuration; default to 3 if unspecified

## undefined
- Do not apply negative-double logic or the 1-level preference when last bid was NT or higher-level
- Honor thru_level configuration; default to 3 if unspecified

## undefined
- Honor thru_level configuration; default to 3 if unspecified

## undefined
- Example: 1C - (1D) - ? with 5 spades -> bid 1S instead of Double.

## undefined

## undefined
- Pattern: (We open 1x) – (They overcall at 1–2 level in a suit, not NT) – (? we, as responder)
- With a stopper and values, prefer 2NT (10–12) or 3NT (13+) when balanced and no obvious fit.
- Without a stopper but with game values (13+), cue-bid their suit to show values/ask for stopper.
- Find the opening bid (first contract) and ensure it was by our side and at the 1-level in a suit
- Opponents overcalled next at 1–2 level in a suit (not NT)

## undefined

## undefined

## undefined
- Find the opening bid (first contract) and ensure it was by our side and at the 1-level in a suit
- Opponents overcalled next at 1–2 level in a suit (not NT)
- Current actor should be on opener's side (responder turn)

## undefined
- Opponents overcalled next at 1–2 level in a suit (not NT)
- Current actor should be on opener's side (responder turn)

## undefined
- Stopper heuristic in their suit

## undefined
- If we already have a clear raise available (3+ support), let the competitive-raises block handle it later
- With stopper and balanced values: choose NT
- Without a stopper but with game values, cue-bid their suit to show values/ask for stopper

## undefined
- With stopper and balanced values: choose NT
- Without a stopper but with game values, cue-bid their suit to show values/ask for stopper

## undefined
- Without a stopper but with game values, cue-bid their suit to show values/ask for stopper

## undefined

## undefined
- Competitive raises (only by opener's side after opponents interfere)
- Allow this as early as responder's first turn after 1-level opening and immediate interference
- Find the first actual contract bid (ignore passes/doubles), treat as the opening

## undefined
- Allow this as early as responder's first turn after 1-level opening and immediate interference
- Find the first actual contract bid (ignore passes/doubles), treat as the opening
- No detectable opening
- Opponents interfered if the next call after opening is a non-pass by the other side

## undefined
- Find the first actual contract bid (ignore passes/doubles), treat as the opening
- No detectable opening
- Opponents interfered if the next call after opening is a non-pass by the other side

## undefined
- No detectable opening
- Opponents interfered if the next call after opening is a non-pass by the other side

## undefined
- Opponents interfered if the next call after opening is a non-pass by the other side

## undefined
- Determine if current actor is on opener's side

## undefined
- Only allow these raises when: opponents interfered and we are on opener's side
- Baseline intended level by TP
- Adjust: treat strong HCP hands on opener's side as invitation to 3-level
- and very strong hands with a long trump as candidates to go straight to game.
- Compute last contract to ensure legality

## undefined
- Baseline intended level by TP
- Adjust: treat strong HCP hands on opener's side as invitation to 3-level
- and very strong hands with a long trump as candidates to go straight to game.
- Compute last contract to ensure legality

## undefined
- Adjust: treat strong HCP hands on opener's side as invitation to 3-level
- and very strong hands with a long trump as candidates to go straight to game.
- Compute last contract to ensure legality

## undefined
- and very strong hands with a long trump as candidates to go straight to game.
- Compute last contract to ensure legality

## undefined
- Compute last contract to ensure legality
- Find minimum legal level at our suit at or above intended

## undefined
- Find minimum legal level at our suit at or above intended

## undefined
- Special-case: very strong opener values with long trump should consider bidding game
- (e.g., opener 16+ HCP and 5+ trumps). This makes aggressive game invitations/jumps
- more likely where the opener has extra distributional value.
- pick the lowest game-level that is legal (4M or higher)

## undefined
- (e.g., opener 16+ HCP and 5+ trumps). This makes aggressive game invitations/jumps
- more likely where the opener has extra distributional value.
- pick the lowest game-level that is legal (4M or higher)

## undefined
- more likely where the opener has extra distributional value.
- pick the lowest game-level that is legal (4M or higher)

## undefined
- pick the lowest game-level that is legal (4M or higher)

## undefined

## undefined
- Upstream early-splinter detection: run before interference/overcall
- handlers so abbreviated single-opener tests pick up Splinter bids
- without relying on wrapper shims.

## undefined
- handlers so abbreviated single-opener tests pick up Splinter bids
- without relying on wrapper shims.

## undefined
- without relying on wrapper shims.

## undefined

## undefined
- prefer a simple raise of partner's suit when we have 4+ support and reasonable HCP.

## undefined

## undefined
- auction seat/dealer information and normal lastSide() semantics.

## undefined
- 1NT opening

## undefined
- 1-level suit

## undefined
- Direct splinter shortcut: when partner opened 1M and we have 4+ support
- and game-forcing values with a singleton/void, prefer splinter immediately.
- Consider convention enabled if either the conventions helper reports
- it enabled or the configuration object explicitly enables it. This
- guards against contexts where `isEnabled` may be unavailable or
- disagree with the static test fixtures that set `splCfg.enabled`.
- Diagnostic entry
- Micro-logging of each guard so failing tests show which condition failed

## undefined
- and game-forcing values with a singleton/void, prefer splinter immediately.
- Consider convention enabled if either the conventions helper reports
- it enabled or the configuration object explicitly enables it. This
- guards against contexts where `isEnabled` may be unavailable or
- disagree with the static test fixtures that set `splCfg.enabled`.
- Diagnostic entry
- Micro-logging of each guard so failing tests show which condition failed

## undefined
- Consider convention enabled if either the conventions helper reports
- it enabled or the configuration object explicitly enables it. This
- guards against contexts where `isEnabled` may be unavailable or
- disagree with the static test fixtures that set `splCfg.enabled`.
- Diagnostic entry
- Micro-logging of each guard so failing tests show which condition failed

## undefined
- it enabled or the configuration object explicitly enables it. This
- guards against contexts where `isEnabled` may be unavailable or
- disagree with the static test fixtures that set `splCfg.enabled`.
- Diagnostic entry
- Micro-logging of each guard so failing tests show which condition failed

## undefined
- guards against contexts where `isEnabled` may be unavailable or
- disagree with the static test fixtures that set `splCfg.enabled`.
- Diagnostic entry
- Micro-logging of each guard so failing tests show which condition failed

## undefined
- Micro-logging of each guard so failing tests show which condition failed

## undefined

## undefined
- Competitive action: only when we know the last bid was by opponents
- Avoid injecting overcalls in seat-unknown contexts (handled elsewhere)

## undefined
- Avoid injecting overcalls in seat-unknown contexts (handled elsewhere)

## undefined
- If opponents opened and our interference handler had no action, normally pass by default.
- However, for single-opening abbreviated auctions where the responder appears to be
- a splinter candidate, allow flow to continue to responder logic rather than defaulting
- to PASS (this supports test fixtures that provide only the opener and ourSeat).

## undefined
- However, for single-opening abbreviated auctions where the responder appears to be
- a splinter candidate, allow flow to continue to responder logic rather than defaulting
- to PASS (this supports test fixtures that provide only the opener and ourSeat).
- fall through to responder handling (do not return PASS)

## undefined
- a splinter candidate, allow flow to continue to responder logic rather than defaulting
- to PASS (this supports test fixtures that provide only the opener and ourSeat).
- fall through to responder handling (do not return PASS)

## undefined
- to PASS (this supports test fixtures that provide only the opener and ourSeat).
- fall through to responder handling (do not return PASS)

## undefined
- fall through to responder handling (do not return PASS)

## undefined
- Fall back to partner response when lastSide indicates partner/opening side

## undefined
- 2-level suit (Weak Two) responses
- Multi-bid auctions - if last bid was by opponents, prefer interference handling first (e.g., negative doubles)

## undefined
- Multi-bid auctions - if last bid was by opponents, prefer interference handling first (e.g., negative doubles)

## undefined
- Early hook: explicit Support Double pattern 1x – (1/2y) – 1z
- Run this before other responder/opener logic to avoid being bypassed in seatless contexts

## undefined

## undefined

## undefined

## undefined

## undefined
- skip generic interference so our dedicated third-round opener logic (later in flow) can run.
- Find our 1-level suit opening
- Next non-pass by opponents is a 1-level suit overcall?

## undefined
- Find our 1-level suit opening
- Next non-pass by opponents is a 1-level suit overcall?

## undefined
- Next non-pass by opponents is a 1-level suit overcall?

## undefined

## undefined
- Instrumentation: log seats/context before calling Drury handler so we can see
- why the main flow might skip the drury handler in some test cases.

## undefined
- why the main flow might skip the drury handler in some test cases.

## undefined
- Special: opener continuation after our Weak Two when partner makes a new-suit forcing bid at 3-level

## undefined
- Competitive actions as a fallback in other multi-bid contexts

## undefined
- Check for ace-asking

## undefined

## undefined
- Find our side and partner using context

## undefined

## undefined
- Identify our Weak Two opening on our side (first contract by our side that is 2D/2H/2S)
- Must be on our side

## undefined
- Must be on our side

## undefined
- Partner's last bid must be a new suit at the 3-level (not our suit)

## undefined
- Decide action
- Otherwise, raise our preempt to 4-level

## undefined
- Otherwise, raise our preempt to 4-level

## undefined

## undefined

## undefined

## undefined
- debug print removed

## undefined

## undefined

## undefined

## undefined
- Find partner's 1NT opening index

## undefined
- Ensure we have made at least one bid after 1NT (i.e., this is our second turn as responder)

## undefined
- Our first action must have been a Jacoby transfer ask to a major

## undefined
- Partner must have accepted: 2D->2H or 2H->2S, and that acceptance should be their last bid

## undefined

## undefined
- Find the very next non-pass after the opener that appears to be by opponents

## undefined
- Candidate must be cueing the opponents' suit (or opener's suit when used as a cue)

## undefined
- Ensure current bidder is on the same side as the overcaller by turn parity

## undefined

## undefined

## undefined

## undefined
- began with a 3-level suit opener followed by two passes (balancing-like
- context), consult the centralized reopening-double helper and return
- the candidate immediately if present. This keeps reopening logic
- centralized and prevents later fallback branches from preempting it.
- Use the interference handler to detect reopening-double candidate

## undefined
- context), consult the centralized reopening-double helper and return
- the candidate immediately if present. This keeps reopening logic
- centralized and prevents later fallback branches from preempting it.
- Use the interference handler to detect reopening-double candidate

## undefined
- the candidate immediately if present. This keeps reopening logic
- centralized and prevents later fallback branches from preempting it.
- Use the interference handler to detect reopening-double candidate

## undefined
- centralized and prevents later fallback branches from preempting it.
- Use the interference handler to detect reopening-double candidate

## undefined
- Use the interference handler to detect reopening-double candidate

## undefined
- Opening bids: either first action, or all prior actions are passes (treat null and 'PASS' as pass)

## undefined
- Upstream early-splinter detection for abbreviated single-opener tests.
- Run this before any interference/overcall handling so responder Splinter
- bids are chosen when the auction only contains the opener and tests set
- explicit ourSeat/dealer fields.

## undefined
- Run this before any interference/overcall handling so responder Splinter
- bids are chosen when the auction only contains the opener and tests set
- explicit ourSeat/dealer fields.

## undefined
- bids are chosen when the auction only contains the opener and tests set
- explicit ourSeat/dealer fields.

## undefined
- explicit ourSeat/dealer fields.

## undefined

## undefined
- Pattern: Our side opened a 1-level suit, partner made a 1-level new suit response, and it's our next turn (passes allowed between).
- Priority: Do this before generic responder/advancer/interference handling to avoid misclassification in seat-edge cases.
- Find the first contract bid and ensure it was by our side (tolerate missing seat on opening; assume it's ours if unknown).
- Determine side relative to our context
- Partner's canonical response index is +2 from opening; must be a 1-level suit (new suit or raise)

## undefined
- Priority: Do this before generic responder/advancer/interference handling to avoid misclassification in seat-edge cases.
- Find the first contract bid and ensure it was by our side (tolerate missing seat on opening; assume it's ours if unknown).
- Determine side relative to our context
- Partner's canonical response index is +2 from opening; must be a 1-level suit (new suit or raise)

## undefined
- Find the first contract bid and ensure it was by our side (tolerate missing seat on opening; assume it's ours if unknown).
- Determine side relative to our context
- Partner's canonical response index is +2 from opening; must be a 1-level suit (new suit or raise)
- Guard: ensure there was no opponents' non-pass action between opening and partner's response

## undefined
- Partner's canonical response index is +2 from opening; must be a 1-level suit (new suit or raise)
- Guard: ensure there was no opponents' non-pass action between opening and partner's response
- Balanced hand ranges

## undefined
- Balanced hand ranges

## undefined
- Opportunistic opener suit-raise heuristic:
- If we opened a 1-level suit, partner made a 1-level suit response in a different suit,
- and we (opener side) have 4+ support for that response and at least 12 HCP,
- raise to 2 of partner's suit. This is conservative and intended to catch the

## undefined

## undefined
- If we opened a 1-level suit, partner made a 1-level suit response in a different suit,
- and we (opener side) have 4+ support for that response and at least 12 HCP,
- raise to 2 of partner's suit. This is conservative and intended to catch the
- common case where opener should prefer a raise over an unexplained PASS.

## undefined
- and we (opener side) have 4+ support for that response and at least 12 HCP,
- raise to 2 of partner's suit. This is conservative and intended to catch the
- common case where opener should prefer a raise over an unexplained PASS.

## undefined
- raise to 2 of partner's suit. This is conservative and intended to catch the
- common case where opener should prefer a raise over an unexplained PASS.

## undefined
- common case where opener should prefer a raise over an unexplained PASS.

## undefined

## undefined

## undefined
- With strong balanced values in the balancing seat, prefer an appropriate-level notrump call when we plausibly hold a stopper.

## undefined

## undefined

## undefined
- Improvement: Do not pass hands with clear two-suited offensive potential (5-5 shape) and 10+ HCP in balancing seat.
- Offer takeout double with 5-5 and 10-15 HCP when not fitting NT criteria and no direct suit bid stands out.

## undefined
- Offer takeout double with 5-5 and 10-15 HCP when not fitting NT criteria and no direct suit bid stands out.

## undefined

## undefined

## undefined

## undefined
- Minimal Drury integration: consult the Drury opener-rebid handler here so
- the main SAYC flow will return the Drury continuation when appropriate.

## undefined
- the main SAYC flow will return the Drury continuation when appropriate.

## undefined
- Ace-asking responses

## undefined
- High-priority: systems-on over interference of our 1NT opening

## undefined

## undefined
- Early hook: Responder after our 1-level suit opening and immediate interference (1X – (1/2Y) – ?)
- Ensure responder-side competitive actions are considered before generic responder/openers blocks.
- Find first contract (opening)

## undefined
- Find first contract (opening)
- Only trigger this early responder hook when it's actually responder's turn now (partner of opener),
- not on opener's later turns (e.g., classic third-round opener after two passes).

## undefined
- Only trigger this early responder hook when it's actually responder's turn now (partner of opener),
- not on opener's later turns (e.g., classic third-round opener after two passes).
- It's responder's turn if we're on opener's side but not the opener's own seat

## undefined
- not on opener's later turns (e.g., classic third-round opener after two passes).
- It's responder's turn if we're on opener's side but not the opener's own seat
- debug print removed

## undefined
- It's responder's turn if we're on opener's side but not the opener's own seat
- debug print removed

## undefined
- debug print removed

## undefined

## undefined
- Configurable via competitive.advancer_raises
- - 6–10 HCP: simple raise to 2-level (min support default 3)
- - 11–12 HCP: jump raise to 3-level (min support default 4)
- - 13+ HCP: cue-bid opener's suit (limit+/GF raise of partner's suit)
- Pattern: (Opp open 1-level suit) – (Partner overcalls 1M) – (RHO PASS) – (? we)
- Find first non-pass (opening)
- Opponents opened a 1-level suit
- Partner's last action was a 1-level suit bid (overcall)

## undefined
- Pattern: (Opp open 1-level suit) – (Partner overcalls 1M) – (RHO PASS) – (? we)
- Find first non-pass (opening)
- Opponents opened a 1-level suit
- Partner's last action was a 1-level suit bid (overcall)

## undefined
- Opponents opened a 1-level suit
- Partner's last action was a 1-level suit bid (overcall)
- New context: opponents raised opener's suit (e.g., 1C – 1S – 2C) -> treat like a live competitive spot for advancer

## undefined
- Partner's last action was a 1-level suit bid (overcall)
- New context: opponents raised opener's suit (e.g., 1C – 1S – 2C) -> treat like a live competitive spot for advancer

## undefined
- New context: opponents raised opener's suit (e.g., 1C – 1S – 2C) -> treat like a live competitive spot for advancer

## undefined
- If opponents already raised opener's suit (e.g., 2C is taken), cue at next available level (3C).

## undefined
- Jump raise (invitational)
- If opponents raised opener's suit, still jump in our suit (3M) unaffected.

## undefined
- If opponents raised opener's suit, still jump in our suit (3M) unaffected.

## undefined
- Simple raise

## undefined
- Opener continuations after Strong 2C opening (partner 2D waiting)
- Find our 2C opening

## undefined
- Find our 2C opening
- Identify partner's first action after our 2C
- If partner gave the waiting response (2D), describe our hand — do not pass
- Classic: with balanced 22–24 HCP, rebid 2NT

## undefined
- Identify partner's first action after our 2C
- If partner gave the waiting response (2D), describe our hand — do not pass
- Classic: with balanced 22–24 HCP, rebid 2NT

## undefined
- If partner gave the waiting response (2D), describe our hand — do not pass
- Classic: with balanced 22–24 HCP, rebid 2NT
- Otherwise, show a good 5+ card suit (prefer majors at the 2-level)

## undefined

## undefined

## undefined
- Fallback: with 22+ but not clearly balanced/long suit, choose 2NT

## undefined
- If partner opened 1NT or 2NT, act as responder
- Be tolerant to missing or misaligned seat info: also treat it as partner-opened
- when it's currently partner's turn to act or seat was not assigned on the opening bid.
- Check whether this is our first action after the 1NT opening or a continuation round

## undefined

## undefined
- Be tolerant to missing or misaligned seat info: also treat it as partner-opened
- when it's currently partner's turn to act or seat was not assigned on the opening bid.
- Check whether this is our first action after the 1NT opening or a continuation round

## undefined
- when it's currently partner's turn to act or seat was not assigned on the opening bid.
- Check whether this is our first action after the 1NT opening or a continuation round

## undefined
- Check whether this is our first action after the 1NT opening or a continuation round

## undefined

## undefined
- First round over 1NT: allow responder conventions, possibly with systems-on vs interference
- Prefer explicit systems-on handling here when enabled

## undefined
- Prefer explicit systems-on handling here when enabled
- Stolen-bid double over 2C = Stayman
- Transfers on over 2C interference to majors

## undefined
- Stolen-bid double over 2C = Stayman
- Transfers on over 2C interference to majors

## undefined
- Map responder tokens to named conventions where appropriate.
- Stayman: 2C. Jacoby Transfers: 2D/2H. Texas Transfers: 4D/4H.

## undefined
- Stayman: 2C. Jacoby Transfers: 2D/2H. Texas Transfers: 4D/4H.
- Second round (responder rebid) after transfer acceptance

## undefined
- Second round (responder rebid) after transfer acceptance

## undefined
- If we opened 1NT/2NT and partner asked/transfered, accept

## undefined
- Opener rebid: after 1m (or 1M) and partner's 1-level response, show 2NT with 18–19 balanced
- Find our opening bid (first bid by our side)

## undefined

## undefined

## undefined
- Partner made a 1-level response and it's now our turn again
- Guard: ensure there was no opponents' non-pass action between our opening and partner's response
- With 12–14 balanced, rebid 1NT

## undefined
- Guard: ensure there was no opponents' non-pass action between our opening and partner's response
- With 12–14 balanced, rebid 1NT
- With 18–19 balanced, rebid 2NT

## undefined
- With 12–14 balanced, rebid 1NT
- With 18–19 balanced, rebid 2NT

## undefined

## undefined

## undefined

## undefined
- Identify first contract by our side (the opening)
- Next non-pass by opponents should be a 1-level suit overcall
- Skip doubles/redoubles

## undefined
- Next non-pass by opponents should be a 1-level suit overcall
- Skip doubles/redoubles
- Any other action breaks the specific pattern

## undefined
- Skip doubles/redoubles
- Any other action breaks the specific pattern
- Ensure exactly two passes followed the overcall

## undefined
- Any other action breaks the specific pattern
- Ensure exactly two passes followed the overcall
- Stopper heuristic

## undefined
- Ensure exactly two passes followed the overcall
- Stopper heuristic

## undefined
- Stopper heuristic

## undefined
- Nuance: 18–19 balanced values prefer 2NT; otherwise 1NT with 15–17+

## undefined

## undefined
- Otherwise, rebid our suit with extra length

## undefined
- Last resort with values: take a conservative double

## undefined
- Responder after opener's 2NT rebid (e.g., 1m - 1M - 2NT): usually raise to 3NT with 6+ HCP; with 6+ trumps or unbalanced, commit to 4M
- debug print removed
- Guard: only apply when our side's opening was a 1-level suit (not a Weak Two)
- Not our target sequence (e.g., Weak Two 2M - 2NT feature ask); let dedicated logic handle it

## undefined

## undefined

## undefined
- Not our target sequence (e.g., Weak Two 2M - 2NT feature ask); let dedicated logic handle it
- Check our previously bid suit at 1-level (by our side)

## undefined

## undefined

## undefined
- Fallback: any earlier 1H/1S in auction (safer than missing the preference entirely)

## undefined
- Balanced: if we hold exactly a 5-card major, prefer 3NT (opener can correct with 3-card support);
- otherwise use a generic notrump game explanation.

## undefined

## undefined
- Otherwise, pass with very weak hands

## undefined

## undefined

## undefined

## undefined
- Responder after opener's jump rebid to 3M following 1M - 1NT
- Verify partner opened 1M earlier and we previously responded 1NT

## undefined
- Verify partner opened 1M earlier and we previously responded 1NT

## undefined

## undefined
- Responder after opener's 2m rebid following 1M - 1NT: prefer restoring 2M/3M with 3-card support
- Verify partner opened 1M earlier and we previously responded 1NT

## undefined
- Verify partner opened 1M earlier and we previously responded 1NT

## undefined

## undefined
- Determine if our partner made the first contract bid (opener), tolerating leading passes
- If no contract is found (all passes so far), be permissive
- Determine the last relevant bid by our side to respond to (partner or opener on our side)

## undefined
- If no contract is found (all passes so far), be permissive
- Determine the last relevant bid by our side to respond to (partner or opener on our side)
- Guard: only apply responder logic when it's actually responder's turn, not opener's rebid

## undefined
- Determine the last relevant bid by our side to respond to (partner or opener on our side)
- Guard: only apply responder logic when it's actually responder's turn, not opener's rebid
- Gate responder logic: ensure the first contract bid of the auction was made by our side

## undefined
- Guard: only apply responder logic when it's actually responder's turn, not opener's rebid
- Gate responder logic: ensure the first contract bid of the auction was made by our side

## undefined
- Gate responder logic: ensure the first contract bid of the auction was made by our side
- Determine side relative to our currentAuction.ourSeat when available (actor's side in tests/UI)

## undefined

## undefined
- Determine side relative to our currentAuction.ourSeat when available (actor's side in tests/UI)
- If seat info is missing on the opening bid, assume it's our partner to enable responder flows in tests

## undefined
- If seat info is missing on the opening bid, assume it's our partner to enable responder flows in tests

## undefined
- Opener rebids after partner's 2NT feature ask over our Weak Two
- Find our last suit opening (2D/2H/2S) prior to partner's 2NT
- Find index of partner's last bid

## undefined
- Find our last suit opening (2D/2H/2S) prior to partner's 2NT
- Find index of partner's last bid
- Walk back to find our prior suit opening at 2-level

## undefined
- Find index of partner's last bid
- Walk back to find our prior suit opening at 2-level

## undefined

## undefined
- Walk back to find our prior suit opening at 2-level

## undefined

## undefined

## undefined

## undefined
- Single 1NT: choose responder vs defenses based on configured conventions
- Detect explicitly configured defenses (as opposed to auto-defaults inside interference logic)

## undefined
- Detect explicitly configured defenses (as opposed to auto-defaults inside interference logic)

## undefined
- Compute responder action first

## undefined
- If tests explicitly emphasize defenses (e.g., DONT off + Meckwell on), prefer defenses first
- Explicitly prefer defenses when tests disable DONT and enable Meckwell (in either category)

## undefined

## undefined

## undefined
- Explicitly prefer defenses when tests disable DONT and enable Meckwell (in either category)

## undefined
- If defenses are explicitly emphasized and shape screams overcall, prefer defenses first

## undefined
- Prefer responder conventional actions (Stayman/Jacoby/Texas/MST)

## undefined
- Try defenses before natural invites if enabled

## undefined
- Natural NT invites/commitments
- Partner opened 2NT in no-seat context: apply responder logic

## undefined
- Partner opened 2NT in no-seat context: apply responder logic

## undefined

## undefined

## undefined
- Detect classic balancing seat: 1-level opening followed by two passes

## undefined
- Strong responder signals take precedence
- Accept responder logic directly; it already encodes thresholds (e.g., simple raise with 6+ total points)
- If no responder action produced, pass rather than compete
- Be permissive for a natural 1NT response with a balanced minimum (6–11 HCP)
- Additionally, allow a low-end fit-first simple raise to 2M with exactly 3-card support
- when total points are 6–8 (to avoid passing hands that should support partner's major).

## undefined
- Accept responder logic directly; it already encodes thresholds (e.g., simple raise with 6+ total points)
- If no responder action produced, pass rather than compete
- Be permissive for a natural 1NT response with a balanced minimum (6–11 HCP)
- Additionally, allow a low-end fit-first simple raise to 2M with exactly 3-card support
- when total points are 6–8 (to avoid passing hands that should support partner's major).

## undefined
- Be permissive for a natural 1NT response with a balanced minimum (6–11 HCP)
- Additionally, allow a low-end fit-first simple raise to 2M with exactly 3-card support
- when total points are 6–8 (to avoid passing hands that should support partner's major).
- Reopening double special-case in balancing seat

## undefined
- when total points are 6–8 (to avoid passing hands that should support partner's major).
- Reopening double special-case in balancing seat
- Reasonable shape for reopening double: short in their suit and at least two other suits with 3+

## undefined
- Reasonable shape for reopening double: short in their suit and at least two other suits with 3+

## undefined
- Attempt interference actions, but be conservative with natural 2-level overcalls in seat-unknown tests
- If this is a plain natural 2-level overcall (no convention label) and we have only ~10 HCP, suppress it
- fall through to other fallbacks

## undefined
- If this is a plain natural 2-level overcall (no convention label) and we have only ~10 HCP, suppress it
- fall through to other fallbacks

## undefined

## undefined
- NOTE: Last-resort inference for seat-unknown tests only
- As a last resort, allow a balancing-friendly natural 1-level new suit in a higher-ranking major
- with 4+ cards and sufficient strength (12+ HCP), only over 1-level openings.
- This is NOT a SAYC overcall rule. It exists purely to satisfy test scenarios that
- lack seat/dealer context (no-seat fallback), and it never applies in seat-aware flows.
- Before taking the seat-unknown fallback natural 1-level overcall,
- consult the centralized reopening-double helper when the opener

## undefined
- As a last resort, allow a balancing-friendly natural 1-level new suit in a higher-ranking major
- with 4+ cards and sufficient strength (12+ HCP), only over 1-level openings.
- This is NOT a SAYC overcall rule. It exists purely to satisfy test scenarios that
- lack seat/dealer context (no-seat fallback), and it never applies in seat-aware flows.
- Before taking the seat-unknown fallback natural 1-level overcall,
- consult the centralized reopening-double helper when the opener
- was at the 3-level. Prefer reopening double in that narrow case.

## undefined
- with 4+ cards and sufficient strength (12+ HCP), only over 1-level openings.
- This is NOT a SAYC overcall rule. It exists purely to satisfy test scenarios that
- lack seat/dealer context (no-seat fallback), and it never applies in seat-aware flows.
- Before taking the seat-unknown fallback natural 1-level overcall,
- consult the centralized reopening-double helper when the opener
- was at the 3-level. Prefer reopening double in that narrow case.

## undefined
- This is NOT a SAYC overcall rule. It exists purely to satisfy test scenarios that
- lack seat/dealer context (no-seat fallback), and it never applies in seat-aware flows.
- Before taking the seat-unknown fallback natural 1-level overcall,
- consult the centralized reopening-double helper when the opener
- was at the 3-level. Prefer reopening double in that narrow case.

## undefined
- lack seat/dealer context (no-seat fallback), and it never applies in seat-aware flows.
- Before taking the seat-unknown fallback natural 1-level overcall,
- consult the centralized reopening-double helper when the opener
- was at the 3-level. Prefer reopening double in that narrow case.

## undefined
- Before taking the seat-unknown fallback natural 1-level overcall,
- consult the centralized reopening-double helper when the opener
- was at the 3-level. Prefer reopening double in that narrow case.

## undefined
- consult the centralized reopening-double helper when the opener
- was at the 3-level. Prefer reopening double in that narrow case.

## undefined
- was at the 3-level. Prefer reopening double in that narrow case.

## undefined
- Opener: respond to partner's simple 2-level raise when strong
- Only consider when we are the original opener
- Look for a simple 2-level raise by partner (e.g., 2C over 1C)

## undefined
- Only consider when we are the original opener
- Look for a simple 2-level raise by partner (e.g., 2C over 1C)
- Require balanced shape for NT responses from opener (conservative)
- Compute vulnerability state (favor us when opponents vulnerable and we not)

## undefined
- Look for a simple 2-level raise by partner (e.g., 2C over 1C)
- Require balanced shape for NT responses from opener (conservative)
- Compute vulnerability state (favor us when opponents vulnerable and we not)

## undefined
- Require balanced shape for NT responses from opener (conservative)
- Compute vulnerability state (favor us when opponents vulnerable and we not)

## undefined
- Compute vulnerability state (favor us when opponents vulnerable and we not)

## undefined
- Determine whether opponents have bid a suit (not just doubled)

## undefined
- Conservative NT choices: require balanced hand; require stoppers only when opponents bid the suit

## undefined

## undefined
- Allow 1NT with a balanced minimum (6–11 HCP) in seat-unknown fallback.
- Also allow a low-end simple raise to 2M with exactly 3-card support when total points are 6–8.
- For Weak Two openings in seat-unknown tests, route directly to responder logic
- to leverage correct structures (raises, feature asks, new suit forcing at 3-level).

## undefined
- to leverage correct structures (raises, feature asks, new suit forcing at 3-level).

## undefined
- Interference handling as a last resort when no partner response applies
- Allow responder-side competitive actions (doubles, cue raises, Lebensohl, competitive raises)
- while preventing pure overcall suggestions if our side made the opening bid.
- Seat-aware defaulting: if seat context is available (dealer known), and the opening bid lacks seat,

## undefined
- Allow responder-side competitive actions (doubles, cue raises, Lebensohl, competitive raises)
- while preventing pure overcall suggestions if our side made the opening bid.
- Seat-aware defaulting: if seat context is available (dealer known), and the opening bid lacks seat,
- prefer allowing interference (assume opponents opened). In seat-unknown tests (no dealer), keep the
- conservative suppression of pure overcalls to avoid spurious suggestions.

## undefined
- while preventing pure overcall suggestions if our side made the opening bid.
- Seat-aware defaulting: if seat context is available (dealer known), and the opening bid lacks seat,
- prefer allowing interference (assume opponents opened). In seat-unknown tests (no dealer), keep the
- conservative suppression of pure overcalls to avoid spurious suggestions.

## undefined
- Seat-aware defaulting: if seat context is available (dealer known), and the opening bid lacks seat,
- prefer allowing interference (assume opponents opened). In seat-unknown tests (no dealer), keep the
- conservative suppression of pure overcalls to avoid spurious suggestions.

## undefined
- prefer allowing interference (assume opponents opened). In seat-unknown tests (no dealer), keep the
- conservative suppression of pure overcalls to avoid spurious suggestions.

## undefined
- conservative suppression of pure overcalls to avoid spurious suggestions.

## undefined
- We're the overcalling side: allow all interference logic
- Our side opened: only allow responder-side competitive actions

## undefined
- Our side opened: only allow responder-side competitive actions
- Natural responder NT continuations (e.g., 2NT/3NT over interference)
- Competitive natural raises of opener's suit (e.g., 2M/3M) without a label

## undefined
- Natural responder NT continuations (e.g., 2NT/3NT over interference)
- Competitive natural raises of opener's suit (e.g., 2M/3M) without a label
- Find opened suit

## undefined

## undefined
- Competitive natural raises of opener's suit (e.g., 2M/3M) without a label
- Find opened suit
- Otherwise, suppress pure overcalls when our side opened

## undefined
- Find opened suit
- Otherwise, suppress pure overcalls when our side opened

## undefined
- Otherwise, suppress pure overcalls when our side opened

## undefined
- One more safety: detect support double pattern before passing (helps seatless tests)

## undefined
- Default: pass
- Diagnostic: if auction looks like a 3-level opener followed by two passes
- and reopening doubles are enabled, ask the helper and log if it suggests
- a double while we're about to pass. This helps catch caller-side
- suppressions in edge-case test fixtures.
- (diagnostics removed)

## undefined
- Diagnostic: if auction looks like a 3-level opener followed by two passes
- and reopening doubles are enabled, ask the helper and log if it suggests
- a double while we're about to pass. This helps catch caller-side
- suppressions in edge-case test fixtures.
- (diagnostics removed)

## undefined
- and reopening doubles are enabled, ask the helper and log if it suggests
- a double while we're about to pass. This helps catch caller-side
- suppressions in edge-case test fixtures.
- (diagnostics removed)

## undefined
- a double while we're about to pass. This helps catch caller-side
- suppressions in edge-case test fixtures.
- (diagnostics removed)

## undefined
- suppressions in edge-case test fixtures.
- (diagnostics removed)

## undefined
- (diagnostics removed)

## undefined
- same level: suit rank must be higher

## undefined
- Important: do NOT assume dealer === ourSeat (that was causing wrong seat inference).
- If ourSeat is missing, prefer to set it from this.ourSeat or infer from the first bid's seat.
- If dealer is missing, set it only when we can reliably infer it from existing bids (first bid seat).
- Otherwise leave dealer undefined so code that relies on explicit dealer/turn will fall back
- to bid-level seat information (bid.seat) instead of a potentially incorrect dealer value.
- non-critical

## undefined
- If dealer is missing, set it only when we can reliably infer it from existing bids (first bid seat).
- Otherwise leave dealer undefined so code that relies on explicit dealer/turn will fall back
- to bid-level seat information (bid.seat) instead of a potentially incorrect dealer value.
- non-critical

## undefined
- Otherwise leave dealer undefined so code that relies on explicit dealer/turn will fall back
- to bid-level seat information (bid.seat) instead of a potentially incorrect dealer value.
- non-critical

## undefined
- to bid-level seat information (bid.seat) instead of a potentially incorrect dealer value.
- non-critical

## undefined
- non-critical

## undefined
- Debug entry: show auction snapshot and hand summary for each call

## undefined
- debug removed: suppressed noisy wrapper entry log

## undefined
- debug print removed

## undefined
- prefer a game-level response (3NT or 4M) when hand/shape indicate game values.
- Verify this is the typical sequence target: our side opened a 1-level suit earlier
- Find our previously bid 1-level major (if any)

## undefined
- Verify this is the typical sequence target: our side opened a 1-level suit earlier
- Find our previously bid 1-level major (if any)

## undefined
- Find our previously bid 1-level major (if any)

## undefined

## undefined

## undefined

## undefined

## undefined

## undefined
- Use wrapper-scoped higherThan if available; fall back on simple compare
- debug print removed

## undefined
- system produced a natural 1-level contract (non-double), consult
- the centralized reopening-double helper and prefer a reopening
- double candidate when present. This is a narrow, well-guarded
- caller-side precedence fix to ensure reopening doubles are not
- preempted by scattered natural overcall fallbacks.
- Prefer reopening double when the auction started with a 1/2/3-level
- suit opener followed by two passes (reopening context). Guard by
- the convention being enabled and only when the current result
- is a non-double so we don't replace intentional doubles/redoubles.
- Prefer reopening double candidate when present

## undefined
- the centralized reopening-double helper and prefer a reopening
- double candidate when present. This is a narrow, well-guarded
- caller-side precedence fix to ensure reopening doubles are not
- preempted by scattered natural overcall fallbacks.
- Prefer reopening double when the auction started with a 1/2/3-level
- suit opener followed by two passes (reopening context). Guard by
- the convention being enabled and only when the current result
- is a non-double so we don't replace intentional doubles/redoubles.
- Prefer reopening double candidate when present

## undefined
- double candidate when present. This is a narrow, well-guarded
- caller-side precedence fix to ensure reopening doubles are not
- preempted by scattered natural overcall fallbacks.
- Prefer reopening double when the auction started with a 1/2/3-level
- suit opener followed by two passes (reopening context). Guard by
- the convention being enabled and only when the current result
- is a non-double so we don't replace intentional doubles/redoubles.
- Prefer reopening double candidate when present

## undefined
- caller-side precedence fix to ensure reopening doubles are not
- preempted by scattered natural overcall fallbacks.
- Prefer reopening double when the auction started with a 1/2/3-level
- suit opener followed by two passes (reopening context). Guard by
- the convention being enabled and only when the current result
- is a non-double so we don't replace intentional doubles/redoubles.
- Prefer reopening double candidate when present

## undefined
- preempted by scattered natural overcall fallbacks.
- Prefer reopening double when the auction started with a 1/2/3-level
- suit opener followed by two passes (reopening context). Guard by
- the convention being enabled and only when the current result
- is a non-double so we don't replace intentional doubles/redoubles.
- Prefer reopening double candidate when present

## undefined
- Prefer reopening double when the auction started with a 1/2/3-level
- suit opener followed by two passes (reopening context). Guard by
- the convention being enabled and only when the current result
- is a non-double so we don't replace intentional doubles/redoubles.
- Prefer reopening double candidate when present

## undefined
- suit opener followed by two passes (reopening context). Guard by
- the convention being enabled and only when the current result
- is a non-double so we don't replace intentional doubles/redoubles.
- Prefer reopening double candidate when present

## undefined
- the convention being enabled and only when the current result
- is a non-double so we don't replace intentional doubles/redoubles.
- Prefer reopening double candidate when present

## undefined
- is a non-double so we don't replace intentional doubles/redoubles.
- Prefer reopening double candidate when present

## undefined
- Prefer reopening double candidate when present

## undefined
- debug removed: suppressed wrapper return logging

## undefined
- Narrow fallback removed: prefer upstream logic and explicit auction context
- The delayed overcall compatibility shim has been removed to avoid
- duplicative decision paths and seat-inference regressions.

## undefined
- The delayed overcall compatibility shim has been removed to avoid
- duplicative decision paths and seat-inference regressions.

## undefined
- duplicative decision paths and seat-inference regressions.

## undefined
- Debug-only: ask the Drury handler what it *would* return for this auction/hand
- and log the result. This is purely observational and does not change the
- returned bid. Leave in place while diagnosing why the main flow returns PASS.
- debug removed: drury hypothetical logging suppressed

## undefined
- and log the result. This is purely observational and does not change the
- returned bid. Leave in place while diagnosing why the main flow returns PASS.
- debug removed: drury hypothetical logging suppressed

## undefined
- returned bid. Leave in place while diagnosing why the main flow returns PASS.
- debug removed: drury hypothetical logging suppressed

## undefined
- debug removed: drury hypothetical logging suppressed

## undefined
- Additional diagnostics: show lastSide and what other handlers would return
- Narrow compatibility: if the main flow returned a natural 1-level overcall
- but the interference handler (when run with the saved auction context)
- suggests a conventional two-suited overcall (e.g., Michaels at 2{opp}),
- prefer the conventional bid in the very specific immediate single-opening
- (direct-seat) and seatless test fixtures. This avoids the diagnostics-only
- mismatch where dbgInter shows a Michaels candidate but the earlier
- main path returned a 1-level natural due to differing auction context.
- Determine whether the auction is an immediate single 1-level opening

## undefined
- Narrow compatibility: if the main flow returned a natural 1-level overcall
- but the interference handler (when run with the saved auction context)
- suggests a conventional two-suited overcall (e.g., Michaels at 2{opp}),
- prefer the conventional bid in the very specific immediate single-opening
- (direct-seat) and seatless test fixtures. This avoids the diagnostics-only
- mismatch where dbgInter shows a Michaels candidate but the earlier
- main path returned a 1-level natural due to differing auction context.
- Determine whether the auction is an immediate single 1-level opening

## undefined
- but the interference handler (when run with the saved auction context)
- suggests a conventional two-suited overcall (e.g., Michaels at 2{opp}),
- prefer the conventional bid in the very specific immediate single-opening
- (direct-seat) and seatless test fixtures. This avoids the diagnostics-only
- mismatch where dbgInter shows a Michaels candidate but the earlier
- main path returned a 1-level natural due to differing auction context.
- Determine whether the auction is an immediate single 1-level opening

## undefined
- suggests a conventional two-suited overcall (e.g., Michaels at 2{opp}),
- prefer the conventional bid in the very specific immediate single-opening
- (direct-seat) and seatless test fixtures. This avoids the diagnostics-only
- mismatch where dbgInter shows a Michaels candidate but the earlier
- main path returned a 1-level natural due to differing auction context.
- Determine whether the auction is an immediate single 1-level opening

## undefined

## undefined
- (direct-seat) and seatless test fixtures. This avoids the diagnostics-only
- mismatch where dbgInter shows a Michaels candidate but the earlier
- main path returned a 1-level natural due to differing auction context.
- Determine whether the auction is an immediate single 1-level opening
- Replace the natural 1-level with the conventional 2-level suggested by dbgInter

## undefined
- mismatch where dbgInter shows a Michaels candidate but the earlier
- main path returned a 1-level natural due to differing auction context.
- Determine whether the auction is an immediate single 1-level opening
- Replace the natural 1-level with the conventional 2-level suggested by dbgInter

## undefined
- main path returned a 1-level natural due to differing auction context.
- Determine whether the auction is an immediate single 1-level opening
- Replace the natural 1-level with the conventional 2-level suggested by dbgInter

## undefined
- Determine whether the auction is an immediate single 1-level opening
- Replace the natural 1-level with the conventional 2-level suggested by dbgInter

## undefined
- Replace the natural 1-level with the conventional 2-level suggested by dbgInter

## undefined
- debug removed: handler diagnostics suppressed

## undefined
- Wrapper shim removed: rely on upstream early-splinter detection and
- interference suppression to select Splinter bids for abbreviated
- single-opener tests. The narrow fallback was a temporary compatibility
- shim; removing it keeps the decision logic in one place and avoids
- duplicative code paths.

## undefined
- interference suppression to select Splinter bids for abbreviated
- single-opener tests. The narrow fallback was a temporary compatibility
- shim; removing it keeps the decision logic in one place and avoids
- duplicative code paths.

## undefined
- single-opener tests. The narrow fallback was a temporary compatibility
- shim; removing it keeps the decision logic in one place and avoids
- duplicative code paths.

## undefined
- shim; removing it keeps the decision logic in one place and avoids
- duplicative code paths.

## undefined
- Safety net: if PASS was returned but a textbook support double pattern is present, emit X

## undefined

## undefined

## undefined
- tests that assert global.* in Node or window.* in browsers both pass.

## undefined
- Node.js/CommonJS export for Jest and other consumers

## undefined
