import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Golf N Ganja",
    short_name: "GNG",
    description:
      "Golf N Ganja livestreams, clips, podcasts, media, and community.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#050706",
    theme_color: "#050706",
    categories: ["sports", "entertainment", "social"],
    icons: [
      {
        src: "/brand/gng-green.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/gng-green.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/brand/gng-cut.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
