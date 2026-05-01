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
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import LoginImage from "@/public/login.png";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginForm) => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (error) {
                toast.error("Login failed: " + error.message);
                return;
            }

            toast.success("Login successful!");
            router.push("/");
            router.refresh();
        } catch (err) {
            console.error("Unexpected error:", err);
            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f3f7ff] font-sans">
            {/* Top Nav */}
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

                    {/* Left — Editorial image */}
                    <div className="hidden lg:block">
                        <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl">
                            <Image
                                src={LoginImage}
                                alt="ShopWave editorial"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-sky-900/60 to-transparent flex flex-col justify-end p-12">
                                <h2 className="text-4xl font-bold text-white tracking-tight leading-tight">
                                    Join the next wave of curated lifestyle.
                                </h2>
                                <p className="text-white/80 mt-4 text-lg">
                                    Experience the Azure Horizon collection and exclusive member benefits.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right — Form */}
                    <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
                        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-[0_32px_64px_-12px_rgba(12,49,78,0.08)]">

                            <h2 className="text-3xl font-extrabold text-sky-950 tracking-tight mb-1">
                                Welcome Back!
                            </h2>
                            <p className="text-slate-500 text-sm mb-6">
                                Sign in to continue your order.
                            </p>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-medium text-slate-600">
                                                    Email or Username
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter your email or username"
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
                                                        placeholder="Enter your password"
                                                        {...field}
                                                        disabled={loading}
                                                        className="bg-[#e9f1ff] border-0 rounded-xl py-5 text-sky-950 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-sky-400/40"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex justify-end">
                                        <Link
                                            href="/forgot-password"
                                            className="text-sm text-sky-600 hover:underline"
                                        >
                                            Forgot Password?
                                        </Link>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full py-6 text-base font-bold rounded-xl bg-gradient-to-r from-sky-700 to-sky-400 hover:from-sky-800 hover:to-sky-500 text-white shadow-lg shadow-sky-500/20 active:scale-[0.98] transition-all cursor-pointer"
                                        disabled={loading}
                                    >
                                        {loading ? "Loading..." : "Login"}
                                    </Button>
                                </form>
                            </Form>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-slate-400">OR</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full flex items-center justify-center gap-2 rounded-xl py-5 border-slate-200 hover:bg-[#e9f1ff] transition-colors"
                                    disabled={loading}
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full flex items-center justify-center gap-2 rounded-xl py-5 border-slate-200 hover:bg-[#e9f1ff] transition-colors"
                                    disabled={loading}
                                >
                                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    Continue with Facebook
                                </Button>
                            </div>

                            <div className="pt-6 border-t border-slate-100 text-center text-sm text-slate-500 mt-6">
                                Don&apos;t have an account?{" "}
                                <Link href="/register" className="text-sky-600 font-bold hover:underline ml-1">
                                    Sign Up
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
                    <div className="flex flex-wrap justify-center gap-8">
                        {["Newsletter", "Privacy Policy", "Terms of Service", "Contact Us"].map((item) => (
                            <Link
                                key={item}
                                href="#"
                                className="text-sm text-slate-500 hover:text-sky-900 transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                    <p className="text-sm text-slate-500">© 2024 ShopWave. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}