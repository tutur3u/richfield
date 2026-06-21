"use client";

import { Toaster } from "sonner";

export function RichfieldToaster() {
	return (
		<Toaster
			closeButton
			position="bottom-right"
			richColors
			toastOptions={{ duration: 3200 }}
		/>
	);
}
