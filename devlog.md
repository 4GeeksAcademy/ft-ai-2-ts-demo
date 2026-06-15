# Dev Log

## 2026-06-15

### Learning objective
Build an interactive page that helps students see how common data relationships work in TypeScript, not just in theory, but in live UI state.

### Why this approach
- Students often understand interfaces on paper but struggle to connect them to real application behavior.
- A visual editor plus console output makes the model easier to reason about.
- Showing both relationship editing and method execution helps connect data modeling and object behavior.

### Data model used
The app is based on [src/types.d.ts](src/types.d.ts), including:
- 1-to-1: `IPet.favoritePerson`
- 1-to-many: `IPerson.pets`
- many-to-many: `TypeBookToGenre` (join table between books and genres)

### Key behavior implemented
- `IPet.makeNoise` returns exactly: `${pet.name}: ${pet.noise}`
- `IPerson.makeCacophany` loops through the person's pets and calls `makeNoise` on each one.

### How it was implemented
Code lives mainly in [src/main.ts](src/main.ts), with styles in [src/style.css](src/style.css).

1. Created in-memory collections for people, pets, books, genres, and book-genre relations.
2. Added factory functions (`createPerson`, `createPet`, `createBook`, `createGenre`) so each object includes its interface methods.
3. Added mutation helpers for each relationship type.
4. Rendered editable UI sections for each relationship.
5. Re-rendered after each mutation so the UI always reflects current state.

### Teaching-focused UI features
- Relationship editors:
  - Favorite person per pet (1-to-1)
  - Pets owned by person (1-to-many)
  - Book to genre links (many-to-many)
- Console Runner section:
  - Run `makeNoise` for one or all pets
  - Run `makeCacophany` for one or all people
- Live Output section directly below Console Runner so students can compare on-screen values with console output.

### Debugging and observability
- Added `console.table` output whenever a relationship changes.
- The relationship table includes rows for all three relationship types so students can inspect state transitions quickly.

### UX refinements for readability
- Made Console Runner full width to avoid cramped controls.
- Moved Live Output directly below Console Runner for better learning flow.
- Vertically aligned checkboxes in both 1-to-many and many-to-many sections so matrix-like relationships are easier to scan.

### Validation and quality checks
- Ran `npm run typecheck` repeatedly during changes.
- Ran `npm run build` during implementation to confirm production build integrity.

### Student takeaway
Interfaces define shape, but the app behavior comes from method implementations plus state updates. This project demonstrates that relationship modeling, method design, and UI rendering should all stay consistent with one another.
