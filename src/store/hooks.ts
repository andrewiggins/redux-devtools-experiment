import {
	useDispatch,
	useSelector,
	type TypedUseSelectorHook,
} from "react-redux";
import type { RootState, AppDispatch } from "./store.ts";

// Pre-typed hooks following Redux Toolkit best practices
export const useAppDispatch: () => AppDispatch =
	useDispatch.withTypes<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> =
	useSelector.withTypes<RootState>();
