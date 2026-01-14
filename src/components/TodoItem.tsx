import { useState, useRef, useEffect, type JSX } from "react";
import { useAppDispatch } from "../store/hooks.ts";
import { toggleTodo, deleteTodo, editTodo } from "../store/todosSlice.ts";
import type { Todo } from "../types/todo.ts";

interface TodoItemProps {
	todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps): JSX.Element {
	const [isEditing, setIsEditing] = useState(false);
	const [editText, setEditText] = useState(todo.title);
	const editInputRef = useRef<HTMLInputElement>(null);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (isEditing) {
			editInputRef.current?.focus();
		}
	}, [isEditing]);

	const handleDoubleClick = (): void => {
		setIsEditing(true);
		setEditText(todo.title);
	};

	const handleToggle = (): void => {
		dispatch(toggleTodo(todo.id));
	};

	const handleDelete = (): void => {
		dispatch(deleteTodo(todo.id));
	};

	const submitEdit = (): void => {
		const trimmedValue = editText.trim();
		if (trimmedValue) {
			dispatch(editTodo({ id: todo.id, title: trimmedValue }));
		} else {
			dispatch(deleteTodo(todo.id));
		}
		setIsEditing(false);
	};

	const cancelEdit = (): void => {
		setEditText(todo.title);
		setIsEditing(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
		if (e.key === "Enter") {
			submitEdit();
		} else if (e.key === "Escape") {
			cancelEdit();
		}
	};

	const handleBlur = (): void => {
		submitEdit();
	};

	const className = [
		"todo",
		todo.completed ? "completed" : "",
		isEditing ? "editing" : "",
	]
		.filter(Boolean)
		.join(" ");

	return (
		<li className={className}>
			<div className="view">
				<input
					className="toggle"
					type="checkbox"
					checked={todo.completed}
					onChange={handleToggle}
				/>
				<label onDoubleClick={handleDoubleClick}>{todo.title}</label>
				<button className="destroy" onClick={handleDelete} />
			</div>
			{isEditing && (
				<input
					ref={editInputRef}
					className="edit"
					value={editText}
					onChange={(e) => setEditText(e.target.value)}
					onKeyDown={handleKeyDown}
					onBlur={handleBlur}
				/>
			)}
		</li>
	);
}
