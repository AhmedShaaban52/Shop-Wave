"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    User,
    LogOut,
    Shield,
    Globe
} from 'lucide-react';
import { useAuth } from '@/context/authContext';
import Logo from './Logo';
import CartBadge from '../CartBadge';
import FavBadge from '../FavBadge';
import { navigationItems } from '@/constant/Constant';
import MobileMenu from './MobileMenu';
import Search from './Search';

const Navbar = () => {
    const { session, user, loading, signOut, isAdmin } = useAuth();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white">
            <div className="flex h-20 items-center justify-between px-4 md:px-10 ">

                <Logo />

                <nav className="hidden lg:flex items-center gap-8">
                    {navigationItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors relative group"
                        >
                            {item.name}
                            {item.name === "New Arrivals" && (
                                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-sky-600 rounded-full" />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center">
                        <Search />
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <Button variant="ghost" size="icon" className="text-slate-600 hover:text-sky-600">
                            <Globe className="h-5 w-5" />
                        </Button>

                        <FavBadge />

                        <CartBadge />

                        {loading ? (
                            <div className="w-20 h-9 rounded-full bg-slate-100 animate-pulse" />
                        ) : session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-9 w-9 rounded-full bg-slate-50 border border-slate-100">
                                        <User className="h-5 w-5 text-sky-700" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium">{user?.email?.split('@')[0]}</p>
                                            <p className="text-xs text-slate-500">{user?.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {isAdmin && (
                                        <DropdownMenuItem asChild>
                                            <Link href="/admin" className="text-red-600 cursor-pointer">
                                                <Shield className="mr-2 h-4 w-4" /> Admin Panel
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile" className="cursor-pointer">
                                            <User className="mr-2 h-4 w-4" /> Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => signOut()} className="text-red-600 cursor-pointer">
                                        <LogOut className="mr-2 h-4 w-4" /> Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/login">
                                <Button className="bg-sky-700 hover:bg-sky-800 text-white rounded-full px-6 font-semibold shadow-sm">
                                    Sign In
                                </Button>
                            </Link>
                        )}

                        <MobileMenu navigationItems={navigationItems} session={session} />

                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;