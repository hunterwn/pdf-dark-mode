import React from 'react';

import StoreLink from './storeLink';

const chromeLogoSrc = 'https://lh3.googleusercontent.com/44WILlaqEheSySx8IHZSVfmbo6gBm6tlH5zRz-odfMPZnz3fACu-swj5y1meKYu5e59EQ5a-xmzwvyzsVHRnMTbfVfuzjJ6f58Pg8g';
const firefoxLogoSrc = 'https://d33wubrfki0l68.cloudfront.net/06185f059f69055733688518b798a0feb4c7f160/9f07a/images/product-identity-assets/firefox.png';
const desktopLogo = './computer-24px.svg';

const RightPanel = () => {
    return (
        <div className = "panel" id = "right-panel">
            <ul className = "store-links-list">
                <li>
                    <StoreLink 
                        id = "chromeExtension"
                        logoSrc = {chromeLogoSrc}
                        text = "Get the Chrome extension."
                    />
                </li>
                <li>
                    <StoreLink
                        id = "firefoxAddon"
                        logoSrc = {firefoxLogoSrc}
                        text = "Download the Firefox add-on."
                    />
                </li>
                <li>
                    <StoreLink
                        id = "desktopVersion"
                        logoSrc = {desktopLogo}
                        text = "Try the Desktop version."
                    />
                </li>
            </ul>
        </div>
    )
}

export default RightPanel;