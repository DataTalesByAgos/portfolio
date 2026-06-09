export const LOCALES = ['es', 'en']
export const DEFAULT_LOCALE = 'es'
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://datatalesbyagos.github.io').replace(/\/$/, '')

export function isValidLocale(lang) {
  return lang === 'es' || lang === 'en'
}

export function homePath(lang) {
  return `/${lang}`
}

export function blogPostPath(lang, slug) {
  return `/${lang}/blog/${slug}`
}

export function sectionPath(lang, section) {
  return `/${lang}#${section}`
}

export function absoluteUrl(path) {
  return `${SITE_URL}${path}`
}
