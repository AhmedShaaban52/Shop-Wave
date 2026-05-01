"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form, FormControl, FormField,
    FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import RegisterImage from "@/public/login.png";

// ── Schema ────────────────────────────────────────────────
const registerSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            password: "",
        },
    });

    const onSubmit = async (data: RegisterForm) => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        full_name: data.fullName,
                        phone: data.phone,
                    },
                },
            });

            if (error) {
                toast.error("Registration failed: " + error.message);
                return;
            }

            toast.success("Account created! Please check your email to verify.");
            router.push("/login");
        } catch (err) {
            console.error("Unexpected error:", err);
            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f3f7ff] font-sans">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(12,49,78,0.04)]">
                <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
                    <span className="text-2xl font-black tracking-tighter text-sky-900">
                        ShopWave
                    </span>
                    <nav className="hidden md:flex space-x-8 text-sm font-medium tracking-tight">
                        {["Electronics", "Fashion", "Home & Living", "Sports"].map((item) => (
                            <Link
                                key={item}
                                href="#"
                                className="text-slate-600 hover:text-sky-600 transition-colors duration-200"
                            >
                                {item}
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>

            {/* Main */}
            <main className="min-h-screen pt-32 pb-20 px-4 md:px-8">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left — Image */}
                    <div className="hidden lg:block">
                        <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl">
                            <Image
                                src={RegisterImage}
                                alt="ShopWave editorial"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-sky-900/60 to-transparent flex flex-col justify-end p-12">
                                <h2 className="text-4xl font-bold text-white tracking-tight leading-tight">
                                    Start your journey with ShopWave today.
                                </h2>
                                <p className="text-white/80 mt-4 text-lg">
                                    Create an account to access curated collections and personalized shopping experiences.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right — Form */}
                    <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
                        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-[0_32px_64px_-12px_rgba(12,49,78,0.08)]">
                            <h2 className="text-3xl font-extrabold text-sky-950 tracking-tight mb-1">
                                Create Account
                            </h2>
                            <p className="text-slate-500 text-sm mb-6">
                                Join our community and start shopping.
                            </p>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                                    {/* Full Name */}
                                    <FormField
                                        control={form.control}
                                        name="fullName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-slate-600">
                                                    Full Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="John Doe"
                                                        {...field}
                                                        disabled={loading}
                                                        className="bg-[#e9f1ff] border-0 rounded-xl py-5 text-sky-950 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-400/40"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Email */}
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-slate-600">
                                                    Email Address
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="name@example.com"
                                                        {...field}
                                                        disabled={loading}
                                                        className="bg-[#e9f1ff] border-0 rounded-xl py-5 text-sky-950 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-400/40"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Phone + Password side by side */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-slate-600">
                                                        Phone
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="tel"
                                                            placeholder="+20 123 456 7890"
                                                            {...field}
                                                            disabled={loading}
                                                            className="bg-[#e9f1ff] border-0 rounded-xl py-5 text-sky-950 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-400/40"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-medium text-slate-600">
                                                        Password
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="password"
                                                            placeholder="Min. 6 characters"
                                                            {...field}
                                                            disabled={loading}
                                                            className="bg-[#e9f1ff] border-0 rounded-xl py-5 text-sky-950 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-400/40"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-6 text-base font-bold rounded-xl bg-gradient-to-r from-sky-700 to-sky-400 hover:from-sky-800 hover:to-sky-500 text-white shadow-lg shadow-sky-500/20 active:scale-[0.98] transition-all cursor-pointer mt-2"
                                    >
                                        {loading ? "Creating Account..." : "Register Now"}
                                    </Button>
                                </form>
                            </Form>

                            <div className="pt-6 border-t border-slate-100 text-center text-sm text-slate-500 mt-6">
                                Already have an account?{" "}
                                <Link href="/login" className="text-sky-600 font-bold hover:underline ml-1">
                                    Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-12 bg-slate-50 border-t border-sky-900/5">
                <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <span className="font-bold text-sky-900 text-lg">ShopWave</span>
                    <p className="text-sm text-slate-500">© 2024 ShopWave. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}