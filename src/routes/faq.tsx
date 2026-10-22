import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageHero, seo } from "@/components/site/StaticPage";
import { faqs } from "@/lib/content";

export const Route = createFileRoute("/faq")({
  head: () => seo("FAQ — ClicksSpot", "Answers about escrow, fees, payments, verification and disputes on ClicksSpot."),
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <PageHero eyebrow="Help" title="Frequently asked questions" />
      <div className="container-page max-w-3xl py-14">
        <Accordion type="single" collapsible>
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </>
  );
}
