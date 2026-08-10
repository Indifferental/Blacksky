// ==UserScript==
// @name         Blacksky
// @namespace    http://tampermonkey.net/
// @version      Auto-updating
// @description  Customizable theme for Tanki Online
// @author       Indifferental
// @match        https://*.tankionline.com/*
// @icon         https://raw.githubusercontent.com/Indifferental/Blacksky/refs/heads/main/assets/blackskylogo100x100.png
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-body
// ==/UserScript==

GM_xmlhttpRequest ({ url: "https://raw.githubusercontent.com/Indifferental/Blacksky/refs/heads/main/scripts/main.js", method: "GET", onload: (ev) => { eval(ev.responseText) } });
