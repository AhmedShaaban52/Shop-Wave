"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductImageGallery({ mainImage, thumbnails, name }: { mainImage: string, thumbnails: string[], name: string }) {
    const allImages = [mainImage, ...(thumbnails || [])].filter(Boolean);
    const [activeImage, setActiveImage] = useState(mainImage);

    return (
        <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-square md:aspect-[1.2/1] bg-white rounded-[2.5rem] overflow-hidden shadow-sm group border border-white">
                <div className="absolute top-6 left-6 z-10 bg-[#fbb06c] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                    Limited Edition
                </div>
                <Image
                    src={activeImage || "/placeholder.png"}
                    alt={name}
                    fill
                    className="object-cover p-4 md:p-0 transition-all duration-300"
                    priority
                />
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((imgUrl, index) => (
                    <div
                        key={index}
                        onClick={() => setActiveImage(imgUrl)}
                        className={`w-20 h-20 bg-white rounded-2xl border flex-shrink-0 cursor-pointer overflow-hidden transition-all
                            ${activeImage === imgUrl ? "border-[#00628c] ring-2 ring-[#00628c]/10 opacity-100" : "border-slate-100 opacity-60 hover:opacity-100"}
                        `}
                    >
                        <Image
                            src={imgUrl}
                            alt={`thumb-${index}`}
                            width={80}
                            height={80}
                            className="object-cover h-full w-full"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}