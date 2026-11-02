import type { NextConfig } from "next";
import site from "./content/site.json";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

function localize(path: string, locale: "nl" | "en"): string {
  if (path.startsWith("http")) return path;
  if (locale === "nl") return path;
  if (path === "/") return "/en";
  return `/en${path}`;
}

const redirects = site.redirects.flatMap((rule) =>
  (["nl", "en"] as const).map((locale) => ({
    source: localize(rule.source, locale),
    destination: localize(rule.destination, locale),
    permanent: true,
  })),
);

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return redirects;
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
