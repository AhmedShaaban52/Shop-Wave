/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/_components/CrudModal.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm, FieldValues, DefaultValues, Path, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form, FormControl, FormField,
    FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ModalField } from "@/lib/types";
import Image from "next/image";

interface CrudModalProps<T extends FieldValues> {
    title: string;
    description?: string;
    schema: ZodType<T>;
    fields: ModalField[];
    defaultValues: DefaultValues<T>;
    mode?: "create" | "edit";
    initialData?: T & { id?: string };
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger?: React.ReactNode;
    triggerLabel?: string;
    onSubmit: (values: T, id?: string) => Promise<void>;
    isSubmitting?: boolean;
    uploadPath?: string;
}

export function CrudModal<T extends FieldValues>({
    title,
    description,
    schema,
    fields,
    defaultValues,
    mode = "create",
    initialData,
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange,
    trigger,
    triggerLabel = "New Item",
    onSubmit,
    isSubmitting = false,
    uploadPath,
}: CrudModalProps<T>) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [previews, setPreviews] = useState<Record<string, string>>({});

    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setOpen = controlledOnOpenChange || setInternalOpen;
    const isLoading = isUploading || isSubmitting;

    const form = useForm<T>({
        resolver: zodResolver(schema as any),
        defaultValues,
    });

    useEffect(() => {
        if (mode === "edit" && initialData && open) {
            form.reset(initialData as DefaultValues<T>);
            const imagePreviews: Record<string, string> = {};

            const data = initialData as any;
            fields.forEach((f) => {
                if (f.type === "file" && typeof data[f.name] === "string") {
                    imagePreviews[f.name] = data[f.name];
                }
            });
            setPreviews(imagePreviews);
        } else if (!open) {
            form.reset(defaultValues);
            setPreviews({});
        }
    }, [open, mode, initialData, fields, form, defaultValues]);

    async function uploadImage(file: File, fieldName: string): Promise<string> {
        const path = uploadPath || fieldName;
        const ext = file.name.split(".").pop();
        const filePath = `${path}/${Date.now()}.${ext}`;

        const { error } = await supabase.storage
            .from("images_url")
            .upload(filePath, file);

        if (error) throw new Error("Upload failed: " + error.message);

        const { data } = supabase.storage.from("images_url").getPublicUrl(filePath);
        return data.publicUrl;
    }

    const handleSubmit = async (values: T) => {
        try {
            setIsUploading(true);
            const processed = { ...values } as any;

            for (const field of fields) {
                if (field.type === "file" && processed[field.name] instanceof File) {
                    processed[field.name] = await uploadImage(
                        processed[field.name] as File,
                        field.name
                    );
                }
            }

            await onSubmit(processed as T, initialData?.id);
            form.reset(defaultValues);
            setPreviews({});
            setOpen(false);
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        } finally {
            setIsUploading(false);
        }
    };

    const renderField = (fieldConfig: ModalField) => (
        <FormField
            key={fieldConfig.name}
            control={form.control as unknown as Control<T>}
            name={fieldConfig.name as Path<T>}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        {fieldConfig.label}
                        {fieldConfig.required && " *"}
                    </FormLabel>
                    <FormControl>
                        {fieldConfig.type === "textarea" ? (
                            <Textarea
                                placeholder={fieldConfig.placeholder}
                                rows={3}
                                disabled={isLoading}
                                {...field}
                                value={(field.value as string) ?? ""}
                            />
                        ) : fieldConfig.type === "select" ? (
                            <Select
                                onValueChange={field.onChange}
                                value={field.value as string}
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={fieldConfig.placeholder || "Select..."} />
                                </SelectTrigger>
                                <SelectContent>
                                    {fieldConfig.options?.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : fieldConfig.type === "file" ? (
                            <div className="space-y-2">
                                {previews[fieldConfig.name] && (
                                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                                        <Image
                                            src={previews[fieldConfig.name]}
                                            alt="preview"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <Input
                                    type="file"
                                    accept={fieldConfig.accept || "image/*"}
                                    disabled={isLoading}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            field.onChange(file);
                                            setPreviews((prev) => ({
                                                ...prev,
                                                [fieldConfig.name]: URL.createObjectURL(file),
                                            }));
                                        }
                                    }}
                                />
                            </div>
                        ) : (
                            <Input
                                type={fieldConfig.type}
                                placeholder={fieldConfig.placeholder}
                                min={fieldConfig.min}
                                max={fieldConfig.max}
                                disabled={isLoading}
                                {...field}
                                value={(field.value as string | number) ?? ""}
                                onChange={(e) =>
                                    field.onChange(
                                        fieldConfig.type === "number"
                                            ? Number(e.target.value)
                                            : e.target.value
                                    )
                                }
                            />
                        )}
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );

    const renderFields = () => {
        const result: React.ReactNode[] = [];
        let i = 0;

        while (i < fields.length) {
            const current = fields[i];
            const next = fields[i + 1];

            if (current.colSpan === 1 && next?.colSpan === 1) {
                result.push(
                    <div key={`row-${i}`} className="grid grid-cols-2 gap-4">
                        {renderField(current)}
                        {renderField(next)}
                    </div>
                );
                i += 2;
            } else {
                result.push(<div key={`row-${i}`}>{renderField(current)}</div>);
                i += 1;
            }
        }

        return result;
    };

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
                        {isLoading ? "Processing..." : triggerLabel}
                    </Button>
                </DialogTrigger>
            )}

            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? `Create ${title}` : `Edit ${title}`}
                    </DialogTitle>
                    {description && (
                        <DialogDescription>{description}</DialogDescription>
                    )}
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit as any)} className="space-y-4">
                        {renderFields()}
                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-sky-700 hover:bg-sky-900 cursor-pointer"
                            >
                                {isLoading
                                    ? "Saving..."
                                    : mode === "create"
                                        ? `Create ${title}`
                                        : `Update ${title}`}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}