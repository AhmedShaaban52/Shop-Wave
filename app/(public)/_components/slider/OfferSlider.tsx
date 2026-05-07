"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type Offer } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface OfferSliderProps {
    offers: Offer[];
}

const OfferSlider = ({ offers }: OfferSliderProps) => {
    const [current, setCurrent] = useState(0);

    const prev = useCallback(() => {
        setCurrent((c) => (c === 0 ? offers.length - 1 : c - 1));
    }, [offers.length]);

    const next = useCallback(() => {
        setCurrent((c) => (c === offers.length - 1 ? 0 : c + 1));
    }, [offers.length]);

    useEffect(() => {
        if (offers.length <= 1) return;
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [offers.length, next]);

    if (!offers || offers.length === 0) return null;

    return (
        <div className="relative w-full overflow-hidden rounded-[2.5rem] select-none bg-gray-100 group">
            <div
                className="flex transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {offers.map((offer) => (
                    <div key={offer.id} className="relative min-w-full h-[450px] md:h-[620px] flex items-center">
                        {/* Background Image */}
                        <Image
                            src={offer.image}
                            alt={offer.name}
                            fill
                            className="object-cover"
                            sizes="100vw"
                            priority
                        />

                        <div className="absolute inset-0 bg-black/10 md:bg-transparent md:bg-gradient-to-r md:from-black/20 md:to-transparent" />

                        {/* Content Area */}
                        <div className="relative z-10 px-8 md:px-16 w-full max-w-3xl">
                            {/* Peach Discount Badge */}
                            <div className="inline-block bg-[#f3b68b] text-[#5e3a21] text-[10px] md:text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">
                                Save up to {offer.discount}%
                            </div>

                            <h3 className="text-white text-5xl md:text-8xl font-bold leading-[0.9] tracking-tight mb-6 drop-shadow-sm">
                                {offer.name}
                            </h3>

                            {offer.description && (
                                <p className="text-white/90 text-base md:text-xl max-w-md font-medium leading-relaxed mb-8 drop-shadow-sm">
                                    {offer.description}
                                </p>
                            )}

                            <Button
                                asChild
                                className="bg-sky-500 hover:bg-sky-600 text-white rounded-2xl px-8 py-7 text-lg font-semibold transition-all active:scale-95 shadow-lg shadow-sky-500/20"
                            >
                                <Link href="/products">Explore Collection</Link>
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows (Hidden by default, show on hover) */}
            {offers.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                    >
                        <ChevronLeft className="h-6 w-6 text-white" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                    >
                        <ChevronRight className="h-6 w-6 text-white" />
                    </button>

                    {/* Pagination Dots (Bottom Left like image) */}
                    <div className="absolute bottom-10 left-8 md:left-16 flex items-center gap-2 z-20">
                        {offers.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`transition-all duration-300 rounded-full ${i === current ? "w-10 h-1.5 bg-white" : "w-2 h-2 bg-white/40"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default OfferSlider;
