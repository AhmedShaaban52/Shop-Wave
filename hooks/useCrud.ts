"use client";

import { useState, useEffect, useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";

interface CrudActions<T, TInput> {
  getAll: () => Promise<{ success: boolean; data?: T[]; error?: string }>;
  create: (data: TInput) => Promise<{ success: boolean; error?: string }>;
  update: (
    id: string,
    data: TInput,
  ) => Promise<{ success: boolean; error?: string }>;
  delete: (
    id: string,
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
}

export function useCrud<T extends { id: string }, TInput>(
  actions: CrudActions<T, TInput>,
  messages = {
    created: "Created successfully!",
    updated: "Updated successfully!",
    deleted: "Deleted successfully!",
  },
  initialData: T[] = [],
) {
  const [items, setItems] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(initialData.length === 0);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const fetchAll = async () => {
    const result = await tryCatch(actions.getAll());
    if (result.error) {
      toast.error("Failed to load data");
      return;
    }
    if (result.data.success) setItems(result.data.data || []);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchAll();
      setLoading(false);
    };

    if (initialData.length === 0) {
      init();
    }
  }, []);

  const handleCreate = async (values: TInput): Promise<void> => {
    return new Promise((resolve, reject) => {
      startTransition(async () => {
        const result = await tryCatch(actions.create(values));
        if (result.error) {
          toast.error("An error occurred");
          reject();
          return;
        }
        if (result.data.success) {
          toast.success(messages.created);
          await fetchAll();
          setShowCreateModal(false);
          resolve();
        } else {
          toast.error(result.data.error || "Failed");
          reject();
        }
      });
    });
  };

  const handleUpdate = async (values: TInput, id?: string): Promise<void> => {
    if (!id) throw new Error("ID required");
    return new Promise((resolve, reject) => {
      startTransition(async () => {
        const result = await tryCatch(actions.update(id, values));
        if (result.error) {
          toast.error("An error occurred");
          reject();
          return;
        }
        if (result.data.success) {
          toast.success(messages.updated);
          await fetchAll();
          setEditingItem(null);
          resolve();
        } else {
          toast.error(result.data.error || "Failed");
          reject();
        }
      });
    });
  };

  const handleDelete = async (id: string) => {
    const result = await tryCatch(actions.delete(id));
    if (result.error) {
      toast.error("An error occurred");
      return;
    }
    if (result.data.success) {
      toast.success(messages.deleted);
      await fetchAll();
    } else {
      toast.error(result.data.error || "Failed to delete");
    }
  };

  return {
    items,
    loading,
    isPending,
    editingItem,
    setEditingItem,
    showCreateModal,
    setShowCreateModal,
    handleCreate,
    handleUpdate,
    handleDelete,
    fetchAll,
  };
}
