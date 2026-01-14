# TodoMVC Implementation Plan

Build a complete TodoMVC application using React 19, Redux Toolkit, and TypeScript with Redux DevTools enabled in all builds (including production).

## Dependencies to Install

```bash
# Runtime dependencies
pnpm add @reduxjs/toolkit react-redux

# Development dependencies
pnpm add -D @types/react-redux todomvc-app-css @testing-library/react @testing-library/user-event
```

## Implementation Steps

### 1. Foundation - Type Definitions and Redux Setup

**Create `src/types/todo.ts`**

- Define `Todo` interface: `{ id: string, title: string, completed: boolean }`
- Define `FilterType`: `'all' | 'active' | 'completed'`
- Define `TodosState` interface: `{ todos: Todo[], filter: FilterType }`

**Create `src/store/todosSlice.ts`** (CRITICAL FILE)

- Use `createSlice` with typed `TodosState`
- Implement reducers:
  - `addTodo(title: string)` - Generate ID with `crypto.randomUUID()`
  - `toggleTodo(id: string)` - Toggle completion
  - `deleteTodo(id: string)` - Remove todo
  - `editTodo({ id, title })` - Update title
  - `toggleAll(completed: boolean)` - Toggle all todos
  - `clearCompleted()` - Remove completed todos
  - `setFilter(filter: FilterType)` - Update active filter
- Create selectors using `createSelector` for memoization:
  - `selectAllTodos`, `selectFilter`
  - `selectFilteredTodos` - Filter by active filter type
  - `selectActiveCount`, `selectCompletedCount`
  - `selectAllCompleted` - Check if all todos completed

**Create `src/utils/storage.ts`**

- `loadState()` - Load from localStorage with try-catch
- `saveState(state)` - Save to localStorage with try-catch
- Storage key: `'todos-redux-toolkit'`

**Create `src/store/store.ts`** (CRITICAL FILE)

- Use `configureStore` with `todos: todosReducer`
- Set `devTools: true` - ENABLED IN ALL BUILDS (key requirement)
- Load `preloadedState` from `loadState()`
- Subscribe to store changes to call `saveState()`
- Export typed `RootState` and `AppDispatch`

**Create `src/store/hooks.ts`**

- Export `useAppDispatch = useDispatch.withTypes<AppDispatch>()`
- Export `useAppSelector = useSelector.withTypes<RootState>()`

### 2. Component Implementation

**Update `src/index.css`**

- Add `@import 'todomvc-app-css/index.css';` at top
- Remove existing `body { text-align: center; }` styles

**Create `src/components/TodoHeader.tsx`**

- Input with `className="new-todo"`, `placeholder="What needs to be done?"`, `autoFocus`
- Handle Enter key: trim input, dispatch `addTodo` if non-empty, clear input
- Use `useAppDispatch` hook

**Create `src/components/TodoItem.tsx`** (CRITICAL - MOST COMPLEX)

- Props: `todo: Todo`
- Local state for edit mode and edit text
- Render with `className="todo"` + conditional `"completed"` and `"editing"` classes
- Checkbox dispatches `toggleTodo(todo.id)`
- Label with double-click handler to enter edit mode
- Delete button (`.destroy`) dispatches `deleteTodo(todo.id)`
- Edit mode input (`.edit`):
  - Escape key: cancel edit
  - Enter key: save edit (trim and validate non-empty, else delete)
  - Blur: save edit
- Use `useAppDispatch` for actions

**Create `src/components/TodoList.tsx`**

- Toggle-all checkbox:
  - `className="toggle-all"`, `id="toggle-all"`
  - Checked state from `selectAllCompleted` selector
  - Change handler dispatches `toggleAll(!allCompleted)`
- Map `selectFilteredTodos` to render `<TodoItem>` components
- Wrap items in `<ul className="todo-list">`

**Create `src/components/TodoFilters.tsx`**

