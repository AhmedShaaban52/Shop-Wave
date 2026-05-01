"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Settings,
    LogOut,
    Menu,
    ChevronDown,
    ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const navigation = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        {
            name: "Products",
            icon: Package,
            subItems: [
                { name: "All Products", href: "/admin/products" },
                { name: "Categories", href: "/admin/categories" },
                { name: "Deals & Offers", href: "/admin/offers" },
            ],
        },
        { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ];


    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    }
    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    return (
        <div className="flex h-screen bg-gray-100 text-gray-900">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex flex-col items-start px-6 py-5 border-b">
                    <h1 className="text-xl font-bold text-sky-900 tracking-tighter">ShopWave Admin</h1>
                    <p className="text-xs text-sky-700/60 font-medium">Management Suite</p>

                </div>

                {/* Navigation */}
                <nav className="px-4 py-6 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.subItems && item.subItems.some((sub) => pathname === sub.href));
                        const isDropdownOpen = openDropdown === item.name;

                        return (
                            <div key={item.name}>
                                {item.subItems ? (
                                    <>
                                        <button
                                            onClick={() => toggleDropdown(item.name)}
                                            className={`group flex w-full items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden ${isActive
                                                ? "bg-[#4FBF8B]/10 text-sky-700"
                                                : "text-gray-700 hover:text-sky-900"
                                                }`}
                                        >
                                            <span className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left bg-[#4FBF8B]/10 transition-transform duration-300 rounded-lg"></span>

                                            <div className="flex items-center gap-3 relative z-10">
                                                <item.icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                                                {item.name}
                                            </div>

                                            <div className="relative z-10">
                                                {isDropdownOpen ? (
                                                    <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                                                )}
                                            </div>
                                        </button>

                                        {/* Submenu */}
                                        {isDropdownOpen && (
                                            <div className="pl-10 mt-1 space-y-1 animate-fadeIn">
                                                {item.subItems.map((sub) => {
                                                    const subActive = pathname === sub.href;
                                                    return (
                                                        <Link
                                                            key={sub.name}
                                                            href={sub.href}
                                                            className={`block px-3 py-1.5 rounded-md text-sm transition-all duration-200 ${subActive
                                                                ? "text-sky-700 font-medium bg-[#4FBF8B]/10"
                                                                : "text-gray-600 hover:text-sky-900 hover:bg-[#4FBF8B]/5"
                                                                }`}
                                                        >
                                                            {sub.name}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden ${isActive
                                            ? "bg-[#4FBF8B]/10 text-sky-700"
                                            : "text-gray-700 hover:text-sky-900"
                                            }`}
                                    >
                                        <span className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left bg-[#4FBF8B]/10 transition-transform duration-300 rounded-lg"></span>
                                        <item.icon className="h-5 w-5 relative z-10 transition-transform duration-200 group-hover:scale-110" />
                                        <span className="relative z-10">{item.name}</span>
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="mt-auto p-4 border-t text-sm">
                    <button onClick={handleLogout}
                        className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors cursor-pointer">
                        <LogOut className="h-4 w-4" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col lg:ml-64">
                {/* Header */}
                <header className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm sticky top-0 z-10">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                    >
                        <Menu className="h-5 w-5 text-gray-600" />
                    </button>

                    <h2 className="text-lg font-bold text-sky-900 tracking-tighter">Admin Dashboard</h2>

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium">John Doe</p>
                            <p className="text-xs text-gray-500">admin@example.com</p>
                        </div>
                        <div className="w-10 h-10 bg-sky-700 text-white rounded-full flex items-center justify-center font-medium">
                            JD
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
}
