import { getKits } from "@/actions/kits";
import KitsTable from "@/components/kits/kits-table";
import { Boxes } from "lucide-react";
import { PageLayout } from "@/components/ui/layout-page";

export const metadata = { title: "Kits" };

export default async function KitsPage() {
    const kits = await getKits();

    return (
        <PageLayout
            title="Kits & Ofertas"
            subtitle={`${kits.length} kit${kits.length !== 1 ? "s" : ""} registrado${kits.length !== 1 ? "s" : ""}`}
            icon={Boxes}
            buttonText="Nuevo Kit"
            buttonHref="/admin/kits/new"
        >
            <KitsTable kits={kits} />
        </PageLayout>
    );
}
