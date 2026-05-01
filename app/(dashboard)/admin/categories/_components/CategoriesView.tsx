"use client";

import { useCrud } from "@/hooks/useCrud";
import { CrudModal } from "../../../_components/CrudModal";
import { DataTable } from "../../../_components/Table";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../actions";
import { categorySchema, CategorySchemaType, type Category } from "@/lib/types";;
import { CATEGORY_DEFAULTS, getCategoryColumns, getCategoryFields } from "@/utils/CategoriesFields";


export default function CategoriesView({ initialData }: { initialData: Category[] }) {
    const {
        items: categories,
        loading,
        isPending,
        editingItem,
        setEditingItem,
        showCreateModal,
        setShowCreateModal,
        handleCreate,
        handleUpdate,
        handleDelete,
    } = useCrud<Category, CategorySchemaType>(
        {
            getAll: getCategories,
            create: createCategory,
            update: updateCategory,
            delete: deleteCategory,
        },
        {
            created: "Category created!",
            updated: "Category updated!",
            deleted: "Category deleted!",
        },
        initialData
    );

    const CATEGORY_FIELDS = getCategoryFields();
    const columns = getCategoryColumns({
        setEditingItem,
        handleDelete
    });


    return (
        <div className="bg-white flex-1 overflow-y-auto p-6  rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-sky-900 tracking-tight">
                    Categories Management
                </h2>

                <CrudModal<CategorySchemaType>
                    title="Category"
                    description="Add a new category to organize your products."
                    schema={categorySchema}
                    fields={CATEGORY_FIELDS}
                    defaultValues={CATEGORY_DEFAULTS}
                    uploadPath="categories"
                    triggerLabel="New Category"
                    open={showCreateModal}
                    onOpenChange={setShowCreateModal}
                    isSubmitting={isPending}
                    onSubmit={handleCreate}
                />
            </div>

            <DataTable
                data={categories}
                columns={columns}
                loading={loading}
                loadingMessage="Loading categories..."
                emptyMessage="No categories found"
                emptySubMessage="Create your first category to get started"
            />

            {editingItem && (
                <CrudModal<CategorySchemaType>
                    title="Edit Category"
                    schema={categorySchema}
                    fields={CATEGORY_FIELDS}
                    defaultValues={CATEGORY_DEFAULTS}
                    uploadPath="categories"
                    mode="edit"
                    initialData={{
                        id: editingItem.id,
                        name: editingItem.name,
                        description: editingItem.description || "",
                        image: editingItem.image,
                        isActive: (editingItem as any).isActive === false ? "false" : "true",
                    }}
                    open={!!editingItem}
                    onOpenChange={(open) => { if (!open) setEditingItem(null); }}
                    isSubmitting={isPending}
                    onSubmit={handleUpdate}
                    trigger={<></>}
                />
            )}
        </div>
    );
}