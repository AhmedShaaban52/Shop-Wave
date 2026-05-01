"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { categorySchema, CategorySchemaType } from "@/lib/types";
import { supabase } from "@/lib/supabase/client";

interface CategoryModalProps {
    mode?: "create" | "edit";
    initialData?: CategorySchemaType & { id?: string };
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger?: React.ReactNode;
    onSubmit: (values: CategorySchemaType, id?: string) => Promise<void>;
    isSubmitting?: boolean;
}

export function CategoryModal({
    mode = "create",
    initialData,
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange,
    trigger,
    onSubmit,
    isSubmitting = false,
}: CategoryModalProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setOpen = controlledOnOpenChange || setInternalOpen;

    const isLoading = isUploading || isSubmitting;

    const form = useForm<CategorySchemaType>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: "",
            description: "",
            image: "",
        },
    });

    
    useEffect(() => {
        if (mode === "edit" && initialData && open) {
            form.reset({
                name: initialData.name,
                description: initialData.description || "",
                image: initialData.image,
            });
        } else if (mode === "create" && open === false) {
            form.reset({ name: "", description: "", image: "" });
        }
    }, [mode, initialData, open, form]);

    async function uploadImage(file: File) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `categories/${fileName}`;

        const { error } = await supabase.storage
            .from("images_url")
            .upload(filePath, file);

        if (error) {
            throw new Error("Image upload failed: " + error.message);
        }

        const { data } = supabase.storage.from("images_url").getPublicUrl(filePath);
        return data.publicUrl;
    }

    const handleSubmit = async (values: CategorySchemaType) => {
        try {
            setIsUploading(true);
            let imageUrl = "";

            if (values.image instanceof File) {
                imageUrl = await uploadImage(values.image);
            } else {
                imageUrl = values.image as string;
            }

            await onSubmit({ ...values, image: imageUrl }, initialData?.id);

            form.reset();
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload image or save category");
        } finally {
            setIsUploading(false);
        }
    };

    const title = mode === "create" ? "Create New Category" : "Edit Category";
    const description = mode === "create"
        ? "Add a new category to organize your products."
        : "Update the category details.";
    const buttonLabel = mode === "create" ? "Create Category" : "Update Category";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger ? (
                <DialogTrigger asChild>{trigger}</DialogTrigger>
            ) : (
                <DialogTrigger asChild>
                    <Button
                        size="sm"
                            className="bg-sky-700 hover:bg-sky-900 gap-2 cursor-pointer"
                        disabled={isLoading}
                    >
                        <Plus className="size-4" />
                        {isLoading ? "Processing..." : "New Category"}
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Category name" {...field} disabled={isLoading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Category description"
                                            {...field}
                                            disabled={isLoading}
                                            rows={3}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field: { onChange, value, ...rest } }) => (
                                <FormItem>
                                    <FormLabel>Image *</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) onChange(file);
                                            }}
                                            disabled={isLoading}
                                            {...rest}
                                            value={undefined}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-sky-700 hover:bg-sky-900 cursor-pointer"
                            >
                                {isLoading ? "Saving..." : buttonLabel}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}