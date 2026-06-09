import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync, copyFileSync } from 'fs'
import { resolve } from 'path'

function seoBuildPlugin(siteUrl) {
  return {
    name: 'seo-build',
    closeBundle() {
      const distDir = resolve('dist')
      const esBlog = JSON.parse(readFileSync(resolve('src/data/es/blog.json'), 'utf8'))
      const enBlog = JSON.parse(readFileSync(resolve('src/data/en/blog.json'), 'utf8'))

      const urls = [
        { loc: `${siteUrl}/es`, changefreq: 'weekly', priority: '1.0' },
        { loc: `${siteUrl}/en`, changefreq: 'weekly', priority: '1.0' },
        ...esBlog.map(post => ({
          loc: `${siteUrl}/es/blog/${post.slug}`,
          changefreq: 'monthly',
          priority: '0.8',
        })),
        ...enBlog.map(post => ({
          loc: `${siteUrl}/en/blog/${post.slug}`,
          changefreq: 'monthly',
          priority: '0.8',
        })),
      ]

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>
`

      writeFileSync(resolve(distDir, 'sitemap.xml'), sitemap)
      copyFileSync(resolve(distDir, 'index.html'), resolve(distDir, '404.html'))
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const siteUrl = (env.VITE_SITE_URL || 'https://datatalesbyagos.github.io').replace(/\/$/, '')

  return {
    plugins: [react(), seoBuildPlugin(siteUrl)],
  }
})
