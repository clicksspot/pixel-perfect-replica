import { createFileRoute } from "@tanstack/react-router";
import { StaticPage, seo } from "@/components/site/StaticPage";

export const Route = createFileRoute("/prohibited-items")({
  head: () => seo("Prohibited Items — ClicksSpot", "Assets and businesses that cannot be listed on ClicksSpot."),
  component: ProhibitedItemsPage,
});

function ProhibitedItemsPage() {
  return (
    <StaticPage eyebrow="Legal" title="What you can't sell on ClicksSpot" sections={[
    { heading: "Illegal content", body: <p>{"Sites or apps involving illegal goods, piracy, malware, or content that violates the law."}</p> },
    { heading: "Stolen or unowned assets", body: <p>{"Anything you do not legally own or have the right to transfer, including hacked accounts."}</p> },
    { heading: "Deceptive businesses", body: <p>{"Scams, pyramid schemes, fake reviews, or traffic and revenue that is fabricated."}</p> },
    { heading: "Restricted categories", body: <p>{"Adult content, gambling without license, weapons, and drugs."}</p> }
    ]} />
  );
}
