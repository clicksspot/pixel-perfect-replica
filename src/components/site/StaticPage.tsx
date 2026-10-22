import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, intro }: { eyebrow?: string | undefined; title: string; intro?: string | undefined }) {
  return (
    <section className="bg-hero text-forest-foreground">
      <div className="container-page py-16 md:py-20">
        {eyebrow && <p className="text-sm font-medium uppercase tracking-widest opacity-70">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl text-4xl md:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-lg opacity-80">{intro}</p>}
      </div>
    </section>
  );
}

export function StaticPage({ eyebrow, title, intro, sections }: {
  eyebrow?: string | undefined; title: string; intro?: string | undefined;
  sections: { heading: string; body: ReactNode }[];
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} intro={intro} />
      <div className="container-page max-w-3xl space-y-10 py-14">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-2xl">{s.heading}</h2>
            <div className="mt-3 space-y-3 leading-relaxed text-muted-foreground">{s.body}</div>
          </section>
        ))}
      </div>
    </>
  );
}

export const seo = (title: string, description: string) => ({
  meta: [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});
