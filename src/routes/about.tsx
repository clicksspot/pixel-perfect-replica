import { createFileRoute } from "@tanstack/react-router";
import { StaticPage, seo } from "@/components/site/StaticPage";

export const Route = createFileRoute("/about")({
  head: () => seo("About ClicksSpot — The trusted marketplace for online businesses", "ClicksSpot connects buyers and sellers of websites, apps and online businesses with transparent escrow."),
  component: AboutPage,
});

function AboutPage() {
  return (
    <StaticPage eyebrow="About us" title="We make buying and selling online businesses safe." sections={[
    { heading: "Our mission", body: <p>{"Digital businesses change hands every day, but trust is often missing. ClicksSpot pairs vetted listings with a manual escrow process so both sides know exactly where the money is at every step."}</p> },
    { heading: "How we review", body: <p>{"Every listing is checked by our team before it goes live. Sellers who verify their identity earn a Verified Seller badge."}</p> },
    { heading: "Who we serve", body: <p>{"First-time buyers, portfolio investors, indie founders and agencies — anyone buying or selling a website, SaaS, app, domain or newsletter."}</p> }
    ]} />
  );
}
