import type { JSX } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks.ts";
import {
	selectFilteredTodos,
	selectAllCompleted,
	toggleAll,
} from "../store/todosSlice.ts";
import { TodoItem } from "./TodoItem.tsx";

export function TodoList(): JSX.Element {
	const filteredTodos = useAppSelector(selectFilteredTodos);
	const allCompleted = useAppSelector(selectAllCompleted);
	const dispatch = useAppDispatch();

	const handleToggleAll = (): void => {
		dispatch(toggleAll(!allCompleted));
	};

	return (
		<section className="main">
			<input
				id="toggle-all"
				className="toggle-all"
				type="checkbox"
				checked={allCompleted}
				onChange={handleToggleAll}
			/>
			<label htmlFor="toggle-all">Mark all as complete</label>
			<ul className="todo-list">
				{filteredTodos.map((todo) => (
					<TodoItem key={todo.id} todo={todo} />
				))}
			</ul>
		</section>
	);
}
