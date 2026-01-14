import { describe, it, expect } from "vitest";
import todosReducer, {
	addTodo,
	toggleTodo,
	deleteTodo,
	editTodo,
	toggleAll,
	clearCompleted,
	setFilter,
	selectAllTodos,
	selectFilter,
	selectFilteredTodos,
	selectActiveCount,
	selectCompletedCount,
	selectAllCompleted,
} from "../src/store/todosSlice.ts";
import type { TodosState } from "../src/types/todo.ts";
import type { RootState } from "../src/store/store.ts";

describe("todosSlice", () => {
	const initialState: TodosState = {
		todos: [],
		filter: "all",
	};

	describe("reducers", () => {
		it("should handle addTodo", () => {
			const state = todosReducer(initialState, addTodo("Test todo"));
			expect(state.todos).toHaveLength(1);
			expect(state.todos[0].title).toBe("Test todo");
			expect(state.todos[0].completed).toBe(false);
			expect(state.todos[0].id).toBeDefined();
		});

		it("should handle toggleTodo", () => {
			const stateWithTodo = todosReducer(initialState, addTodo("Test todo"));
			const todoId = stateWithTodo.todos[0].id;
			const toggledState = todosReducer(stateWithTodo, toggleTodo(todoId));
			expect(toggledState.todos[0].completed).toBe(true);

			const toggledBackState = todosReducer(toggledState, toggleTodo(todoId));
			expect(toggledBackState.todos[0].completed).toBe(false);
		});

		it("should handle deleteTodo", () => {
			const stateWithTodo = todosReducer(initialState, addTodo("Test todo"));
			const todoId = stateWithTodo.todos[0].id;
			const deletedState = todosReducer(stateWithTodo, deleteTodo(todoId));
			expect(deletedState.todos).toHaveLength(0);
		});

		it("should handle editTodo", () => {
			const stateWithTodo = todosReducer(initialState, addTodo("Test todo"));
			const todoId = stateWithTodo.todos[0].id;
			const editedState = todosReducer(
				stateWithTodo,
				editTodo({ id: todoId, title: "Updated todo" }),
			);
			expect(editedState.todos[0].title).toBe("Updated todo");
		});

		it("should handle toggleAll", () => {
			let state = todosReducer(initialState, addTodo("Todo 1"));
			state = todosReducer(state, addTodo("Todo 2"));
			state = todosReducer(state, addTodo("Todo 3"));

			const allCompletedState = todosReducer(state, toggleAll(true));
			expect(allCompletedState.todos.every((t) => t.completed)).toBe(true);

			const allActiveState = todosReducer(allCompletedState, toggleAll(false));
			expect(allActiveState.todos.every((t) => !t.completed)).toBe(true);
		});

		it("should handle clearCompleted", () => {
			let state = todosReducer(initialState, addTodo("Todo 1"));
			state = todosReducer(state, addTodo("Todo 2"));
			state = todosReducer(state, addTodo("Todo 3"));
			state = todosReducer(state, toggleTodo(state.todos[0].id));
			state = todosReducer(state, toggleTodo(state.todos[2].id));

			const clearedState = todosReducer(state, clearCompleted());
			expect(clearedState.todos).toHaveLength(1);
			expect(clearedState.todos[0].title).toBe("Todo 2");
		});

		it("should handle setFilter", () => {
			const state = todosReducer(initialState, setFilter("active"));
			expect(state.filter).toBe("active");

			const completedState = todosReducer(state, setFilter("completed"));
			expect(completedState.filter).toBe("completed");

			const allState = todosReducer(completedState, setFilter("all"));
			expect(allState.filter).toBe("all");
		});
	});

	describe("selectors", () => {
		const createRootState = (todosState: TodosState): RootState => ({
			todos: todosState,
		});

		it("should select all todos", () => {
			let state = todosReducer(initialState, addTodo("Todo 1"));
			state = todosReducer(state, addTodo("Todo 2"));
			const rootState = createRootState(state);

			const todos = selectAllTodos(rootState);
			expect(todos).toHaveLength(2);
		});

		it("should select filter", () => {
			const state = todosReducer(initialState, setFilter("active"));
			const rootState = createRootState(state);

			const filter = selectFilter(rootState);
			expect(filter).toBe("active");
		});

		it("should select filtered todos - all", () => {
			let state = todosReducer(initialState, addTodo("Todo 1"));
			state = todosReducer(state, addTodo("Todo 2"));
			state = todosReducer(state, toggleTodo(state.todos[0].id));
			const rootState = createRootState(state);

			const filteredTodos = selectFilteredTodos(rootState);
			expect(filteredTodos).toHaveLength(2);
		});

		it("should select filtered todos - active", () => {
			let state = todosReducer(initialState, addTodo("Todo 1"));
			state = todosReducer(state, addTodo("Todo 2"));
			state = todosReducer(state, addTodo("Todo 3"));
			state = todosReducer(state, toggleTodo(state.todos[0].id));
			state = todosReducer(state, setFilter("active"));
			const rootState = createRootState(state);

			const filteredTodos = selectFilteredTodos(rootState);
			expect(filteredTodos).toHaveLength(2);
			expect(filteredTodos.every((t) => !t.completed)).toBe(true);
		});

		it("should select filtered todos - completed", () => {
			let state = todosReducer(initialState, addTodo("Todo 1"));
			state = todosReducer(state, addTodo("Todo 2"));
			state = todosReducer(state, addTodo("Todo 3"));
			state = todosReducer(state, toggleTodo(state.todos[0].id));
			state = todosReducer(state, setFilter("completed"));
			const rootState = createRootState(state);

			const filteredTodos = selectFilteredTodos(rootState);
			expect(filteredTodos).toHaveLength(1);
			expect(filteredTodos.every((t) => t.completed)).toBe(true);
		});

		it("should select active count", () => {
			let state = todosReducer(initialState, addTodo("Todo 1"));
			state = todosReducer(state, addTodo("Todo 2"));
			state = todosReducer(state, addTodo("Todo 3"));
			state = todosReducer(state, toggleTodo(state.todos[0].id));
			const rootState = createRootState(state);

			const activeCount = selectActiveCount(rootState);
			expect(activeCount).toBe(2);
		});

		it("should select completed count", () => {
			let state = todosReducer(initialState, addTodo("Todo 1"));
			state = todosReducer(state, addTodo("Todo 2"));
			state = todosReducer(state, addTodo("Todo 3"));
			state = todosReducer(state, toggleTodo(state.todos[0].id));
			state = todosReducer(state, toggleTodo(state.todos[2].id));
			const rootState = createRootState(state);

			const completedCount = selectCompletedCount(rootState);
			expect(completedCount).toBe(2);
		});

		it("should select all completed", () => {
			let state = todosReducer(initialState, addTodo("Todo 1"));
			state = todosReducer(state, addTodo("Todo 2"));
			const rootState1 = createRootState(state);
			expect(selectAllCompleted(rootState1)).toBe(false);

			state = todosReducer(state, toggleAll(true));
			const rootState2 = createRootState(state);
			expect(selectAllCompleted(rootState2)).toBe(true);

			// Empty state should return false
			const emptyRootState = createRootState(initialState);
			expect(selectAllCompleted(emptyRootState)).toBe(false);
		});
	});
});
