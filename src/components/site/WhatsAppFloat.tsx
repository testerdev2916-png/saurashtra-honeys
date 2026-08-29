import { useSiteSettings } from "@/lib/site-settings";
import whatsappLogo from "@/assets/whatsapp-logo.png";

export function WhatsAppFloat() {
  const { whatsapp } = useSiteSettings();
  if (!whatsapp.enabled || !whatsapp.number) return null;
  const href = `https://wa.me/${whatsapp.number.replace(/\D/g, "")}?text=${encodeURIComponent(whatsapp.default_message)}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
      className="fixed z-50 bottom-[100px] md:bottom-6 right-4 md:right-6 w-[56px] h-[56px] md:w-[64px] md:h-[64px] hover:scale-105 transition-transform flex items-center justify-center drop-shadow-lg">
      <img loading="lazy" src={whatsappLogo} alt="WhatsApp" className="w-full h-full object-contain scale-[1.6]" />
    </a>
  );
}
