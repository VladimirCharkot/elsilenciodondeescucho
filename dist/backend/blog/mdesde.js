"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = exports.md = void 0;
const markdown_it_1 = __importDefault(require("markdown-it"));
const lodash_1 = require("lodash");
exports.md = new markdown_it_1.default({ html: true, typographer: true });
let front_matter;
let hay_front_matter = false;
const markdown_it_attrs_1 = __importDefault(require("markdown-it-attrs"));
//@ts-ignore
const markdown_it_bracketed_spans_1 = __importDefault(require("markdown-it-bracketed-spans"));
//@ts-ignore
const markdown_it_div_1 = __importDefault(require("markdown-it-div"));
//@ts-ignore
const markdown_it_footnote_1 = __importDefault(require("markdown-it-footnote"));
const markdown_it_front_matter_1 = __importDefault(require("markdown-it-front-matter"));
const markdown_it_container_1 = __importDefault(require("markdown-it-container"));
exports.md.use(markdown_it_attrs_1.default);
exports.md.use(markdown_it_bracketed_spans_1.default);
exports.md.use(markdown_it_div_1.default);
exports.md.use(markdown_it_footnote_1.default);
exports.md.use(markdown_it_front_matter_1.default, function (fm) {
    hay_front_matter = true;
    front_matter = (0, lodash_1.fromPairs)(fm.split('\n').filter(l => l.includes(':')).map(l => l.split(':')).map(p => [p[0], p[1].trim()]));
});
exports.md.use(markdown_it_container_1.default, 'clase', {
    validate: function (params) {
        return params.trim().match(/^(.+)\s*$/);
    },
    render: function (tokens, idx) {
        var m = tokens[idx].info.trim().match(/^(.+)\s*$/);
        if (tokens[idx].nesting === 1) {
            // opening tag
            return `<div class="${exports.md.utils.escapeHtml(m[1])}">\n`;
        }
        else {
            // closing tag
            return '</div>\n';
        }
    }
});
const render = (md_txt) => {
    let html = exports.md.render(md_txt);
    if (hay_front_matter) {
        hay_front_matter = false;
        return { html, front_matter };
    }
    else {
        return { html, front_matter: {} };
    }
};
exports.render = render;
//# sourceMappingURL=mdesde.js.map