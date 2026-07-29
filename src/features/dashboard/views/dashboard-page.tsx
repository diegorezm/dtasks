import {
	ArrowRightIcon,
	CheckIcon,
	CircleAlertIcon,
	Clock3Icon,
	MessageSquareTextIcon,
	PlusIcon,
	SparklesIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarGroup } from "#/components/ui/avatar";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { Progress } from "#/components/ui/progress";
import { Separator } from "#/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "#/components/ui/sidebar";
import { DashboardSidebar } from "#/features/dashboard/components/dashboard-sidebar";
import { m } from "#/paraglide/messages";

type DashboardPageProps = {
	user: {
		name?: string | null;
		email: string;
		image?: string | null;
	};
};

const projects = [
	{
		name: "Northstar",
		client: "Atlas Labs",
		progress: 78,
		due: m.dashboard_due_friday,
		team: ["AK", "DM", "SL"],
	},
	{
		name: "Fieldnotes",
		client: "Morrow Studio",
		progress: 52,
		due: m.dashboard_due_next_week,
		team: ["JM", "EC"],
	},
	{
		name: "Relay",
		client: "Aster Health",
		progress: 31,
		due: m.dashboard_due_in_two_weeks,
		team: ["KP", "DM", "RH"],
	},
];

const attentionItems = [
	{
		title: m.dashboard_attention_approval,
		detail: m.dashboard_attention_approval_detail,
		icon: CircleAlertIcon,
	},
	{
		title: m.dashboard_attention_overdue,
		detail: m.dashboard_attention_overdue_detail,
		icon: Clock3Icon,
	},
	{
		title: m.dashboard_attention_reply,
		detail: m.dashboard_attention_reply_detail,
		icon: MessageSquareTextIcon,
	},
];

const activity = [
	{
		initials: "AK",
		text: m.dashboard_activity_moved,
		meta: m.dashboard_activity_moved_meta,
	},
	{
		initials: "DM",
		text: m.dashboard_activity_shared,
		meta: m.dashboard_activity_shared_meta,
	},
	{
		initials: "JM",
		text: m.dashboard_activity_completed,
		meta: m.dashboard_activity_completed_meta,
	},
];

const nextMoves = [
	{
		task: m.dashboard_task_review,
		project: "Northstar",
		time: m.dashboard_time_today,
	},
	{
		task: m.dashboard_task_scope,
		project: "Fieldnotes",
		time: m.dashboard_time_tomorrow,
	},
	{
		task: m.dashboard_task_invite,
		project: "Relay",
		time: m.dashboard_time_thursday,
	},
];

