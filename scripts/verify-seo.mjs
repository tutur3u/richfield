#!/usr/bin/env node

import { writeFile } from "node:fs/promises";

const args = process.argv.slice(2);
const option = (name) => {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
};

const baseUrl = new URL(option("--base-url") ?? "http://localhost:3000");
const canonicalOrigin = new URL(
  option("--canonical-origin") ?? "https://richfieldgroup.com.vn",
);
const output = option("--output");
const staticPaths = [
  "/",
  "/about/our-story",
  "/about/who-we-are",
  "/brands",
  "/logistics",
  "/distribution",
  "/news",
  "/careers",
  "/contact",
];

function content(html, pattern) {
  return html.match(pattern)?.[1]?.trim() ?? "";
}

function metaContent(html, attribute, value) {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return (
    content(
      html,
      new RegExp(
        `<meta[^>]+${attribute}=["']${escaped}["'][^>]+content=["']([^"']*)["'][^>]*>`,
        "i",
      ),
    ) ||
    content(
      html,
      new RegExp(
        `<meta[^>]+content=["']([^"']*)["'][^>]+${attribute}=["']${escaped}["'][^>]*>`,
        "i",
      ),
    )
  );
}

function linkHref(html, rel, hreflang) {
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];
  return (
    tags.find((tag) => {
      const relValue = content(tag, /\brel=["']([^"']+)["']/i);
      const language = content(tag, /\bhreflang=["']([^"']+)["']/i);
      return (
        relValue.split(/\s+/).includes(rel) &&
        (!hreflang || language === hreflang)
      );
    })?.match(/\bhref=["']([^"']+)["']/i)?.[1] ?? ""
  );
}

function localizedPath(locale, path) {
  return locale === "vi" ? (path === "/" ? "/vi" : `/vi${path}`) : path;
}

function expectedCanonical(locale, path) {
  return new URL(localizedPath(locale, path), canonicalOrigin).toString();
}

function equivalentUrl(left, right) {
  try {
    const leftUrl = new URL(left);
    const rightUrl = new URL(right);
    const normalizePath = (path) => (path === "/" ? "" : path.replace(/\/$/, ""));
    return (
      leftUrl.origin === rightUrl.origin &&
      normalizePath(leftUrl.pathname) === normalizePath(rightUrl.pathname) &&
      leftUrl.search === rightUrl.search
    );
  } catch {
    return false;
  }
}

function findJsonLd(html) {
  const scripts = [
    ...html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];
  return scripts.flatMap((match) => {
    try {
      const value = JSON.parse(match[1]);
      return Array.isArray(value) ? value : [value];
    } catch {
      return [];
    }
  });
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "RichfieldSEOAudit/1.0" },
    redirect: "follow",
  });
  return { response, text: await response.text() };
}

const failures = [];
const pages = [];

function check(condition, path, message) {
  if (!condition) failures.push({ path, message });
}

