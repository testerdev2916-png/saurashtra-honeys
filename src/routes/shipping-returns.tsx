import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { StructuredData, breadcrumbLd } from "@/components/site/StructuredData";
import { Truck, RefreshCcw, AlertTriangle, ShieldCheck } from "lucide-react";
import { useSiteSettings } from "@/lib/site-settings";

export const Route = createFileRoute("/shipping-returns")({
  head: () => ({
    meta: [
      {
        title: "Shipping & Returns Policy | Saurashtra Honey",
      },
      {
        name: "description",
        content: "Learn about our shipping options, delivery times, and return/replacement policies for Saurashtra Honey.",
      },
    ],
  }),
  component: ShippingReturnsPage,
});

function ShippingReturnsPage() {
  const settings = useSiteSettings();
  
  return (
    <SiteLayout>
      <StructuredData
        data={breadcrumbLd([
          { name: "Home", url: "/" },
          { name: "Shipping & Returns", url: "/shipping-returns" },
        ])}
      />

      <div className="bg-[#FDFBF7] min-h-screen py-16 sm:py-24">
        <div className="container-page max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <h1 className="font-serif text-[36px] sm:text-[48px] text-[#2B2118] mb-4">
              Shipping & Returns
            </h1>
            <p className="text-[#6B6257] text-[16px]">
              Everything you need to know about delivery and our replacement policies.
            </p>
          </div>

          <div className="space-y-16">
            {/* Shipping Policy */}
            <section className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-[#E6DDCF] reveal">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#E6DDCF]">
                <div className="size-12 rounded-full bg-[#F6EFE3] flex items-center justify-center text-[#D97706]">
                  <Truck size={24} />
                </div>
                <h2 className="font-serif text-[28px] text-[#2B2118]">
                  Shipping & Delivery Policy
                </h2>
              </div>

              <div className="space-y-8 text-[#2B2118]/80 leading-relaxed">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-bold text-[#2B2118] mb-2 uppercase tracking-wide text-sm">Delivery Area</h3>
                    <p>Pan-India Delivery is available.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2B2118] mb-2 uppercase tracking-wide text-sm">Dispatch & Timeline</h3>
                    <p><strong>Dispatch Time:</strong> 1–3 working days after order confirmation.</p>
                    <p><strong>Delivery Time:</strong> Generally 2–10 working days.</p>
                    <p className="text-sm text-[#6B6257] mt-1">*Delivery time may vary depending on courier service and your PIN code.</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-[#2B2118] mb-4 uppercase tracking-wide text-sm">Shipping Charges</h3>
                  <div className="bg-[#FDFBF7] rounded-xl p-6 border border-[#E6DDCF]">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <ShieldCheck className="shrink-0 text-[#D97706] mt-0.5" size={18} />
                        <span><strong>Prepaid Online Orders:</strong> FREE Shipping</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ShieldCheck className="shrink-0 text-[#D97706] mt-0.5" size={18} />
                        <span><strong>Cash on Delivery (COD):</strong> ₹100 Charge</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ShieldCheck className="shrink-0 text-[#D97706] mt-0.5" size={18} />
                        <span><strong>Standard Shipping Charge:</strong> Actual/applicable charge from customer.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-[#2B2118] mb-4 uppercase tracking-wide text-sm">Free Shipping Minimum Order Value</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-5 border border-[#E6DDCF] flex items-center justify-between">
                      <span className="font-medium">Inside Gujarat</span>
                      <span className="font-bold text-[#D97706]">₹{settings?.shipping?.free_shipping_min_gujarat || "1,500"}</span>
                    </div>
                    <div className="bg-white rounded-lg p-5 border border-[#E6DDCF] flex items-center justify-between">
                      <span className="font-medium">Rest of India</span>
                      <span className="font-bold text-[#D97706]">₹{settings?.shipping?.free_shipping_min_india || "2,500"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Return Policy */}
            <section className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-[#E6DDCF] reveal delay-100">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#E6DDCF]">
                <div className="size-12 rounded-full bg-[#F6EFE3] flex items-center justify-center text-[#D97706]">
                  <RefreshCcw size={24} />
                </div>
                <h2 className="font-serif text-[28px] text-[#2B2118]">
                  Return / Replacement Policy
                </h2>
              </div>

              <div className="space-y-6 text-[#2B2118]/80 leading-relaxed">
                <div className="flex gap-4 p-5 rounded-xl bg-[#FFF9F2] border border-[#FBE6CC]">
                  <AlertTriangle className="shrink-0 text-[#D97706]" size={24} />
                  <div>
                    <h3 className="font-bold text-[#2B2118] mb-1">No Returns on Food Products</h3>
                    <p className="text-sm">Since our honey is a consumable food product, generally <strong>we do not accept returns</strong> to maintain the highest standards of safety and hygiene.</p>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="font-bold text-[#2B2118] mb-3 uppercase tracking-wide text-sm">Replacement Conditions</h3>
                  <p className="mb-4">We will provide a replacement in appropriate cases if the product meets any of the following conditions upon delivery:</p>
                  <ul className="list-disc pl-5 space-y-2 mb-6">
                    <li>The bottle is broken or damaged during transit.</li>
                    <li>The product has leaked.</li>
                    <li>A wrong product was delivered to you.</li>
                  </ul>
                  
                  <div className="bg-[#FDFBF7] p-5 rounded-xl border border-[#E6DDCF]">
                    <h4 className="font-bold text-[#2B2118] mb-2">How to claim a replacement:</h4>
                    <p className="text-sm">The customer must inform us within <strong>24 hours of receiving the delivery</strong> along with clear photos or videos of the damaged/wrong product. Please contact our support team at <Link to="/contact" className="text-[#D97706] font-medium hover:underline">our Contact page</Link> to initiate the process.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
