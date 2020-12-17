import React, {useState} from 'react';

const Header = () => {
    const [imgSrc, setImgSrc] = useState("PDF_DarkMode_logo.svg");

    const quotes = [
        "\"Our future is brighter than our files.\"",
        "\"PDF stands for pretty dark files.\"",
        "\"Because light mode is just not as cool.\"",
        "\"Not for printing!\"",
        "\"Hello darkness, my old friend.\"",
        "\"Welcome to the dark side.\"",
        "\"Time bares it away, and in the end there is only darkness.\" - Stephen King",
        "\"When it is dark enough, you can see the stars.\" ― Ralph Waldo Emerson",
        "\"Being left in the dark isn't so bad.\"",
        "\"Without darkness there are no dreams.\" - Karla Kuban"
    ]

    const [headerQuote, setHeaderQuote] = useState(
        quotes[Math.floor(Math.random() * 10)]
    )

    return(
        <div className="app-header">
            <title>
                <a href = {window.location}>
                    <img src = {imgSrc}
                    onMouseEnter = {() => setImgSrc("PDF_DarkMode_logo2.svg")}
                    onMouseOut = {() => setImgSrc("PDF_DarkMode_logo.svg")}>
                    </img>
                    PDF_DarkMode
                </a>
            </title>
            <small className = "orange-text">{headerQuote}</small>
        </div>
    )
}

export default Header;