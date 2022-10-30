import markdownIt from 'markdown-it';
import _ from 'lodash';
const md = new markdownIt({html: true, typographer: true})

interface Atributos {
  [atributo: string]: string;
}
let front_matter : Atributos
let hay_front_matter = false

import markdownItAttrs from "markdown-it-attrs";
//@ts-ignore
import markdownItSpans from "markdown-it-bracketed-spans";
//@ts-ignore
import markdownItDivs from "markdown-it-div";
//@ts-ignore
import markdownItFootnote from "markdown-it-footnote";
import markdownItFrontMatter from "markdown-it-front-matter";
import markdownItContainer from "markdown-it-container";

md.use(markdownItAttrs)
md.use(markdownItSpans)
md.use(markdownItDivs)
md.use(markdownItFootnote)
md.use(markdownItFrontMatter, function(fm: string) {
  hay_front_matter = true
  front_matter = _.fromPairs(fm.split('\n').filter(l => l.includes(':')).map(l => l.split(':')).map(p => [p[0],p[1].trim()]))
})

md.use(markdownItContainer, 'clase', {
  validate: function(params: string) {
    return params.trim().match(/^(.+)\s*$/);
  },

  render: function (tokens: any[], idx: number) {
    var m = tokens[idx].info.trim().match(/^(.+)\s*$/);

    if (tokens[idx].nesting === 1) {
      // opening tag
      return `<div class="${md.utils.escapeHtml(m[1])}">\n`

    } else {
      // closing tag
      return '</div>\n';
    }
  }
})

const render = (md_txt: string) => {
  let html = md.render(md_txt)
  if(hay_front_matter) {
    hay_front_matter = false
    return {html, front_matter}
  }else{
    return {html, front_matter: {}}
  }
}

export {md, render}
