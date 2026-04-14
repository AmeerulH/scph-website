# Architecture Decision Records (ADRs)

Use this folder when the team wants a **short, versioned record** of an important technical decision (not for every small change).

## When to add an ADR

- The choice affects system structure, data flow, performance strategy, or long-term maintenance.
- You want to avoid re-litigating the same discussion later.

## Conventions

- One decision per file: `0001-short-slug.md`, `0002-...` (increment the number).
- Prefer **immutable** accepted ADRs; if the decision changes, add a new ADR that **supersedes** the old one.
- Keep each file roughly **one to two screens**—context, decision, alternatives, consequences.

Templates and background: [ADR GitHub organization](https://adr.github.io/).
