import { useTransactions } from "../../contexts/TransactionsContext";

export default function Dashboard() {
  const { getUniqueCustomers, getAllTimeRevenue } = useTransactions();

  const customers = getUniqueCustomers();
  const revenueData = getAllTimeRevenue();

  return (
    <div>
      <h1>إجمالي العملاء: {customers.length}</h1>
      {/* يمكنك عرض revenueData في رسم بياني هنا */}
    </div>
  );
}
