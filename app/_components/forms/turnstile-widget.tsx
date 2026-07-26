"use client";

import Script from "next/script";
import { useId } from "react";

const TURNSTILE_SCRIPT =
  "https://challenges.cloudflare.com/turnstile/v0/api.js";

/**
 * Cloudflare Turnstile challenge for public forms.
 *
 * Rendered declaratively (`cf-turnstile` class + data attributes) so Cloudflare's
 * own script manages the lifecycle; it writes the result into a hidden
 * `cf-turnstile-response` input that posts with the form. The token is verified
 * by Tuturuuu, which holds the secret — this site only relays it, so the widget
 * needs nothing but the public site key.
 *
 * Renders nothing when no site key is configured, which keeps the form usable
 * on environments where Turnstile has not been set up yet rather than showing a
 * permanently broken challenge.
 */
export function TurnstileWidget({
  className,
  siteKey,
}: {
  className?: string;
  siteKey?: string;
}) {
  const widgetId = useId();

  if (!siteKey) return null;

  return (
    <div className={className}>
      <Script src={TURNSTILE_SCRIPT} strategy="lazyOnload" />
      <div
        className="cf-turnstile"
        data-appearance="interaction-only"
        data-sitekey={siteKey}
        data-theme="light"
        id={widgetId}
      />
    </div>
  );
}
