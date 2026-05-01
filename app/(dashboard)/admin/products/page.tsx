
import ProductsView from "./_components/ProductsView";
import { getProducts } from "./actions";

export default async function ProductsPage() {
    const { data } = await getProducts();
    const initialProducts = data ? data : [];

    return (
        <>
            <ProductsView initialData={initialProducts} />
        </>
    );
}