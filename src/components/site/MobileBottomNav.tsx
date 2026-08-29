import { Link } from "@tanstack/react-router";
import { Home, Store, Heart, User, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";

export function MobileBottomNav() {
  const { count, setOpen } = useCart();
  const { count: wishCount } = useWishlist();
  const item = "group flex flex-col items-center justify-center gap-[4px] flex-1 py-3 text-[10px] font-medium tracking-wide uppercase text-[#6B6257] hover:text-[#D97706] min-h-[64px] transition-colors";
  const activeItem = item + " !text-[#D97706] font-bold";
  
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/85 backdrop-blur-xl border-t border-[#2B2118]/5 shadow-[0_-8px_32px_rgba(43,33,24,0.06)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch px-1">
        <Link to="/" className={item} activeProps={{ className: activeItem }} activeOptions={{ exact: true }}>
          <Home className="size-5 md:size-6 stroke-[1.5] group-active:scale-90 transition-transform duration-200" aria-hidden /><span>Home</span>
        </Link>
        <Link to="/shop" className={item} activeProps={{ className: activeItem }}>
          <Store className="size-5 md:size-6 stroke-[1.5] group-active:scale-90 transition-transform duration-200" aria-hidden /><span>Shop</span>
        </Link>
        <Link to="/wishlist" className={item + " relative"} activeProps={{ className: activeItem }}>
          <div className="relative">
            <Heart className="size-5 md:size-6 stroke-[1.5] group-active:scale-90 transition-transform duration-200" aria-hidden />
            {wishCount > 0 && <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#D97706] text-white text-[9px] font-bold flex items-center justify-center shadow-sm">{wishCount}</span>}
          </div>
          <span>Wishlist</span>
        </Link>
        <Link to="/account" className={item} activeProps={{ className: activeItem }}>
          <User className="size-5 md:size-6 stroke-[1.5] group-active:scale-90 transition-transform duration-200" aria-hidden /><span>Account</span>
        </Link>
        <button type="button" onClick={() => setOpen(true)} className={item + " relative"} aria-label="Open cart">
          <div className="relative">
            <ShoppingCart className="size-5 md:size-6 stroke-[1.5] group-active:scale-90 transition-transform duration-200" aria-hidden />
            {count > 0 && <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#D97706] text-white text-[9px] font-bold flex items-center justify-center shadow-sm">{count}</span>}
          </div>
          <span>Cart</span>
        </button>
      </div>
    </nav>
  );
}
