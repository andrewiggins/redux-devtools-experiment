import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "../src/store/todosSlice.ts";
import { TodoApp } from "../src/components/TodoApp.tsx";

function renderTodoApp() {
	const store = configureStore({
		reducer: { todos: todosReducer },
	});
	return render(
		<Provider store={store}>
			<TodoApp />
		</Provider>,
	);
}

describe("TodoApp", () => {
	beforeEach(() => {
		// Clear localStorage before each test
		localStorage.clear();
	});

	it("should render the app with header", () => {
		renderTodoApp();
		expect(screen.getByText("todos")).toBeInTheDocument();
		expect(
			screen.getByPlaceholderText("What needs to be done?"),
		).toBeInTheDocument();
	});

	it("should add a new todo", async () => {
		const user = userEvent.setup();
		renderTodoApp();

		const input = screen.getByPlaceholderText("What needs to be done?");
		await user.type(input, "Test todo{Enter}");

		expect(screen.getByText("Test todo")).toBeInTheDocument();
		expect(input).toHaveValue("");
	});

	it("should not add empty todo", async () => {
		const user = userEvent.setup();
		renderTodoApp();

		const input = screen.getByPlaceholderText("What needs to be done?");
		await user.type(input, "   {Enter}");

		expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
	});

	it("should toggle todo completion", async () => {
		const user = userEvent.setup();
		renderTodoApp();

		const input = screen.getByPlaceholderText("What needs to be done?");
		await user.type(input, "Test todo{Enter}");

		const checkbox = screen.getByRole("checkbox", { name: "" });
		await user.click(checkbox);

		const todoItem = screen.getByText("Test todo").closest("li");
		expect(todoItem).toHaveClass("completed");
	});

	it("should delete a todo", async () => {
		const user = userEvent.setup();
		renderTodoApp();

		const input = screen.getByPlaceholderText("What needs to be done?");
		await user.type(input, "Test todo{Enter}");

		const deleteButton = screen.getByRole("button", { name: "" });
		await user.click(deleteButton);

		expect(screen.queryByText("Test todo")).not.toBeInTheDocument();
	});

	it("should edit a todo", async () => {
		const user = userEvent.setup();
		renderTodoApp();

		const input = screen.getByPlaceholderText("What needs to be done?");
		await user.type(input, "Test todo{Enter}");

		const label = screen.getByText("Test todo");
		await user.dblClick(label);

		const editInput = screen.getByDisplayValue("Test todo");
		await user.clear(editInput);
		await user.type(editInput, "Updated todo{Enter}");

		expect(screen.getByText("Updated todo")).toBeInTheDocument();
		expect(screen.queryByText("Test todo")).not.toBeInTheDocument();
	});

	it("should toggle all todos", async () => {
		const user = userEvent.setup();
		renderTodoApp();

		const input = screen.getByPlaceholderText("What needs to be done?");
		await user.type(input, "Todo 1{Enter}");
		await user.type(input, "Todo 2{Enter}");
		await user.type(input, "Todo 3{Enter}");

		const toggleAllCheckbox = screen.getByLabelText("Mark all as complete");
		await user.click(toggleAllCheckbox);

		await waitFor(() => {
			const todoCheckboxes = screen.getAllByRole("checkbox", { name: "" });
			todoCheckboxes.forEach((checkbox) => {
				expect(checkbox).toBeChecked();
			});
		});
	});

	it("should clear completed todos", async () => {
		const user = userEvent.setup();
		renderTodoApp();

		const input = screen.getByPlaceholderText("What needs to be done?");
		await user.type(input, "Todo 1{Enter}");
		await user.type(input, "Todo 2{Enter}");
		await user.type(input, "Todo 3{Enter}");

		const checkboxes = screen.getAllByRole("checkbox", { name: "" });
		await user.click(checkboxes[0]);
		await user.click(checkboxes[2]);

		const clearButton = screen.getByText("Clear completed");
		await user.click(clearButton);

		expect(screen.queryByText("Todo 1")).not.toBeInTheDocument();
		expect(screen.getByText("Todo 2")).toBeInTheDocument();
		expect(screen.queryByText("Todo 3")).not.toBeInTheDocument();
	});

	it("should show correct active count", async () => {
		const user = userEvent.setup();
		renderTodoApp();

		const input = screen.getByPlaceholderText("What needs to be done?");
		await user.type(input, "Todo 1{Enter}");
		await user.type(input, "Todo 2{Enter}");
		await user.type(input, "Todo 3{Enter}");

		await expect(
			screen.findByText((content, element) => {
				return element?.textContent === "3 items left";
			}),
		).resolves.toBeInTheDocument();

		const checkboxes = screen.getAllByRole("checkbox", { name: "" });
		await user.click(checkboxes[0]);

		expect(
			screen.getByText((content, element) => {
				return element?.textContent === "2 items left";
			}),
		).toBeInTheDocument();
	});

	it("should pluralize item count correctly", async () => {
		const user = userEvent.setup();
		renderTodoApp();

		const input = screen.getByPlaceholderText("What needs to be done?");
		await user.type(input, "Todo 1{Enter}");

		expect(
			screen.getByText((content, element) => {
				return element?.textContent === "1 item left";
			}),
		).toBeInTheDocument();

		await user.type(input, "Todo 2{Enter}");
		expect(
			screen.getByText((content, element) => {
				return element?.textContent === "2 items left";
			}),
		).toBeInTheDocument();
	});

	it("should filter todos by active", async () => {
		const user = userEvent.setup();
		renderTodoApp();

		const input = screen.getByPlaceholderText("What needs to be done?");
		await user.type(input, "Active todo{Enter}");
		await user.type(input, "Completed todo{Enter}");

		const checkboxes = screen.getAllByRole("checkbox", { name: "" });
		await user.click(checkboxes[1]);

		const activeLink = screen.getByText("Active");
		await user.click(activeLink);

		await waitFor(() => {
			expect(screen.getByText("Active todo")).toBeInTheDocument();
			expect(screen.queryByText("Completed todo")).not.toBeInTheDocument();
		});
	});

	it("should filter todos by completed", async () => {
		const user = userEvent.setup();
		renderTodoApp();

		const input = screen.getByPlaceholderText("What needs to be done?");
		await user.type(input, "Active todo{Enter}");
		await user.type(input, "Completed todo{Enter}");

		const checkboxes = screen.getAllByRole("checkbox", { name: "" });
		await user.click(checkboxes[1]);

		const completedLink = screen.getByText("Completed");
		await user.click(completedLink);

		await waitFor(() => {
			expect(screen.queryByText("Active todo")).not.toBeInTheDocument();
			expect(screen.getByText("Completed todo")).toBeInTheDocument();
		});
	});

	it("should hide main and footer when no todos", () => {
		renderTodoApp();

		expect(screen.queryByRole("list")).not.toBeInTheDocument();
		expect(screen.queryByText("items left")).not.toBeInTheDocument();
	});
});
