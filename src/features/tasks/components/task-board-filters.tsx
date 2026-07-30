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
import { m } from "#/paraglide/messages";
import type { WorkspaceMember } from "./task-board-types";

type TaskBoardFiltersProps = {
	query: string;
	priority: string;
	assignee: string;
	members: WorkspaceMember[];
	resultCount: number;
	totalCount: number;
	onQueryChange: (value: string) => void;
	onPriorityChange: (value: string) => void;
	onAssigneeChange: (value: string) => void;
	onClear: () => void;
};

export function TaskBoardFilters({
	query,
	priority,
	assignee,
	members,
	resultCount,
	totalCount,
	onQueryChange,
	onPriorityChange,
	onAssigneeChange,
	onClear,
}: TaskBoardFiltersProps) {
	const hasFilters =
		query.length > 0 || priority !== "all" || assignee !== "all";

	return (
		<section
			aria-label={m.task_filters()}
			className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-3 shadow-[0_1px_2px_hsl(var(--foreground)/0.04)] lg:flex-row lg:items-center"
		>
			<div className="relative min-w-0 flex-1">
				<SearchIcon
					className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
					aria-hidden="true"
				/>
				<Input
					type="search"
					value={query}
					onChange={(event) => onQueryChange(event.target.value)}
					placeholder={m.task_search_placeholder()}
					aria-label={m.task_search_placeholder()}
					className="pl-9"
				/>
			</div>
			<div className="grid grid-cols-2 gap-2 sm:flex">
				<Select value={priority} onValueChange={onPriorityChange}>
					<SelectTrigger className="w-full sm:w-40">
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
				<Select value={assignee} onValueChange={onAssigneeChange}>
					<SelectTrigger className="w-full sm:w-44">
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
			<div className="flex min-h-9 items-center justify-between gap-3 border-t pt-3 lg:border-l lg:border-t-0 lg:pl-3 lg:pt-0">
				<p
					className="whitespace-nowrap font-mono text-xs tabular-nums text-muted-foreground"
					aria-live="polite"
				>
					{m.task_filter_count({ count: resultCount, total: totalCount })}
				</p>
				{hasFilters ? (
					<Button variant="ghost" size="sm" onClick={onClear}>
						<XIcon data-icon="inline-start" />
						{m.task_clear_filters()}
					</Button>
				) : null}
			</div>
		</section>
	);
}
