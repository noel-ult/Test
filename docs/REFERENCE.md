# Test source reference

Source reviewed: [`0870d1f30aad`](https://github.com/noel-ult/Test/commit/0870d1f30aada9caa97b788dd878160ee151a49f).

This reference records the checked-in source, scripts, configuration names, and route declarations. It is a navigation aid; service availability and successful test execution require separate verification.

## Package commands

Run each command in the directory containing its package manifest. A declared script is not necessarily a passing check; guides call out placeholders and known mismatches.

### package.json

| Script | Shell command |
| --- | --- |
| `start` | `node server.js` |

Manifest: [package.json](../package.json).

## Configuration names

Names below are declared by source or example files. Example-only entries may be stale; consult the linked reader and project guide before relying on them. Secret values are intentionally omitted.

| Name | Declared/read in |
| --- | --- |
| `PORT` | [server.js](../server.js) |
| `VERCEL` | [server.js](../server.js) |

## HTTP route declarations

Paths are **as declared in each source file**. Router/blueprint mount prefixes from the entry point must be prepended; the project guide describes the active entry point and common prefixes. Alternate entry points (such as SQLite) are listed separately by file. Authentication, request bodies, and response schemas live in the linked handlers/models.

| Source | Method | Declared path | Handler |
| --- | --- | --- | --- |
| [server.js](../server.js) | GET | `/` | `` |
| [server.js](../server.js) | GET | `/price` | `` |

## Existing documentation

Historical plans/reports describe their own revision; use current source when they disagree.

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [README.md](../README.md)
- [docs/REFERENCE.md](../docs/REFERENCE.md)

## Source and configuration map

Generated lockfiles, binary assets, compiled output, vendored dependencies, and cached bytecode are omitted. Test files remain listed so coverage can be located.

- [package.json](../package.json)
- [public/index.html](../public/index.html)
- [server.js](../server.js)
- [vercel.json](../vercel.json)
