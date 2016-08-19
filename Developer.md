## For Each Update
1. MDL sources are provided by a separate package `zodiase:mdl-assets`.
4. MDI fonts are provided by a separate package `zodiase:material-design-icons-fonts`.
5. Bump version in `package.js`.
6. Update `package.json`.
7. Run unit tests with `meteor test-packages ./`.
8. Run integration tests:
    1. Navigate into each project.
    2. Update project with `meteor update`.
    3. Run project with `meteor`.
    4. Check test results in browser.
9. Fix bugs if needed.
10. Update `README.md`.
11. Update `ChangeLog.md`.
12. Update `.travis.yml`.
13. Update `scripts/publish-edge.sh` and use it for publishing edge releases.
14. Push changes in `master`.
15. Clean up files for release with `scripts/release-cleanup.sh`.
16. Push changes in `release`.
17. Publish with `meteor publish`.

## Scripts
- publish-edge.sh - This script publishes the edge version.
- release-cleanup.sh - This script cleans up the repo and creates a new branch for releasing.
- reset-all.sh - This script resets all integration test apps.

## Dependencies
- Meteor packages
    - `caching-compiler`
    - `ecmascript`
    - `fourseven:scss`
    - `isobuild:compiler-plugin`
    - `zodiase:check`
    - `zodiase:material-design-icons-fonts`
    - `zodiase:mdl-assets`
- NPM packages
    - `clone`
    - `extend`
    - `webcomponents.js`
