import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

const cols = [
  { title: "Marketplace", links: [["/browse", "Browse listings"], ["/how-escrow-works", "How escrow works"], ["/fees", "Fees"], ["/faq", "FAQ"]] },
  { title: "Company", links: [["/about", "About"], ["/contact", "Contact"]] },
  { title: "Legal", links: [["/terms", "Terms"], ["/privacy", "Privacy"], ["/refund-policy", "Refund & Disputes"], ["/prohibited-items", "Prohibited items"]] },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-forest text-forest-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-gradient-primary"><ShieldCheck className="size-4" /></span>
            <span className="font-display text-xl">ClicksSpot</span>
          </div>
          <p className="mt-4 text-sm opacity-70">Buy and sell websites, apps, domains and online businesses with escrow protection.</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="font-sans text-sm font-semibold">{c.title}</h3>
            <ul className="mt-4 space-y-2 text-sm opacity-75">
              {c.links.map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:opacity-100 hover:underline">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-forest-foreground/10">
        <div className="container-page py-5 text-xs opacity-60">© {new Date().getFullYear()} ClicksSpot. All rights reserved.</div>
      </div>
    </footer>
  );
}
