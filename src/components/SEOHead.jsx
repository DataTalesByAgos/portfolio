import { useEffect } from 'react'
import portfolioData, { findBlogPostBySlug, getLocalizedPost } from '../data'
import { absoluteUrl, blogPostPath, homePath, DEFAULT_LOCALE } from '../lib/routes'

const SITE_NAME = 'Agostina Silva — Data Scientist'

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href, extra = {}) {
  if (!href) return
  const selector = Object.entries(extra).reduce(
    (acc, [k, v]) => `${acc}[${k}="${v}"]`,
    `link[rel="${rel}"]`
  )
  let el = document.querySelector(selector)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    Object.entries(extra).forEach(([k, v]) => el.setAttribute(k, v))
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id)
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = id
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

function removeJsonLd(id) {
  document.getElementById(id)?.remove()
}

export default function SEOHead({ language, slug }) {
  useEffect(() => {
    const data = portfolioData[language]
    const post = slug ? findBlogPostBySlug(language, slug) : null

    document.documentElement.lang = language === 'es' ? 'es' : 'en'

    if (post) {
      const title = `${post.title} | ${SITE_NAME}`
      const description = post.excerpt
      const canonical = absoluteUrl(blogPostPath(language, post.slug))
      const alternatePost = getLocalizedPost(language, language === 'es' ? 'en' : 'es', post)
      const alternateLang = language === 'es' ? 'en' : 'es'
      const alternateUrl = alternatePost
        ? absoluteUrl(blogPostPath(alternateLang, alternatePost.slug))
        : absoluteUrl(homePath(alternateLang))

      document.title = title
      upsertMeta('name', 'description', description)
      upsertMeta('property', 'og:title', post.title)
      upsertMeta('property', 'og:description', description)
      upsertMeta('property', 'og:type', 'article')
      upsertMeta('property', 'og:url', canonical)
      upsertMeta('name', 'twitter:card', 'summary_large_image')
      upsertMeta('name', 'twitter:title', post.title)
      upsertMeta('name', 'twitter:description', description)
      upsertLink('canonical', canonical)
      upsertLink('alternate', alternateUrl, { hreflang: alternateLang })
      upsertLink('alternate', canonical, { hreflang: language })
      upsertLink('alternate', absoluteUrl(homePath('es')), { hreflang: 'es' })
      upsertLink('alternate', absoluteUrl(homePath('en')), { hreflang: 'en' })
      upsertLink('alternate', absoluteUrl(homePath(DEFAULT_LOCALE)), { hreflang: 'x-default' })
      upsertJsonLd('portfolio-jsonld', {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        inLanguage: language === 'es' ? 'es-AR' : 'en-US',
        url: canonical,
        author: {
          '@type': 'Person',
          name: data.personalInfo.name,
        },
      })
    } else {
      const title = SITE_NAME
      const description = data.personalInfo.bio
      const canonical = absoluteUrl(homePath(language))
      const alternateLang = language === 'es' ? 'en' : 'es'

      document.title = title
      upsertMeta('name', 'description', description)
      upsertMeta('property', 'og:title', title)
      upsertMeta('property', 'og:description', description)
      upsertMeta('property', 'og:type', 'website')
      upsertMeta('property', 'og:url', canonical)
      upsertMeta('name', 'twitter:card', 'summary')
      upsertMeta('name', 'twitter:title', title)
      upsertMeta('name', 'twitter:description', description)
      upsertLink('canonical', canonical)
      upsertLink('alternate', absoluteUrl(homePath(alternateLang)), { hreflang: alternateLang })
      upsertLink('alternate', canonical, { hreflang: language })
      upsertLink('alternate', absoluteUrl(homePath('es')), { hreflang: 'es' })
      upsertLink('alternate', absoluteUrl(homePath('en')), { hreflang: 'en' })
      upsertLink('alternate', absoluteUrl(homePath(DEFAULT_LOCALE)), { hreflang: 'x-default' })
      removeJsonLd('portfolio-jsonld')
    }
  }, [language, slug])

  return null
}
