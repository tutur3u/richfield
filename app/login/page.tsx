import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Admin Login | Richfield Group",
	description: "Centralized Tuturuuu admin login for the Richfield Group portfolio.",
};

export default function LoginPage() {
	redirect("/admin/login?next=library");
}
