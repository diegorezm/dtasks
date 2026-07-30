import { Columns3Icon, LayoutGridIcon, ListIcon } from "lucide-react";
import { Button } from "#/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";
import { m } from "#/paraglide/messages";
import { columns, type TaskStatus } from "./task-board-types";

export type TaskBoardView = "board" | "list";

type TaskBoardViewControlsProps = {
	view: TaskBoardView;
	visibleStatuses: TaskStatus[];
	onViewChange: (view: TaskBoardView) => void;
	onVisibleStatusesChange: (statuses: TaskStatus[]) => void;
};

export function TaskBoardViewControls({
	view,
	visibleStatuses,
	onViewChange,
	onVisibleStatusesChange,
}: TaskBoardViewControlsProps) {
	function toggleStatus(status: TaskStatus, checked: boolean) {
		if (checked) {
			onVisibleStatusesChange(
				columns.filter(
					(column): column is TaskStatus =>
						column === status || visibleStatuses.includes(column),
				),
			);
			return;
		}

		if (visibleStatuses.length === 1) return;
		onVisibleStatusesChange(
			visibleStatuses.filter((column) => column !== status),
		);
	}

	return (
		<div className="flex items-center gap-2">
			<ToggleGroup
				aria-label={m.task_view_label()}
				type="single"
				value={view}
				onValueChange={(value) => {
					if (value === "board" || value === "list") onViewChange(value);
				}}
				variant="outline"
				size="sm"
			>
				<ToggleGroupItem value="board" aria-label={m.task_board_view()}>
					<LayoutGridIcon data-icon="inline-start" />
					<span className="hidden sm:inline">{m.task_board_view()}</span>
				</ToggleGroupItem>
				<ToggleGroupItem value="list" aria-label={m.task_list_view()}>
					<ListIcon data-icon="inline-start" />
					<span className="hidden sm:inline">{m.task_list_view()}</span>
				</ToggleGroupItem>
			</ToggleGroup>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="sm" aria-label={m.task_columns()}>
						<Columns3Icon data-icon="inline-start" />
						<span className="hidden sm:inline">{m.task_columns()}</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-52">
					<DropdownMenuLabel>{m.task_visible_columns()}</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{columns.map((status) => (
						<DropdownMenuCheckboxItem
							key={status}
							checked={visibleStatuses.includes(status)}
							disabled={
								visibleStatuses.length === 1 && visibleStatuses.includes(status)
							}
							onCheckedChange={(checked) => toggleStatus(status, checked)}
						>
							{m[`status_${status}`]()}
						</DropdownMenuCheckboxItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
