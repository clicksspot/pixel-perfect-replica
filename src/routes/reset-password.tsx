import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { seo } from "@/components/site/StaticPage";

export const Route = createFileRoute("/reset-password")({
  head: () => seo("Choose a new password — ClicksSpot", "Set a new password for your ClicksSpot account."),
  component: Reset,
});

function Reset() {
  const navigate = useNavigate();
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const password = new FormData(e.currentTarget).get("password") as string;
    if (password.length < 8) { toast.error("At least 8 characters"); return; }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated");
    navigate({ to: "/account" });
  };
  return (
    <div className="container-page max-w-md py-16">
      <div className="rounded-2xl border bg-card p-8 shadow-elevated">
        <h1 className="text-3xl">New password</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-1.5"><Label htmlFor="password">New password</Label><Input id="password" name="password" type="password" autoComplete="new-password" required /></div>
          <Button type="submit" className="w-full">Update password</Button>
        </form>
      </div>
    </div>
  );
}
