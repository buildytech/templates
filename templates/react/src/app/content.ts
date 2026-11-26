// The page's data: JSON fixtures (src/fixtures) and the ui dictionary (src/i18n, DictionaryV04 shape of
// @ui8kit/contract: { locale, messages }). No backend, no API calls: edit the JSON to change the site.
import home from "../fixtures/home.json"
import site from "../fixtures/site.json"
import en from "../i18n/en.json"

export type Dictionary = { locale: string; source_locale?: string; messages: Record<string, string> }
export type NavItem = { id: string; label: string; href: string }
export type Site = typeof site
export type Home = typeof home
export type Feature = Home["features"]["items"][number]

export const dictionary: Dictionary = en
export const t = (key: string): string => dictionary.messages[key] ?? key
export { home, site }
