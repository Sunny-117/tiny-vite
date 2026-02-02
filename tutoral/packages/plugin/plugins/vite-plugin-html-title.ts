import { Plugin } from 'vite'
export default function viteHTMLTitlePlugin({ title = '' }):Plugin { 
  return {
    name: 'vite-html-title-plugin',
    enforce:"pre",
    apply: 'serve',
    transformIndexHtml(html) { 
      return html.replace(/<title>(.*?)<\/title>/,`<title>${title}</title>`);
    }
  }
}