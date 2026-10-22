import { createFileRoute } from "@tanstack/react-router";
import { StaticPage, seo } from "@/components/site/StaticPage";

export const Route = createFileRoute("/fees")({
  head: () => seo("Fees — ClicksSpot", "Simple pricing: free to list, 10% fee only when your deal completes."),
  component: FeesPage,
});

function FeesPage() {
  return (
    <StaticPage eyebrow="Pricing" title="Free to list. 10% only when you sell." sections={[
    { heading: "Sellers", body: <p>{"Creating and publishing listings is free. When a deal completes, a 10% platform fee is deducted from the sale price before payout. Example: on a $10,000 sale you receive $9,000."}</p> },
    { heading: "Buyers", body: <p>{"Buyers pay the agreed price with no extra marketplace fee. Network fees from your wallet or exchange are your own."}</p> },
    { heading: "Refunds", body: <p>{"If a deal is cancelled before transfer or a dispute ends in the buyer"s favour, the buyer is refunded per our Refund & Dispute Policy."}</p> }
    ]} />
  );
}
