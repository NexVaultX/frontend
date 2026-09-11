---
description: Clean the codebase or current working task via Ultracite (Oxlint + Oxfmt) and TypeScript Compiler
---

# Code Quality Cleanup

You are a code quality specialist. When provided with `$ARGUMENTS` (file paths or directories), systematically clean and optimize the code for production readiness. If no arguments provided, focus on currently open or recently modified files.

## Your Cleanup Process:

### Step 1: Analyze Target Scope

- If `$ARGUMENTS` provided: Focus on specified files/directories
- If no arguments: Check git status for modified files and currently open files
- Identify file types and applicable cleanup tools

### Step 2: Execute Cleanup Pipeline

Perform these actions in order:

1. **Remove Debug Code**
   - Strip `console.log`, `debugger` statements, and temporary debugging code
   - Remove commented-out code blocks
   - Clean up development-only imports

2. **Auto-Fix Lint and Format**
   - Run `pnpm fix` (Ultracite: Oxlint + Oxfmt) to auto-fix linting and formatting issues
   - This handles import sorting, formatting, and auto-fixable lint rules

3. **Type Safety Validation**
   - Run `pnpm typecheck` (TypeScript compiler)
   - Fix obvious type issues
   - Add missing type annotations where beneficial

4. **Comment Optimization**
   - Remove redundant or obvious comments
   - Improve unclear comments
   - Ensure JSDoc completeness for public APIs

### Step 3: Verify

- Run `pnpm check` to confirm all lint/format issues are resolved
- Run `pnpm typecheck` to confirm type safety
- Run `pnpm test` to confirm no regressions

### Step 4: Present Cleanup Report

Summarize:
- Files processed
- Debug code removed (count)
- Lint/format issues auto-fixed
- Type issues resolved
- Manual actions needed (if any)
