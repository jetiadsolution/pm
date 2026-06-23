# LLM Structured Outputs Proposal

Purpose
- Define a stable, machine-readable schema the backend and frontend use to accept LLM replies that may include user-facing text and optional Kanban updates.

Principles
- Human-readable `response` text for direct display.
- Optional, deterministic `actions` array describing concrete changes to the Kanban.
- Small, composable operations (add/update/move/delete) that the backend can validate and apply.
- A single canonical `board` replacement option when the model returns a full updated board.

Top-level schema (informal)

{
  "response": "<string>",              // text to show the user
  "actions": [                          // optional array of operations (apply in order)
    {
      "op": "add_card" | "update_card" | "move_card" | "delete_card",
      "card": { /* card object for add/update */ },
      "from_column_id": "<string>",  // for move_card
      "to_column_id": "<string>",    // for move_card
      "position": <integer>            // 0-based position in column
    }
  ],
  "board": { /* optional full board JSON to replace persisted board */ },
  "metadata": { /* optional: model_version, confidence, source */ }
}

Operation details
- add_card: requires `card` with `id` (client can accept model-provided id or backend will generate), `title`, `description?`, `column_id`, `position?`.
- update_card: requires `card.id` and any fields to change (title, description, metadata).
- move_card: requires `card.id`, `from_column_id`, `to_column_id`, and `position`.
- delete_card: requires `card.id`.

Validation & Safety
- Backend must validate operations: ids exist, column ids valid, positions in range.
- Reject malicious or malformed operations; return a structured error to the frontend.
- If both `actions` and `board` are present, treat `board` as authoritative and ignore `actions` (or use a configurable policy).

Example 1 — user-visible explanation without changes

{
  "response": "I think the next step is to review the requirements.",
  "actions": []
}

Example 2 — add a card and move another

{
  "response": "Added a new QA task and moved the design card.",
  "actions": [
    {"op":"add_card", "card":{"title":"Add QA tests","description":"Write unit tests for Kanban API","column_id":"todo","id":"tmp_1"}},
    {"op":"move_card","card":{"id":"card-123"}, "from_column_id":"inprogress","to_column_id":"done","position":0}
  ]
}

Notes for implementers
- Use `actions` when changes are small and auditable; use `board` when returning a canonical complete board state.
- Store `response` and `actions` in operation logs for audit and rollback.
- Provide a clear user confirmation UX when the AI proposes multiple disruptive changes.

Suggested next step
- Add a machine-readable JSON Schema (`.json` or validation code) and include example validation tests in the backend test suite.