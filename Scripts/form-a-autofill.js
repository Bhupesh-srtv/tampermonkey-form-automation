// ==UserScript==
// @name         HS-105 Daily Autofill
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Autofills HS-105 and auto prints
// @author       Bhupesh Shrivastav
// @match        URL to your portal domain/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function deepFindButtons(root = document) {
        let buttons = Array.from(root.querySelectorAll('button'));
        root.querySelectorAll('*').forEach(el => {
            if (el.shadowRoot) buttons = buttons.concat(deepFindButtons(el.shadowRoot));
        });
        return buttons;
    }

    function deepFindAll(selector, root = document) {
        let results = Array.from(root.querySelectorAll(selector));
        root.querySelectorAll('*').forEach(el => {
            if (el.shadowRoot) results = results.concat(deepFindAll(selector, el.shadowRoot));
        });
        return results;
    }

    function setValue(selector, value) {
        const el = document.querySelector(selector);
        if (!el) return;
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function checkIt(selector) {
        const el = document.querySelector(selector);
        if (el) {
            el.checked = true;
            el.click();
            el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    function checkItByIndex(selector, index) {
        const el = document.querySelectorAll(selector)[index];
        if (el) {
            el.checked = true;
            el.click();
            el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    function autoPrint() {
        document.title = 'HS - 105';

        const moreBtn = deepFindButtons().find(b => b.textContent.trim() === 'More');
        if (!moreBtn) return;
        moreBtn.click();

        setTimeout(() => {
            const allEls = deepFindAll('button, a, li, div, span');
            const printEl = allEls.find(el =>
                el.textContent.trim() === 'Print Document'
            );
            if (printEl) printEl.click();
        }, 1500);
    }

    function fillForm() {
        checkItByIndex('[name="fav_language"][data-radioattr="checkedB"]', 1);
        checkIt('[name="fav_radio"][data-templatevalue="Flow.IsUnavailabe"]');
        setValue('div:nth-child(7) > div > input', 'EMAILED');
        setValue('[name="SpName"]', 'LAURA ATTAR');
        setValue('[name="SPSign"]', 'LAURA ATTAR');
        setValue('[name="date"]', new Date().toLocaleDateString('en-US'));

        setTimeout(autoPrint, 3000);
    }

    window.addEventListener('load', function() {
        setTimeout(() => {
            if (document.body.innerText.includes('Receipt of Lead Paint Pamphlet')) {
                fillForm();
            }
        }, 3000);
    });

})();
