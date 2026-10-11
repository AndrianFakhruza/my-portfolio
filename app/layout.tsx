import type { Metadata } from "next";
import { Geist, Roboto_Slab } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  variable: "--font-roboto-slab",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://andrian.design"),
  title: {
    default: "Andrian Fakhruza · Web Development, UI Design & Data Science",
    template: "%s · Andrian Fakhruza",
  },
  description:
    "Portofolio Andrian Fakhruza: Lulusan Teknik Informatika Politeknik Negeri Lhokseumawe dengan keahlian Web Development, UI Design, Data Science, dan Machine Learning.",
  keywords: [
    "Andrian Fakhruza",
    "Web Developer",
    "UI Designer",
    "Data Science",
    "Machine Learning",
    "Teknik Informatika",
    "Politeknik Negeri Lhokseumawe",
    "Next.js",
    "Portfolio",
  ],
  authors: [{ name: "Andrian Fakhruza" }],
  creator: "Andrian Fakhruza",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://andrian.design",
    title: "Andrian Fakhruza · Web Development, UI Design & Data Science",
    description:
      "Portofolio profesional Andrian Fakhruza dalam pembangunan website modern, desain UI responsif, serta eksplorasi Data Science dan Machine Learning.",
    siteName: "Andrian Fakhruza Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Andrian Fakhruza · Web Development, UI Design & Data Science",
    description:
      "Portofolio profesional Andrian Fakhruza dalam pembangunan website modern, desain UI responsif, serta eksplorasi Data Science dan Machine Learning.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className={`${geist.variable} ${robotoSlab.variable}`}>
      <body suppressHydrationWarning className="font-sans min-h-screen flex flex-col selection:bg-accent-500 selection:text-[#18181B]">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
