/**
 * Prints a CV by opening a clean, isolated print window that contains only the
 * `.cv-document` node and its styles. Because it uses the browser's native print
 * engine (not html2canvas), the resulting "Save as PDF" output is real, vector,
 * selectable text — searchable and parseable by ATS — and paginates naturally.
 *
 * @param {HTMLElement} cvNode   The `.cv-document` element to print.
 * @param {Object}   [opts]
 * @param {string}   [opts.filename]   Title of the print window (suggested PDF name).
 * @param {HTMLElement} [opts.container] Subtree to harvest template <style> blocks from
 *                                       (defaults to the document — harmless but broader).
 */
export function printCvDocument(cvNode, { filename = 'CV', container = document } = {}) {
  if (!cvNode) return;

  // 1. Global stylesheets + web fonts from <head> (CSS variables, Google Fonts).
  const headStyles = Array.from(
    document.head.querySelectorAll('style, link[rel="stylesheet"]')
  ).map(n => n.outerHTML).join('\n');

  // 2. The template's own scoped <style> blocks (rendered inside the preview subtree).
  const scopedStyles = Array.from(
    (container || document).querySelectorAll('style')
  ).map(n => n.outerHTML).join('\n');

  // 3. CSS custom properties (--cv-font-*) the preview wrapper sets on the document,
  //    which the cloned node would otherwise lose.
  const cs = getComputedStyle(cvNode);
  const cvVars = ['--cv-font-family', '--cv-font-size', '--cv-line-height', '--cv-size-scale']
    .map(v => {
      const val = cs.getPropertyValue(v).trim();
      return val ? `${v}: ${val};` : '';
    })
    .filter(Boolean)
    .join(' ');

  const win = window.open('', '_blank', 'width=900,height=1200');
  if (!win) {
    // Popup blocked — fall back to printing the current page.
    window.print();
    return;
  }

  win.document.open();
  win.document.write(`<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${filename}</title>
${headStyles}
${scopedStyles}
<style>
  @page { size: A4; margin: 0; }
  html, body { margin: 0; padding: 0; background: #fff; }
  body { ${cvVars} }
  /* Keep colored sidebars/backgrounds in the printed output. */
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  .cv-document { margin: 0 auto !important; box-shadow: none !important; border-radius: 0 !important; }
</style>
</head>
<body>${cvNode.outerHTML}</body>
</html>`);
  win.document.close();

  // Print once fonts are ready, otherwise the PDF renders with fallback fonts.
  let printed = false;
  const triggerPrint = () => {
    if (printed) return;
    printed = true;
    win.focus();
    win.print();
  };

  const fontsReady = win.document.fonts?.ready;
  if (fontsReady) {
    fontsReady.then(triggerPrint).catch(triggerPrint);
    setTimeout(triggerPrint, 1500); // safety net if fonts.ready stalls
  } else {
    setTimeout(triggerPrint, 600);
  }
}
