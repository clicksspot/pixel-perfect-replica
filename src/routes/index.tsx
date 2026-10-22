import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AtSign, Cloud, Globe, Lock, Mail, Search, ShieldCheck, ShoppingBag, Smartphone, Star, Wallet, FileCheck, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ListingCard, ListingCardSkeleton } from "@/components/site/ListingCard";
import { categoriesQuery, featuredQuery } from "@/lib/listings";
import { seo } from "@/components/site/StaticPage";
import { faqs } from "@/lib/content";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => seo("ClicksSpot — Buy & sell websites, apps and online businesses", "A trusted marketplace for websites, SaaS, apps, domains and newsletters. Every deal protected by manual escrow."),
  component: Index,
});

const icons: Record<string, typeof Globe> = { Globe, Cloud, ShoppingBag, Smartphone, AtSign, Mail };

const steps = [
  { icon: Search, title: "Find or list", text: "Browse vetted listings or publish yours after a quick review." },
  { icon: Handshake, title: "Agree on a price", text: "Make offers, counter and message the other side safely." },
  { icon: Lock, title: "Pay into escrow", text: "Buyer pays ClicksSpot. Funds are held until transfer is approved." },
  { icon: Wallet, title: "Transfer & payout", text: "Seller hands over assets, buyer approves, seller gets paid." },
];

const testimonials = [
  { name: "Hannah P.", role: "Bought a SaaS", text: "The escrow steps made a six-figure purchase feel calm. I always knew where my money was." },
  { name: "Omar S.", role: "Sold 3 websites", text: "Clean process, serious buyers, and payout arrived the day after approval." },
  { name: "Lucas M.", role: "Bought a newsletter", text: "Verified metrics and a clear timeline. Exactly what this market needed." },
];

function Index() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const cats = useQuery(categoriesQuery());
  const featured = useQuery(featuredQuery());

  return (
    <>
      <section className="relative overflow-hidden bg-hero text-forest-foreground">
        <div className="container-page grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-forest-foreground/20 px-3 py-1 text-xs">
              <ShieldCheck className="size-3.5" /> Every deal protected by escrow
            </p>
            <h1 className="mt-5 text-4xl leading-tight md:text-6xl">Buy and sell online businesses with confidence</h1>
            <p className="mt-5 max-w-lg text-lg opacity-80">Websites, SaaS, apps, domains and newsletters — verified listings and a transparent escrow flow.</p>
            <form
              className="mt-8 flex max-w-lg gap-2 rounded-xl bg-card p-2 shadow-elevated"
              onSubmit={(e) => { e.preventDefault(); navigate({ to: "/browse", search: { q: q || undefined } }); }}
            >
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search SaaS, blogs, domains…" className="border-0 text-foreground shadow-none focus-visible:ring-0" aria-label="Search listings" />
              <Button type="submit"><Search className="size-4" /> Search</Button>
            </form>
          </div>
          <img src={hero} alt="Dashboards secured by an escrow shield" width={1280} height={960} className="rounded-2xl shadow-elevated" />
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="text-3xl">Browse by category</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {(cats.data ?? []).map((c) => {
            const Icon = icons[c.icon ?? "Globe"] ?? Globe;
            return (
              <Link key={c.id} to="/browse" search={{ category: c.slug }} className="rounded-xl border bg-card p-5 shadow-soft transition hover:border-primary">
                <Icon className="size-6 text-primary" />
                <div className="mt-3 font-medium">{c.name}</div>
                <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.description}</div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-mint py-16">
        <div className="container-page">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl">Featured listings</h2>
            <Link to="/browse" className="text-sm font-medium text-primary hover:underline">View all</Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.isLoading
              ? Array.from({ length: 3 }).map((_, i) => <ListingCardSkeleton key={i} />)
              : featured.data?.map((l) => <ListingCard key={l.id} l={l} />)}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="text-center text-3xl">How it works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-xl border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-accent text-primary"><s.icon className="size-5" /></span>
                <span className="text-xs font-semibold text-muted-foreground">STEP {i + 1}</span>
              </div>
              <h3 className="mt-4 font-sans text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-forest text-forest-foreground">
        <div className="container-page grid gap-10 py-16 md:grid-cols-2">
          <div>
            <h2 className="text-3xl">Escrow that protects both sides</h2>
            <p className="mt-4 opacity-80">The buyer's payment is held by ClicksSpot and only released to the seller after the buyer confirms the assets were received. If something goes wrong, our team reviews evidence and decides fairly.</p>
            <Button asChild variant="secondary" className="mt-6"><Link to="/how-escrow-works">See the escrow process</Link></Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[["$4.2M+", "Escrowed to date"], ["1,800+", "Completed deals"], ["98%", "Deals without dispute"], ["< 24h", "Payment verification"]].map(([v, l]) => (
              <div key={l} className="rounded-xl border border-forest-foreground/15 p-5">
                <div className="font-display text-3xl">{v}</div>
                <div className="mt-1 text-sm opacity-70">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="text-center text-3xl">Trusted by buyers and sellers</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="rounded-xl border bg-card p-6 shadow-soft">
              <div className="flex gap-0.5 text-warning">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-4 fill-current" />)}</div>
              <blockquote className="mt-4 text-sm">"{t.text}"</blockquote>
              <figcaption className="mt-4 text-sm"><span className="font-semibold">{t.name}</span> · <span className="text-muted-foreground">{t.role}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="bg-mint py-16">
        <div className="container-page max-w-3xl">
          <h2 className="text-center text-3xl">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="mt-8">
            {faqs.slice(0, 5).map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="rounded-2xl bg-hero p-10 text-center text-forest-foreground md:p-14">
          <FileCheck className="mx-auto size-8 opacity-80" />
          <h2 className="mt-4 text-3xl md:text-4xl">Ready to sell your online business?</h2>
          <p className="mx-auto mt-3 max-w-xl opacity-80">List for free. Pay only a 10% fee when your deal completes.</p>
          <Button asChild size="lg" variant="secondary" className="mt-6"><Link to="/auth" search={{ mode: "signup" }}>Create your listing</Link></Button>
        </div>
      </section>
    </>
  );
}
