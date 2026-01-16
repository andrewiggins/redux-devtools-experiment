import { configureStore, type EnhancedStore } from "@reduxjs/toolkit";
import todosReducer from "./todosSlice.ts";
import { loadState, saveState } from "../utils/storage.ts";
import type { TodosState } from "../types/todo.ts";

// Define RootState type first
export interface RootState {
	todos: TodosState;
}

const params = new URLSearchParams(location.search);
const hasTraceParam = params.has("trace") && params.get("trace") !== "false";

const preloadedState: RootState | undefined = loadState();

export const store: EnhancedStore<RootState> = configureStore({
	reducer: {
		todos: todosReducer,
	},
	preloadedState,
	devTools: hasTraceParam ? { trace: true } : true, // ENABLED IN ALL BUILDS (including production)
});

// Subscribe to store changes for localStorage persistence
store.subscribe(() => {
	saveState(store.getState());
});

export type AppDispatch = typeof store.dispatch;
