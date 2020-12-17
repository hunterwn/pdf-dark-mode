import React, { useEffect, useState } from 'react';

const OptionsPreview = (props) => {
    const divStyles = {
        backgroundColor: props.bgColor,
        border: props.border
    }

    return(
        <div className = "options-preview"
        style = {divStyles}
        onClick = {() => props.select(props.pos)}>
            <br></br>
            <br></br>
            <p style = {{color: props.color1}}>
                This is an example document
            </p>
            <p style = {{color: props.color2}}>
                meant to show
            </p>
            <p style = {{color: props.color1}}>
                how your pdf may
            </p>
            <p style = {{color: props.color3}}>
                look after conversion.
            </p>
        </div>
    )
}

const Options = () => {

    let [borders, setBorders] = useState(Array(4).fill('none'));
    let [selected, setSelected] = useState(2);

    const highlight = (index) => {
        borders = Array(4).fill('none')
        borders[index] = '2px outset #575757';
        setBorders(borders);
    }

    const optionNav = (direction, index) => {
        if (direction === 'none') {
            setSelected(() => {
                highlight(index);
                setSelected(index);
            });
        } else if (direction === 'left') {
            if (selected - 1 >= 0) {
                setSelected(selected => {
                    highlight(selected - 1);
                    return (selected - 1);
                });
            } else {
                setSelected(selected => {
                    highlight(3);
                    return(3);
                });
            }
        } else {
            setSelected(selected => {
                if(selected + 1 <= 3) {
                    highlight(selected + 1);
                    return selected + 1;
                } else {
                    highlight(0);
                    return 0;
                }
            })
        }
    }

    // useEffect(() => {
    //     document.cookie = 'option=' + selected + ';max-age=3600000;';
    //     highlight(selected);
    // }, []);

    document.cookie = 'option=' + selected + ';max-age=3600000;';

    return (
        <div className = "options">
            <div className = "options-nav"
            id = "optionsNavLeft"
            onClick = {() => optionNav('left')}>
                <p unselectable="on">&lt;</p>
            </div>
            <ul className = "options-list">
                <li>
                    <OptionsPreview
                        pos = "0"
                        bgColor = "black"
                        border = {borders[0]}
                        color1 = "#d8d4cf"
                        color2 = "#3dadad"
                        color3 = "#e4d22f"
                        select = {() => optionNav('none', 0)}/>
                </li>
                <li>
                    <OptionsPreview 
                        pos = "1"
                        bgColor = "#111111"
                        border = {borders[1]}
                        color1 = "#d8d4cf"
                        color2 = "#3dadad"
                        color3 = "#e4d22f"
                        select = {() => optionNav('none', 1)}/>
                </li>
                <li>
                    <OptionsPreview 
                        pos = "2"
                        bgColor = "#262626"
                        border = {borders[2]}
                        color1 = "#d8d4cf"
                        color2 = "#3dadad"
                        color3 = "#e4d22f"
                        select = {() => optionNav('none', 2)}/>
                </li>
                <li>
                    <OptionsPreview
                        pos = "3"
                        bgColor = "#383838"
                        border = {borders[3]}
                        color1 = "#d8d4cf"
                        color2 = "#3dadad"
                        color3 = "#e4d22f"
                        select = {() => optionNav('none', 3)}/>
                </li>
            </ul>
            <div className = "options-nav"
            id = "optionsNavRight"
            onClick = {() => optionNav('right')}>
                <p unselectable="on">&gt;</p>
            </div>
        </div>
    )
}

export default Options;