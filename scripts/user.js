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

GM_xmlhttpRequest({ url: 'https://raw.githubusercontent.com/Indifferental/Blacksky/refs/heads/main/scripts/main.js', method: 'GET', onload: (ev) => { try { eval(ev.responseText); console.log('[Blacksky] Основной скрипт загружен и выполнен'); } catch (err) { console.error('[Blacksky] Ошибка выполнения main.js:', err); } }, onerror: (err) => { console.error('[Blacksky] Не удалось загрузить main.js:', err); } }); const isCanvasEnabled = localStorage.getItem('BlackskyValue-canvas-toggleValue'); if (isCanvasEnabled === 'true') { GM_xmlhttpRequest({ url: 'https://raw.githubusercontent.com/Indifferental/Blacksky/refs/heads/main/scripts/background.js', method: 'GET', onload: (ev) => { const script = document.createElement('script'); script.textContent = ev.responseText; document.head.appendChild(script); } }); }
