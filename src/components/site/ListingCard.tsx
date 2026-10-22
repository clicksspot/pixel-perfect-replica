import { Link } from "@tanstack/react-router";
import { BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { type Listing, usd, compact, ageLabel } from "@/lib/listings";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  if (status === "under_offer") return <Badge variant="secondary">Under offer</Badge>;
  if (status === "sold") return <Badge variant="outline">Sold</Badge>;
  return null;
}

export function ListingCard({ l, layout = "grid" }: { l: Listing; layout?: "grid" | "list" }) {
  return (
    <Link
      to="/listings/$slug"
      params={{ slug: l.slug }}
      className={cn(
        "group overflow-hidden rounded-xl border bg-card shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated",
        layout === "list" && "flex flex-col sm:flex-row",
      )}
    >
      <div className={cn("relative aspect-[16/10] overflow-hidden bg-muted", layout === "list" && "sm:aspect-auto sm:w-64 sm:shrink-0")}>
        {l.cover_image && (
          <img src={l.cover_image} alt={l.title} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105" />
        )}
        <div className="absolute left-3 top-3 flex gap-1.5">
          {l.category && <Badge className="bg-background/90 text-foreground hover:bg-background/90">{l.category.name}</Badge>}
          <StatusBadge status={l.status} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1.5">
          <h3 className="font-sans text-base font-semibold">{l.title}</h3>
          {l.is_verified && <BadgeCheck className="size-4 text-primary" aria-label="Verified" />}
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{l.tagline}</p>
        <dl className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <div><dt className="text-muted-foreground">Revenue/mo</dt><dd className="font-medium">{usd(l.monthly_revenue)}</dd></div>
          <div><dt className="text-muted-foreground">Profit/mo</dt><dd className="font-medium">{usd(l.monthly_profit)}</dd></div>
          <div><dt className="text-muted-foreground">{l.monthly_traffic ? "Traffic" : "Age"}</dt><dd className="font-medium">{l.monthly_traffic ? compact(l.monthly_traffic) : ageLabel(l.age_months)}</dd></div>
        </dl>
        <div className="mt-auto flex items-end justify-between pt-5">
          <div>
            <div className="text-xs text-muted-foreground">Asking price</div>
            <div className="font-display text-2xl text-primary">{usd(l.asking_price)}</div>
          </div>
          <span className="text-xs text-muted-foreground">{l.seller_country}</span>
        </div>
      </div>
    </Link>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Skeleton className="aspect-[16/10] rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-8 w-1/3" />
      </div>
    </div>
  );
}
