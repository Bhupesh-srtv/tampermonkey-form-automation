// ==UserScript==
// @name         EWR Auto Document Adder
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Detects EWR, adds docs, opens each form one at a time
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

    // Precise edit button finder - matches exact doc name only
    function clickEditFor(exactName) {
        const rows = deepFindAll('tr');
        for (const row of rows) {
            const cells = row.querySelectorAll('td');
            if (!cells.length) continue;
            const firstCell = cells[0].textContent.trim();
            if (firstCell.includes(exactName)) {
                const editBtn = deepFindButtons(row).find(b =>
                    b.textContent.trim() === 'Edit'
                );
                if (editBtn) {
                    editBtn.click();
                    return true;
                }
            }
        }
        return false;
    }

    const isPOPage = window.location.href.includes('jm-purchase-order');

    const checker = setInterval(() => {
        const pending = sessionStorage.getItem('ewr_pending');

        // Only run edit-opening logic on PO page
        if (isPOPage) {
            if (pending === 'open_hs105') {
                const rows = deepFindAll('tr');
                const found = rows.some(r => r.textContent.includes('HS-105'));
                if (found) {
                    setTimeout(() => {
                        const clicked = clickEditFor('HS-105');
                        if (clicked) {
                            sessionStorage.setItem('ewr_pending', 'open_hs118');
                        }
                    }, 1500);
                }
                return;
            }

            if (pending === 'open_hs118') {
                const rows = deepFindAll('tr');
                const found = rows.some(r => r.textContent.includes('HS-118'));
                if (found) {
                    setTimeout(() => {
                        const clicked = clickEditFor('HS-118');
                        if (clicked) {
                            sessionStorage.removeItem('ewr_pending');
                        }
                    }, 1500);
                }
                return;
            }
        }

        // Inject Auto Add button if EWR box present
        const hasEWR = document.body.innerText.includes('Environmental Work Rules');
        const alreadyAdded = document.querySelector('#ewr-auto-btn');
        if (!hasEWR || alreadyAdded) return;

        const docsBtn = deepFindButtons().find(btn =>
            btn.textContent.trim().includes('Documents')
        );
        if (docsBtn) injectButton(docsBtn);
    }, 2000);

    function injectButton(docsBtn) {
        const btn = document.createElement('button');
        btn.id = 'ewr-auto-btn';
        btn.textContent = '⚡ Auto Add EWR Docs';
        btn.style.cssText = `
            background: #e31837; color: white; border: none;
            padding: 8px 16px; border-radius: 4px; cursor: pointer;
            margin-right: 8px; font-weight: bold; font-size: 14px;
            z-index: 9999; position: relative;
        `;
        btn.onclick = startFlow;
        docsBtn.parentNode.insertBefore(btn, docsBtn);
    }

    function startFlow() {
        const docsBtn = deepFindButtons().find(btn =>
            btn.textContent.trim().includes('Documents') && btn.id !== 'ewr-auto-btn'
        );
        if (docsBtn) docsBtn.click();
        setTimeout(selectDocs, 2000);
    }

    function selectDocs() {
        const allCheckboxes = deepFindAll('input[type="checkbox"]');
        allCheckboxes.forEach(cb => {
            const row = cb.closest('tr') || cb.closest('li') || cb.parentElement;
            if (!row) return;
            const text = row.innerText || row.textContent || '';
            if (text.includes('HS-105') || text.includes('HS-118')) {
                if (!cb.checked) cb.click();
            } else {
                if (cb.checked) cb.click();
            }
        });

        setTimeout(() => {
            const addBtn = deepFindButtons().find(btn =>
                btn.textContent.trim().includes('Add Selected Documents')
            );
            if (addBtn) {
                addBtn.click();
                sessionStorage.setItem('ewr_pending', 'open_hs105');
            } else {
                alert('Add Selected Documents button not found. Try again.');
            }
        }, 1000);
    }

})();
