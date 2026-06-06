import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { extractDataFromText } from './cvTextParser';

// Configure PDF.js worker locally to avoid CDN fetch issues
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// ─── Public API ───────────────────────────────────────────────────────────────

export const parseFile = async (file) => {
  const extension = file.name.split('.').pop().toLowerCase();

  if (extension === 'docx') {
    const arrayBuffer = await file.arrayBuffer();

    // Extract first image (for photo)
    let firstImage = '';
    await mammoth.convertToHtml({ arrayBuffer }, {
      convertImage: mammoth.images.imgElement((image) => {
        return image.read('base64').then((buf) => {
          if (!firstImage) firstImage = `data:${image.contentType};base64,${buf}`;
          return { src: '' };
        });
      }),
    });

    const result = await mammoth.extractRawText({ arrayBuffer });
    const data = extractDataFromText(result.value);
    if (firstImage) data.personalInfo.photo = firstImage;
    return data;
  }

  if (extension === 'pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      // Preserve line breaks by grouping items with similar Y positions
      const items = textContent.items;
      let lastY = null;
      let pageText = '';

      for (const item of items) {
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          pageText += '\n';
        }
        pageText += item.str;
        lastY = item.transform[5];
      }

      fullText += pageText + '\n';
    }

    return extractDataFromText(fullText);
  }

  throw new Error('Format de fichier non supporté. Utilisez .pdf ou .docx');
};
