---
name: update-progress
description: Record completed work in this repo's root PROJECT_PROGRESS.md. Use at the END of any task that changed the codebase, the site content, the Figma-synced tokens, or project config — after the work is done and verified, before reporting back. Triggers on finishing a feature, section, component, design-to-code pass, bug fix, dependency bump, or content change. Also use when asked to "update the progress file", "log this", or "write this up for later reference".
---

# Update PROJECT_PROGRESS.md

[PROJECT_PROGRESS.md](../../../PROJECT_PROGRESS.md) at the repo root is the running log of
notable work. It exists so the next person — often a different agent, or the
same developer three months later — can see **why** things are the way they
are, not just what changed. Git already records what changed.

## When to write an entry

Write one when a task is finished and verified. Do not write one for:

- work that was abandoned or rolled back
- a pure refactor with no behavioural or structural consequence
- anything still in progress — wait until it is done

If the change is genuinely trivial (a typo, a version bump with no follow-on),
skip the entry rather than padding the log.

## How to write it

Add a new `##` section directly under the `---` that follows the intro line, so
**the newest entry is first**. Never edit or reword earlier entries — if an
earlier entry turned out to be wrong, say so in the new entry and link to it.

Date the heading with today's real date in `YYYY-MM-DD`, resolved from the
environment, never a guess or a relative phrase like "today".

### Entry template

Include only the sections that apply. Keep the tables; they are what makes the
log skimmable.

```markdown
## YYYY-MM-DD — <short title of the work>

### Source of truth

Where the requirements came from — a Figma node (file key + node id + link), a
ticket, or a conversation. Include anything about the source that is misleading
on its face, e.g. a variant carrying stale placeholder copy.

### What changed in code

| File | Change |
| --- | --- |
| [`Thing.tsx`](src/components/Thing.tsx) | What changed and, briefly, why |

### Why <the non-obvious decision>

One short section per decision a reader would otherwise question or undo.
This is the part git cannot tell them.

### Content

Which pages, sections or data files (`src/data/`) changed, and any coupling
that is easy to break — e.g. "the CTA renders as a button only because it is
last in the nav list".

### Verified

Evidence, not claims. Measured numbers against the design, the commands run and
their result, what was checked in a browser. If something was not verified, say
so plainly here.

| Metric | Expected | Actual |
| --- | --- | --- |

### Open items

Numbered. For each: what it is, whether it pre-dates this work, and what the
fix would touch. This is where the next person starts.
```

## Rules

- **Link every file** with a relative markdown path from the repo root —
  `[PreHeader.tsx](src/components/ui/StyledHeader/PreHeader.tsx)` — so the
  links work in the editor.
- **Separate pre-existing problems from regressions.** If you found a bug that
  was already there, label it as pre-existing and say why you left it. If you
  caused one, say that too.
- **Record what you deliberately did not do**, and why. A reader who cannot
  tell "not done" from "forgotten" will redo the analysis.
- **Absolute dates and versions.** No "recently", "the other day", "the latest".
- **Report failures honestly.** If tests failed, a step was skipped, or a check
  was impossible in this environment, the entry says so.
- Do not paste large diffs or full file contents. Describe and link.
- Keep the intro lines at the top of the file (`# Project Progress` and the
  "Newest entry first" note) intact.

## After writing

Mention the entry in your reply to the user in one line, with the link. Do not
restate the whole entry — they can open it.
