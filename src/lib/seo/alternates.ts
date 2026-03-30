export function getLanguageAlternates(pathname: string) {
  const normalized = pathname === "/" ? "" : pathname;
  return {
    "x-default": `${normalized || "/"}`,
    en: `${normalized || "/"}`,
    de: `${normalized || "/"}`,
  };
}
