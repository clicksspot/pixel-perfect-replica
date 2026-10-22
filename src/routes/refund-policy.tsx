import { createFileRoute } from "@tanstack/react-router";
import { StaticPage, seo } from "@/components/site/StaticPage";

export const Route = createFileRoute("/refund-policy")({
  head: () => seo("Refund & Dispute Policy — ClicksSpot", "How refunds, cancellations and disputes are handled on ClicksSpot."),
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
    <StaticPage eyebrow="Legal" title="Refund & Dispute Policy" sections={[
    { heading: "Before transfer", body: <p>{"If a deal is cancelled before the seller starts the transfer, the buyer receives a full refund."}</p> },
    { heading: "Expired payment", body: <p>{"Deals without payment before the deadline expire automatically. No funds are involved."}</p> },
    { heading: "Disputes", body: <p>{"A buyer may reject a transfer with a reason and evidence during the review window. Our team reviews both sides and may release funds to the seller, refund the buyer or split the amount."}</p> },
    { heading: "Timing", body: <p>{"Refunds are sent to the original payment wallet, typically within 3 business days of a decision."}</p> }
    ]} />
  );
}
