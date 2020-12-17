// info dump panel, hidden on small screens

import React, { useState } from 'react';

const LeftPanel = () => {

    const blurb = () => {
        return (
            <p className = "blurb-text">
            <br></br>
            <b className = "orange-text">PDF_DarkMode </b> 
            allows you to convert
            those blindingly bright 
            <b className = "orange-text"> pdf </b>files
            to an easy to read 
            <b className = "green-text"> light-on-dark </b>
            color scheme to protect your eyes
            (or your batteries)<br></br>
            <br></br>
            <b className = "blue-text">Select a file </b>
            to get started.
            </p>
        )
    }

    const [content, setContent] = useState(blurb);

    return (
        <div className = "panel" id = "left-panel">
            {content}
        </div>
    )
}

export default LeftPanel;