# Contributing

1. Create a focused branch from the default branch.
2. Install dependencies with the package manager pinned in `package.json`.
3. Keep generated files listed in `.ui8kit-manifest.json` unchanged.
4. Run `check:ui8kit`, `lint`, `test`, and `build`.
5. Open a pull request that explains the behavior change and verification.

Application code belongs outside `src/ui/` and `src/utils/`. Do not add
secrets, external-service requirements for the default route, generated build
output, or a second package-manager lockfile.
