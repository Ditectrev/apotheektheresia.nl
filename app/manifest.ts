import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Apotheek Theresia",
    short_name: "Theresia",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#008884",
    icons: [{ src: "/media/logo.jpg", sizes: "635x260", type: "image/jpeg" }],
  };
}
