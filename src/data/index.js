import esUi from './es/ui.json';
import esProjects from './es/projects.json';
import esBlog from './es/blog.json';

import enUi from './en/ui.json';
import enProjects from './en/projects.json';
import enBlog from './en/blog.json';

const portfolioData = {
  es: {
    ...esUi,
    projects: esProjects,
    blogPosts: esBlog
  },
  en: {
    ...enUi,
    projects: enProjects,
    blogPosts: enBlog
  }
};

/** Resolve a blog post by hash slug, including cross-locale fallbacks for shared links. */
export function findBlogPostBySlug(language, slug) {
  const posts = portfolioData[language].blogPosts;
  const direct = posts.find(p => p.slug === slug);
  if (direct) return direct;

  const otherLang = language === 'es' ? 'en' : 'es';
  const otherIndex = portfolioData[otherLang].blogPosts.findIndex(p => p.slug === slug);
  if (otherIndex === -1) return null;

  return posts[otherIndex] ?? null;
}

/** Map a post to its counterpart in another locale (parallel blog array order). */
export function getLocalizedPost(sourceLang, targetLang, post) {
  if (!post) return null;

  const sourcePosts = portfolioData[sourceLang].blogPosts;
  const targetPosts = portfolioData[targetLang].blogPosts;
  const index = sourcePosts.findIndex(p => p.slug === post.slug);

  if (index !== -1) return targetPosts[index] ?? null;

  return findBlogPostBySlug(targetLang, post.slug);
}

export default portfolioData;
