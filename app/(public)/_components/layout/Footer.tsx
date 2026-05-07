"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Logo from "@/app/(public)/_components/layout/Logo";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setSubscribed(true);
        setEmail("");
    };

    return (
        <footer className="w-full mt-20 border border-gray-200">
            <div className="w-[95%] mx-auto py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

                    {/* ── Brand ── */}
                    <div className="lg:col-span-1 flex flex-col gap-4">
                        <Logo />
                        <p className="text-sm leading-relaxed" style={{ color: "#4a7a96" }}>
                            Curating the intersection of modern lifestyle and timeless design.
                            Experience the essence of light and form through our editorial selections.
                        </p>
                    </div>

                    {/* ── Shop ── */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-xs font-black uppercase tracking-widest" style={{ color: "#0c314e" }}>
                            Shop
                        </h4>
                        <ul className="flex flex-col gap-3">
                            {["New Arrivals", "Collections", "Sale"].map(l => (
                                <li key={l}>
                                    <Link href="#" className="text-sm transition-colors" style={{ color: "#4a7a96" }}
                                        onMouseEnter={e => (e.currentTarget.style.color = "#00628c")}
                                        onMouseLeave={e => (e.currentTarget.style.color = "#4a7a96")}
                                    >{l}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Support ── */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-xs font-black uppercase tracking-widest" style={{ color: "#0c314e" }}>
                            Support
                        </h4>
                        <ul className="flex flex-col gap-3">
                            {["Shipping", "Returns", "FAQ"].map(l => (
                                <li key={l}>
                                    <Link href="#" className="text-sm transition-colors" style={{ color: "#4a7a96" }}
                                        onMouseEnter={e => (e.currentTarget.style.color = "#00628c")}
                                        onMouseLeave={e => (e.currentTarget.style.color = "#4a7a96")}
                                    >{l}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Company ── */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-xs font-black uppercase tracking-widest" style={{ color: "#0c314e" }}>
                            Company
                        </h4>
                        <ul className="flex flex-col gap-3">
                            {["Our Story", "Sustainability", "Careers"].map(l => (
                                <li key={l}>
                                    <Link href="#" className="text-sm transition-colors" style={{ color: "#4a7a96" }}
                                        onMouseEnter={e => (e.currentTarget.style.color = "#00628c")}
                                        onMouseLeave={e => (e.currentTarget.style.color = "#4a7a96")}
                                    >{l}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Newsletter ── */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-xs font-black uppercase tracking-widest" style={{ color: "#0c314e" }}>
                            Newsletter
                        </h4>
                        <p className="text-sm leading-relaxed" style={{ color: "#4a7a96" }}>
                            Join our edit for exclusive drops and design insights.
                        </p>

                        {subscribed ? (
                            <p className="text-sm font-semibold" style={{ color: "#00628c" }}>
                                ✓ You're subscribed!
                            </p>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Your email"
                                    required
                                    className="flex-1 min-w-0 rounded-xl px-4 py-2.5 text-sm outline-none border-none"
                                    style={{
                                        background: "rgba(255,255,255,0.85)",
                                        color: "#0c314e",
                                    }}
                                />
                                <button
                                    type="submit"
                                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200"
                                    style={{ background: "#0c314e" }}
                                    onMouseEnter={e => (e.currentTarget.style.background = "#00628c")}
                                    onMouseLeave={e => (e.currentTarget.style.background = "#0c314e")}
                                >
                                    <ArrowRight className="w-4 h-4 text-white" />
                                </button>
                            </form>
                        )}
                    </div>

                </div>
            </div>

            {/* ── Bottom bar ── */}
            <div style={{ borderTop: "1px solid rgba(0,98,140,0.15)" }}>
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-4">
                    <p className="text-xs" style={{ color: "#7aaec4" }}>
                        © {new Date().getFullYear()} ShopWave. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}