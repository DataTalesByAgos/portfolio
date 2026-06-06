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

export default portfolioData;
