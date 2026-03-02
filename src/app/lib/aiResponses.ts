const CANCELLATIONS_RESPONSE = `**Cancellation Analysis — Week to Date**

Cancellation rate has elevated to **8.2%** this week, against a 3.9% baseline for the equivalent period last month.

**Key drivers identified:**
- OTA bookings (primarily Booking.com) account for 71% of cancellations
- Average lead time on cancelled bookings: 4.2 days — indicating last-minute demand shifts
- Weekend nights (Fri–Sat) disproportionately affected at 62% of total cancellations

**Revenue impact:**
Net room nights lost this week: **14 rooms**. At current ADR of £142.50, this represents approximately **£1,995** in unrealised revenue.

**Operational context:**
The elevated cancellation pattern correlates with OTA pricing softness observed across comparable properties in the region. Guests may be finding lower rates via OTA flash promotions as mid-week demand softens.

**Recommendation context:**
Review flexible-rate exposure on OTA channels for the next 14-day window. Restricting flexible cancellation policies on high-demand nights (Fri–Sat) would reduce cancellation risk on periods where demand is already confirmed.`;

const WEEKEND_RESPONSE = `**Weekend Demand Outlook — 28 Feb–2 Mar 2026**

Forward demand for the upcoming weekend is tracking **23% above the 4-week rolling average** for the same day-of-week.

**Pickup velocity:**
- Friday night: 68% occupancy (confirmed bookings, 4 days out)
- Saturday night: 94% occupancy — approaching capacity with days remaining
- Sunday night: 89% occupancy — strong residual leisure demand

**Average booked rate:**
- Friday BAR: £128.00
- Saturday BAR: £149.00
- Sunday BAR: £142.00

**Channel composition (Saturday):**
- Direct bookings: 42% — above average, indicating strong brand demand
- OTA (Booking.com): 38%
- Corporate / Group: 20%

**Yield consideration:**
At current pace, Saturday night is likely to close at 97%+ occupancy by Thursday. There may be headroom to apply a rate increase of £15–25 on remaining open rooms without materially impacting conversion. Monday–Tuesday remain soft at 61–58% and do not warrant rate adjustment at this stage.`;

const PRICING_RESPONSE = `**Rate Strategy Analysis — Saturday 1 March 2026**

Current Saturday BAR: **£149.00**
Estimated fair value based on demand signals: **£168–£175**

**Demand indicators suggesting underpricing:**
- Pickup velocity: 94% of Saturday rooms confirmed with 4 days remaining
- Historical benchmark: Property typically closes Saturday at £162.50 average ADR
- Comp set positioning: You are currently estimated £18–22 below market median for comparable dates

**Revenue opportunity:**
At 94% occupancy with 6 rooms remaining, revenue at current rate: **£894**. Moving to £168 would yield approximately **£1,008** — a £114 uplift with minimal conversion risk given demand strength.

**Channel risk assessment:**
- Booking.com (51% of Saturday bookings) — rate-sensitive channel, adjust carefully
- Direct (31%) — price-inelastic at this demand level
- Expedia (18%) — moderate sensitivity

**Recommendation context:**
A rate move of £10–15 on last-availability rooms on Booking.com and Expedia would test price elasticity with limited downside risk. Direct channel rooms can absorb a larger increase of £20+ given confirmed intent from direct bookers.`;

const PICKUP_RESPONSE = `**Pickup Pace Comparison — This Week vs Same Period Last Week**

**This week (week to date, Mon–Wed):**
- Total new bookings: 47 room nights
- Average booking value: £138.20
- Lead time of new bookings: 6.8 days average

**Same period last week (Mon–Wed):**
- Total new bookings: 39 room nights
- Average booking value: £131.80
- Lead time of new bookings: 8.1 days average

**Pace delta: +20.5% in volume, +4.9% in average rate**

**Day-by-day breakdown:**
- Monday this week: 8 new bookings (+3 vs last Monday)
- Tuesday this week: 12 new bookings (+3 vs last Tuesday)
- Wednesday (today, partial): 7 new bookings (+1 vs last Wednesday)

**Interpretation:**
The stronger pickup this week is concentrated in weekend bookings (Fri–Sat), suggesting demand response to a local event or competitor rate movement. The shorter lead time (6.8 vs 8.1 days) indicates more last-minute demand — consistent with the elevated cancellation pattern observed this week as guests re-book closer to arrival.`;

