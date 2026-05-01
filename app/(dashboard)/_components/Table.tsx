// components/DataTable.tsx
"use client";

import React from "react";
import { ImageIcon } from "lucide-react";
import TableLoader from "./TableLoader";

interface Column<T> {
    key: string;
    label: string;
    align?: "left" | "center" | "right";
    render: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    loading: boolean;
    loadingMessage?: string;
    emptyMessage?: string;
    emptySubMessage?: string;
}

export function DataTable<T>({
    data,
    columns,
    loading,
    loadingMessage = "Loading...",
    emptyMessage = "No data found",
    emptySubMessage = "Create your first item to get started",
}: DataTableProps<T>) {
    if (loading) {
        return <TableLoader columns={columns.length} message={loadingMessage} />;
    }

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                    <ImageIcon className="h-8 w-8 opacity-40" />
                </div>
                <p className="text-sm font-medium text-gray-500">{emptyMessage}</p>
                <p className="text-xs text-gray-400 mt-1">{emptySubMessage}</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full text-sm border-collapse">
                <thead>
                    <tr className="bg-sky-800 text-white">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={`px-4 py-3 font-semibold border border-sky-700 whitespace-nowrap text-${col.align || "left"}`}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr
                            key={index}
                            className={`transition-colors hover:bg-sky-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                        >
                            {columns.map((col) => (
                                <td
                                    key={col.key}
                                    className={`px-4 py-3 border border-gray-200 text-${col.align || "left"}`}
                                >
                                    {col.render(item)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}