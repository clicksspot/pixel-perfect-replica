import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { seo } from "@/components/site/StaticPage";

export const Route = createFileRoute("/auth")({
  validateSearch: z.object({ mode: z.enum(["signin", "signup"]).optional() }),
  head: () => seo("Sign in or create an account — ClicksSpot", "Sign in to ClicksSpot to buy, sell and manage escrow deals."),
  component: AuthPage,
});

const signupSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters").max(72),
});

function AuthPage() {
  const { mode: initial } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">(initial ?? "signin");
  const [role, setRole] = useState("both");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setBusy(true);
    try {
      if (mode === "signup") {
        const p = signupSchema.safeParse(fd);
        if (!p.success) { toast.error(p.error.issues[0]?.message ?? "Invalid input"); return; }
        const { error } = await supabase.auth.signUp({
          email: p.data.email, password: p.data.password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: p.data.full_name, account_type: role } },
        });
        if (error) { toast.error(error.message); return; }
        setSent(p.data.email);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: fd["email"] ?? "", password: fd["password"] ?? "" });
        if (error) { toast.error(error.message); return; }
        toast.success("Welcome back");
        navigate({ to: "/account" });
      }
    } finally { setBusy(false); }
  };

  if (sent) return (
    <div className="container-page max-w-md py-24 text-center">
      <MailCheck className="mx-auto size-10 text-primary" />
      <h1 className="mt-4 text-3xl">Check your email</h1>
      <p className="mt-2 text-muted-foreground">We sent a confirmation link to {sent}. Click it to activate your account.</p>
    </div>
  );

  return (
    <div className="container-page grid max-w-md py-16">
      <div className="rounded-2xl border bg-card p-8 shadow-elevated">
        <h1 className="text-3xl">{mode === "signup" ? "Create your account" : "Welcome back"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{mode === "signup" ? "Buy and sell with escrow protection." : "Sign in to continue."}</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <div className="space-y-1.5"><Label htmlFor="full_name">Full name</Label><Input id="full_name" name="full_name" required /></div>
          )}
          <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" autoComplete="email" required /></div>
          <div className="space-y-1.5">
            <div className="flex justify-between"><Label htmlFor="password">Password</Label>
              {mode === "signin" && <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>}
            </div>
            <Input id="password" name="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} required />
          </div>
          {mode === "signup" && (
            <div className="space-y-2">
              <Label>I want to</Label>
              <RadioGroup value={role} onValueChange={setRole} className="grid grid-cols-3 gap-2">
                {([["buyer", "Buy"], ["seller", "Sell"], ["both", "Both"]] as const).map(([v, l]) => (
                  <Label key={v} htmlFor={`r-${v}`} className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 has-[:checked]:border-primary has-[:checked]:bg-accent">
                    <RadioGroupItem id={`r-${v}`} value={v} /> {l}
                  </Label>
                ))}
              </RadioGroup>
            </div>
          )}
          <Button type="submit" className="w-full" disabled={busy}>{busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}</Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signup" ? "Already have an account?" : "New to ClicksSpot?"}{" "}
          <button className="font-medium text-primary hover:underline" onClick={() => setMode(mode === "signup" ? "signin" : "signup")}>
            {mode === "signup" ? "Sign in" : "Create one"}
          </button>
        </p>
      </div>
    </div>
  );
}