const FORECAST_RESPONSE = `**7-Day Revenue Forecast — 27 Feb–5 Mar 2026**

| Date | Projected Occ | Projected ADR | Projected RevPAR |
|------|--------------|--------------|-----------------|
| Fri 28 Feb | 68% | £128 | £87.04 |
| Sat 1 Mar | 94% | £158 | £148.52 |
| Sun 2 Mar | 89% | £142 | £126.38 |
| Mon 3 Mar | 61% | £112 | £68.32 |
| Tue 4 Mar | 58% | £108 | £62.64 |
| Wed 5 Mar | 64% | £118 | £75.52 |
| Thu 6 Mar | 71% | £131 | £93.01 |

**Weekly total projected revenue: £34,280** (based on 94-room inventory at 94 rooms × £158 peak)

**Key observations:**
- Weekend (Fri–Sun) contributes **63%** of projected weekly revenue
- Mid-week softness (Mon–Tue) is consistent with seasonal pattern for this property type
- Thursday shows positive early momentum with corporate pickup signals

**Confidence note:**
Weekend projections carry higher confidence (confirmed bookings at 89–94% occupancy). Mid-week projections are model-based and dependent on last-minute demand materialising at historical rates.`;

const CURRENT_RESPONSE = `**Live Snapshot — The Grand Meridian, 27 Feb 2026**

**Today's confirmed metrics (as of last sync):**
- Occupancy: **71.3%** — 67 of 94 rooms occupied (27 remaining)
- ADR: **£142.50** — £4.20 above yesterday
- RevPAR: **£101.60** — tracking slightly below last week's equivalent

**Active signals requiring attention:**
1. ⚠️ Cancellation rate elevated at 8.2% (baseline: 3.9%)
2. ℹ️ Weekend demand strong — Saturday at 94% confirmed occupancy
3. ⚠️ Check-in congestion risk between 14:00–16:00 today (23 arrivals)
4. 🔴 3 VIP arrivals without pre-authorisation processed

**Pickup momentum:**
New bookings this week are running **20.5% ahead** of last week's equivalent period, driven primarily by Fri–Sat demand. Mid-week (Mon–Wed) pace is flat.

**Data freshness:** Last sync completed at 09:14 today. All metrics reflect Guestline (Rezlynx) live data.`;

const DEFAULT_RESPONSE = `**Intelligence Summary — The Grand Meridian**

Based on current operational data, here is a snapshot of key performance signals as of today, 27 February 2026.

**Today's performance:**
- Occupancy: **71.3%** (27 rooms remaining of 94)
- ADR: **£142.50** (+£4.20 vs yesterday)
- RevPAR: **£101.60**
- Cancellation rate: **8.2%** (elevated — 2× baseline)

**Forward outlook:**
- This weekend is tracking strongly (Sat 94% occupancy) with rate likely suppressed
- Mid-week (Mon–Tue next week) forecast at 58–61% — seasonal softness expected
- Pickup pace is +20.5% vs equivalent last week

**Suggested areas to explore:**
- Ask about cancellations to understand the OTA pattern in detail
- Ask about weekend pricing to review the rate opportunity for Saturday
- Ask about pickup to compare this week's booking pace against last week
- Ask for a 7-day forecast to see the full revenue outlook

I can provide structured analysis on any metric, channel, date range, or operational area. What would you like to explore?`;

export function generateAIResponse(question: string): string {
  const q = question.toLowerCase();

  if (/cancell|cancel/.test(q)) return CANCELLATIONS_RESPONSE;
  if (/weekend|saturday|friday|sat |fri /.test(q)) return WEEKEND_RESPONSE;
  if (/pric|underpr|rate|bar |£/.test(q)) return PRICING_RESPONSE;
  if (/pickup|last week|this week|pace/.test(q)) return PICKUP_RESPONSE;
  if (/forecast|next|outlook|week ahead|coming/.test(q)) return FORECAST_RESPONSE;
  if (/today|now|current|live|snapshot|status/.test(q)) return CURRENT_RESPONSE;

  return DEFAULT_RESPONSE;
}
