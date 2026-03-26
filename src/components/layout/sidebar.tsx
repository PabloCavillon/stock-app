import { auth } from "@/auth"
import SidebarClient from "./sidebar-client";

export async function Sidebar() {
    const session = await auth();
    const role = session?.user?.role ?? "SELLER"

    return <SidebarClient role={role} />
}