import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/admin/ui";
import { FileText, Store, ChevronRight } from "lucide-react";
import { z } from "zod";

const pagesSearchSchema = z.object({
  group: z.enum(["info", "b2b"]).catch("info"),
});

export const Route = createFileRoute("/admin/pages")({
  validateSearch: pagesSearchSchema,
  component: AdminPagesGroup,
});

const PAGE_GROUPS = {
  info: {
    title: "Information Pages",
    subtitle: "Manage content for story, contact, and informational sections.",
    icon: FileText,
    pages: [
      { slug: "our-story", title: "Our Story", desc: "The journey, the founder, and the farm." },
      { slug: "contact", title: "Contact Us", desc: "Addresses, phone numbers, and maps." },
      { slug: "bee-farming", title: "Bee Farming", desc: "Imagery and stats about beekeeping practices." },
    ],
  },
  b2b: {
    title: "B2B & Partnerships",
    subtitle: "Manage bulk orders, corporate gifting, and private label content.",
    icon: Store,
    pages: [
      { slug: "bulk-orders", title: "Bulk Orders", desc: "Wholesale supplies and bulk purchasing." },
      { slug: "corporate-gifting", title: "Corporate Gifting", desc: "Corporate gifting solutions and features." },
      { slug: "private-label", title: "Private Label", desc: "OEM and private label manufacturing." },
      { slug: "become-a-partner", title: "Become a Partner", desc: "Partnership programs and benefits." },
    ],
  },
};

function AdminPagesGroup() {
  const { group } = Route.useSearch();
  const config = PAGE_GROUPS[group];
  const Icon = config.icon;

  return (
    <div>
      <PageHeader 
        title={config.title} 
        subtitle={config.subtitle} 
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {config.pages.map((p) => (
          <Link key={p.slug} to={`/admin/pages/${p.slug}` as any} className="block group">
            <Card className="p-6 hover:border-gold-deep/50 hover:shadow-lg transition-all h-full flex flex-col justify-between group-hover:bg-cream/20">
              <div>
                <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center text-brand-orange mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="size-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-forest-dark mb-2 group-hover:text-brand-orange transition-colors">
                  {p.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {p.desc}
                </p>
              </div>
              <div className="mt-6 flex items-center text-sm font-semibold text-brand-orange group-hover:gap-2 transition-all">
                Manage Page <ChevronRight className="size-4 ml-1" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
