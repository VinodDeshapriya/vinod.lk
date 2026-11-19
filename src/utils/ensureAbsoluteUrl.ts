const ensureAbsoluteUrl = <T extends string | null | undefined>(url: T): T =>
  (url && !/^https?:\/\//i.test(url) ? (`https://${url}` as T) : url);

export default ensureAbsoluteUrl;
