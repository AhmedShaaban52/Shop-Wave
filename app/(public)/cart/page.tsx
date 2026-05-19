"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowLeft, Shield, Truck, Tag, X } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { calculatePrice } from "@/lib/calculatePrice";
import { useAuth } from "@/context/authContext";
import { ProductCart } from "../_components/ProductCart";
import { toast } from "sonner";
import { createCheckoutSession } from "@/lib/actions/checkoutActions";
import { validateCoupon } from "@/lib/actions/couponActions";
import { useState } from "react";

const CartPage = () => {
    const [couponCode, setCouponCode] = useState("");
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponLoading, setCouponLoading] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    const { items, removeItem } = useCartStore();
    const { user } = useAuth();

    const subtotal = items.reduce((sum, item) => {
        const singleProductPrice = calculatePrice(item as any) ?? parseFloat(item.price as string);
        const validPrice = isNaN(singleProductPrice) ? 0 : singleProductPrice;
        return sum + (validPrice * item.quantity);
    }, 0);

    const tax = subtotal * 0.1;
    const total = subtotal + tax - (Number(couponDiscount) || 0);

    const handleApplyCoupon = async (e?: React.FormEvent | React.KeyboardEvent) => {
        if (e) e.preventDefault(); 

        if (!couponCode.trim()) return;

        setCouponLoading(true);
        try {
            console.log("Client: Sending coupon to server...", couponCode.trim(), subtotal);
            const result = await validateCoupon(couponCode.trim(), subtotal);
            console.log("Client: Received result from server:", result);

            if (result.valid) {
                setCouponDiscount(result.discount!);
                setAppliedCoupon(couponCode.toUpperCase().trim());
                toast.success(`Coupon applied! You save $${result.discount}`);
            } else {
                toast.error(result.error || "Invalid coupon code");
            }
        } catch (error) {
            console.error("Client Error applying coupon:", error);
            toast.error("Something went wrong");
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponCode("");
    };

    const handleCheckout = async () => {
        if (!user) { toast.error("Please login first"); return; }
        setCheckoutLoading(true);
        try {
            const result = await createCheckoutSession(
                items,
                user.id,
                appliedCoupon || undefined,
                couponDiscount || undefined
            );
            if (result?.error) { toast.error(result.error); return; }
            if (result?.url) window.location.href = result.url;
        } catch (err) {
            toast.error("Checkout failed. Please try again.");
        } finally {
            setCheckoutLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#f0f4f8]">
                <ShoppingBag className="w-20 h-20 text-sky-200" />
                <h2 className="text-2xl font-bold text-sky-900">Your cart is empty</h2>
                <Link href="/" className="flex items-center gap-2 bg-sky-700 hover:bg-sky-800 text-white px-6 py-3 rounded-2xl font-semibold transition-all">
                    <ArrowLeft className="w-4 h-4" />
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f0f4f8] px-4 md:px-8 py-10 font-sans">
            <div>
                <div className="mb-8">
                    <Link href="/" className="flex items-center gap-2 text-sky-600 hover:text-sky-800 text-sm font-medium mb-4 transition-colors w-fit">
                        <ArrowLeft className="w-4 h-4" />
                        Continue Shopping
                    </Link>
                    <h1 className="text-4xl font-black text-sky-900 tracking-tight">Shopping Cart</h1>
                    <p className="text-gray-500 mt-1">{items.reduce((s, i) => s + i.quantity, 0)} items</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        {items.map((item) => {
                            const finalPrice = calculatePrice(item) ?? parseFloat(item.price as string);
                            const original = parseFloat(item.price as string);
                            const hasDiscount = calculatePrice(item) !== null;

                            return (
                                <div key={item.id} className="bg-white rounded-2xl p-5 flex gap-5 shadow-sm border border-gray-100">
                                    <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                                        <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-sky-900 text-base leading-tight">{item.name}</h3>
                                                {item.categories?.name && (
                                                    <p className="text-xs text-sky-500 font-medium mt-0.5">{item.categories.name}</p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-sky-700 text-lg">${(finalPrice * item.quantity).toFixed(2)}</p>
                                                {hasDiscount && (
                                                    <p className="text-xs text-gray-400 line-through">${(original * item.quantity).toFixed(2)}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <ProductCart product={item} userId={user!.id} quantity={item.quantity} variant="compact" />
                                            <button
                                                onClick={() => removeItem(item.id, user!.id)}
                                                className="flex items-center gap-1.5 pl-4 text-red-400 hover:text-red-600 text-xs font-medium transition-colors cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1 flex flex-col gap-4 sticky top-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-black text-sky-900 mb-5">Order Summary</h2>

                            {/* Coupon Section */}
                            <div className="mb-5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                                    <Tag className="w-3 h-3 inline mr-1" />
                                    Coupon Code
                                </label>
                                {appliedCoupon ? (
                                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-4 h-4 text-green-600" />
                                            <span className="font-mono font-black text-green-700 text-sm">{appliedCoupon}</span>
                                            <span className="text-green-600 text-xs font-medium">-${couponDiscount.toFixed(2)}</span>
                                        </div>
                                        <button type="button" onClick={handleRemoveCoupon} className="text-green-400 hover:text-red-500 transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon(e)} 
                                            placeholder="Enter code..."
                                            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-sky-400 font-mono uppercase"
                                        />
                                        <button
                                            type="button" 
                                            onClick={(e) => handleApplyCoupon(e)}
                                            disabled={couponLoading || !couponCode.trim()}
                                            className="bg-sky-700 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-sky-800 disabled:opacity-50 transition-all cursor-pointer"
                                        >
                                            {couponLoading ? "..." : "Apply"}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 text-sm border-t pt-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-semibold text-green-600">FREE</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax (10%)</span>
                                    <span className="font-semibold text-gray-800">${tax.toFixed(2)}</span>
                                </div>
                                {couponDiscount > 0 && (
                                    <div className="flex justify-between text-green-600 font-bold">
                                        <span>Coupon ({appliedCoupon})</span>
                                        <span>-${couponDiscount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="border-t pt-3 flex justify-between">
                                    <span className="font-black text-sky-900 text-base">Total</span>
                                    <span className="font-black text-sky-700 text-2xl">${Math.max(0, total).toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={checkoutLoading}
                                className="w-full mt-6 bg-sky-700 hover:bg-sky-800 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-md shadow-sky-200 cursor-pointer disabled:opacity-70"
                            >
                                {checkoutLoading ? "Redirecting..." : "Proceed to Checkout"}
                            </button>

                            <p className="text-center text-xs text-gray-400 mt-3">
                                Taxes and shipping calculated at checkout.<br />
                                Secure 256-bit SSL encrypted payments.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                                <Truck className="w-4 h-4 text-sky-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">Free Premium Shipping</p>
                                <p className="text-xs text-gray-400 mt-0.5">Delivered in 2-3 business days.</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                                <Shield className="w-4 h-4 text-sky-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">Secure Warranty</p>
                                <p className="text-xs text-gray-400 mt-0.5">2-year coverage on all performance wear.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;