// components/DeleteModal.tsx
"use client";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface DeleteModalProps {
    itemName: string;
    onDelete: () => Promise<void>;
}

export function DeleteModal({ itemName, onDelete }: DeleteModalProps) {
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        await onDelete();
        setIsDeleting(false);
        setOpen(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <button
                    className="p-1.5 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200 cursor-pointer"
                    title="Delete"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete{" "}
                        <span className="font-semibold text-red-500">{itemName}</span>.
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting} className="cursor-pointer">Cancel</AlertDialogCancel>
                    <Button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-red-500 hover:bg-red-600 cursor-pointer"
                    >
                        {isDeleting ? (
                            <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />Deleting...</>
                        ) : "Delete"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}