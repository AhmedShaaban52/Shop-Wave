"use client";

import Image from "next/image";
import { ShoppingBag, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import shoeImage from "@/public/shoe.png";
import { useCartStore } from "@/lib/store/cartStore";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";

const FLASH_PRODUCT = {
    id: "flash-001",
    name: "Velocity Court Shoes",
    description: "Lightweight court shoes designed for high-impact indoor sports and rapid movement.",
    price: "140.00",
    image: "/shoe.png",
    categories: { name: "Sports" },
    discount: 18,
};

interface TimeLeft { hours: number; mins: number; secs: number }

function getTimeLeft(): TimeLeft {
    const now = new Date();
    const target = new Date(now);
    target.setHours(now.getHours() + 4, 32, 15, 0);
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
        hours: Math.floor(diff / 3_600_000),
        mins: Math.floor((diff % 3_600_000) / 60_000),
        secs: Math.floor((diff % 60_000) / 1_000),
    };
}

const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center gap-1.5">
        <div className="flex items-center justify-center w-16 h-16 rounded-xl text-2xl font-black tabular-nums text-white"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
            {String(value).padStart(2, "0")}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">{label}</span>
    </div>
);

const FlashDeal = () => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
    const addToCart = useCartStore((s) => s.addItem);
    const { user } = useAuth();

    useEffect(() => {
        setTimeLeft(getTimeLeft()); 
        const id = setInterval(() => setTimeLeft(getTimeLeft()), 1_000);
        return () => clearInterval(id);
    }, []);

    if (!timeLeft) return null

    const originalPrice = parseFloat(FLASH_PRODUCT.price);
    const finalPrice = +(originalPrice * (1 - FLASH_PRODUCT.discount / 100)).toFixed(2);

    const handleAddToCart = () => {
        if (!user) { toast.error("Please login first"); return; }
        addToCart(FLASH_PRODUCT as any, user.id);
        toast.success(`${FLASH_PRODUCT.name} added to cart!`);
    };

    return (
        <section className="w-full rounded-3xl overflow-hidden" style={{ background: "#0c314e" }}>
            <div className="grid grid-cols-1 md:grid-cols-2 min-h-[340px]">

                {/* ── LEFT: Content ── */}
                <div className="flex flex-col justify-center gap-6 px-10 py-12 md:px-14">

                    {/* Badge */}
                    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-orange-500 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-white">
                        <Zap className="w-3 h-3 fill-white" />
                        Flash Deal
                    </span>

                    {/* Heading */}
                    <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
                        Ends In&hellip;
                    </h2>

                    {/* Countdown */}
                    <div className="flex items-center gap-3">
                        <TimeBlock value={timeLeft.hours} label="Hours" />
                        <span className="text-white/30 text-3xl font-black pb-5">:</span>
                        <TimeBlock value={timeLeft.mins} label="Mins" />
                        <span className="text-white/30 text-3xl font-black pb-5">:</span>
                        <TimeBlock value={timeLeft.secs} label="Secs" />
                    </div>

                    {/* Description */}
                    <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                        Get the{" "}
                        <span className="text-white font-semibold">{FLASH_PRODUCT.name}</span>{" "}
                        at an unbeatable price. Only for a limited time.
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-black text-white">${finalPrice.toFixed(2)}</span>
                        <span className="text-sm line-through text-white/40">${originalPrice.toFixed(2)}</span>
                    </div>

                    {/* CTA — brand sky color matching ProductCard */}
                    <button
                        onClick={handleAddToCart}
                        className="group inline-flex w-fit items-center gap-2.5 rounded-xl text-white font-bold px-8 py-4 text-sm uppercase tracking-widest transition-all duration-200 active:scale-[0.97]"
                        style={{ background: "#00628c" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#00557b")}
                        onMouseLeave={e => (e.currentTarget.style.background = "#00628c")}
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Add to Cart
                    </button>
                </div>

                {/* ── RIGHT: Image — full fill, straight like reference ── */}
                <div className="relative overflow-hidden min-h-[300px] md:min-h-0" style={{ background: "#0f2a40" }}>
                    <Image
                        src={shoeImage}
                        alt={FLASH_PRODUCT.name}
                        fill
                        priority
                        className="object-contain"
                        style={{ padding: "24px", filter: "drop-shadow(0 24px 40px rgba(0,0,0,0.6))" }}
                    />
                </div>

            </div>
        </section>
    );
};

export default FlashDeal;