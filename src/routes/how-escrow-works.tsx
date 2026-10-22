import { createFileRoute } from "@tanstack/react-router";
import { StaticPage, seo } from "@/components/site/StaticPage";

export const Route = createFileRoute("/how-escrow-works")({
  head: () => seo("How Escrow Works — ClicksSpot", "Step-by-step guide to the ClicksSpot escrow process, from payment to payout."),
  component: HowEscrowWorksPage,
});

function HowEscrowWorksPage() {
  return (
    <StaticPage eyebrow="Escrow" title="Your money is held safely until the transfer is approved." sections={[
    { heading: "1. Awaiting payment", body: <p>{"When a seller accepts an offer, a deal is created. The buyer sees the price, the platform fee breakdown and our Binance Pay / USDT payment instructions with a unique deal reference code."}</p> },
    { heading: "2. Payment submitted", body: <p>{"The buyer pays and submits the transaction ID and a screenshot."}</p> },
    { heading: "3. Payment verified", body: <p>{"Our team manually verifies the payment and marks it received. The seller is notified that funds are held in escrow."}</p> },
    { heading: "4. Seller transfers", body: <p>{"The seller delivers the domain, credentials, files and instructions through a secure delivery form."}</p> },
    { heading: "5. Buyer review", body: <p>{"The buyer inspects everything and approves or rejects with evidence. With no response, the deal auto-approves after the review window (5 days by default)."}</p> },
    { heading: "6. Payout", body: <p>{"We keep the platform fee (10%) and send the remaining 90% to the seller, recording the payout transaction. The deal completes and both sides leave reviews."}</p> },
    { heading: "If something goes wrong", body: <p>{"A rejection opens a dispute. Our team reviews both sides' evidence and decides to release to the seller, refund the buyer, or split. Every decision is logged."}</p> }
    ]} />
  );
}