- Three links with hash routing: All (#/), Active (#/active), Completed (#/completed)
- Apply `.selected` class to active filter
- `useEffect` with `hashchange` event listener:
  - Parse `window.location.hash` to determine filter
  - Dispatch `setFilter` action
  - Call on mount to sync initial state
- Cleanup listener on unmount

**Create `src/components/TodoFooter.tsx`**

- Show active count with pluralization: "X item" vs "X items"
- Render `<TodoFilters />`
- Clear completed button (hidden when `completedCount === 0`)
- Use `selectActiveCount` and `selectCompletedCount` selectors

**Create `src/components/TodoApp.tsx`**

- Main container with `className="todoapp"`
- Render `<TodoHeader />`
- Conditionally render `<section className="main">` with `<TodoList />` if todos exist
- Conditionally render `<TodoFooter />` if todos exist

**Update `src/index.tsx`** (CRITICAL FILE)

- Import `Provider` from 'react-redux' and `store` from './store/store.ts'
- Import `TodoApp` component
- Wrap app with `<Provider store={store}><TodoApp /></Provider>`

### 3. Testing Implementation

**Replace `test/index.test.ts` with comprehensive TodoMVC tests**

- Create `test/todosSlice.test.ts` - Test all reducers and selectors
- Create `test/TodoApp.test.tsx` - Integration tests:
  - Add todo flow
  - Toggle todo flow
  - Edit todo flow
  - Filter todos flow
  - Clear completed flow
  - Toggle all flow
- Use `@testing-library/react` with render helpers
- Create test store wrapper for component tests

## Critical Files to Modify/Create

1. **C:\code\github\andrewiggins\redux-devtools-experiment\src\store\todosSlice.ts** - Core Redux logic
2. **C:\code\github\andrewiggins\redux-devtools-experiment\src\store\store.ts** - Store with DevTools enabled
3. **C:\code\github\andrewiggins\redux-devtools-experiment\src\components\TodoItem.tsx** - Complex edit mode handling
4. **C:\code\github\andrewiggins\redux-devtools-experiment\src\components\TodoApp.tsx** - Main composition
5. **C:\code\github\andrewiggins\redux-devtools-experiment\src\index.tsx** - Redux Provider integration

## Redux DevTools Configuration

Key requirement: DevTools must be enabled in ALL builds (dev and production).

**Implementation in store.ts:**

```typescript
export const store = configureStore({
	reducer: { todos: todosReducer },
	devTools: true, // Always enabled - extension only activates if installed
});
```

Redux Toolkit's `configureStore` automatically integrates with Redux DevTools Extension. Setting `devTools: true` enables it in all builds with no performance penalty for users without the extension installed.

## TodoMVC Specification Compliance

Key requirements to ensure:

- ✅ Auto-focus input field on load
- ✅ Trim input and validate non-empty before adding
- ✅ Hide main/footer sections when no todos exist
- ✅ Toggle-all checkbox syncs with individual todo states
- ✅ Double-click label to edit with proper escape/enter/blur handling
- ✅ Empty title after trim should delete the todo
- ✅ Pluralized counter: "0 items", "1 item", "2 items"
- ✅ Clear completed button hidden when no completed todos
- ✅ Hash-based routing: #/, #/active, #/completed
- ✅ LocalStorage persistence including filter state
- ✅ Use official `todomvc-app-css` package for styling

## TypeScript Best Practices

- Use `PayloadAction<T>` for typed action payloads in reducers
- Extract `RootState` and `AppDispatch` types from store
- Use pre-typed hooks (`useAppDispatch`, `useAppSelector`) throughout
- Leverage Immer via Redux Toolkit - direct state mutation in reducers is safe
- Strict null checks enabled - handle all nullable cases

## Verification Steps

After implementation:

1. **Build verification:**

   ```bash
   pnpm build
   pnpm serve
   ```

   - Open browser to localhost
   - Open Redux DevTools extension (should be active in production build)
   - Verify all DevTools features work

2. **Feature verification:**
   - Add multiple todos
   - Mark some as completed
   - Edit a todo (double-click)
   - Filter by All/Active/Completed
   - Toggle all todos
   - Clear completed
   - Reload page - verify persistence
   - Check browser localStorage for saved state

3. **Test verification:**

   ```bash
   pnpm test
   ```

   - All tests should pass
   - Coverage should include reducers, selectors, and key user flows

4. **Type checking:**

   ```bash
   pnpm tsc
   ```

   - Should complete with no errors

5. **Code quality:**

   ```bash
   pnpm lint
   ```

   - TypeScript and Prettier checks should pass
