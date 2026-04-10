# UI Prototyping Rules (Non-Generic Design)

## Objective
All UI implementations must avoid generic template-like layouts and instead reflect intentional product thinking.

## Core Principles

- Do not generate "dashboard-style" layouts by default.
- Every screen must have a clear purpose and primary action.
- Layout decisions must reflect user workflow, not visual symmetry.
- Avoid overuse of cards, shadows, and centered containers unless justified.

## Layout Rules

- Prefer task-oriented layouts over decorative layouts.
- Use whitespace intentionally, not as padding filler.
- Group elements by interaction, not by visual similarity.
- Avoid:
  - generic card grids
  - unnecessary borders
  - repetitive UI patterns without meaning

## Components

- Only create components when they represent a real domain concept.
- Avoid generic components like:
  - InfoCard
  - DataCard
  - GenericPanel

Instead prefer:
  - ReservationSummary
  - TravelerAssignmentPanel
  - OperationTimeline

## Interaction Design

- Every screen must define:
  - primary action
  - secondary actions
  - navigation intent

- Avoid dead UI (buttons without clear purpose).

## State Handling (Prototype Mode)

- It's allowed to use localStorage or mock state.
- State should simulate real flows, not static placeholders.

## Visual Consistency

- Use a limited set of spacing and typography rules.
- Avoid random Tailwind usage per component.
- Reuse layout patterns intentionally.

## Anti-Patterns (Strict)

Do NOT generate:
- centered landing page layouts for internal tools
- empty dashboards with fake stats
- lorem ipsum or placeholder data
- repetitive card grids without meaning

## Expected Behavior

Before generating UI, you must:
1. Infer the user goal
2. Define the main action
3. Structure the layout accordingly

If unclear, make a reasonable assumption and proceed.