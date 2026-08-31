# SEO operations

## Verification

Run the production-shaped build and audit locally:

```bash
bun run build
bun run start
bun run seo:audit
```

Audit a deployed host while keeping the production canonical expectation:

```bash
bun run seo:audit -- --base-url https://richfieldgroup.com.vn
```

The audit checks the web manifest, every static public page, and all URLs discovered in the
sitemap. It fails on HTTP errors, missing or incorrect canonicals and
hreflang links, missing search/social metadata, invalid heading structure,
indexing directives, and missing organization/website structured data. Add
`--output seo-report.json` when a dated JSON artifact is useful; generated
reports should not be committed.

## Search engine ownership

Set these optional Vercel environment variables with the content values from
the corresponding HTML-tag verification methods, then redeploy:

- `GOOGLE_SITE_VERIFICATION` for Google Search Console
- `BING_SITE_VERIFICATION` for Bing Webmaster Tools

After the verification tags are live, verify the domain properties and submit
`https://richfieldgroup.com.vn/sitemap.xml` in both products. Do not put the
verification tokens in the repository.

## Tracking cadence

Vercel Analytics records on-site page views. Search discovery should be
tracked in Search Console because it owns impressions, clicks, click-through
rate, average position, indexing, rich-result, and sitemap status.

Review monthly, comparing the latest complete 28-day period with the previous
28 days:

1. Branded and non-branded clicks, impressions, CTR, and average position.
2. Top landing pages and queries, split by country and device.
3. Indexed versus submitted sitemap URLs and canonical/hreflang exclusions.
4. News and job rich-result validity.
5. Vercel Analytics landing-page traffic and engagement after organic entry.

Record the date, comparison windows, metrics, anomalies, actions, and owner in
the team's operating tracker so changes are attributable over time.
