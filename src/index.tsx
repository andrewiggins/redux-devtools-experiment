import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { TodoApp } from "./components/TodoApp.tsx";
import "./index.css";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");
const reactRoot = createRoot(root);
reactRoot.render(
	<Provider store={store}>
		<TodoApp />
	</Provider>,
);
