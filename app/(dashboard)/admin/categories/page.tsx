import CategoriesView from "./_components/CategoriesView";
import { getCategories } from "./actions";


export default async function CategoriesPage() {

    const {data} = await getCategories();
    const initialCategories = data ? data : [];

    return (
        <>
            <CategoriesView initialData={initialCategories} />
        </>
    );
}