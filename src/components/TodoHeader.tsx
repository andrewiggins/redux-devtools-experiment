import { useState, type JSX } from "react";
import { useAppDispatch } from "../store/hooks.ts";
import { addTodo } from "../store/todosSlice.ts";

export function TodoHeader(): JSX.Element {
	const [input, setInput] = useState("");
	const dispatch = useAppDispatch();

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
		if (e.key === "Enter") {
			const trimmedValue = input.trim();
			if (trimmedValue) {
				dispatch(addTodo(trimmedValue));
				setInput("");
			}
		}
	};

	return (
		<header className="header">
			<h1>todos</h1>
			<input
				className="new-todo"
				placeholder="What needs to be done?"
				autoFocus
				value={input}
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={handleKeyDown}
			/>
		</header>
	);
}
