import type { TodosState } from "../types/todo.ts";

const STORAGE_KEY = "todos-redux-toolkit";

interface StoredState {
	todos: TodosState;
}

export function loadState(): StoredState | undefined {
	try {
		const serialized = localStorage.getItem(STORAGE_KEY);
		if (serialized === null) {
			return undefined;
		}
		return JSON.parse(serialized) as StoredState;
	} catch (err) {
		console.error("Failed to load state:", err);
		return undefined;
	}
}

export function saveState(state: StoredState): void {
	try {
		const serialized = JSON.stringify(state);
		localStorage.setItem(STORAGE_KEY, serialized);
	} catch (err) {
		console.error("Failed to save state:", err);
	}
}
