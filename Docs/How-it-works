# Browser Form Automation with Tampermonkey

A lightweight browser automation system built with Tampermonkey userscripts 
to eliminate repetitive daily data entry on a Salesforce Experience Cloud portal.

## What It Does

- Detects a compliance trigger condition on a Salesforce portal page
- Injects a one-click automation button into the UI
- Automatically selects and adds required document templates
- Fills all form fields with static and dynamic values (including auto-updating date)
- Triggers the print/export workflow automatically

## Problem It Solved

The manual process required opening a portal, identifying qualifying records, 
adding 2 document templates, filling 6+ fields on each form, and saving as PDF. 
This happened multiple times daily.

The automation reduced this to a single button click per record.

## Tech Stack

- Vanilla JavaScript
- Tampermonkey (Chrome Extension)
- CSS Selectors + Shadow DOM traversal
- SessionStorage for cross-page state management

## Key Challenges

- Salesforce Lightning uses Shadow DOM extensively, 
  so standard querySelector fails silently. 
  Built a recursive deepFindAll() utility to pierce Shadow DOM.
- Dynamic date injection that updates automatically each day 
  without any manual editing.
- Multi-step state management across page navigations 
  using sessionStorage flags.
- Precise checkbox targeting when multiple elements 
  share identical attributes.

## Scripts Included

| Script | Purpose |
|--------|---------|
| `ewr-auto-adder.js` | Detects trigger, adds templates, opens forms sequentially |
| `form-a-autofill.js` | Fills Form A fields + triggers print |
| `form-b-autofill.js` | Fills Form B fields + triggers print |

## How to Use

1. Install [Tampermonkey](https://www.tampermonkey.net/) in Chrome
2. Create a new userscript for each file
3. Update the `@match` URL to your portal domain
4. Update field selectors and values to match your form fields
5. Save and reload your portal page

## Notes

- All selectors are CSS-based and portal-specific. 
  You will need to inspect your own form fields 
  and update selectors accordingly.
- Sensitive field values (names, IDs, cert numbers) 
  are not included in this repo. Add your own in the value fields.
- Tested on Salesforce Experience Cloud portals 
  with Lightning Web Components.

## Skills Demonstrated

- Shadow DOM traversal
- Browser automation without Selenium or Puppeteer
- Cross-page state management
- Dynamic content detection with MutationObserver and polling
- Real-world process automation
