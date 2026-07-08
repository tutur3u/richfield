import Link from "next/link";
import Image from "next/image";

const TUTURUUU_LOGO_URL = "/media/branding/tuturuuu.svg";

export function RichfieldAdminLoginPanel({ loginHref }: { loginHref: string }) {
	return (
		<main className="section-band grid min-h-[calc(100vh-96px)] place-items-center px-4 py-12 sm:px-6">
			<section className="parchment-card w-full max-w-[420px] p-6 text-center sm:p-8">
				<Image
					alt="Tuturuuu logo"
					className="mx-auto"
					height={64}
					priority
					src={TUTURUUU_LOGO_URL}
					width={64}
				/>
				<p className="script-label mt-5">Admin access</p>
				<h1 className="font-display text-4xl leading-none text-[var(--navy)] sm:text-5xl">
					Login with Tuturuuu
				</h1>
				<p className="mx-auto mt-3 max-w-[280px] text-sm leading-6 text-[var(--ink-soft)]">
					Use your Tuturuuu account to open the dashboard.
				</p>
				<div className="mt-6 grid gap-3">
					<a className="button-primary w-full" href={loginHref}>
						Login with Tuturuuu
					</a>
					<Link className="button-secondary w-full" href="/">
						Back to site
					</Link>
				</div>
			</section>
		</main>
	);
}
