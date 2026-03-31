# Contributing Guidelines

This document summarizes the most important points for people interested in contributing to **Gourmet2Go**, especially via 
bug reports or pull requests.

## Table of Contents

- [Quick Start](#quick-start)
- [Developing](#developing)
- [Testing](#testing)
- [Bug Report](#bug-report)
- [Proposing Features or Improvements](#proposing-features-or-improvements)
- [Contributing Code](#contributing-code)
- [Pull Requests](#pull-requests)

## Quick Start <a name="quick-start"></a>

1. Fork the repo
2. Clone locally
3. Follow SETUP.md
4. Run the app
5. Pick an issue 

## Developing <a name="developing"></a>

**Gourmet2Go** is mostly coded in TypeScript and React. You'll need to be at least somewhat comfortable in it to start 
contributing.

- Instructions for setting up locally for development can be found <a href="https://github.com/iraana/Capstone-Project/blob/main/docs/SETUP.md">here</a>
- Information regarding the architecture, coding standards, database schema, and more can be found in <a href="https://github.com/iraana/Capstone-Project/blob/main/docs">this</a> folder
- You will also need to read our <a href="https://github.com/iraana/Capstone-Project/blob/main/LICENSE">license</a> to understand what rights you have as a contributor

#### VSCode Plug-ins

If you are developing in `VSCode` here are some recommended plug-ins. For styling, you should have PostCSS and Tailwind 
CSS IntelliSense. If you are working with Python/Flask you should have Python, Python Debugger, and Pylance. If you will
be building for the `wasm-lib` then you will need rust, rust-analyzer, and Rust Syntax. For viewing and creating 
documentation you should have Mermaid, Mermaid Editor, Mermaid Markdown Syntax Highlighting, and Mermaid Preview.

## Testing <a name="testing"></a>

Testing for **Gourmet2Go** is done with **vitest** on the frontend and **pytest** for the API. To learn more about how to write
tests <a href="https://github.com/iraana/Capstone-Project/blob/main/docs/TESTING.md">click here</a>.

## Bug Report <a name="bug-report"></a>

#### Did you find a bug?

- Do not open a GitHub issue if the bug is a security vulnerability. Instead, refer to our <a href="https://github.com/iraana/Capstone-Project/blob/main/SECURITY.md">Security Policy</a>
- Ensure the bug hasn't already been reported under <a href="https://github.com/iraana/Capstone-Project/issues">issues</a>
- If you're unable to find an open issue addressing the problem, <a href="https://github.com/iraana/Capstone-Project/issues/new">open a new one</a> (be sure to include a title and clear description, as much relevant information as possible, and a code sample or an executable test case demonstrating the expected behavior that is not occurring)

#### Did you write a patch that fixes a bug?

- Open a new PR with the patch
- Ensure the PR description clearly describes the problem and solution 
- Include the relevant issue number if applicable

#### Versions

Please confirm in your issue or PR if the bug is in the latest version.

Additionally, tell us if the bug is in the latest version but not in previous versions (*regression*)

## Proposing Features or Improvements <a name="proposing-features-or-improvements"></a>

Create an issue with the **enhancement** label stating the new feature or improvement you'd like to see

## Contributing Code <a name="contributing-code"></a>

If you have improvements to **Gourmet2Go** please make a PR. GitHub has a <a href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests">how-to</a>.
If you want to contribute, look through the codebase and then look at the issues. Find one that looks interesting to you
and leave a comment stating that you are working on it. Then, once you are finished, make a PR and add the issue(s) in
development tab. Additionally, add the issue number to your PR comment.

## Pull Requests <a name="pull-requests"></a>

### PR Checklist

Before making a PR, do the following:

- Read and understand this document fully
- Read the <a href="https://github.com/iraana/Capstone-Project/blob/main/CODE_OF_CONDUCT.md">Code of Conduct</a>
- Your code follows the standards we've set, <a href="https://github.com/iraana/Capstone-Project/blob/main/docs/DEVELOPER_NOTES.md">read here</a>
- Run the unit tests

### Typical PR Workflow

1. New PR
2. Validated
3. Review
4. Approved
5. Merged

### Commits

Be mindful of your commits. Try to make your PRs handle one specific topic. It is better to open 3 different PRs than to 
open 1 PR that has 3 different topics. This makes reviews and merges easier. Additionally, format your commit messages
in a way that is easy to understand. A git commit message should be a short title and an extended description.

Here's an example of a well-formatted commit message (note how the extended description is also manually wrapped at 80 chars for readability):

```text
Prevent French fries carbonation by fixing heat regulation

When using the French fries frying module, Godot would not regulate the heat
and thus bring the oil bath to supercritical liquid conditions, thus causing
unwanted side effects in the physics engine.

By fixing the regulation system via an added binding to the internal feature,
this commit now ensures that Godot will not go past the ebullition temperature
of cooking oil under normal atmospheric conditions.
```

## Thanks!

Thank you for your interest in contributing to **Gourmet2Go**

—Snack Overflow