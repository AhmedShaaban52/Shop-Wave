import { useAuth } from "@/context/authContext";
import { useCartStore } from "@/lib/store/cartStore";
import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react";

const CartBadge = () => {
    const { user } = useAuth();

    const cartItems = useCartStore((s) => s.items);
    const fetchCart = useCartStore((s) => s.fetchCart);
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    useEffect(() => {
        if (user?.id) {
            fetchCart(user.id);
        }
    }, [user?.id, fetchCart]);
    return (
        <Link href="/cart" className="relative p-2 text-slate-600 hover:text-sky-600 transition-colors cursor-pointer">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
                <span className="absolute top-1 right-0 bg-sky-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                </span>
            )}
        </Link>
    )
}

export default CartBadge