export function DashboardPage({ user }: DashboardPageProps) {
	const firstName = user.name?.split(" ")[0] || m.dashboard_teammate();

	return (
		<SidebarProvider>
			<DashboardSidebar user={user} />
			<SidebarInset className="overflow-hidden">
				<header className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-7">
					<div className="flex items-center gap-3">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="h-5" />
						<p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
							{m.dashboard_today()}
						</p>
					</div>
					<Button size="sm">
						<PlusIcon data-icon="inline-start" />
						{m.dashboard_new_task()}
					</Button>
				</header>

				<div className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col gap-8 p-4 md:p-7 lg:p-10">
					<section className="rise-in flex flex-col gap-3 border-b pb-7 md:flex-row md:items-end md:justify-between">
						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-2 text-primary">
								<SparklesIcon className="size-4" />
								<span className="font-mono text-xs font-semibold uppercase tracking-widest">
									{m.dashboard_focus_label()}
								</span>
							</div>
							<h1 className="display-title text-4xl font-semibold tracking-tight md:text-5xl">
								{m.dashboard_greeting({ name: firstName })}
							</h1>
							<p className="max-w-2xl text-muted-foreground">
								{m.dashboard_summary()}
							</p>
						</div>
						<div className="flex items-center gap-7 md:text-right">
							<div>
								<p className="font-mono text-2xl font-semibold">12</p>
								<p className="text-xs text-muted-foreground">
									{m.dashboard_open_tasks()}
								</p>
							</div>
							<div>
								<p className="font-mono text-2xl font-semibold">3</p>
								<p className="text-xs text-muted-foreground">
									{m.dashboard_active_projects()}
								</p>
							</div>
						</div>
					</section>

					<section className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.75fr)]">
						<Card className="overflow-hidden shadow-none">
							<CardHeader>
								<CardTitle className="text-lg">
									{m.dashboard_delivery_title()}
								</CardTitle>
								<CardDescription>
									{m.dashboard_delivery_description()}
								</CardDescription>
								<CardAction>
									<Button size="sm" variant="ghost">
										{m.dashboard_view_projects()}
										<ArrowRightIcon data-icon="inline-end" />
									</Button>
								</CardAction>
							</CardHeader>
							<CardContent className="flex flex-col gap-1 px-0">
								{projects.map((project, index) => (
									<div
										key={project.name}
										className="group grid gap-4 px-6 py-5 transition-colors hover:bg-muted/40 md:grid-cols-[1fr_1.4fr_auto] md:items-center"
									>
										<div>
											<p className="font-semibold">{project.name}</p>
											<p className="text-sm text-muted-foreground">
												{project.client}
											</p>
										</div>
										<div className="flex flex-col gap-2">
											<div className="flex justify-between font-mono text-xs text-muted-foreground">
												<span>{m.dashboard_progress()}</span>
												<span>{project.progress}%</span>
											</div>
											<Progress value={project.progress} />
										</div>
										<div className="flex items-center justify-between gap-5 md:justify-end">
											<AvatarGroup>
												{project.team.map((member) => (
													<Avatar size="sm" key={member}>
														<AvatarFallback>{member}</AvatarFallback>
													</Avatar>
												))}
											</AvatarGroup>
											<Badge variant={index === 0 ? "default" : "outline"}>
												{project.due()}
											</Badge>
										</div>
									</div>
								))}
							</CardContent>
							<CardFooter className="border-t bg-muted/20 py-4 text-xs text-muted-foreground">
								{m.dashboard_delivery_footer()}
							</CardFooter>
						</Card>

						<Card className="shadow-none">
							<CardHeader>
								<CardTitle className="text-lg">
									{m.dashboard_attention_title()}
								</CardTitle>
								<CardDescription>
									{m.dashboard_attention_description()}
								</CardDescription>
							</CardHeader>
							<CardContent className="flex flex-col gap-5">
								{attentionItems.map((item) => (
									<div className="flex gap-3" key={item.title()}>
										<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
											<item.icon className="size-4" />
										</div>
										<div className="min-w-0 flex-1">
											<p className="text-sm font-medium">{item.title()}</p>
											<p className="text-sm text-muted-foreground">
												{item.detail()}
											</p>
										</div>
										<Button
											size="icon-sm"
											variant="ghost"
											aria-label={m.dashboard_mark_done()}
										>
											<CheckIcon />
										</Button>
									</div>
								))}
							</CardContent>
						</Card>
					</section>

					<section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.42fr)]">
						<Card className="shadow-none">
							<CardHeader>
								<CardTitle className="text-lg">
									{m.dashboard_next_title()}
								</CardTitle>
								<CardDescription>
									{m.dashboard_next_description()}
								</CardDescription>
							</CardHeader>
							<CardContent className="grid gap-3 md:grid-cols-3">
								{nextMoves.map((item) => (
									<button
										type="button"
										key={item.task()}
										className="flex min-h-36 flex-col items-start justify-between rounded-lg border bg-background p-4 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
									>
										<Badge variant="outline">{item.time()}</Badge>
										<div>
											<p className="font-medium">{item.task()}</p>
											<p className="mt-1 font-mono text-xs text-muted-foreground">
												{item.project}
											</p>
										</div>
									</button>
								))}
							</CardContent>
						</Card>

						<Card className="shadow-none">
							<CardHeader>
								<CardTitle className="text-lg">
									{m.dashboard_activity_title()}
								</CardTitle>
								<CardDescription>
									{m.dashboard_activity_description()}
								</CardDescription>
							</CardHeader>
							<CardContent className="flex flex-col gap-5">
								{activity.map((item) => (
									<div className="flex gap-3" key={item.text()}>
										<Avatar size="sm">
											<AvatarFallback>{item.initials}</AvatarFallback>
										</Avatar>
										<div>
											<p className="text-sm leading-snug">{item.text()}</p>
											<p className="mt-1 font-mono text-xs text-muted-foreground">
												{item.meta()}
											</p>
										</div>
									</div>
								))}
							</CardContent>
						</Card>
					</section>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
