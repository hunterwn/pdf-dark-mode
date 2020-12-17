import React, { useEffect } from 'react';
import Dropzone from 'dropzone';

const FileDropArea = (props) => {

    const server = 'http://localhost:4000';

    const dropFile = 'Drop file here or click to select.'
    const selectFile = 'Tap here to select file.'
    const startText = (window.innerWidth >= 1024) ? dropFile : selectFile;

    async function wait(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    async function uploadAnimation() {
        await wait(100);
        document.documentElement.style.setProperty('--background-pos', '50% -75%');
        return;
    }

    function raiseOpacity() {
        document.documentElement.style.setProperty('--opacity', '1');
    }

    function lowerOpacity() {
        document.documentElement.style.setProperty('--opacity', '0.65');
    }

    useEffect(() => {
        let myDropzone = new Dropzone(
                "div#customUpload", 
                {
                    withCredentials:true,
                    url: server + '/upload',
                    acceptedFiles: 'application/pdf',
                    maxFiles: 1,
                    maxFilesize: 10,
                    timeout: 99000,
                    dragenter: raiseOpacity,
                    dragleave: lowerOpacity,
                    paramName: 'selectedFile'
                }
            );
        //remove error messages from previous uploads
        myDropzone.on('addedfile', () => {
            let prevErr = document.querySelector('.dz-error');
            if(prevErr) {
                prevErr.remove();
            }
        });
        myDropzone.on('processing', () => {
            uploadAnimation();
            document.querySelector('.bg-text').innerHTML = 'Uploading...';
        });
        myDropzone.on('error', (file, errorMessage, xhr) => {
            document.querySelector('.bg-text').innerHTML = startText;
            if(errorMessage.length > 100) {
                let errText = document.querySelector('.dz-error');
                errText.innerHTML = 'Something went wrong.';
            } else if (errorMessage === 'You can not upload any more files.') {
                //prevent extra upload attempts breaking the page
                let errText = document.querySelector('.dz-error');
                errText.remove();
            }
        });
        myDropzone.on('success', async (file) => {
            myDropzone.disable();
            await wait(500);
            let bgText = document.querySelector('.bg-text');
            let progressBar = document.querySelector('.dz-upload');
            bgText.setAttribute("style", "transition: opacity .3s; opacity: 0;");
            progressBar.setAttribute("style", "opacity: 0;");
            props.done(file.name);
        });
    }, [])

    return (
        <div id = "customUpload">
            <div className="bg-text">{startText}</div>
        </div>
    )
}

export default FileDropArea;