let markdownIt = require('markdown-it')
let _ = require('lodash')
let md = new markdownIt({html: true, typographer: true})
let front_matter
let hay_front_matter = false

let markdownItAttrs = require('markdown-it-attrs')
let markdownItSpans = require('markdown-it-bracketed-spans')
let markdownItDivs = require('markdown-it-div')
let markdownItFootnote = require('markdown-it-footnote')
let markdownItFrontMatter = require('markdown-it-front-matter')
let markdownItContainer = require('markdown-it-container')

md.use(markdownItAttrs)
md.use(markdownItSpans)
md.use(markdownItDivs)
md.use(markdownItFootnote)
md.use(markdownItFrontMatter, function(fm) {
  hay_front_matter = true
  front_matter = _.fromPairs(fm.split('\n').filter(l => l.includes(':')).map(l => l.split(':')).map(p => [p[0],p[1].trim()]))
})
md.use(markdownItContainer, 'clase', {
  validate: function(params) {
    return params.trim().match(/^(.+)\s*$/);
  },

  render: function (tokens, idx) {
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

exports.md = md
exports.render = (md_txt) => {
  let html = md.render(md_txt)
  if(hay_front_matter) {
    hay_front_matter = false
    return [html, front_matter]
  }else{
    return [html, {}]
  }
}
