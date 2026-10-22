import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { LayoutGrid, List, SearchX, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { ListingCard, ListingCardSkeleton } from "@/components/site/ListingCard";
import { browseQuery, categoriesQuery, PAGE_SIZE, type BrowseFilters } from "@/lib/listings";
import { seo } from "@/components/site/StaticPage";

const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minRevenue: z.coerce.number().optional(),
  minProfit: z.coerce.number().optional(),
  minTraffic: z.coerce.number().optional(),
  minAge: z.coerce.number().optional(),
  monetization: z.string().optional(),
  tech: z.string().optional(),
  country: z.string().optional(),
  sort: z.enum(["newest", "price_asc", "price_desc", "revenue", "profit"]).optional(),
  page: z.coerce.number().optional(),
});

export const Route = createFileRoute("/browse")({
  validateSearch: searchSchema,
  head: () => seo("Browse listings — ClicksSpot", "Search websites, SaaS, apps, domains and newsletters for sale. Filter by price, revenue, profit, traffic and more."),
  component: Browse,
});

const ALL = "__all";
const monetizations = ["Affiliate", "Display Ads", "Subscriptions", "Product sales", "Sponsorships", "In-app purchases", "Job listings"];
const techs = ["WordPress", "Shopify", "Next.js", "Laravel", "React Native", "Flutter", "Webflow"];

function Filters({ f, set }: { f: BrowseFilters; set: (p: Partial<BrowseFilters>) => void }) {
  const cats = useQuery(categoriesQuery());
  const num = (k: keyof BrowseFilters, label: string) => (
    <div className="space-y-1.5">
      <Label htmlFor={k} className="text-xs">{label}</Label>
      <Input id={k} type="number" min={0} defaultValue={(f[k] as number | undefined) ?? ""} onBlur={(e) => set({ [k]: e.target.value ? Number(e.target.value) : undefined })} />
    </div>
  );
  const sel = (k: "category" | "monetization" | "tech", label: string, opts: [string, string][]) => (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Select value={(f[k] as string) ?? ALL} onValueChange={(v) => set({ [k]: v === ALL ? undefined : v })}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Any</SelectItem>
          {opts.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
  return (
    <div className="space-y-4">
      {sel("category", "Category", (cats.data ?? []).map((c) => [c.slug, c.name]))}
      <div className="grid grid-cols-2 gap-2">{num("minPrice", "Min price $")}{num("maxPrice", "Max price $")}</div>
      {num("minRevenue", "Min monthly revenue $")}
      {num("minProfit", "Min monthly profit $")}
      {num("minTraffic", "Min monthly visitors")}
      {num("minAge", "Min age (months)")}
      {sel("monetization", "Monetization", monetizations.map((m) => [m, m]))}
      {sel("tech", "Tech stack", techs.map((t) => [t, t]))}
      <div className="space-y-1.5">
        <Label htmlFor="country" className="text-xs">Country</Label>
        <Input id="country" defaultValue={f.country ?? ""} onBlur={(e) => set({ country: e.target.value || undefined })} />
      </div>
    </div>
  );
}

function Browse() {
  const f = Route.useSearch();
  const navigate = useNavigate({ from: "/browse" });
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const set = (p: Partial<BrowseFilters>) => navigate({ search: (prev) => ({ ...prev, ...p, page: undefined }) });
  const { data, isLoading } = useQuery({ ...browseQuery(f), placeholderData: keepPreviousData });
  const page = f.page ?? 1;
  const pages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  return (
    <div className="container-page py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl">Browse listings</h1>
          <p className="mt-1 text-muted-foreground">{data ? `${data.total} businesses for sale` : "Loading…"}</p>
        </div>
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); set({ q: (new FormData(e.currentTarget).get("q") as string) || undefined }); }}>
          <Input name="q" defaultValue={f.q ?? ""} placeholder="Search…" aria-label="Search" className="w-56" />
          <Button type="submit">Search</Button>
        </form>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden rounded-xl border bg-card p-5 shadow-soft lg:block lg:self-start">
          <Filters f={f} set={set} />
          <Button variant="ghost" className="mt-4 w-full" onClick={() => navigate({ search: {} })}>Clear filters</Button>
        </aside>
        <div>
          <div className="mb-5 flex items-center justify-between gap-2">
            <Sheet>
              <SheetTrigger asChild><Button variant="outline" size="sm" className="lg:hidden"><SlidersHorizontal className="size-4" /> Filters</Button></SheetTrigger>
              <SheetContent side="left" className="overflow-y-auto"><SheetTitle>Filters</SheetTitle><div className="mt-4"><Filters f={f} set={set} /></div></SheetContent>
            </Sheet>
            <div className="ml-auto flex items-center gap-2">
              <Select value={f.sort ?? "newest"} onValueChange={(v) => set({ sort: v as BrowseFilters["sort"] })}>
                <SelectTrigger className="w-44" aria-label="Sort"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price_asc">Price: low to high</SelectItem>
                  <SelectItem value="price_desc">Price: high to low</SelectItem>
                  <SelectItem value="revenue">Highest revenue</SelectItem>
                  <SelectItem value="profit">Highest profit</SelectItem>
                </SelectContent>
              </Select>
              <Button variant={layout === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => setLayout("grid")} aria-label="Grid view"><LayoutGrid className="size-4" /></Button>
              <Button variant={layout === "list" ? "secondary" : "ghost"} size="icon" onClick={() => setLayout("list")} aria-label="List view"><List className="size-4" /></Button>
            </div>
          </div>
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <ListingCardSkeleton key={i} />)}</div>
          ) : data && data.items.length === 0 ? (
            <div className="rounded-xl border border-dashed p-16 text-center">
              <SearchX className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 font-medium">No listings match these filters</p>
              <Button variant="link" onClick={() => navigate({ search: {} })}>Clear filters</Button>
            </div>
          ) : (
            <div className={layout === "grid" ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-4"}>
              {data?.items.map((l) => <ListingCard key={l.id} l={l} layout={layout} />)}
            </div>
          )}
          {pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => navigate({ search: (p) => ({ ...p, page: page - 1 }) })}>Previous</Button>
              <span className="text-sm text-muted-foreground">Page {page} of {pages}</span>
              <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => navigate({ search: (p) => ({ ...p, page: page + 1 }) })}>Next</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
