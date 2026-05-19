import { getAllOrders } from "./actions";
import OrdersView from "./_components/OrdersView";

export default async function OrdersPage() {
    const { data } = await getAllOrders();
    return <OrdersView initialData={data || []} />;
}