/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useForm, FieldValues, DefaultValues, Path, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";
import { Plus, X } from "lucide-react";
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
    const [previews, setPreviews] = useState<Record<string, any>>({});

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
            const imagePreviews: Record<string, any> = {};
            const data = initialData as any;
            fields.forEach((f) => {
                if (f.type === "file" && typeof data[f.name] === "string") {
                    imagePreviews[f.name] = data[f.name];
                }
                if (f.type === "files" && Array.isArray(data[f.name])) {
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
                if (field.type === "files" && Array.isArray(processed[field.name])) {
                    const urls: string[] = [];
                    for (const f of processed[field.name] as (File | string)[]) {
                        if (f instanceof File) {
                            urls.push(await uploadImage(f, uploadPath || field.name));
                        } else if (typeof f === "string") {
                            urls.push(f);
                        }
                    }
                    processed[field.name] = urls;
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
                                {previews[fieldConfig.name] && typeof previews[fieldConfig.name] === "string" && (
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
                        ) : fieldConfig.type === "files" ? (
                            <div className="space-y-3">
                                {/* Previews Grid */}
                                {(previews[fieldConfig.name] as string[] || []).length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {(previews[fieldConfig.name] as string[]).map((url, i) => (
                                            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                                <Image src={url} alt={`img-${i}`} fill className="object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const currentPreviews = (previews[fieldConfig.name] as string[]);
                                                        const currentValues = (field.value as (File | string)[]) || [];
                                                        setPreviews(prev => ({
                                                            ...prev,
                                                            [fieldConfig.name]: currentPreviews.filter((_, idx) => idx !== i),
                                                        }));
                                                        field.onChange(currentValues.filter((_, idx) => idx !== i));
                                                    }}
                                                    className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <Input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    disabled={isLoading}
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        if (!files.length) return;
                                        const newPreviews = files.map(f => URL.createObjectURL(f));
                                        const existingPreviews = (previews[fieldConfig.name] as string[]) || [];
                                        const existingValues = (field.value as (File | string)[]) || [];
                                        setPreviews(prev => ({
                                            ...prev,
                                            [fieldConfig.name]: [...existingPreviews, ...newPreviews],
                                        }));
                                        field.onChange([...existingValues, ...files]);
                                        e.target.value = "";
                                    }}
                                />
                                <p className="text-xs text-gray-400">
                                    {((previews[fieldConfig.name] as string[]) || []).length} image(s) — unlimited uploads
                                </p>
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

            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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