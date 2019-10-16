/* eslint-env node */
'use strict';

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { oneLine } = require('common-tags');

class ContentInliner {
  constructor({ assetPath, directory }) {
    this.assetPath = assetPath;
    this.directory = directory;
  }
  sanitize(content) {
    return content;
  }
  compile() {
    let element = this.buildElement();
    let fullAssetPath = path.join(this.directory, this.assetPath);
    let content = fs.readFileSync(fullAssetPath, 'utf-8');
    // .data() is ignored on style/script tags
    element.attr('data-asset-path', this.assetPath);
    element.text(`\n${this.sanitize(content)}\n`);
    return element;
  }
}

class ScriptInliner extends ContentInliner {
  assertAssetPath() {
    return /^\/assets\/.*\.js/.test(this.assetPath);
  }
  sanitize(content) {
    return content.replace(/<(\/?script[^>]*)>/g, '&lt;$1&gt;');
  }
  buildElement() {
    return cheerio('<script type="application/javascript"></script>');
  }
}

class StyleInliner extends ContentInliner {
  assertAssetPath() {
    return /^\/assets\/.*\.css$/.test(this.assetPath);
  }
  sanitize(content) {
    return content.replace(/<(\/?style[^>]*)>/g, '&lt;$1&gt;');
  }
  buildElement() {
    return cheerio('<style type="text/css"></style>');
  }
}

function inlineReplace(Inliner, lookupOptions) {
  return function(_, element) {
    let node = cheerio(element);
    let inliner = new Inliner(lookupOptions(node));
    if (inliner.assertAssetPath()) {
      node.replaceWith(inliner.compile());
    }
  };
}

module.exports = {
  name: require('./package').name,

  included({ env: environment, project }) {
    let buildConfig = require(project.configPath());
    let { locationType } = buildConfig(environment);
    if (locationType !== 'hash') {
      this.ui.writeWarnLine(oneLine`
        Downloaded versions of the app will NOT WORK without
        locationType = 'hash' in config/environment [ember-quine]
      `);
    }
    return this._super.included.call(this, ...arguments);
  },

  postBuild({ directory }) {
    let indexFilePath = path.join(directory, 'index.html');
    let doc = cheerio.load(fs.readFileSync(indexFilePath, 'utf-8'));
    doc('style[data-asset-path]').each(inlineReplace(
      StyleInliner,
      (node) => ({ assetPath: node.attr('data-asset-path'), directory })
    ));
    doc('script[data-asset-path]').each(inlineReplace(
      ScriptInliner,
      (node) => ({ assetPath: node.attr('data-asset-path'), directory })
    ));
    doc('link[rel=stylesheet]').each(inlineReplace(
      StyleInliner,
      (node) => ({ assetPath: node.attr('href'), directory })
    ));
    doc('script[src]').each(inlineReplace(
      ScriptInliner,
      (node) => ({ assetPath: node.attr('src'), directory })
    ));
    fs.writeFileSync(indexFilePath, doc.root().html(), 'utf-8');
  }
};
