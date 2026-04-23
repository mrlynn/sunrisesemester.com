## Active context

### Current focus
- Implement weekly crossword puzzle feature with persisted progress and a leaderboard.

### Key decisions
- Use a privacy-first identity: anonymous `userId` cookie + optional display name.
- Persist puzzles and runs in MongoDB Atlas via Mongoose.
- Use existing admin auth patterns for puzzle publishing.

### Next steps
- Add `Puzzle` / `PuzzleRun` / `PuzzleUser` models.
- Add `/api/puzzles/*` endpoints.
- Build `/puzzles` pages and a minimal `/admin/puzzles` publishing UI.

