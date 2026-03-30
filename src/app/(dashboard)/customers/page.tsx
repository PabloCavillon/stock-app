import { getCustomers } from "@/actions/customers";
import CustomersTable from "@/components/customers/customers-table";
import { UserCircle } from "lucide-react";
import { PageLayout } from '../../../components/common/layout-page';

export const metadata = {
  title: 'Clientes', 
};

export default async function CustomersPage() {
	const customers = await getCustomers();

	return (
		<PageLayout
			title="Clientes"
			subtitle={`Directorio: ${customers.length} contactos`}
			icon={UserCircle}
			buttonText="Nuevo Cliente"
			buttonHref="/customers/new"
		>
			<CustomersTable customers={customers} />
		</PageLayout>
	);
}