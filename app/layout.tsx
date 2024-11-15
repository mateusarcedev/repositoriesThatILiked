import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from 'next-themes';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Atualize as informações de metadata para um melhor SEO
export const metadata: Metadata = {
  title: "Repositórios Favoritos do GitHub | Mateus Arce",
  description: "Explore minha coleção curada de repositórios favoritos do GitHub. Encontre projetos interessantes em diversas linguagens de programação, ferramentas e frameworks.",
  keywords: "github, repositórios, código aberto, desenvolvimento, programação, react, javascript, typescript, favoritos, stars",
  openGraph: {
    title: "Repositórios Favoritos do GitHub | Mateus Arce",
    description: "Explore minha coleção curada de repositórios favoritos do GitHub. Encontre projetos interessantes em diversas linguagens de programação, ferramentas e frameworks.",
    type: "website",
    locale: "en_US",
    url: "https://mateusarce.dev",
    siteName: "repositoriesThatILike",
    images: [
      {
        url: "https://www.example.com/og-image.jpg",
        width: 800,
        height: 600,
        alt: "Imagem de Exemplo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@technomancer",
    title: "repositoriesThatILike",
    description: "Explore minha coleção curada de repositórios favoritos do GitHub. Encontre projetos interessantes em diversas linguagens de programação, ferramentas e frameworks.",
    images: ["https://www.example.com/twitter-image.jpg"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
