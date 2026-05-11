import { confirmOrder } from "@/lib/actions/checkoutActions";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SuccessPage({
    searchParams
}: {
    searchParams: Promise<{ session_id: string }>
}) {
    const { session_id } = await searchParams;

    if (!session_id) redirect("/");

    const result = await confirmOrder(session_id);

    if (!result.success) {
        return <div>An error occurred while confirming the order.</div>
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-2xl font-bold text-emerald-600">Payment successful</h1>
            <p className="mt-2 text-slate-600">Your order has been successfully confirmed</p>
            <Link href="/order" className="mt-6 bg-sky-500 text-white px-6 py-2 rounded-lg">
                View my orders
            </Link>
        </div>
    );
}