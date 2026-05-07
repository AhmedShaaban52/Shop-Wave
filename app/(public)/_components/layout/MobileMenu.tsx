"use client";

import Link from 'next/link';
import { MenuIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

interface NavItem {
    name: string;
    href: string;
}

interface MobileMenuProps {
    navigationItems: NavItem[];
    session: any; 
}

const MobileMenu = ({ navigationItems, session }: MobileMenuProps) => {
    return (
        <div className="lg:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                        <MenuIcon className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle className="text-left text-sky-700 italic">
                            ShopWave
                        </SheetTitle>
                    </SheetHeader>

                    <div className="flex flex-col gap-6 mt-10">
                        {navigationItems.map((item) => (
                            <SheetClose asChild key={item.name}>
                                <Link
                                    href={item.href}
                                    className="text-lg font-semibold text-slate-700 hover:text-sky-600"
                                >
                                    {item.name}
                                </Link>
                            </SheetClose>
                        ))}

                        {!session && (
                            <Link href="/login" className="mt-4">
                                <Button className="w-full bg-sky-700 rounded-full">
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default MobileMenu;