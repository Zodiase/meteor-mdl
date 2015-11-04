This is a note to myself about the tasks to perform for each update.

1. Copy new files from `google/material-design-lite`.
2. Update material icons css file with `scripts/update-icons.js`.
3. Bump version in `package.js`.
4. Bump version in `package.json`.
5. Run unit tests with `meteor test-packages ./`.
6. Run integration tests:
    1. Navigate into each project.
    2. Update project with `meteor update`.
    3. Run project with `meteor`.
    4. Check test results in browser.
7. Fix bugs if needed.
8. Update `README.md`.
9. Update `ChangeLog.md`.
10. Push changes in `master`.
11. Push changes in `release`.
12. Publish with `meteor publish`.
