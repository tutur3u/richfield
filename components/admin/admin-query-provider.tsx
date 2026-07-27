"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

/**
 * Query client for the admin dashboard.
 *
 * Created inside state rather than at module scope: a module-level client is
 * shared across every request on the server, which would leak one editor's
 * content into another's cache.
 */
export function AdminQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Content changes only when someone in this dashboard changes it,
            // so refetching on every window focus is noise — mutations
            // invalidate precisely instead.
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 30_000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
