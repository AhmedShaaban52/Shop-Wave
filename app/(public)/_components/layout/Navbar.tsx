"use client";

import { useState } from 'react';
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
    Globe,
    Search as SearchIcon,
    X,
    Heart,
    ShoppingCart
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
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="flex h-16 md:h-20 items-center justify-between px-4 md:px-10 relative ">

                {isMobileSearchOpen && (
                    <div className="absolute inset-0 bg-white z-[130] flex items-center px-4 gap-2 lg:hidden animate-in fade-in slide-in-from-top duration-300">
                        <div className="flex-1">
                            <Search />
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileSearchOpen(false)}>
                            <X className="h-5 w-5 text-slate-500" />
                        </Button>
                    </div>
                )}

                <div className="flex-shrink-0">
                    <Logo />
                </div>

                <nav className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2 gap-8">
                    {navigationItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-[15px] font-semibold text-slate-600 hover:text-sky-600 transition-all duration-200 relative group py-2"
                        >
                            {item.name}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-600 transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2 md:gap-5">

                    <div className="hidden xl:block">
                        <Search />
                    </div>

                    <div className="flex items-center gap-1 md:gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="xl:hidden text-slate-600 hover:bg-slate-50"
                            onClick={() => setIsMobileSearchOpen(true)}
                        >
                            <SearchIcon className="h-5 w-5" />
                        </Button>


                        <div className="flex items-center">
                            <Button variant="ghost" size="icon" className="hidden sm:flex text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-colors">
                                <Globe className="h-5 w-5" />
                            </Button>

                            <FavBadge />
                            <CartBadge />
                        </div>


                        <div className="flex items-center ">
                            {loading ? (
                                <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
                            ) : session ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-sky-50">
                                            <User className="h-5 w-5 text-sky-700" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56 mt-2" align="end">
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-bold text-slate-900">{user?.email?.split('@')[0]}</p>
                                                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {isAdmin && (
                                            <DropdownMenuItem asChild className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
                                                <Link href="/admin">
                                                    <Shield className="mr-2 h-4 w-4" /> <span className="font-bold">Admin Panel</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem asChild className="cursor-pointer">
                                            <Link href="/profile">
                                                <User className="mr-2 h-4 w-4" /> Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => signOut()} className="text-red-600 cursor-pointer focus:bg-red-50">
                                            <LogOut className="mr-2 h-4 w-4" /> Log out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link href="/login">
                                    <Button className="bg-sky-700 hover:bg-sky-800 text-white rounded-full px-6 text-xs font-bold transition-all shadow-md active:scale-95">
                                        Sign In
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="lg:hidden">
                        <MobileMenu navigationItems={navigationItems} session={session} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;