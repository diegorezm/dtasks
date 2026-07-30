import { LoaderCircleIcon } from "lucide-react";
import { type FormEvent, type ReactNode, useState } from "react";
import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
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
import type { WorkspaceMember } from "./task-board-types";

type CreateTaskDialogProps = {
	members: WorkspaceMember[];
	isPending: boolean;
	error?: string;
	children: ReactNode;
	onSubmit: (form: FormData, close: () => void) => void;
};

export function CreateTaskDialog({
	members,
	isPending,
	error,
	children,
	onSubmit,
}: CreateTaskDialogProps) {
	const [open, setOpen] = useState(false);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		onSubmit(new FormData(event.currentTarget), () => setOpen(false));
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<span className="inline-flex">{children}</span>
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-2xl tracking-[-0.03em]">
						{m.task_create()}
					</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit}>
					<FieldGroup>
						<Field data-invalid={Boolean(error) || undefined}>
							<FieldLabel htmlFor="task-title">{m.task_title()}</FieldLabel>
							<Input id="task-title" name="title" required maxLength={200} />
						</Field>
						<Field>
							<FieldLabel htmlFor="task-description">
								{m.task_description()}
							</FieldLabel>
							<Textarea
								id="task-description"
								name="description"
								maxLength={10000}
							/>
						</Field>
						{error ? <FieldError>{error}</FieldError> : null}
						<Field>
							<FieldLabel>{m.task_priority()}</FieldLabel>
							<Select name="priority" defaultValue="none">
								<SelectTrigger>
									<SelectValue />
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
						<Field>
							<FieldLabel>{m.task_assignee()}</FieldLabel>
							<Select name="assignee">
								<SelectTrigger>
									<SelectValue placeholder={m.task_unassigned()} />
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
						<Field>
							<FieldLabel htmlFor="due-date">{m.task_due_date()}</FieldLabel>
							<Input id="due-date" name="dueDate" type="date" />
						</Field>
						<Button
							type="submit"
							className="mt-2 transition-transform active:scale-[0.98]"
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
					</FieldGroup>
				</form>
			</DialogContent>
		</Dialog>
	);
}
