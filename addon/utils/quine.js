export function cloneHead(document = window.document) {
  return document.head.innerHTML;
}

export function cloneBody(document = window.document) {
  let content = '';
  for (let node of document.body.children) {
    if (!node.classList.contains('ember-view')) {
      content += node.outerHTML;
    }
  }
  return content;
}

export function buildHtml(headContent, bodyContent) {
  return [
    '<html>',
    '<head>',
    headContent,
    '</head>',
    '<body>',
    bodyContent,
    '</body>',
    '</html>'
  ].join('\n');
}

export function saveHtmlFile(fileName, htmlContent, document = window.document) {
  let link = document.createElement('a');
  if (typeof(Blob) !== undefined) {
    let blob = new Blob([htmlContent], { type: 'text/html' });
    link.setAttribute('href', URL.createObjectURL(blob));
  } else {
    link.setAttribute('href', `data:text/html,${encodeURIComponent(htmlContent)}`);
  }
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function saveQuine(fileName, document = window.document) {
  let htmlContent = buildHtml(cloneHead(document), cloneBody(document));
  return saveHtmlFile(fileName, htmlContent, document);
}
