export function RichfieldAdminLoadingPanel() {
  return (
    <main className="section-band min-h-screen px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto grid min-w-0 max-w-7xl gap-6">
        <section className="parchment-card grid min-w-0 gap-5 p-5 sm:p-6">
          <p className="script-label">InkedByRichfield</p>
          <h1 className="break-words font-display text-4xl leading-none text-[var(--navy)] sm:text-6xl">
            Opening the dashboard
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-[var(--ink-soft)]">
            Checking your session, latest content, team access, and file room.
          </p>
          <progress
            aria-label="Dashboard is loading"
            className="h-3 w-full overflow-hidden border border-[rgba(184,112,81,0.34)] bg-white/72 [&::-moz-progress-bar]:animate-pulse [&::-moz-progress-bar]:bg-[var(--clay)] [&::-webkit-progress-bar]:bg-white/72 [&::-webkit-progress-value]:animate-pulse [&::-webkit-progress-value]:bg-[var(--clay)]"
            max={100}
            value={50}
          />
          <ol className="grid gap-2 text-sm leading-6 text-[var(--ink-soft)] sm:grid-cols-3">
            <li className="border border-[rgba(184,112,81,0.24)] bg-white/50 px-3 py-2">
              1. Confirming access
            </li>
            <li className="border border-[rgba(184,112,81,0.24)] bg-white/50 px-3 py-2">
              2. Loading site content
            </li>
            <li className="border border-[rgba(184,112,81,0.24)] bg-white/50 px-3 py-2">
              3. Preparing tools
            </li>
          </ol>
        </section>
      </div>
    </main>
  );
}
