import React from 'react';

const StoreLink = (props) => {
    return (
        <div 
        className = "store-link"
        id = {props.id}
        >          
            <span className = "logo"><img src = {props.logoSrc}></img></span>
            <span className = "text">{props.text}</span>
        </div>
    )
}

export default StoreLink;