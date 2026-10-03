#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage:
  scripts/setup-worktrees.sh <branch> <path> [<branch> <path> ...]
  scripts/setup-worktrees.sh --help

Example:
  scripts/setup-worktrees.sh \
    feature/bouquet-domain ../tiemhoa-claude \
    test/bouquet-domain ../tiemhoa-codex \
    visual/bouquet-ui ../tiemhoa-antigravity

The command creates new worktrees from the current HEAD. It validates every
branch/path pair before changing Git state and refuses existing targets or
local branches. It never overwrites or deletes worktrees.
USAGE
}

fail() {
  printf 'error: %s\n' "$1" >&2
  exit 1
}

if [[ $# -eq 1 && "$1" == "--help" ]]; then
  usage
  exit 0
fi

if [[ $# -eq 0 ]]; then
  usage >&2
  exit 1
fi

if (( $# % 2 != 0 )); then
  fail 'arguments must be branch/path pairs'
fi

repo_root="$(git rev-parse --show-toplevel 2>/dev/null)" || fail 'run this command inside a Git repository'
cd "$repo_root"

branches=()
paths=()
while (( $# > 0 )); do
  branch="$1"
  path="$2"
  shift 2

  [[ -n "$branch" ]] || fail 'branch names cannot be empty'
  [[ -n "$path" ]] || fail 'worktree paths cannot be empty'
  git check-ref-format --branch "$branch" >/dev/null 2>&1 || fail "invalid branch name: $branch"
  git show-ref --verify --quiet "refs/heads/$branch" && fail "local branch already exists: $branch"
  [[ -e "$path" || -L "$path" ]] && fail "worktree target already exists: $path"

  for existing_branch in "${branches[@]}"; do
    [[ "$existing_branch" != "$branch" ]] || fail "branch repeated in arguments: $branch"
  done
  for existing_path in "${paths[@]}"; do
    [[ "$existing_path" != "$path" ]] || fail "path repeated in arguments: $path"
  done

  branches+=("$branch")
  paths+=("$path")
done

for index in "${!branches[@]}"; do
  branch="${branches[$index]}"
  path="${paths[$index]}"
  mkdir -p "$(dirname "$path")"
  git worktree add -b "$branch" "$path" HEAD
  printf 'created worktree: %s (%s)\n' "$path" "$branch"
done
