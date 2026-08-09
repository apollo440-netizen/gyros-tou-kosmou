/**
 * Όλες οι σημαίες του πακέτου flag-icons (SVG, αναλογία 4:3) ως τοπικά URLs.
 * Καμία εξωτερική κλήση — τα αρχεία συμπεριλαμβάνονται στο build.
 */
const flagModules = import.meta.glob('/node_modules/flag-icons/flags/4x3/*.svg', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const flagUrlByIso2 = new Map<string, string>();
for (const [path, url] of Object.entries(flagModules)) {
  const match = path.match(/\/([a-z0-9-]+)\.svg$/);
  if (match) flagUrlByIso2.set(match[1], url);
}

export function getFlagUrl(iso2: string): string | undefined {
  return flagUrlByIso2.get(iso2.toLowerCase());
}
