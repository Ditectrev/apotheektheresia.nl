import type { Metadata } from "next";
import Script from "next/script";
import { Poppins, Roboto } from "next/font/google";
import { Consent } from "@/components/Consent";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PreviewBanner } from "@/components/PreviewBanner";
import { SkipLink } from "@/components/SkipLink";
import { siteUrl } from "@/lib/content";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  preload: true,
  variable: "--font-roboto",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
  preload: true,
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: "Apotheek Theresia",
};

const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t="system";var dark=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);var root=document.documentElement;root.dataset.theme=dark?"dark":"light";root.dataset.themeChoice=t;var path=location.pathname;root.lang=path==="/en"||path.indexOf("/en/")===0?"en":"nl";}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" suppressHydrationWarning className={`${roboto.variable} ${poppins.variable}`}>
      <head>
        <link rel="describedby" href="/llms.txt" />
        <Script id="theme-boot" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </head>
      <body>
        <PreviewBanner />
        <SkipLink />
        <Header />
        {children}
        <Footer />
        <Consent measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? ""} />
      </body>
    </html>
  );
}
