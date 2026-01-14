import {
	createSlice,
	createSelector,
	type PayloadAction,
	type Slice,
	type CaseReducer,
	type SliceSelectors,
} from "@reduxjs/toolkit";
import type { Todo, FilterType, TodosState } from "../types/todo.ts";

type StaticCaseReducers<State> = Record<
	string,
	CaseReducer<State, PayloadAction<any>>
>;

interface TodoCaseReducers extends StaticCaseReducers<TodosState> {
	addTodo: CaseReducer<TodosState, PayloadAction<string>>;
	toggleTodo: CaseReducer<TodosState, PayloadAction<string>>;
	deleteTodo: CaseReducer<TodosState, PayloadAction<string>>;
	editTodo: CaseReducer<
		TodosState,
		PayloadAction<{ id: string; title: string }>
	>;
	toggleAll: CaseReducer<TodosState, PayloadAction<boolean>>;
	clearCompleted: CaseReducer<TodosState>;
	setFilter: CaseReducer<TodosState, PayloadAction<FilterType>>;
}

interface TodoSelectors extends SliceSelectors<TodosState> {
	selectAllTodos(state: TodosState): Todo[];
	selectFilter(state: TodosState): FilterType;
	selectFilteredTodos(state: TodosState): Todo[];
	selectActiveCount(state: TodosState): number;
	selectCompletedCount(state: TodosState): number;
	selectAllCompleted(state: TodosState): boolean;
}

type TodoSlice = Slice<
	TodosState,
	TodoCaseReducers,
	"todos",
	"todos",
	TodoSelectors
>;

function createTodoSlice(): TodoSlice {
	// Initial state
	const initialState: TodosState = {
		todos: [],
		filter: "all",
	};

	// Base selectors
	function selectAllTodos(state: TodosState): Todo[] {
		return state.todos;
	}
	function selectFilter(state: TodosState): FilterType {
		return state.filter;
	}

	// State slice
	return createSlice({
		name: "todos",
		initialState,
		reducers: {
			addTodo(state, action): void {
				const newTodo: Todo = {
					id: crypto.randomUUID(),
					title: action.payload,
					completed: false,
				};
				state.todos.push(newTodo);
			},
			toggleTodo(state, action): void {
				const todo = state.todos.find((t) => t.id === action.payload);
				if (todo) {
					todo.completed = !todo.completed;
				}
			},
			deleteTodo(state, action): void {
				state.todos = state.todos.filter((t) => t.id !== action.payload);
			},
			editTodo(state, action): void {
				const todo = state.todos.find((t) => t.id === action.payload.id);
				if (todo) {
					todo.title = action.payload.title;
				}
			},
			toggleAll(state, action): void {
				state.todos.forEach((todo) => {
					todo.completed = action.payload;
				});
			},
			clearCompleted(state): void {
				state.todos = state.todos.filter((t) => !t.completed);
			},
			setFilter(state, action): void {
				state.filter = action.payload;
			},
		},
		selectors: {
			selectAllTodos,
			selectFilter,
			selectFilteredTodos: createSelector(
				[selectAllTodos, selectFilter],
				(todos, filter): Todo[] => {
					switch (filter) {
						case "active":
							return todos.filter((t) => !t.completed);
						case "completed":
							return todos.filter((t) => t.completed);
						default:
							return todos;
					}
				},
			),
			selectActiveCount: createSelector(
				[selectAllTodos],
				(todos): number => todos.filter((t) => !t.completed).length,
			),
			selectCompletedCount: createSelector(
				[selectAllTodos],
				(todos): number => todos.filter((t) => t.completed).length,
			),
			selectAllCompleted: createSelector(
				[selectAllTodos],
				(todos): boolean => todos.length > 0 && todos.every((t) => t.completed),
			),
		},
	});
}

const todosSlice = createTodoSlice();

// Export actions - must use individual exports for isolatedDeclarations
type Actions = TodoSlice["actions"];
const actions: Actions = todosSlice.actions;
export const addTodo: Actions["addTodo"] = actions.addTodo;
export const toggleTodo: Actions["toggleTodo"] = actions.toggleTodo;
export const deleteTodo: Actions["deleteTodo"] = actions.deleteTodo;
export const editTodo: Actions["editTodo"] = actions.editTodo;
export const toggleAll: Actions["toggleAll"] = actions.toggleAll;
export const clearCompleted: Actions["clearCompleted"] = actions.clearCompleted;
export const setFilter: Actions["setFilter"] = actions.setFilter;

type Selectors = TodoSlice["selectors"];
const selectors: Selectors = todosSlice.selectors;
export const selectAllTodos: Selectors["selectAllTodos"] =
	selectors.selectAllTodos;
export const selectFilter: Selectors["selectFilter"] = selectors.selectFilter;
export const selectFilteredTodos: Selectors["selectFilteredTodos"] =
	selectors.selectFilteredTodos;
export const selectActiveCount: Selectors["selectActiveCount"] =
	selectors.selectActiveCount;
export const selectCompletedCount: Selectors["selectCompletedCount"] =
	selectors.selectCompletedCount;
export const selectAllCompleted: Selectors["selectAllCompleted"] =
	selectors.selectAllCompleted;

const reducer: TodoSlice["reducer"] = todosSlice.reducer;
export default reducer;
