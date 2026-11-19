import projectConfig from "../../project.config";

const getFullUrl = (page: string | null | undefined = "") => {
  const pageWithSlash = (page ?? "").startsWith("/")
    ? (page ?? "")
    : `/${page ?? ""}`;

  return `${projectConfig.baseUrl}${pageWithSlash}`;
};

export default getFullUrl;
