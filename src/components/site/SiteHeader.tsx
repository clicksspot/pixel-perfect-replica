import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Menu, ShieldCheck, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/browse", label: "Browse" },
  { to: "/how-escrow-works", label: "How Escrow Works" },
  { to: "/fees", label: "Fees" },
  { to: "/about", label: "About" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid size-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground">
        <ShieldCheck className="size-4" />
      </span>
      <span className="font-display text-xl">ClicksSpot</span>
    </Link>
  );
}

export function SiteHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground font-medium" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2"><UserIcon className="size-4" />Account</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild><Link to="/account">My profile</Link></DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex"><Link to="/auth">Sign in</Link></Button>
              <Button asChild size="sm"><Link to="/auth" search={{ mode: "signup" }}>Start selling</Link></Button>
            </>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu"><Menu className="size-5" /></Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="mt-8 flex flex-col gap-2">
                {nav.map((n) => (
                  <Link key={n.to} to={n.to} className="rounded-md px-3 py-2 text-base hover:bg-accent">{n.label}</Link>
                ))}
                <Link to="/faq" className="rounded-md px-3 py-2 text-base hover:bg-accent">FAQ</Link>
                <Link to="/contact" className="rounded-md px-3 py-2 text-base hover:bg-accent">Contact</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
