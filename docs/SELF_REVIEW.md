[Tiếng Việt](SELF_REVIEW.vi.md)

# Self-review — 2026-11-11

## Fixed after review

- Expired sessions left the account UI signed in. A 401 now clears account UI state without deleting the local garden.
- Pointer capture produced a click after dragging cloud/sun, unintentionally treating all beds. Movement beyond 8px suppresses that click.
- A late profile request could overwrite a newer selection. Requests are numbered, obsolete results ignored, current state read at merge time, and closing the modal invalidates pending selection.
- Unfinished lunch was ephemeral. Meal kind/count/attempts now persist and sync.
- Wrong-food feedback was mostly outside the dialog. Picture requests, in-dialog feedback, a desired-food bubble, gentle tilt and positive hop/star now provide visible guidance. Four meal variations replace two.
- House decorations now also appear in the main garden.
- New edits no longer read wall time. Each app mount has a unique writer ID; same-profile storage events merge tabs. Legacy clocks stay compatible.

## Remaining limits

This is a playable MVP, not a release-readiness certification. Real Google OAuth, Neon networking, Vercel routing and physical iPad Safari remain unverified. Three plants, three decorations and fixed hiding positions still limit breadth. Enjoyment must be evaluated with children.

Concurrent edits to the same field select one whole field; individual decorations are not collaboratively merged. Logical clocks do not determine real-time order between offline devices. The arithmetic gate is a UX barrier, not proof of adulthood. The callback query can open account UI, but protected APIs still require a valid session. No production artwork has been generated. No repository push has been performed.