const { response: robotsResponse, text: robots } = await fetchText(
  new URL("/robots.txt", baseUrl),
);
check(robotsResponse.ok, "/robots.txt", `HTTP ${robotsResponse.status}`);
check(/Sitemap:\s+https:\/\/richfieldgroup\.com\.vn\/sitemap\.xml/i.test(robots), "/robots.txt", "canonical sitemap is missing");
check(/Disallow:\s+\/api\//i.test(robots), "/robots.txt", "API routes are crawlable");
check(!/Disallow:\s+\/(?:admin|login|verify-token)/i.test(robots), "/robots.txt", "noindex HTML routes are blocked from crawlers");

const { response: sitemapResponse, text: sitemap } = await fetchText(
  new URL("/sitemap.xml", baseUrl),
);
check(sitemapResponse.ok, "/sitemap.xml", `HTTP ${sitemapResponse.status}`);

const { response: manifestResponse, text: manifestText } = await fetchText(
  new URL("/manifest.webmanifest", baseUrl),
);
check(manifestResponse.ok, "/manifest.webmanifest", `HTTP ${manifestResponse.status}`);
try {
  const manifest = JSON.parse(manifestText);
  check(manifest.name === "Richfield Group", "/manifest.webmanifest", "site name is incorrect");
  check(Array.isArray(manifest.icons) && manifest.icons.length >= 2, "/manifest.webmanifest", "icons are missing");
} catch {
  check(false, "/manifest.webmanifest", "manifest is invalid JSON");
}

const sitemapPaths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
  .map((match) => {
    try {
      return new URL(match[1]).pathname;
    } catch {
      return null;
    }
  })
  .filter(Boolean);
const paths = [...new Set([
  ...staticPaths.flatMap((path) => [localizedPath("en", path), localizedPath("vi", path)]),
  ...sitemapPaths,
])];

for (const requestPath of paths) {
  const locale = requestPath === "/vi" || requestPath.startsWith("/vi/") ? "vi" : "en";
  const barePath = locale === "vi" ? requestPath.slice(3) || "/" : requestPath;
  const { response, text: html } = await fetchText(new URL(requestPath, baseUrl));
  const result = { path: requestPath, status: response.status };
  pages.push(result);

  check(response.ok, requestPath, `HTTP ${response.status}`);
  if (!response.ok) continue;

  const title = content(html, /<title[^>]*>([^<]+)<\/title>/i);
  const description = metaContent(html, "name", "description");
  const canonical = linkHref(html, "canonical");
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  const jsonLd = findJsonLd(html);

  check(title.length >= 10 && title.length <= 70, requestPath, `title length is ${title.length}`);
  check(description.length >= 50 && description.length <= 170, requestPath, `description length is ${description.length}`);
  check(equivalentUrl(canonical, expectedCanonical(locale, barePath)), requestPath, `canonical is ${canonical || "missing"}`);
  check(equivalentUrl(linkHref(html, "alternate", "en"), expectedCanonical("en", barePath)), requestPath, "English hreflang is incorrect");
  check(equivalentUrl(linkHref(html, "alternate", "vi"), expectedCanonical("vi", barePath)), requestPath, "Vietnamese hreflang is incorrect");
  check(equivalentUrl(linkHref(html, "alternate", "x-default"), expectedCanonical("en", barePath)), requestPath, "x-default hreflang is incorrect");
  check(h1Count === 1, requestPath, `expected one h1, found ${h1Count}`);
  check(!/noindex/i.test(metaContent(html, "name", "robots")), requestPath, "page is noindex");
  check(metaContent(html, "property", "og:title") !== "", requestPath, "og:title is missing");
  check(metaContent(html, "property", "og:description") !== "", requestPath, "og:description is missing");
  check(metaContent(html, "property", "og:image") !== "", requestPath, "og:image is missing");
  check(equivalentUrl(metaContent(html, "property", "og:url"), canonical), requestPath, "og:url does not match canonical");
  check(metaContent(html, "name", "twitter:card") !== "", requestPath, "twitter:card is missing");
  check(jsonLd.some((item) => item?.["@type"] === "Organization"), requestPath, "Organization JSON-LD is missing");
  check(jsonLd.some((item) => item?.["@type"] === "WebSite"), requestPath, "WebSite JSON-LD is missing");
}

for (const privatePath of ["/admin/login", "/verify-token"]) {
  const { response, text: html } = await fetchText(new URL(privatePath, baseUrl));
  const robotsMeta = metaContent(html, "name", "robots");
  check(response.ok, privatePath, `HTTP ${response.status}`);
  check(/noindex/i.test(robotsMeta), privatePath, "private page is indexable");
  check(/nofollow/i.test(robotsMeta), privatePath, "private page allows link following");
}

const report = {
  auditedAt: new Date().toISOString(),
  baseUrl: baseUrl.toString(),
  canonicalOrigin: canonicalOrigin.toString(),
  failures,
  pages,
  summary: {
    failedChecks: failures.length,
    passed: failures.length === 0,
    pagesAudited: pages.length,
  },
};

if (output) await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (failures.length > 0) process.exitCode = 1;
