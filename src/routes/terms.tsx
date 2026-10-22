import { createFileRoute } from "@tanstack/react-router";
import { StaticPage, seo } from "@/components/site/StaticPage";

export const Route = createFileRoute("/terms")({
  head: () => seo("Terms of Service — ClicksSpot", "The terms that govern using the ClicksSpot marketplace."),
  component: TermsPage,
});

function TermsPage() {
  return (
    <StaticPage eyebrow="Legal" title="Terms of Service" sections={[
    { heading: "Accounts", body: <p>{"You must provide accurate information and keep your login secure. One person may hold one account, which can be used to buy and sell."}</p> },
    { heading: "Listings", body: <p>{"Sellers must own what they list and describe it truthfully. We may reject or remove any listing."}</p> },
    { heading: "Escrow", body: <p>{"All transactions started on ClicksSpot must be completed through our escrow. Taking a deal off-platform may lead to suspension."}</p> },
    { heading: "Fees", body: <p>{"A platform fee (currently 10%) applies to completed deals."}</p> },
    { heading: "Liability", body: <p>{"ClicksSpot is a marketplace and escrow agent. We do not guarantee the future performance of any business sold."}</p> }
    ]} />
  );
}
