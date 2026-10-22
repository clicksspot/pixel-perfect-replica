import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BadgeCheck, Eye, Flag, Heart, Lock, Share2, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ListingCard, StatusBadge } from "@/components/site/ListingCard";
import { listingQuery, similarQuery, usd, compact, ageLabel, multiple } from "@/lib/listings";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/listings/$slug")({
  head: ({ params }) => {
    const name = params.slug.split("-").map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" ");
    const title = `${name} for sale — ClicksSpot`;
    const description = `View metrics, revenue and price for ${name}. Buy safely with ClicksSpot escrow.`;
    return {
      meta: [
        { title }, { name: "description", content: description },
        { property: "og:title", content: title }, { property: "og:description", content: description },
        { property: "og:type", content: "product" }, { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ListingPage,
});

function ListingPage() {
  const { slug } = Route.useParams();
  const { data: l, isLoading } = useQuery(listingQuery(slug));
  const similar = useQuery({ ...similarQuery(l?.category?.slug, l?.id ?? ""), enabled: !!l });
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const watch = useQuery({
    queryKey: ["watch", l?.id, user?.id],
    enabled: !!l && !!user,
    queryFn: async () => {
      const { data } = await supabase.from("watchlist").select("listing_id").eq("listing_id", l!.id).maybeSingle();
      return !!data;
    },
  });

  useEffect(() => { if (l?.id) supabase.rpc("increment_listing_view", { _id: l.id }); }, [l?.id]);

  if (isLoading) return <div className="container-page space-y-4 py-10"><Skeleton className="h-10 w-1/2" /><Skeleton className="h-96" /></div>;
  if (!l) return (
    <div className="container-page py-24 text-center">
      <h1 className="text-3xl">Listing not found</h1>
      <Button asChild className="mt-6"><Link to="/browse">Browse listings</Link></Button>
    </div>
  );

  const requireAuth = (msg: string) => {
    if (!user) { toast.info(msg); navigate({ to: "/auth" }); return false; }
    return true;
  };
  const toggleWatch = async () => {
    if (!requireAuth("Sign in to save listings")) return;
    if (watch.data) await supabase.from("watchlist").delete().eq("listing_id", l.id);
    else await supabase.from("watchlist").insert({ listing_id: l.id, user_id: user!.id });
    qc.invalidateQueries({ queryKey: ["watch"] });
    toast.success(watch.data ? "Removed from watchlist" : "Added to watchlist");
  };
  const share = async () => { await navigator.clipboard.writeText(window.location.href); toast.success("Link copied"); };
  const chart = l.revenue_history.map((v, i) => ({ month: `M${i + 1}`, revenue: v }));
  const live = l.status === "approved";

  return (
    <div className="container-page py-10">
      <nav className="text-sm text-muted-foreground"><Link to="/browse" className="hover:underline">Browse</Link> / {l.category?.name}</nav>
      <div className="mt-4 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {l.category && <Badge variant="secondary">{l.category.name}</Badge>}
            {l.is_verified && <Badge className="gap-1"><BadgeCheck className="size-3" /> Verified</Badge>}
            <StatusBadge status={l.status} />
          </div>
          <h1 className="mt-3 text-4xl md:text-5xl">{l.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{l.tagline}</p>
          {l.cover_image && <img src={l.cover_image} alt={l.title} className="mt-6 aspect-video w-full rounded-xl object-cover shadow-soft" />}

          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[["Monthly revenue", usd(l.monthly_revenue)], ["Monthly profit", usd(l.monthly_profit)], ["Monthly traffic", l.monthly_traffic ? compact(l.monthly_traffic) : "—"], ["Age", ageLabel(l.age_months)]].map(([k, v]) => (
              <div key={k} className="rounded-xl border bg-card p-4 shadow-soft"><div className="text-xs text-muted-foreground">{k}</div><div className="mt-1 text-xl font-semibold">{v}</div></div>
            ))}
          </div>

          {chart.length > 0 && (
            <section className="mt-8 rounded-xl border bg-card p-5 shadow-soft">
              <h2 className="text-xl">Revenue, last 6 months</h2>
              <div className="mt-4 h-60">
                <ResponsiveContainer>
                  <AreaChart data={chart}>
                    <defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} /><stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="month" fontSize={12} stroke="var(--color-muted-foreground)" />
                    <YAxis fontSize={12} stroke="var(--color-muted-foreground)" />
                    <Tooltip formatter={(v: number) => usd(v)} />
                    <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" fill="url(#rev)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}

          <section className="mt-8">
            <h2 className="text-2xl">About this business</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">{l.description}</p>
          </section>

          <section className="mt-8 grid gap-6 md:grid-cols-3">
            {[["Monetization", l.monetization], ["Tech stack", l.tech_stack], ["Included in sale", l.included]].map(([k, arr]) => (
              <div key={k as string}><h3 className="font-sans text-sm font-semibold">{k as string}</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">{(arr as string[]).length ? (arr as string[]).map((x) => <Badge key={x} variant="outline">{x}</Badge>) : <span className="text-sm text-muted-foreground">—</span>}</div>
              </div>
            ))}
          </section>

          <div className="mt-8 flex items-start gap-3 rounded-xl border border-dashed bg-mint p-5">
            <Lock className="mt-0.5 size-5 text-primary" />
            <div className="text-sm"><div className="font-medium">Private details hidden</div><p className="text-muted-foreground">The URL, credentials and financial proof are shared once a deal begins.</p></div>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border bg-card p-6 shadow-elevated">
            <div className="text-sm text-muted-foreground">Asking price</div>
            <div className="font-display text-4xl text-primary">{usd(l.asking_price)}</div>
            <div className="mt-1 text-xs text-muted-foreground">{multiple(l)} annual profit multiple</div>
            <div className="mt-5 space-y-2">
              <Button className="w-full" size="lg" disabled={!live} onClick={() => requireAuth("Sign in to make an offer") && toast.info("Offers open in the next update")}>Make an offer</Button>
              {l.buy_now_price && <Button variant="outline" className="w-full" disabled={!live} onClick={() => requireAuth("Sign in to buy") && toast.info("Buy Now opens in the next update")}>Buy now for {usd(l.buy_now_price)}</Button>}
            </div>
            <div className="mt-4 flex justify-between">
              <Button variant="ghost" size="sm" onClick={toggleWatch}><Heart className={watch.data ? "size-4 fill-primary text-primary" : "size-4"} /> {watch.data ? "Saved" : "Watch"}</Button>
              <Button variant="ghost" size="sm" onClick={share}><Share2 className="size-4" /> Share</Button>
              <Button variant="ghost" size="sm" onClick={() => requireAuth("Sign in to report") && toast.success("Report received. Our team will review it.")}><Flag className="size-4" /> Report</Button>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground"><Eye className="size-3.5" /> {l.view_count} views</div>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-soft">
            <div className="text-xs text-muted-foreground">Seller</div>
            <div className="mt-1 font-semibold">{l.seller_name}</div>
            <div className="mt-1 flex items-center gap-1 text-sm"><Star className="size-4 fill-warning text-warning" /> {l.seller_rating} · {l.seller_country}</div>
          </div>
        </aside>
      </div>

      {similar.data && similar.data.length > 0 && (
        <section className="mt-16">
          <h2 className="text-3xl">Similar listings</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{similar.data.map((s) => <ListingCard key={s.id} l={s} />)}</div>
        </section>
      )}
    </div>
  );
}
