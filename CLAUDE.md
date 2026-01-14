# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an experimental project for testing Redux DevTools integration with React applications. It uses Vite for development and build tooling, React 19 for the UI, and Vitest for testing.

## Common Commands

### Development

- `pnpm start` - Start Vite development server
- `pnpm build` - Build for production
- `pnpm serve` - Preview production build locally

### Testing

- `pnpm test` - Run tests in watch mode
- `pnpm test run` - Run tests once
- Tests use Vitest with happy-dom environment

### Code Quality

- `pnpm lint` - Run TypeScript compiler and format check
- `pnpm tsc` - Run TypeScript compiler only
- `pnpm format` - Format code with Prettier
- `pnpm check-format` - Check formatting without modifying files

## Application Structure

This is a TodoMVC application built with React 19 and Redux Toolkit.

### HTML Structure (TodoMVC Spec)

The app follows the TodoMVC HTML specification. The root element in `index.html` is:

```html
<section class="todoapp" id="root"></section>
```

Components render directly into this section without adding another wrapper. The structure is:

- `section.todoapp` (in index.html)
  - `header.header` (TodoHeader)
  - `main.main` (wraps list and footer, rendered by TodoApp)
    - `div.toggle-all-container` (TodoList)
    - `ul.todo-list` (TodoList)
    - `footer.footer` (TodoFooter)

### Redux Store

- **Store**: `src/store/store.ts` - configureStore with `devTools: true` for ALL builds (production included)
- **Slice**: `src/store/todosSlice.ts` - all actions, reducers, and selectors
- **Hooks**: `src/store/hooks.ts` - typed `useAppDispatch` and `useAppSelector`

Redux DevTools only activates when the browser extension is installed, so there's no performance penalty in production for users without it.

### TypeScript with isolatedDeclarations

Due to `isolatedDeclarations: true`, Redux slices require explicit type annotations. The slice uses a factory function pattern:

```typescript
interface TodoCaseReducers extends StaticCaseReducers<TodosState> { ... }
interface TodoSelectors extends SliceSelectors<TodosState> { ... }
type TodoSlice = Slice<TodosState, TodoCaseReducers, "todos", "todos", TodoSelectors>;

function createTodoSlice(): TodoSlice {
  return createSlice({ ... });
}
```

Reducers use inline object function syntax (not arrow functions) to simplify return type inference:

```typescript
reducers: {
  addTodo(state, action): void { ... },  // NOT: addTodo: (state, action) => { ... }
}
```

### localStorage Persistence

State is automatically persisted to localStorage via store subscription in `src/store/store.ts`. The `src/utils/storage.ts` module handles serialization with error handling.

## Architecture

### TypeScript Project References

This project uses TypeScript project references with composite builds for better modularity:

- **Root tsconfig.json**: Main configuration that references three sub-projects
- **src/**: Application source code (types: vite/client)
- **test/**: Test files (types: node, references src/)
- **scripts/**: Build and git hook scripts (types: node)

Each sub-project has its own `tsconfig.json` that extends the root config and outputs to `build/<directory>`.

Key compiler options:

- `isolatedDeclarations: true` - Required for type-safe declaration generation
- `emitDeclarationOnly: true` - Only emit type declarations (Vite handles transpilation)
- `verbatimModuleSyntax: true` - Stricter module syntax
- `allowImportingTsExtensions: true` - Import .ts/.tsx files directly

### Build System

- **Vite** handles development server and production builds
- Vite config sets `base: "/redux-devtools-experiment/"` for GitHub Pages deployment
- Uses `@vitejs/plugin-react` for JSX transformation
- TypeScript is used for type checking only; Vite performs the actual transpilation

### Testing Setup

- Test configuration is embedded in `vite.config.ts` using Vitest projects
- Tests run in the `happy-dom` environment for DOM simulation
- Test files are located in `test/` directory and import from `src/`
- Tests reference TypeScript project structure via `tsconfig.json` references

### Git Hooks & Automation

The project uses custom Node.js-based git hooks for cross-platform compatibility:

- `scripts/prepare.ts` - Runs on `pnpm install` to set up git hooks
- `scripts/pre-commit.ts` - Formats staged files with Prettier before commit
- Hooks use `--experimental-strip-types` to run TypeScript directly without transpilation

### Package Management

Uses pnpm with security-focused workspace configuration (`pnpm-workspace.yaml`):

- `minimumReleaseAge: 7200` - Only use packages released at least 5 days ago
- `trustPolicy: no-downgrade` - Prevent trust level downgrades
- `onlyBuiltDependencies: []` - Disable package install scripts for security

Node.js version is managed via Volta (specified in package.json).
