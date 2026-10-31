import React, { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { fetchAnnouncements, type AnnouncementItem } from "@/lib/homepage-cms.functions";

const fallbackMessages = [
  <span key="1" className="inline-flex items-center gap-2">
    <span className="shrink-0">🚚</span>
    <span className="text-white font-bold">Free Delivery on orders above ₹1500</span>
  </span>,
  <span key="2" className="inline-flex items-center gap-2">
    <span className="shrink-0">🍯</span>
    <span className="text-white font-bold">Up to 24% OFF All Honey + Up to 10% Off on Prepaid</span>
  </span>,
];

export function TopBar() {
  const [items, setItems] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchAnnouncements().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const renderMessage = (item: AnnouncementItem, idx: number, isClone = false) => {
    const content = (
      <span
        key={`db-${item.id}-${idx}${isClone ? "-clone" : ""}`}
        className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        {item.icon && <span className="shrink-0">{item.icon}</span>}
        <span className="text-white font-bold">{item.text}</span>
      </span>
    );

    if (item.link) {
      if (item.link.startsWith("http")) {
        return (
          <a
            href={item.link}
            target={item.open_in_new_tab ? "_blank" : "_self"}
            rel="noreferrer"
            tabIndex={isClone ? -1 : undefined}
            key={`db-link-${item.id}-${idx}${isClone ? "-clone" : ""}`}
          >
            {content}
          </a>
        );
      }
      return (
        <Link
          to={item.link as any}
          target={item.open_in_new_tab ? "_blank" : undefined}
          tabIndex={isClone ? -1 : undefined}
          key={`db-link-${item.id}-${idx}${isClone ? "-clone" : ""}`}
        >
          {content}
        </Link>
      );
    }
    return content;
  };

  const activeMessages =
    items.length > 0
      ? items.map((item, idx) => renderMessage(item, idx, false))
      : loading
        ? []
        : fallbackMessages;

  const cloneMessages =
    items.length > 0
      ? items.map((item, idx) => renderMessage(item, idx, true))
      : loading
        ? []
        : fallbackMessages;

  const loopGroup = Array(12).fill(activeMessages).flat();
  const cloneGroup = Array(12).fill(cloneMessages).flat();

  if (activeMessages.length === 0) return null;

  return (
    <div
      className="bg-announcement w-full max-w-[100vw] text-white border-b border-white/10 py-2.5 px-4 text-xs sm:text-sm font-bold tracking-wide select-none overflow-hidden relative flex items-center"
      role="region"
      aria-label="Announcement bar"
    >
      <div className="flex w-max items-center animate-ticker" style={{ animationDuration: "300s" }}>
        {/* First Half (0% to -50% translation area) */}
        <div className="flex items-center shrink-0">
          {loopGroup.map((msg, idx) => (
            <React.Fragment key={`half-1-${idx}`}>
              <div className="px-5 sm:px-7 whitespace-nowrap">{msg}</div>
              <span className="text-white font-bold select-none px-1">•</span>
            </React.Fragment>
          ))}
        </div>

        {/* Second Half (Exact clone for seamless looping, non-focusable for screen reader safety) */}
        <div className="flex items-center shrink-0" aria-hidden="true">
          {cloneGroup.map((msg, idx) => (
            <React.Fragment key={`half-2-${idx}`}>
              <div className="px-5 sm:px-7 whitespace-nowrap">{msg}</div>
              <span className="text-white font-bold select-none px-1">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
