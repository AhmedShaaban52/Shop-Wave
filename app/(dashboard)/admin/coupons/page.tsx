// app/(dashboard)/admin/coupons/page.tsx
import { getCoupons } from "@/lib/actions/couponActions";
import CouponsView from "./_components/CouponsView";

export default async function CouponsPage() {
    const { data } = await getCoupons();
    return <CouponsView initialData={data || []} />;
}