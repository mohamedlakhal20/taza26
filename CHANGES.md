# Non-intrusive additions on branch feature/add-arabic-contact-cart

Added files:
- assets/ar-switch.js  — adds a floating AR switch that performs in-place text replacements, creates a Contact button + modal, fixes cart icon opening by creating/sharing a cart modal, and prevents mobile filters auto-open.
- assets/ar-styles.css — RTL helper styles, modal styles, and a mobile 3-column product grid rule.

Notes:
- These files are intentionally non-intrusive and do not modify existing HTML templates. They append DOM nodes and use class-based CSS to avoid changing current behavior.
- The Arabic translator currently performs exact-text matches. For full coverage, elements can be annotated with data-i18n attributes or the translations map can be expanded.
- If you want, I can open a Pull Request that injects these files into your main layout (index.html or template) so they load automatically.
