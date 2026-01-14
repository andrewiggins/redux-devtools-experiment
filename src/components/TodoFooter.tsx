import type { JSX } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks.ts";
import {
	selectActiveCount,
	selectCompletedCount,
	clearCompleted,
} from "../store/todosSlice.ts";
import { TodoFilters } from "./TodoFilters.tsx";

export function TodoFooter(): JSX.Element {
	const activeCount = useAppSelector(selectActiveCount);
	const completedCount = useAppSelector(selectCompletedCount);
	const dispatch = useAppDispatch();

	const itemWord = activeCount === 1 ? "item" : "items";

	const handleClearCompleted = (): void => {
		dispatch(clearCompleted());
	};

	return (
		<footer className="footer">
			<span className="todo-count">
				<strong>{activeCount}</strong> {itemWord} left
			</span>
			<TodoFilters />
			{completedCount > 0 && (
				<button className="clear-completed" onClick={handleClearCompleted}>
					Clear completed
				</button>
			)}
		</footer>
	);
}
