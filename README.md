### InsightLoop — Project Context

InsightLoop is a lightweight analytics + feedback platform.

Core goals:
- Track events (track)
- Identify users (identify)
- Capture feedback (feedback)
- Support anonymous users by default
- Gradually link anonymous → identified users
- Be usable in browsers, SPAs, and backend environments

Core components:
1. JavaScript SDK (browser-first)
2. Backend API (ingestion, auth, analytics)
3. Event + feedback pipelines
4. Privacy-first defaults (anonymous ID, minimal PII)

Non-goals (important):
- This is NOT a full Segment replacement
- This is NOT a data warehouse
- This is NOT a dashboard-heavy analytics product (yet)

Key SDK principles:
- SDK must never crash the host app
- Network failures must degrade gracefully
- SDK must batch + retry intelligently
- Anonymous ID must persist correctly
- Identify should link, not overwrite

Current SDK concepts:
- anonymousId (stored client-side)
- identify(userId, traits?)
- track(eventName, properties?)
- feedback({ score, message, metadata })
- flush()
- clearAnonymousId()

Design philosophy:
- Small surface area
- Explicit > magic
- Opinionated defaults
