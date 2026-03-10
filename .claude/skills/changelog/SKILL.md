---
name: changelog
description: Generate a formatted CHANGELOG.md entry from git commits since the last tag. Use when preparing a changelog for a new release.
disable-model-invocation: true
argument-hint: "vX.Y.Z"
allowed-tools: Bash, Read, Edit
---

Generate and insert a CHANGELOG.md entry for version $ARGUMENTS.

## Step 1 — Collect commits

Run: `git log $(git describe --tags --abbrev=0 2>/dev/null || git rev-list --max-parents=0 HEAD)..HEAD --pretty=format:"%s"`

This gets all commit subjects since the last tag (or all commits if no tags exist yet).

## Step 2 — Categorize commits

Group by conventional commit type:
- `feat:` / `feat(...):` → **Added**
- `fix:` / `fix(...):` → **Fixed**
- `refactor:` / `refactor(...):` / `chore:` / `docs:` → **Changed** (user-visible changes only; skip pure internal chores)

## Step 3 — Draft the entry

Format each bullet to match the exact style already used in CHANGELOG.md:
```
- **Short Title** — Sentence describing the change for a user.
```

Structure the section as:
```
## [X.Y.Z] - YYYY-MM-DD

### Added

- **Feature** — Description.

### Fixed

- **Fix** — Description.

### Changed

- **Change** — Description.
```

Only include sections that have entries. Use today's date in YYYY-MM-DD format.

Show the drafted entry to the user and ask: "Does this look right? Reply yes to write it, or describe any edits."

## Step 4 — Write to CHANGELOG.md

After user approval, read CHANGELOG.md and insert the new section immediately after the `## [Unreleased]` line.

Also append a comparison link at the bottom of the file after the last existing `[X.Y.Z]:` line:
```
[X.Y.Z]: https://github.com/ChessMess/return-to-dark-tower-hero-creator/compare/vPREV...vX.Y.Z
```

Where `vPREV` is the previous version tag (from `git describe --tags --abbrev=0`).
