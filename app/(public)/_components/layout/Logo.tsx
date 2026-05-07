import Link from "next/link"

const Logo = () => {
    return (
        <div className="flex items-center">
            <Link href="/" className="text-2xl font-black tracking-tighter text-sky-900 dark:text-sky-100 active:scale-95 transition-transform cursor-pointer">
                ShopWave
            </Link>
        </div>
    )
}

export default Logo