import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { seo } from "@/components/site/StaticPage";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => seo("My profile — ClicksSpot", "Manage your ClicksSpot profile and payout details."),
  component: Account,
});

const schema = z.object({
  full_name: z.string().trim().max(80),
  country: z.string().trim().max(60),
  bio: z.string().trim().max(600),
  binance_pay_id: z.string().trim().max(40),
  usdt_wallet: z.string().trim().max(100),
});

function Account() {
  const qc = useQueryClient();
  const { data: p, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data, error } = await supabase.from("profiles").select("*").eq("id", u.user!.id).single();
      if (error) throw error;
      return { ...data, email: u.user!.email };
    },
  });
  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    const { error } = await supabase.from("profiles").update(parsed.data).eq("id", p!.id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["me"] });
    toast.success("Profile saved");
  };
  if (isLoading || !p) return <div className="container-page max-w-2xl space-y-4 py-12"><Skeleton className="h-10 w-1/3" /><Skeleton className="h-80" /></div>;
  const f = (name: keyof z.infer<typeof schema>, label: string, area = false) => (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      {area ? <Textarea id={name} name={name} defaultValue={p[name] ?? ""} rows={4} /> : <Input id={name} name={name} defaultValue={p[name] ?? ""} />}
    </div>
  );
  return (
    <div className="container-page max-w-2xl py-12">
      <div className="flex items-center gap-2">
        <h1 className="text-4xl">My profile</h1>
        {p.is_verified_seller && <BadgeCheck className="size-6 text-primary" aria-label="Verified seller" />}
      </div>
      <p className="mt-1 text-muted-foreground">{p.email} · {p.account_type === "both" ? "Buyer & seller" : p.account_type}</p>
      <form onSubmit={save} className="mt-8 space-y-5 rounded-xl border bg-card p-6 shadow-soft">
        {f("full_name", "Full name")}
        {f("country", "Country")}
        {f("bio", "Bio", true)}
        <div className="border-t pt-5">
          <h2 className="text-xl">Payout details</h2>
          <p className="text-sm text-muted-foreground">Where we send your earnings when you sell.</p>
        </div>
        {f("binance_pay_id", "Binance Pay ID")}
        {f("usdt_wallet", "USDT wallet address")}
        <Button type="submit">Save changes</Button>
      </form>
    </div>
  );
}
