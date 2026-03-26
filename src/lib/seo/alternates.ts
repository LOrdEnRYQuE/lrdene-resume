export function getLanguageAlternates(pathname: string) {
  const normalized = pathname === "/" ? "" : pathname;
  return {
    "x-default": `/en${normalized}`,
    "en-US": `/en${normalized}`,
    "de-DE": `/de${normalized}`,
  };
}

