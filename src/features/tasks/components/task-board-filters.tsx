import { SearchIcon, XIcon } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { cn } from "#/lib/utils";
import { m } from "#/paraglide/messages";
import { useTaskBoardPreferences } from "../hooks/use-task-board-preferences";
import type { WorkspaceMember } from "./task-board-types";

type TaskBoardFiltersProps = {
	workspaceId: string;
	projectId: string;
	members: WorkspaceMember[];
	resultCount: number;
	totalCount: number;
	className?: string;
};

export function TaskBoardFilters({
	workspaceId,
	projectId,
	members,
	resultCount,
	totalCount,
	className,
}: TaskBoardFiltersProps) {
	const {
		query,
		priority,
		assignee,
		setQuery,
		setPriority,
		setAssignee,
		clearFilters,
	} = useTaskBoardPreferences(workspaceId, projectId);
	const hasFilters =
		query.length > 0 || priority !== "all" || assignee !== "all";

	return (
		<section
			aria-label={m.task_filters()}
			className={cn(
				"flex flex-col gap-2 border-b pb-3 lg:flex-row lg:items-center",
				className,
			)}
		>
			<div className="relative min-w-0 flex-1 lg:max-w-sm">
				<SearchIcon
					className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
					aria-hidden="true"
				/>
				<Input
					type="search"
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					placeholder={m.task_search_placeholder()}
					aria-label={m.task_search_placeholder()}
					className="h-9 border-transparent bg-muted/60 pl-9 shadow-none focus-visible:border-ring"
				/>
			</div>
			<div className="grid grid-cols-2 gap-2 sm:flex">
				<Select value={priority} onValueChange={setPriority}>
					<SelectTrigger className="h-9 w-full border-transparent bg-muted/60 shadow-none sm:w-40">
						<SelectValue placeholder={m.task_priority()} />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value="all">{m.task_all_priorities()}</SelectItem>
							<SelectItem value="none">{m.priority_none()}</SelectItem>
							<SelectItem value="low">{m.priority_low()}</SelectItem>
							<SelectItem value="medium">{m.priority_medium()}</SelectItem>
							<SelectItem value="high">{m.priority_high()}</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
				<Select value={assignee} onValueChange={setAssignee}>
					<SelectTrigger className="h-9 w-full border-transparent bg-muted/60 shadow-none sm:w-44">
						<SelectValue placeholder={m.task_assignee()} />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value="all">{m.task_all_assignees()}</SelectItem>
							<SelectItem value="unassigned">{m.task_unassigned()}</SelectItem>
							{members.map((member) => (
								<SelectItem key={member.id} value={member.id}>
									{member.name || member.email || member.id}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
			<div className="flex min-h-9 items-center justify-between gap-3 lg:ml-auto">
				<p
					className="whitespace-nowrap font-mono text-[11px] tabular-nums text-muted-foreground"
					aria-live="polite"
				>
					{m.task_filter_count({ count: resultCount, total: totalCount })}
				</p>
				{hasFilters ? (
					<Button
						variant="ghost"
						size="sm"
						className="text-muted-foreground"
						onClick={clearFilters}
					>
						<XIcon data-icon="inline-start" />
						{m.task_clear_filters()}
					</Button>
				) : null}
			</div>
		</section>
	);
}
