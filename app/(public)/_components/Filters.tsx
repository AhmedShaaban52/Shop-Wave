"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

export const FilterSection = ({
    title,
    options,
    paramName
}: {
    title: string;
    options: string[];
    paramName: string;
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const current = searchParams.get(paramName) || "All";

    const handleChange = useCallback((opt: string) => {
        const params = new URLSearchParams();  
        
        if (opt !== "All") {
            params.set(paramName, opt);
        }
        
        startTransition(() => {
            router.push(`/products?${params.toString()}`, { scroll: false });
        });
    }, [paramName, router]);

    return (
        <div>
            <h3 className="text-sm font-black text-[#0c314e] uppercase tracking-wider mb-4">
                {title}
                {isPending && <span className="ml-2 text-xs text-sky-500 normal-case font-normal">Loading...</span>}
            </h3>
            <div className="space-y-3">
                {options.map((opt) => (
                    <label key={opt} className="flex items-center gap-3 group cursor-pointer">
                        <input
                            type="radio"
                            name={paramName}
                            checked={current === opt || (opt === "All" && !searchParams.get(paramName))}
                            onChange={() => handleChange(opt)}
                            className="w-4 h-4 border-slate-300 text-[#00628c] focus:ring-[#00628c] cursor-pointer"
                        />
                        <span className={`text-sm font-bold transition-colors ${current === opt || (opt === "All" && !searchParams.get(paramName))
                            ? "text-[#00628c]"
                            : "text-slate-600 group-hover:text-[#00628c]"
                            }`}>
                            {opt}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
};