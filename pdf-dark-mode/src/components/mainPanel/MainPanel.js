import React, { useEffect, useState } from 'react';
import FileDropArea from './FileDropArea';

const MainPanel = () => {

    //require pdfjs 
    const pdfjsLib = require('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf-worker/pdf.worker.js';

    //server address
    const server = 'http://localhost:4000';

    //file name holder variable
    let fileName;

    /***********************************
     FUNCTIONS
    ***********************************/

    const [content, setContent] = useState(() => {
        return(<FileDropArea done = {displayPdf}/>);
    })

    //utility function for setting delay timer
    async function wait(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    //handle fetch request errors
    const handleErrors = (res) => {
        return new Promise((resolve, reject) => {
            if (!res.ok) {
                console.log(res.text());
                reject(new Error(res.statusText));
            } else {
                resolve(res);
            }
        });
    }

    async function getPdfUrl() {
        const res = await fetch(server + '/pdf', {
            method: 'GET',
            credentials: "include"
        });
        await handleErrors(res);
        const pdfBlob = await res.blob();
        const url = await URL.createObjectURL(pdfBlob);
        return url;
    }

    async function convertFile() {
        const res = await fetch(server + '/pdf', {
            method: 'POST',
            credentials: 'include'
        });
        await handleErrors(res);
        return res;
    }

    function fileDownload (url, fileName) {
        let a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();    
        a.remove();
    }

    async function renderPdf(pageNum, pdf) {
        let page = await pdf.getPage(pageNum);
        let viewport = page.getViewport({ scale: 1, });
        let ratio = 160 / viewport.width;
        let trueViewport = page.getViewport({ scale: ratio, });
        let canvas = document.querySelector('#page' + pageNum);
        canvas.width = trueViewport.width;
        canvas.height = trueViewport.height;
        let context = canvas.getContext('2d');
        let renderContext = {
            canvasContext: context,
            viewport: trueViewport,
            };
        page.render(renderContext);
    }

    async function displayPdf(fileName) {
        await convertFile();
        let pdfUrl = await getPdfUrl();
        let loadingTask = pdfjsLib.getDocument(pdfUrl);
        let pdf = await loadingTask.promise;
        let numPages = (pdf.numPages > 3) ? 3 : pdf.numPages;
        let displayPages = [];
        await new Promise((resolve) => {
            for(let i = 1; i <= numPages; i++) {
                displayPages.push(
                    <canvas key = {i} id = {"page" + i}></canvas>
                )
                if (i === numPages) {
                    resolve();
                }
            }
        })
        setContent(() => {
            return(
                <div className = "pdf-display-area"
                onClick = {() => fileDownload(pdfUrl, fileName)}>
                    <div className = "pages-container">
                        {displayPages}
                    </div>
                    <p className = "download-text">Click to download</p>
                </div>
                
            )
        });
        for(let i = 1; i <= numPages; i++) {
            renderPdf(i, pdf);
        }
        //wait to skip render flash
        await wait(500);
        let pages = document.querySelector('.pages-container');
        let dlText = document.querySelector('.download-text');
        pages.setAttribute("style", "transition: opacity .25s; opacity: 1;");
        dlText.setAttribute("style", "transition: opacity .5s; opacity: 1;");
    }

    /***********************************/

    return (
        <div className = "main-panel" id = "mainPanel">
            {content}
        </div>
    )
}

export default MainPanel;