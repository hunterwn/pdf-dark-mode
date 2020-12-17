const pdfjsLib = require('pdfjs-dist');
    


const renderPdf = (pdfUrl) => {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
    './pdf-worker/pdf.worker.js';

    const loadingTask = pdfjsLib.getDocument(pdfUrl);

    loadingTask.promise.then(function(pdf) {
        pdf.getPage(1).then(function(page) {
            let scale = 1.5
            let viewport = page.getViewport({ scale: scale, });
            let canvas = document.getElementById('the-canvas');
            let context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            let renderContext = {
                canvasContext: context,
                viewport: viewport,
              };
            page.render(renderContext);
        });
    });
}

export default renderPdf;