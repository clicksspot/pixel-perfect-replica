import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { seo } from "@/components/site/StaticPage";

export const Route = createFileRoute("/forgot-password")({
  head: () => seo("Reset your password — ClicksSpot", "Request a password reset link for your ClicksSpot account."),
  component: Forgot,
});

function Forgot() {
  const [sent, setSent] = useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email") as string;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    if (error) return toast.error(error.message);
    setSent(true);
  };
  return (
    <div className="container-page max-w-md py-16">
      <div className="rounded-2xl border bg-card p-8 shadow-elevated">
        <h1 className="text-3xl">Forgot password</h1>
        {sent ? <p className="mt-3 text-muted-foreground">If an account exists, a reset link is on its way.</p> : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
            <Button type="submit" className="w-full">Send reset link</Button>
          </form>
        )}
      </div>
    </div>
  );
}
