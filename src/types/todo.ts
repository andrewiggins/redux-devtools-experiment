export interface Todo {
	id: string;
	title: string;
	completed: boolean;
}

export type FilterType = "all" | "active" | "completed";

export interface TodosState {
	todos: Todo[];
	filter: FilterType;
}
