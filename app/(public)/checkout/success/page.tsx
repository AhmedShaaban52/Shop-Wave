import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default async function SuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ session_id?: string }>
}) {
    const { session_id } = await searchParams;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f4f8] gap-6">
            <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 flex flex-col items-center max-w-md w-full mx-4">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h1 className="text-2xl font-black text-sky-900">Order Confirmed!</h1>
                <p className="text-gray-400 text-sm mt-2 text-center">
                    Your payment was successful. We'll send you a confirmation soon.
                </p>
                {session_id && (
                    <p className="text-xs text-gray-300 mt-3 font-mono">
                        Ref: {session_id.slice(-8).toUpperCase()}
                    </p>
                )}
                <Link
                    href="/"
                    className="mt-8 bg-sky-700 hover:bg-sky-800 text-white font-bold py-3 px-8 rounded-2xl transition-all"
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}