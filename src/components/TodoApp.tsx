import type { JSX } from "react";
import { useAppSelector } from "../store/hooks.ts";
import { selectAllTodos } from "../store/todosSlice.ts";
import { TodoHeader } from "./TodoHeader.tsx";
import { TodoList } from "./TodoList.tsx";
import { TodoFooter } from "./TodoFooter.tsx";

export function TodoApp(): JSX.Element {
	const todos = useAppSelector(selectAllTodos);
	const hasTodos = todos.length > 0;

	return (
		<div className="todoapp">
			<TodoHeader />
			{hasTodos && (
				<>
					<TodoList />
					<TodoFooter />
				</>
			)}
		</div>
	);
}
