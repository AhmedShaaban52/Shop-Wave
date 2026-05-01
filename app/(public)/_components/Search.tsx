"use client";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

const Search = () => {
    const form = useForm({
        defaultValues: {
            search: "",
        },
    });

    const handleSubmit = () => {
        console.log("Search:");
    };

    return (
        <div className="flex flex-col w-full max-w-md">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="flex items-center gap-0 overflow-hidden rounded-full border border-primary dark:border-gray-600 dark:bg-primary-foreground shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                    <FormField
                        control={form.control}
                        name="search"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl>
                                    <Input
                                        placeholder="Search products..."
                                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 pl-4 pr-10 py-2 bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 mr-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <SearchIcon className="h-4 w-4" />
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default Search;