export type DocType = "pdf" | "pptx" | "unknown";

export function getDocType(url: string): DocType {
  const m = url.split("?")[0].toLowerCase();
  if (m.endsWith(".pdf")) return "pdf";
  if (m.endsWith(".pptx")) return "pptx";
  return "unknown";
}

export function toAbsoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  if (typeof window === "undefined") return pathOrUrl;
  return new URL(pathOrUrl, window.location.origin).toString();
}