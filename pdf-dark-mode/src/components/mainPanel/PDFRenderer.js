import React from 'react';

//Reference: pdf.js Hello World example
const pdfjsLib = require('pdfjs-dist');

/*
Optional properties: 
    height, width, scale, pageNumber, 
Required properties:
    canvasID, pdf
*/

const PDFRenderer = (props) => {
    const pageNumber = (props.pageNumber) ? parseInt(props.pageNumber) : 1;
    const pdf = props.pdf;

    pdf.getPage(pageNumber).then(function(page) {
        let viewport = page.getViewport({ scale: 1, });
        
        let width = (props.width) ? props.width : viewport.width;
        let ratio = width / viewport.width;
        let trueViewport = page.getViewport({ scale: ratio, });
        let canvas = document.getElementById(props.canvasID);
        let context = canvas.getContext('2d');
        let height = (props.height) ? props.height : trueViewport.height;
        canvas.height = height;
        canvas.width = width;
        let renderContext = {
            canvasContext: context,
            viewport: trueViewport,
            };
        page.render(renderContext);
    });


    return (null);
}

async function newpdfRenderer(pageNum, pdf) {
    let page = await pdf.getPage(pageNum);
    let viewport = page.getViewport({ scale: 1, });
    let ratio = 160 / viewport.width;
    let trueViewport = page.getViewport({ scale: ratio, });
    let canvas = document.getElementById('page' + pageNum);
    let context = canvas.getContext('2d');
    let renderContext = {
        canvasContext: context,
        viewport: trueViewport,
        };
    page.render(renderContext);
}

export default PDFRenderer;