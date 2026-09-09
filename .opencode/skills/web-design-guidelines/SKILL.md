---
name: web-design-guidelines
description: Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices".
version: 1.0.0
author: vercel
type: skill
category: design
tags:
  - ui
  - ux
  - accessibility
  - review
  - design
---

# Web Design Guidelines

**Purpose**: Review UI code for compliance with the Web Interface Guidelines.

## What I Do

- Fetch the latest Web Interface Guidelines from Vercel Labs
- Review specified files against all rules in the guidelines
- Output findings in a terse `file:line` format

## How to Use Me

### Step 1: Fetch the Guidelines

Fetch fresh guidelines before each review:

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

Use WebFetch to retrieve the latest rules. The fetched content contains all the rules and output format instructions.

### Step 2: Read the Files

Read the specified files, or prompt the user for files/pattern if none are provided.

### Step 3: Apply the Rules

Check the files against all rules in the fetched guidelines.

### Step 4: Output Findings

Output findings using the format specified in the guidelines (terse `file:line` format).

## Tips

- Always fetch fresh guidelines before each review — the rules change over time
- Use the terse `file:line` output format for findings
- Ask the user which files to review if none are specified