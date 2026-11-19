const projectConfig = {
  siteName: "Vinod.lk",
  baseUrl:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NODE_ENV === "production"
      ? "https://vinod.lk"
      : "http://localhost:1204"),
};

export default projectConfig;
