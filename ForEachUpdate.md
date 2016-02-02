This is a note to myself about the tasks to perform for each update.

1. MDL sources are provided by a separate package `zodiase:mdl-assets`.
4. MDI fonts are provided by a separate package `zodiase:material-design-icons-fonts`.
5. Bump version in `package.js`.
6. Run unit tests with `meteor test-packages ./`.
7. Run integration tests:
    1. Navigate into each project.
    2. Update project with `meteor update`.
    3. Run project with `meteor`.
    4. Check test results in browser.
8. Fix bugs if needed.
9. Update `README.md`.
10. Update `ChangeLog.md`.
11. Push changes in `master`.
12. Clean up files for release with `scripts/releasecleanup.sh`.
13. Push changes in `release`.
14. Publish with `meteor publish`.
