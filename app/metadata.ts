import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Repositórios Favoritos do GitHub | Mateus Arce",
  description:
    "Explore minha coleção curada de repositórios favoritos do GitHub. Encontre projetos interessantes em diversas linguagens de programação, ferramentas e frameworks.",
  keywords:
    "github, repositórios, código aberto, desenvolvimento, programação, react, javascript, typescript, favoritos, stars",
  openGraph: {
    title: "Repositórios Favoritos do GitHub | Mateus Arce",
    description:
      "Explore minha coleção curada de repositórios favoritos do GitHub. Encontre projetos interessantes em diversas linguagens de programação, ferramentas e frameworks.",
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
    description:
      "Explore minha coleção curada de repositórios favoritos do GitHub. Encontre projetos interessantes em diversas linguagens de programação, ferramentas e frameworks.",
    images: ["https://www.example.com/twitter-image.jpg"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};
