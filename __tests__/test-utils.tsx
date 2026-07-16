import type { ReactElement, ReactNode } from "react";
import { render as rtlRender, type RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";

// Components migrated to next-intl call useTranslations(), which needs a
// NextIntlClientProvider in the tree. Wrap every render with the real English
// catalog so component tests exercise the same strings the app ships.
function IntlWrapper({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

function render(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return rtlRender(ui, { wrapper: IntlWrapper, ...options });
}

// Re-export the rest of Testing Library; the local `render` shadows the star.
export * from "@testing-library/react";
export { render };
