import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import Nav from "./_components/nav";
import { ThemeProvider } from "~/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "rubberduck.sh",
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`relative flex h-screen flex-col bg-background font-mono text-foreground ${inter.variable}`}
      >
        <TRPCReactProvider headers={headers()}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Nav />
            <div className="flex-1 p-6 md:p-16 lg:p-32">{children}</div>
          </ThemeProvider>
        </TRPCReactProvider>{" "}
      </body>
    </html>
  );
}
