import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { columns, type TaskStatus } from "../components/task-board-types";
import type { TaskBoardView } from "../components/task-board-view-controls";

type TaskPriority = "all" | "none" | "low" | "medium" | "high";

type TaskBoardPreferences = {
	query: string;
	priority: TaskPriority;
	assignee: string;
	view: TaskBoardView;
	visibleStatuses: TaskStatus[];
	setQuery: (query: string) => void;
	setPriority: (priority: string) => void;
	setAssignee: (assignee: string) => void;
	setView: (view: TaskBoardView) => void;
	setVisibleStatuses: (statuses: TaskStatus[]) => void;
	clearFilters: () => void;
};

const taskBoardStores = new Map<
	string,
	ReturnType<typeof createTaskBoardPreferencesStore>
>();

const serverStorage = {
	getItem: () => null,
	setItem: () => undefined,
	removeItem: () => undefined,
};

export function useTaskBoardPreferences(
	workspaceId: string,
	projectId: string,
) {
	const key = `${workspaceId}:${projectId}`;
	let store = taskBoardStores.get(key);
	if (!store) {
		store = createTaskBoardPreferencesStore(
			`dtasks:task-board:${workspaceId}:${projectId}`,
		);
		taskBoardStores.set(key, store);
	}
	return store();
}

function createTaskBoardPreferencesStore(storageKey: string) {
	return create<TaskBoardPreferences>()(
		persist(
			(set) => ({
				query: "",
				priority: "all",
				assignee: "all",
				view: "board",
				visibleStatuses: [...columns],
				setQuery: (query) => set({ query }),
				setPriority: (priority) =>
					set({ priority: isTaskPriority(priority) ? priority : "all" }),
				setAssignee: (assignee) => set({ assignee }),
				setView: (view) => set({ view }),
				setVisibleStatuses: (visibleStatuses) => set({ visibleStatuses }),
				clearFilters: () =>
					set({ query: "", priority: "all", assignee: "all" }),
			}),
			{
				name: storageKey,
				storage: createJSONStorage(() =>
					typeof window === "undefined" ? serverStorage : window.localStorage,
				),
				partialize: ({ query, priority, assignee, view, visibleStatuses }) => ({
					query,
					priority,
					assignee,
					view,
					visibleStatuses,
				}),
				merge: (persisted, current) => {
					if (!isStoredPreferences(persisted)) return current;
					return { ...current, ...persisted };
				},
			},
		),
	);
}

function isStoredPreferences(value: unknown): value is {
	query: string;
	priority: TaskPriority;
	assignee: string;
	view: TaskBoardView;
	visibleStatuses: TaskStatus[];
} {
	if (!value || typeof value !== "object") return false;
	const visibleStatuses = Reflect.get(value, "visibleStatuses");
	return (
		typeof Reflect.get(value, "query") === "string" &&
		isTaskPriority(Reflect.get(value, "priority")) &&
		typeof Reflect.get(value, "assignee") === "string" &&
		isTaskBoardView(Reflect.get(value, "view")) &&
		Array.isArray(visibleStatuses) &&
		visibleStatuses.length > 0 &&
		visibleStatuses.every(isTaskStatus)
	);
}

function isTaskPriority(value: unknown): value is TaskPriority {
	return (
		value === "all" ||
		value === "none" ||
		value === "low" ||
		value === "medium" ||
		value === "high"
	);
}

function isTaskBoardView(value: unknown): value is TaskBoardView {
	return value === "board" || value === "list";
}

function isTaskStatus(value: unknown): value is TaskStatus {
	return columns.some((column) => column === value);
}
