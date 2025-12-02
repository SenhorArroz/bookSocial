
import type { Metadata } from "next";
import Navbar  from "../_components/navbar";

export const metadata: Metadata = {
	title: "Dashboard",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div>
        <Navbar />
        {children}
        </div>;
}