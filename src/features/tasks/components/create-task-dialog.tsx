import {
	CalendarDaysIcon,
	CircleDashedIcon,
	FlagIcon,
	LoaderCircleIcon,
	UserRoundIcon,
} from "lucide-react";
import type { FormEvent } from "react";
import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { Textarea } from "#/components/ui/textarea";
import { m } from "#/paraglide/messages";
import { useTaskCreateStore } from "../hooks/use-task-create-store";
import type { WorkspaceMember } from "./task-board-types";

type CreateTaskDialogProps = {
	members: WorkspaceMember[];
	isPending: boolean;
	error?: string;
	onSubmit: (form: FormData, close: () => void) => void;
};

export function CreateTaskDialog({
	members,
	isPending,
	error,
	onSubmit,
}: CreateTaskDialogProps) {
	const isOpen = useTaskCreateStore((state) => state.isOpen);
	const status = useTaskCreateStore((state) => state.status);
	const openForStatus = useTaskCreateStore((state) => state.openForStatus);
	const close = useTaskCreateStore((state) => state.close);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		onSubmit(new FormData(event.currentTarget), close);
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				if (open) openForStatus("backlog");
				else close();
			}}
		>
			<DialogContent className="max-h-[calc(100dvh-2rem)] gap-0 overflow-y-auto rounded-2xl border-border/80 p-0 shadow-2xl sm:max-w-3xl">
				<DialogHeader className="border-b px-5 py-4 pr-12 sm:px-6">
					<DialogTitle className="text-sm font-semibold tracking-normal">
						{m.task_create()}
					</DialogTitle>
					<DialogDescription className="sr-only">
						{m.task_create()}
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<FieldGroup className="gap-0">
						<div className="space-y-1 px-5 pt-5 sm:px-6 sm:pt-6">
							<Field
								data-invalid={Boolean(error) || undefined}
								className="gap-0"
							>
								<FieldLabel htmlFor="task-title" className="sr-only">
									{m.task_title()}
								</FieldLabel>
								<Input
									id="task-title"
									name="title"
									required
									maxLength={200}
									placeholder={m.task_title()}
									className="h-auto border-0 bg-transparent px-0 py-1 text-xl font-semibold tracking-[-0.02em] shadow-none placeholder:text-muted-foreground/65 focus-visible:border-0 focus-visible:ring-0 sm:text-2xl"
								/>
							</Field>
							<Field className="gap-0">
								<FieldLabel htmlFor="task-description" className="sr-only">
									{m.task_description()}
								</FieldLabel>
								<Textarea
									id="task-description"
									name="description"
									maxLength={10000}
									placeholder={m.task_description()}
									className="min-h-32 resize-none border-0 bg-transparent px-0 py-2 text-sm leading-6 shadow-none placeholder:text-muted-foreground/65 focus-visible:border-0 focus-visible:ring-0"
								/>
							</Field>
						</div>

						{error ? (
							<FieldError className="px-5 sm:px-6">{error}</FieldError>
						) : null}

						<div className="flex flex-wrap gap-2 border-t px-5 py-4 sm:px-6">
							<div className="inline-flex h-8 items-center gap-1.5 rounded-full border bg-muted/45 px-3 text-xs font-medium text-muted-foreground">
								<CircleDashedIcon className="size-3.5" aria-hidden="true" />
								{m[`status_${status}`]()}
							</div>
							<Field className="w-auto gap-0">
								<FieldLabel className="sr-only">{m.task_priority()}</FieldLabel>
								<Select name="priority">
									<SelectTrigger
										aria-label={m.task_priority()}
										className="h-8 w-auto min-w-0 rounded-full border-border bg-muted/45 px-3 text-xs shadow-none hover:bg-muted"
									>
										<FlagIcon className="size-3.5 text-muted-foreground" />
										<SelectValue placeholder={m.task_priority()} />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{["none", "low", "medium", "high"].map((value) => (
												<SelectItem key={value} value={value}>
													{m[`priority_${value}` as "priority_none"]()}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</Field>
							<Field className="w-auto gap-0">
								<FieldLabel className="sr-only">{m.task_assignee()}</FieldLabel>
								<Select name="assignee">
									<SelectTrigger
										aria-label={m.task_assignee()}
										className="h-8 w-auto min-w-0 rounded-full border-border bg-muted/45 px-3 text-xs shadow-none hover:bg-muted"
									>
										<UserRoundIcon className="size-3.5 text-muted-foreground" />
										<SelectValue placeholder={m.task_assignee()} />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{members.map((member) => (
												<SelectItem key={member.id} value={member.id}>
													{member.name || member.email || member.id}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</Field>
							<Field className="w-auto gap-0">
								<FieldLabel htmlFor="due-date" className="sr-only">
									{m.task_due_date()}
								</FieldLabel>
								<div className="relative">
									<CalendarDaysIcon className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
									<Input
										id="due-date"
										name="dueDate"
										type="date"
										aria-label={m.task_due_date()}
										className="h-8 w-[8.5rem] rounded-full border-border bg-muted/45 py-1 pr-3 pl-8 text-xs shadow-none hover:bg-muted"
									/>
								</div>
							</Field>
						</div>

						<div className="flex items-center justify-end border-t bg-muted/20 px-5 py-3 sm:px-6">
							<Button
								type="submit"
								className="transition-transform active:scale-[0.98]"
								disabled={isPending}
							>
								{isPending ? (
									<LoaderCircleIcon
										data-icon="inline-start"
										className="animate-spin"
									/>
								) : null}
								{m.task_save()}
							</Button>
						</div>
					</FieldGroup>
				</form>
			</DialogContent>
		</Dialog>
	);
}
