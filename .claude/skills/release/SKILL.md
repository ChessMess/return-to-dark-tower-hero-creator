---
name: release
description: Run the full semantic versioning release process for RTDT Hero Creator — bump version, update changelog, create release branch, open PR. Use when the user says "release" or "cut a release" or provides a version number to release.
disable-model-invocation: true
argument-hint: "vX.Y.Z"
allowed-tools: Read, Edit, Bash, Glob, Grep
---

Run the RTDT Hero Creator release process for version $ARGUMENTS.

## Pre-flight checks

1. Confirm `$ARGUMENTS` looks like a valid semver version (vX.Y.Z or X.Y.Z). If not, stop and tell the user.
2. Run `git status` — if the working tree is dirty, stop and tell the user to commit or stash first.
3. Run `git branch --show-current` — confirm we are on `main`. If not, warn the user and ask to confirm before continuing.
4. Run `git pull origin main` to make sure we are up to date.

## Step 1 — Generate changelog entry

Run `git log $(git describe --tags --abbrev=0 2>/dev/null || git rev-list --max-parents=0 HEAD)..HEAD --pretty=format:"%s"` to get commit subjects since the last tag (or since the beginning if no tags exist).

Categorize commits by type using conventional commit prefixes:
- `feat:` / `feat(...):` → **Added**
- `fix:` / `fix(...):` → **Fixed**
- `refactor:` / `refactor(...):` → **Changed**
- `chore:` / `docs:` / `style:` → **Changed** (only include if user-visible)

Format each bullet to match the exact style used in CHANGELOG.md:
```
- **Short Title** — Sentence describing the change.
```

Show the drafted changelog section to the user for review before writing anything. Ask: "Does this look right? Reply yes to continue or describe edits."

## Step 2 — Update CHANGELOG.md

Read CHANGELOG.md. Insert the new version section immediately after the `## [Unreleased]` line, following the format of existing entries:

```
## [X.Y.Z] - YYYY-MM-DD

### Added

- **Feature** — Description.

### Fixed

- **Fix** — Description.

### Changed

- **Change** — Description.
```

Only include sections (Added / Fixed / Changed) that have entries. Use today's date in YYYY-MM-DD format.

Also append a comparison link at the bottom of the file after the last existing `[X.Y.Z]:` line:
```
[X.Y.Z]: https://github.com/ChessMess/board-game-creator/compare/vPREV...vX.Y.Z
```

## Step 3 — Update package.json version

Read `package.json`. Update the `"version"` field to `$ARGUMENTS` without a leading `v`. Write it back.

## Step 4 — Create release branch and commit

Run these commands:
```
git checkout -b release/$ARGUMENTS
git add CHANGELOG.md package.json
git commit -m "chore: release $ARGUMENTS"
git push -u origin release/$ARGUMENTS
```

## Step 5 — Open PR

Run:
```
gh pr create --title "Release $ARGUMENTS" --body "Bumps version and updates changelog for the $ARGUMENTS release. After merging: pull main, tag vX.Y.Z, push the tag, create a GitHub Release, delete the release branch."
```

Show the user the PR URL and remind them of the post-merge steps from CONTRIBUTING.md:
1. `git checkout main && git pull`
2. `git tag $ARGUMENTS && git push origin $ARGUMENTS`
3. Create a GitHub Release from the tag with the changelog as release notes
4. `git push origin --delete release/$ARGUMENTS`
