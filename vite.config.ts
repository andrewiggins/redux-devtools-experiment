/// <reference types="vitest/config" />
import type { UserConfig } from "vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
const viteConfig: UserConfig = defineConfig({
	base: "/redux-devtools-experiment/",
	plugins: [react()],
	build: {
		minify: false,
	},
	test: {
		projects: [
			{
				test: {
					name: "happy-dom",
					root: "./test",
					environment: "happy-dom",
					setupFiles: ["./setup.ts"],
				},
			},
		],
	},
});
export default viteConfig;
