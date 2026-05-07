"use client"

import { useAuth } from '@/context/authContext';
import { useFavStore } from '@/lib/store/favStore';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

const FavBadge = () => {
    const { user } = useAuth();
    const favItems = useFavStore((s) => s.items);
    const fetchFavs = useFavStore((s) => s.fetchFavs);
    const favCount = favItems.length;

    useEffect(() => {
        if (user?.id) {
            fetchFavs(user.id);
        }
    }, [user?.id, fetchFavs]);
    return (
        <Link href="/fav" className="relative p-2 text-slate-600 hover:text-sky-600 transition-colors">
            <Heart className="h-5 w-5 cursor-pointer" />
            {favCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                    {favCount}
                </span>
            )}
        </Link>
    )
}

export default FavBadge