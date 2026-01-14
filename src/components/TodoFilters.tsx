import { useEffect, type JSX } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks.ts";
import { setFilter, selectFilter } from "../store/todosSlice.ts";
import type { FilterType } from "../types/todo.ts";

export function TodoFilters(): JSX.Element {
	const currentFilter = useAppSelector(selectFilter);
	const dispatch = useAppDispatch();

	useEffect(() => {
		const handleHashChange = (): void => {
			const hash = window.location.hash;
			let filter: FilterType = "all";

			if (hash === "#/active") {
				filter = "active";
			} else if (hash === "#/completed") {
				filter = "completed";
			}

			dispatch(setFilter(filter));
		};

		// Sync on mount
		handleHashChange();

		window.addEventListener("hashchange", handleHashChange);
		return () => window.removeEventListener("hashchange", handleHashChange);
	}, [dispatch]);

	return (
		<ul className="filters">
			<li>
				<a href="#/" className={currentFilter === "all" ? "selected" : ""}>
					All
				</a>
			</li>
			<li>
				<a
					href="#/active"
					className={currentFilter === "active" ? "selected" : ""}
				>
					Active
				</a>
			</li>
			<li>
				<a
					href="#/completed"
					className={currentFilter === "completed" ? "selected" : ""}
				>
					Completed
				</a>
			</li>
		</ul>
	);
}
