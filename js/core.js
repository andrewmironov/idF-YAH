//Main js file of idM-YAH----------------------------------------------------------------

//Import configs and index---------------------------------------------------------------
import {config} from './config.js';
import {index} from './index.js';
import {getHTMLfromMarkdown} from './parser.js';

//App functions-------------------------------------------------------------------------

//Open index
export function openIndex() {
    contentIndex.style.display = 'block';
    menuButton.textContent = config.interface.index_open;
    setCookie('index_state', 'open', {secure: true, 'max-age': 3600});
}

//Close index
export function closeIndex() {
    contentIndex.style.display = 'none';
    menuButton.textContent = config.interface.index_close;
    setCookie('index_state', 'close', {secure: true, 'max-age': 3600});
}

//Index point generator
export function getIndexPoint(point_obj) {
    let point = document.createElement('li');
    point.className = 'content-index__list-point';
    let link = document.createElement('a');
    link.className = 'content-index__list-point-link';
    let url = new URL(document.URL);
    url.searchParams.delete('current_page');
    url.searchParams.append('current_page', point_obj.path);
    link.href = url.href;
    link.textContent = point_obj.name;

    //Selection of the index point when it's selected
    if(point_obj.path == config.appvar.current_page) { 
        point.className = point.className + ' selected';
    }
    point.append(link);
    return point;
}

//Index block generator, params - html target object, data for generation object
export function getIndexBlock(block_target, block_obj) {
    //Block name generation
    if (block_target.tagName == 'UL') {
        let header_point = document.createElement('li');
        header_point.className = 'content-index__list-point';
        header_point.textContent = block_obj.name;
        block_target.append(header_point);
    } else {
        let header = document.createElement('h1');
        header.className = 'content-index__header';
        header.textContent = block_obj.name;
        block_target.append(header);
    }
    
    //Make a block and content
    let block = document.createElement('ul');
    block.className = 'content-index__list-block';

    for (let i in block_obj.content) {
        if (block_obj.content[i].type == 'point') {
            block.append(getIndexPoint(block_obj.content[i]));
        } else if (block_obj.content[i].type == 'block') {
            getIndexBlock(block, block_obj.content[i]);
        } else {
            console.log(`Error: type of object in index is incorrect: ${block_obj.content[i].type}`);
        }
    }
    block_target.append(block);
}

//Get cookie by name
export function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

//Set cookie
//  Example:
//  setCookie('user', 'John', {secure: true, 'max-age': 3600});
export function setCookie(name, value, options = {}) {
    //It's default parameters
    options = {
        path: '/',
    }
    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }
    document.cookie = updatedCookie;
}

//Content block generator, params - html target object, path for load data from file
export function getContentBlock(html_target, file) {
    let fileRequest = new XMLHttpRequest();
    
    fileRequest.open("GET", file);
    fileRequest.send();

    fileRequest.onload = function() {
        
        if (fileRequest.status != 200) { 
            console.log(`Error: md file loading is failed - ${fileRequest.status}: ${fileRequest.statusText}`);
        } else {
            html_target.insertAdjacentHTML('afterbegin', getHTMLfromMarkdown(fileRequest.response));
        }
    }

    fileRequest.onerror = function() {
        console.log(`Error: md file loading is failed`);
    }
}

//Connecting html vs js and applying configuration data----------------------------------
let title = document.querySelector('title');
let headerTitle = document.querySelector('.header-logo__title');
let headerSubtytle = document.querySelector('.header-logo__subtitle');
let menuButton = document.querySelector('.header-menu__button');
let contentIndex = document.querySelector('.content-index');
let contentData = document.querySelector('.content-data');

//Events and handlers--------------------------------------------------------------------

//Load a data to page
document.addEventListener("DOMContentLoaded", function() {
    
    //Check of url parameters
    let url = new URL(document.URL);
    if (url.searchParams.get('current_page') != null) {
        config.appvar.current_page = String(url.searchParams.get('current_page'));
    }
    
    //Check of cookies
    if (getCookie('index_state') == undefined) {
        setCookie('index_state', config.appvar.index_state, {secure: true, 'max-age': 3600});
    } else {
        config.appvar.index_state = getCookie('index_state');
    }

    //Load interface
    title.textContent = config.interface.title;
    headerTitle.textContent = config.interface.title;
    headerSubtytle.textContent = config.interface.subtitle;

    //Check status of index
    if (config.appvar.index_state == 'open') {
        openIndex();
    } else {
        closeIndex();
    }

    //Load index
    contentIndex.textContent = '';
    getIndexBlock(contentIndex, index);
    
    //Load content
    contentData.textContent = '';
    getContentBlock(contentData, '../content/'+config.appvar.current_page);
})

//Processing the click of the button with the index
menuButton.addEventListener('click', function () {
    if (contentIndex.style.display == 'none') {
        openIndex();
    } else {
        closeIndex();
    }
})