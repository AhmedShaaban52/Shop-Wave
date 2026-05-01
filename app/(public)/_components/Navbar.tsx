"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MenuIcon, ShoppingCart, User, LogOut, Settings, Shield, Heart } from 'lucide-react';
import Search from './Search';
import { useAuth } from '@/context/authContext';
import { useCartStore } from '@/lib/store/cartStore';
import { useFavStore } from '@/lib/store/favStore';


const navigationItems = [
    {
        name: "Home",
        href: "/",
    },
    {
        name: "Products",
        href: "/products",
    },
    {
        name: "Categories",
        href: "/categories",
    },
];

const Navbar = () => {
    const { session, user, loading, signOut, isAdmin } = useAuth();
    const cartItems = useCartStore((s) => s.items);
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const favItems = useFavStore((s) => s.items);
    const favCount = favItems.length;

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <header>
            <div className="container flex min-h-16 items-center justify-between mx-auto px-4 md:px-6">
                <div className='flex items-center gap-12'>
                    <div className="text-2xl font-black tracking-tighter text-sky-900 dark:text-sky-100 active:scale-95 transition-transform cursor-pointer">
                        ShopWave
                    </div>
                    <Search />
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-5">
                    {navigationItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-base font-medium transition-colors hover:text-primary"
                        >
                            {item.name}
                        </Link>
                    ))}


                    <Link href="/fav" className="relative group">
                        <Heart className="h-6 w-6 group-hover:text-red-500 transition-colors text-gray-900" />
                        {favCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {favCount}
                            </span>
                        )}
                    </Link>

                    {/* Cart Icon */}
                    <Link href="/cart" className="relative group">
                        <ShoppingCart className="h-6 w-6 group-hover:text-primary transition-colors text-gray-900 dark:text-gray-100" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-sky-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {loading ? (
                        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
                    ) : session ? (
                        // User is logged in - Show Dropdown Menu
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <div className="flex items-center justify-center h-8 w-8   text-primary  rounded-full">
                                        <User className="h-8 w-8 rounded-3xl text-primary hover:text-primary-foreground" />
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user?.email}
                                        </p>
                                        {isAdmin && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <Shield className="h-3 w-3 text-red-600 focus:text-red-600" />
                                                <span className="text-xs text-red-600 focus:text-red-600 font-medium">Admin</span>
                                            </div>
                                        )}
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {isAdmin && (
                                    <DropdownMenuItem asChild>
                                        <Link href="/admin" className="cursor-pointer">
                                            <Shield className="mr-2 h-4 w-4 text-red-600 focus:text-red-600" />
                                            <span className="text-red-600 focus:text-red-600 font-medium">Admin Panel</span>
                                        </Link>
                                    </DropdownMenuItem>
                                )}

                                <DropdownMenuItem asChild>
                                    <Link href="/profile" className="cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/settings" className="cursor-pointer">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600 cursor-pointer"
                                    onClick={handleSignOut}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/login">
                            <Button className="bg-sky-700 hover:bg-sky-600 text-white px-8 py-3 rounded-3xl cursor-pointer">
                                Login
                            </Button>
                        </Link>
                    )}
                </nav>

                {/* Mobile Navigation */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                className="shrink-0 md:hidden"
                                variant="outline"
                                size="icon"
                            >
                                <MenuIcon className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Menu</SheetTitle>
                            </SheetHeader>

                            <div className="flex flex-col gap-4 mt-4">
                                {navigationItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="text-sm font-medium transition-colors hover:text-primary"
                                    >
                                        {item.name}
                                    </Link>
                                ))}

                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className="text-sm font-medium transition-colors hover:text-purple-600 text-purple-600 flex items-center gap-1"
                                    >
                                        <Shield className="h-4 w-4" />
                                        Admin
                                    </Link>
                                )}

                                {/* Mobile Authentication Section */}
                                {loading ? (
                                    <div className="w-full h-10 rounded bg-gray-200 animate-pulse"></div>
                                ) : session ? (
                                    <>
                                        <div className="border-t pt-4 mt-2">
                                            <p className="text-sm font-medium">
                                                {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {user?.email}
                                            </p>
                                            {isAdmin && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Shield className="h-3 w-3 text-purple-600" />
                                                    <span className="text-xs text-purple-600 font-medium">Admin</span>
                                                </div>
                                            )}
                                        </div>

                                        {isAdmin && (
                                            <Link
                                                href="/admin"
                                                className="text-sm font-medium transition-colors hover:text-purple-600 text-purple-600"
                                            >
                                                Admin Panel
                                            </Link>
                                        )}

                                        <Link
                                            href="/profile"
                                            className="text-sm font-medium transition-colors hover:text-primary"
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="text-sm font-medium transition-colors hover:text-primary"
                                        >
                                            Settings
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className="text-sm font-medium text-red-600 transition-colors hover:text-red-800 text-left"
                                        >
                                            Log out
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="text-sm font-medium transition-colors hover:text-primary"
                                    >
                                        Login
                                    </Link>
                                )}
                            </div>

                            <SheetFooter className="mt-8">
                                <SheetClose asChild>
                                    <Button variant="outline">Close</Button>
                                </SheetClose>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}

export default Navbar