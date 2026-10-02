## Active context

### Current focus
- Monthly AA business meeting minutes — secretary editor and public archive.

### Key decisions
- Flexible schema: reorderable agenda sections, optional motions, attached reports, commitment schedules with dynamic columns.
- Secretary uses existing `/admin` auth (toolbar link: Minutes).
- Public list at `/business-meetings`, detail at `/business-meetings/[slug]` (default slug `YYYY-MM`).

### Next steps
- Review/publish July 2026 minutes draft (`/admin/business-meetings`, slug `2026-07`).
- Consider member-only visibility if the group wants minutes off the public nav.

### Minutes paste-import
- Form: “Paste notes to import” → Parse into form (`parseBusinessMeetingNotes`).
- Understands headings, Motion/Second/Result, and Day/Chair/Sherpa tables.

