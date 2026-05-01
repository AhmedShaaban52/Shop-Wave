// components/OfferSlider.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type Offer } from "@/lib/types";

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

    // Auto-play
    useEffect(() => {
        if (offers.length <= 1) return;
        const timer = setInterval(next, 4000);
        return () => clearInterval(timer);
    }, [offers.length, next]);

    if (!offers || offers.length === 0) return null;

    return (
        <div className="relative w-full overflow-hidden rounded-2xl select-none">
            <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {offers.map((offer) => (
                    <div key={offer.id} className="relative min-w-full h-[280px] md:h-[420px]">
                        <Image
                            src={offer.image}
                            alt={offer.name}
                            fill
                            className="object-cover"
                            sizes="100vw"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        <div className="absolute top-4 left-4 bg-green-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                            {offer.discount}% OFF
                        </div>
                        <div className="absolute bottom-6 left-6 right-16">
                            <h3 className="text-white text-xl md:text-3xl font-bold drop-shadow-md">
                                {offer.name}
                            </h3>
                            {offer.description && (
                                <p className="text-white/80 text-sm md:text-base mt-1 line-clamp-2">
                                    {offer.description}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {offers.length > 1 && (
                <>
                    <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/30 hover:bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer">
                        <ChevronLeft className="h-5 w-5 text-white" />
                    </button>
                    <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/30 hover:bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer">
                        <ChevronRight className="h-5 w-5 text-white" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                        {offers.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`rounded-full transition-all duration-300 ${i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50"}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default OfferSlider;