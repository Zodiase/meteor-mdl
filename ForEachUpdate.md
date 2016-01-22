This is a note to myself about the tasks to perform for each update.

1. MDL sources are provided by a separate package `zodiase:mdl-assets`.
4. MDI fonts are provided by a separate package `zodiase:material-design-icons-fonts`.
5. Bump version in `package.js`.
6. Bump version in `package.json`. Only supports `0.0.0`.
7. Run unit tests with `meteor test-packages ./`.
8. Run integration tests:
    1. Navigate into each project.
    2. Update project with `meteor update`.
    3. Run project with `meteor`.
    4. Check test results in browser.
9. Fix bugs if needed.
10. Update `README.md`.
11. Update `ChangeLog.md`.
12. Push changes in `master`.
13. Clean up files for release with `scripts/releasecleanup.sh`.
14. Push changes in `release`.
15. Publish with `meteor publish`.
