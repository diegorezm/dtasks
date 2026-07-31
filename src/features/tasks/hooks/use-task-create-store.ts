import { create } from "zustand";
import type { TaskStatus } from "../components/task-board-types";

type TaskCreateStore = {
	isOpen: boolean;
	status: TaskStatus;
	openForStatus: (status: TaskStatus) => void;
	close: () => void;
};

export const useTaskCreateStore = create<TaskCreateStore>((set) => ({
	isOpen: false,
	status: "backlog",
	openForStatus: (status) => set({ isOpen: true, status }),
	close: () => set({ isOpen: false, status: "backlog" }),
}));
