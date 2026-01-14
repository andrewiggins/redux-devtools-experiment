import { createRoot } from "react-dom/client";
import "./index.css";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");
const reactRoot = createRoot(root);
reactRoot.render(<div>Hello World</div>);
