import { createFileRoute } from "@tanstack/react-router";
import { StaticPage, seo } from "@/components/site/StaticPage";

export const Route = createFileRoute("/privacy")({
  head: () => seo("Privacy Policy — ClicksSpot", "How ClicksSpot collects, uses and protects your personal data."),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <StaticPage eyebrow="Legal" title="Privacy Policy" sections={[
    { heading: "What we collect", body: <p>{"Account details, profile information, verification documents, listing content, messages and transaction records."}</p> },
    { heading: "How we use it", body: <p>{"To run the marketplace, verify users, process escrow, prevent fraud and communicate with you."}</p> },
    { heading: "Storage and security", body: <p>{"Sensitive documents are stored privately and only shared with deal participants and our review team."}</p> },
    { heading: "Your rights", body: <p>{"You can request access to or deletion of your data by contacting support."}</p> }
    ]} />
  );
}
