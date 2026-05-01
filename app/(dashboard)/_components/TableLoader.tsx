import React from "react";

interface TableLoaderProps {
    columns?: number;
    message?: string;
    showHeader?: boolean;
}

export default function TableLoader({
    columns = 5,
    message = "Loading data...",
    showHeader = true
}: TableLoaderProps) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-100 text-sm">
                {showHeader && (
                    <thead>
                        <tr className="bg-gray-50 text-gray-700">
                            {Array.from({ length: columns }).map((_, index) => (
                                <th key={index} className="px-4 py-3 text-left border-b font-semibold">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                )}
                <tbody>
                    <tr>
                        <td colSpan={columns} className="px-4 py-8 text-center text-gray-500">
                            <div className="flex justify-center items-center gap-3">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-700"></div>
                                <span className="text-sm">{message}</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}