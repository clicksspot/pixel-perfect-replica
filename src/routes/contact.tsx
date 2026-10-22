import { createFileRoute } from "@tanstack/react-router";
import { StaticPage, seo } from "@/components/site/StaticPage";

export const Route = createFileRoute("/contact")({
  head: () => seo("Contact ClicksSpot", "Get in touch with the ClicksSpot team for support, partnerships or dispute help."),
  component: ContactPage,
});

function ContactPage() {
  return (
    <StaticPage eyebrow="Contact" title="We usually reply within one business day." sections={[
    { heading: "Support", body: <p>{"Email support@clicksspot.com for help with listings, offers or deals."}</p> },
    { heading: "Disputes", body: <p>{"If you have an active dispute, reply inside your deal page so evidence stays in one place."}</p> },
    { heading: "Partnerships", body: <p>{"Brokers and agencies can reach us at partners@clicksspot.com."}</p> }
    ]} />
  );
}
