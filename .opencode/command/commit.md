---
description: Create well-formatted commits with Conventional Commit messages.
---

# Commit Command

You are an AI agent that helps create well-formatted Git commits following the **Conventional Commits** specification. Follow these instructions exactly.

Always create the commit and push it. Do not ask for confirmation unless there is a significant issue, validation failure, merge conflict, or another unexpected Git error.

## Instructions for Agent

When the user runs this command, execute the following workflow:

1. **Check command mode**
   - If the user provides `$ARGUMENTS` (a custom commit message or description), skip to step 3.

2. **Run pre-commit validation**
   - Execute `pnpm lint` and report any issues.
   - Execute `pnpm build` and ensure it succeeds.
   - If either command fails, ask the user whether to proceed anyway or fix the issues first.

3. **Analyze Git status**
   - Run `git status --porcelain` to inspect the working tree.
   - If no files are staged, run `git add .` to stage all modified files.
   - If files are already staged, only commit the staged files.

4. **Analyze the changes**
   - Run `git diff --cached` to inspect the staged changes.
   - Determine the primary Conventional Commit type (`feat`, `fix`, `docs`, etc.).
   - Identify an appropriate scope when it improves clarity.
   - Summarize the main purpose of the changes.

5. **Generate the commit message**
   - Create a Conventional Commit message using the format:
     - `<type>(<scope>): <description>`
     - or `<type>: <description>` if no meaningful scope exists.
   - Keep the description concise, clear, and in imperative mood.
   - Keep the first line under 72 characters.
   - If the user supplied `$ARGUMENTS`, use them as the commit description when appropriate while still formatting the message as a Conventional Commit.

6. **Execute the commit**
   - Run `git commit -m "<generated message>"`.
   - Display the commit hash.
   - Confirm the commit succeeded.
   - Provide a brief summary of what was committed.

7. **Push the commit**
   - Run `git push`.
   - Confirm the push succeeded or report any errors.

## Commit Message Guidelines

When generating commit messages, follow these rules:

- **Atomic commits**: Each commit should contain one logical change.
- **Imperative mood**: Write messages as commands (for example, `add authentication` instead of `added authentication`).
- **Present tense**: Use present tense throughout.
- **Concise subject**: Keep the first line under 72 characters.
- **Specific descriptions**: Clearly describe the primary change.

### Conventional Commit Types

- `feat`: A new feature.
- `fix`: A bug fix.
- `docs`: Documentation changes.
- `style`: Formatting or stylistic changes only.
- `refactor`: Code changes that neither fix bugs nor add features.
- `perf`: Performance improvements.
- `test`: Adding or updating tests.
- `build`: Build system or dependency changes.
- `ci`: CI/CD configuration changes.
- `chore`: Tooling, maintenance, or miscellaneous repository changes.
- `revert`: Reverting a previous commit.

Use a scope when it improves clarity, for example:

- `feat(auth): add password reset flow`
- `fix(ui): resolve navbar layout shift`
- `docs(readme): update development workflow`
- `ci(github): split GitHub Actions workflows`

## Reference: Good Commit Examples

Use these as examples when generating commit messages:

- `feat(auth): add user authentication system`
- `fix(renderer): resolve memory leak in rendering process`
- `docs(api): update API documentation with new endpoints`
- `refactor(parser): simplify error handling logic`
- `perf(images): optimize image loading pipeline`
- `test(auth): add unit tests for authentication flow`
- `chore(dev): improve local development tooling`
- `build(docker): optimize production Docker image`
- `ci(github): add pull request validation workflow`

Example commit sequence:

- `feat(auth): add user authentication system`
- `fix(renderer): resolve memory leak in rendering process`
- `docs(api): update API documentation with new endpoints`
- `refactor(parser): simplify error handling logic`
- `test(auth): add unit tests for authentication flow`

## Agent Behavior Notes

- **Error handling**: If validation fails, give the user the option to proceed anyway or fix the issues first.
- **Auto-staging**: If no files are staged, automatically stage all changes with `git add .`.
- **File priority**: If files are already staged, only commit those staged files.
- **Always commit and push**: Run `git push` after a successful commit unless a significant error prevents it.
- **Message quality**: Ensure every commit message follows the Conventional Commits specification and accurately reflects the staged changes.
- **Success feedback**: After a successful commit and push, show the commit hash and a brief summary of what was committed.
