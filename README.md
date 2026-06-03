# erhoert.github.io

Static viewer for review findings produced by the **Review Lead** workflow
in [agentic-education-team](https://github.com/erhoert/agentic-education-team).

Live: <https://erhoert.github.io/>

The viewer is a single `index.html` that loads a CT folder (containing
`review-findings.md` and any of `te.md` / `lesson.md` / `exercise-gebunden.md` /
`exercise-ungebunden.md`) via the browser's File-Picker API and renders the
findings with inline anchors to the target files. Edits stay local to the
browser; the updated `review-findings.md` can be copied to the clipboard
and pasted back into the Claude chat.
