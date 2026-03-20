import { type Register as RegisterInput, registerSchema } from "@dtask/schemas";
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
import { useRegister } from "../../use_cases/use-register";

export function RegisterPage() {
  const navigate = useNavigate();
  const { mutate: register, isPending } = useRegister();
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = (data: RegisterInput) => {
    register(data, {
      onSuccess: () => navigate({ to: "/" }),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="font-bold text-2xl">
            Create an account
          </CardTitle>
          <CardDescription>Get started with dtask today</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="register-name">Name</FieldLabel>
                    <Input
                      {...field}
                      id="register-name"
                      type="text"
                      placeholder="Your name"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="register-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="register-email"
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
                    <FieldLabel htmlFor="register-password">
                      Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="register-password"
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
            form="register-form"
            className="mt-4 w-full"
            disabled={isPending}
          >
            {isPending ? "Creating account..." : "Create account"}
          </Button>
          <p className="mt-4 text-center text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-foreground underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
