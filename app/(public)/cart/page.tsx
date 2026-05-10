"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowLeft, Shield, Truck } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { calculatePrice } from "@/lib/calculatePrice";
import { useAuth } from "@/context/authContext";
import { ProductCart } from "../_components/ProductCart";
import { toast } from "sonner";
import { createCheckoutSession } from "@/lib/actions/checkoutActions";

const CartPage = () => {
    const { items, removeItem } = useCartStore();
    const { user } = useAuth();

    const subtotal = items.reduce((sum, item) => {
        const price = calculatePrice(item) ?? parseFloat(item.price as string);
        return sum + price * item.quantity;
    }, 0);

    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const handleCheckout = async () => {
        if (!user) { toast.error("Please login first"); return; }
        try {
            await createCheckoutSession(items, user.id);
        } catch (err) {
            toast.error("Checkout failed");
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#f0f4f8]">
                <ShoppingBag className="w-20 h-20 text-sky-200" />
                <h2 className="text-2xl font-bold text-sky-900">Your cart is empty</h2>
                <Link
                    href="/"
                    className="flex items-center gap-2 bg-sky-700 hover:bg-sky-800 text-white px-6 py-3 rounded-2xl font-semibold transition-all"
                >
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
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
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
                                            <div className="flex items-center justify-between mt-3">
                                                <ProductCart
                                                    product={item}
                                                    userId={user!.id}
                                                    quantity={item.quantity}
                                                    variant="compact"
                                                />

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
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1 flex flex-col gap-4 sticky top-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-black text-sky-900 mb-6">Order Summary</h2>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-semibold text-green-600">FREE</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Estimated Tax (10%)</span>
                                    <span className="font-semibold text-gray-800">${tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between">
                                    <span className="font-black text-sky-900 text-base">Total</span>
                                    <span className="font-black text-sky-700 text-2xl">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button onClick={handleCheckout} className="w-full mt-6 bg-sky-700 hover:bg-sky-800 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] shadow-md shadow-sky-200 cursor-pointer">
                                Proceed to Checkout
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