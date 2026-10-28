---
trigger: always_on
description: Mandatory rule to record all changes in progress.md before committing or completing tasks.
---

# Progress Tracking & Changelog Enforcement

## Rule
Every modification, enhancement, bug fix, or refactoring in this codebase **must** be documented in `progress.md` located at the root of the project.

## Requirements
1. **Always Record**: Do not mark any task as finished without updating `progress.md`.
2. **Standard Format**: Use the format:
   - Date: `[YYYY-MM-DD]`
   - Module: e.g., `Backend / Auth`, `Frontend / Mock Interview`, etc.
   - Status: `Completed`, `In Progress`, or `Verified`
   - Detailed list of modifications and affected files.
3. **Rollback Alignment**: If the change introduces database schema changes, destructive operations, or major architecture refactoring, document corresponding recovery steps in `Rollback.md`.
