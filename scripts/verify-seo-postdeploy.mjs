#!/usr/bin/env node
import https from "node:https";

const sitemap = process.argv[2] || "https://lordenryque.com/sitemap.xml";

function fetch(url, timeout = 20000) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: "GET",
        headers: {
          "User-Agent": "SEO-Verify/1.0",
          Accept: "*/*",
        },
        timeout,
      },
      (res) => {
        const chunks = [];
        res.on("data", (d) => chunks.push(d));
        res.on("end", () => {
          resolve({
            status: res.statusCode || 0,
            headers: res.headers,
            body: Buffer.concat(chunks).toString("utf8"),
          });
        });
      },
    );
    req.on("error", reject);
    req.on("timeout", () => req.destroy(new Error(`timeout: ${url}`)));
    req.end();
  });
}

function extractTagContent(xml, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi");
  const out = [];
  let m;
  while ((m = re.exec(xml))) out.push(m[1].trim());
  return out;
}

function normalizePath(pathname) {
  if (!pathname) return "/";
  return pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
}

function parseCanonical(html) {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
  if (!m) return null;
  const h = m[0].match(/href=["']([^"']+)["']/i);
  return h ? h[1] : null;
}

function parseAlternates(html) {
  const re = /<link[^>]+rel=["']alternate["'][^>]*>/gi;
  const out = [];
  let m;
  while ((m = re.exec(html))) {
    const tag = m[0];
    const hreflang = (tag.match(/hreflang=["']([^"']+)["']/i) || [])[1];
    const href = (tag.match(/href=["']([^"']+)["']/i) || [])[1];
    if (hreflang && href) out.push({ hreflang: hreflang.toLowerCase(), href });
  }
  return out;
}

function toAbs(url, base) {
  try {
    return new URL(url, base).toString();
  } catch {
    return null;
  }
}

function localeFromPath(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  if (!parts.length) return "x-default";
  if (parts[0] === "en" || parts[0] === "de") return parts[0];
  return "x-default";
}

(async () => {
  const started = Date.now();
  const root = await fetch(sitemap);
  if (root.status !== 200) {
    console.error(`Root sitemap is not 200: ${root.status}`);
    process.exit(2);
  }

  const rootLocs = extractTagContent(root.body, "loc");
  const childSitemaps = rootLocs.filter((u) => u.endsWith(".xml") && u !== sitemap);

  let urls = [];
  if (childSitemaps.length) {
    for (const sm of childSitemaps) {
      const r = await fetch(sm);
      if (r.status === 200) urls.push(...extractTagContent(r.body, "loc"));
    }
  } else {
    urls = rootLocs;
  }

  urls = [...new Set(urls)];

  const metrics = {
    total: urls.length,
    status3xx: 0,
    status4xx: 0,
    status5xx: 0,
    canonicalMismatch: 0,
    hreflangXDefaultMissing: 0,
    hreflangSelfMissing: 0,
    hreflangReciprocalMissing: 0,
    issues: {
      status3xx: [],
      status4xx: [],
      status5xx: [],
      canonicalMismatch: [],
      hreflangXDefaultMissing: [],
      hreflangSelfMissing: [],
      hreflangReciprocalMissing: [],
    },
  };

  const pageMeta = new Map();

  for (const url of urls) {
    const res = await fetch(url).catch((e) => ({
      status: 0,
      error: String(e),
      headers: {},
      body: "",
    }));

    const status = res.status || 0;
    if (status >= 300 && status < 400) {
      metrics.status3xx += 1;
      metrics.issues.status3xx.push(url);
    }
    if (status >= 400 && status < 500) {
      metrics.status4xx += 1;
      metrics.issues.status4xx.push(url);
    }
    if (status >= 500 || status === 0) {
      metrics.status5xx += 1;
      metrics.issues.status5xx.push(`${url}${res.error ? ` (${res.error})` : ""}`);
    }

    if (status === 200 && /text\/html/i.test(String(res.headers["content-type"] || ""))) {
      const canonical = parseCanonical(res.body);
      const alternates = parseAlternates(res.body);
      pageMeta.set(url, { canonical, alternates });

      const urlPath = normalizePath(new URL(url).pathname);
      const canonicalAbs = canonical ? toAbs(canonical, url) : null;
      const canonicalPath = canonicalAbs ? normalizePath(new URL(canonicalAbs).pathname) : null;

      if (!canonicalPath || canonicalPath !== urlPath) {
        metrics.canonicalMismatch += 1;
        metrics.issues.canonicalMismatch.push(`${url} -> ${canonical || "MISSING"}`);
      }

      const hasXDefault = alternates.some((a) => a.hreflang === "x-default");
      if (!hasXDefault) {
        metrics.hreflangXDefaultMissing += 1;
        metrics.issues.hreflangXDefaultMissing.push(url);
      }

      const locale = localeFromPath(urlPath);
      const selfHref = alternates.find((a) => a.hreflang === locale)?.href;
      const selfAbs = selfHref ? toAbs(selfHref, url) : null;
      const selfPath = selfAbs ? normalizePath(new URL(selfAbs).pathname) : null;

      if (!selfPath || selfPath !== urlPath) {
        metrics.hreflangSelfMissing += 1;
        metrics.issues.hreflangSelfMissing.push(
          `${url} (expected ${locale} -> ${urlPath}, got ${selfHref || "MISSING"})`,
        );
      }
    }
  }

  const canonicalPathToUrl = new Map();
  for (const [url, meta] of pageMeta.entries()) {
    const canonicalUrl = meta.canonical ? toAbs(meta.canonical, url) : url;
    if (!canonicalUrl) continue;
    canonicalPathToUrl.set(normalizePath(new URL(canonicalUrl).pathname), url);
  }

  for (const [url, meta] of pageMeta.entries()) {
    const sourcePath = normalizePath(new URL(url).pathname);
    const sourceLocale = localeFromPath(sourcePath);

    for (const alt of meta.alternates) {
      if (alt.hreflang === sourceLocale || alt.hreflang === "x-default") continue;
      const targetAbs = toAbs(alt.href, url);
      if (!targetAbs) continue;

      const targetPath = normalizePath(new URL(targetAbs).pathname);
      const targetUrl = canonicalPathToUrl.get(targetPath) || targetAbs;
      const targetMeta = pageMeta.get(targetUrl);
      if (!targetMeta) continue;

      const back = targetMeta.alternates.find((a) => a.hreflang === sourceLocale);
      const backAbs = back ? toAbs(back.href, targetUrl) : null;
      const backPath = backAbs ? normalizePath(new URL(backAbs).pathname) : null;

      if (!backPath || backPath !== sourcePath) {
        metrics.hreflangReciprocalMissing += 1;
        metrics.issues.hreflangReciprocalMissing.push(
          `${url} -> ${targetUrl} missing return ${sourceLocale}`,
        );
      }
    }
  }

  console.log("=== SEO VERIFICATION ===");
  console.log(`SITEMAP=${sitemap}`);
  console.log(`TOTAL_URLS=${metrics.total}`);
  console.log(`STATUS_3XX=${metrics.status3xx}`);
  console.log(`STATUS_4XX=${metrics.status4xx}`);
  console.log(`STATUS_5XX=${metrics.status5xx}`);
  console.log(`CANONICAL_MISMATCH=${metrics.canonicalMismatch}`);
  console.log(`HREFLANG_XDEFAULT_MISSING=${metrics.hreflangXDefaultMissing}`);
  console.log(`HREFLANG_SELF_MISSING=${metrics.hreflangSelfMissing}`);
  console.log(`HREFLANG_RECIPROCAL_MISSING=${metrics.hreflangReciprocalMissing}`);
  console.log(`DURATION_MS=${Date.now() - started}`);

  const printTop = (name, arr) => {
    if (!arr.length) return;
    console.log(`\n-- ${name} (${arr.length}) --`);
    for (const item of arr.slice(0, 10)) console.log(item);
  };

  printTop("STATUS_3XX", metrics.issues.status3xx);
  printTop("STATUS_4XX", metrics.issues.status4xx);
  printTop("STATUS_5XX", metrics.issues.status5xx);
  printTop("CANONICAL_MISMATCH", metrics.issues.canonicalMismatch);
  printTop("HREFLANG_XDEFAULT_MISSING", metrics.issues.hreflangXDefaultMissing);
  printTop("HREFLANG_SELF_MISSING", metrics.issues.hreflangSelfMissing);
  printTop("HREFLANG_RECIPROCAL_MISSING", metrics.issues.hreflangReciprocalMissing);

  const hasFailures =
    metrics.status3xx > 0 ||
    metrics.status4xx > 0 ||
    metrics.status5xx > 0 ||
    metrics.canonicalMismatch > 0 ||
    metrics.hreflangXDefaultMissing > 0 ||
    metrics.hreflangSelfMissing > 0 ||
    metrics.hreflangReciprocalMissing > 0;

  process.exit(hasFailures ? 1 : 0);
})();
