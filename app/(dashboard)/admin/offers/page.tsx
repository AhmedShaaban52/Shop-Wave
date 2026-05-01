import OffersView from "./_components/OffersView";
import { getOffers } from "./actions";

export default async function OffersPage() {
    const { data } = await getOffers();
    const initialOffers = data ? data : [];


    return (
        <>
            <OffersView initialData={initialOffers} />
        </>
    );
}