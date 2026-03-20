import { type Login, loginSchema } from "@dtask/schemas";
import { Button } from "@dtask/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@dtask/ui/components/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@dtask/ui/components/field";
import { Input } from "@dtask/ui/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useLogin } from "../../use_cases/use-login";

export function LoginPage() {
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();
  const form = useForm<Login>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: Login) => {
    login(data, {
      onSuccess: () => navigate({ to: "/" }),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="font-bold text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your dtask account</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-password">Password</FieldLabel>
                    <Input
                      {...field}
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
          <Button
            type="submit"
            form="login-form"
            className="mt-4 w-full"
            disabled={isPending}
          >
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
          <p className="mt-4 text-center text-muted-foreground text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-foreground underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
