(function(){
  // Non-intrusive Arabic switch + contact & cart modal helpers
  const translations = {
    "Home": "الرئيسية",
    "Cart": "عربة التسوق",
    "Contact": "اتصل",
    "Search": "بحث",
    "Add to cart": "أضف إلى السلة",
    "Filter": "تصفية",
    "Categories": "الفئات",
    "Price": "السعر"
  };

  function textNodesUnder(el){
    const nodelist = [];
    const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    let n;
    while(n = walk.nextNode()) nodelist.push(n);
    return nodelist;
  }

  function applyArabic(){
    document.body.classList.add('arabic-enabled');
    // basic text replacement by exact match (non-destructive)
    textNodesUnder(document.body).forEach(tn => {
      const txt = tn.nodeValue.trim();
      if(!txt) return;
      const mapped = translations[txt];
      if(mapped){
        tn.nodeValue = tn.nodeValue.replace(txt, mapped);
      }
    });
  }

  function removeArabic(){
    document.body.classList.remove('arabic-enabled');
    // Full restore is not possible without original snapshot; do a soft page reload to restore original texts
    if(window.location){
      // reload preserving scroll
      const scroll = {x: window.scrollX, y: window.scrollY};
      window.location.reload();
      window.scrollTo(scroll.x, scroll.y);
    }
  }

  function createSwitch(){
    if(document.getElementById('ar-switch')) return;
    const btn = document.createElement('button');
    btn.id = 'ar-switch';
    btn.type = 'button';
    btn.title = 'عربي / FR';
    btn.textContent = 'AR';
    btn.style.cssText = 'position:fixed;bottom:16px;left:16px;z-index:9999;padding:8px 10px;border-radius:6px;background:#222;color:#fff;border:none;opacity:0.9';
    btn.addEventListener('click', ()=>{
      if(document.body.classList.contains('arabic-enabled')) removeArabic(); else applyArabic();
    });
    document.body.appendChild(btn);
  }

  function createContactModal(){
    if(document.getElementById('contact-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'contact-modal';
    modal.className = 'taza-modal hidden';
    modal.innerHTML = `\n      <div class="taza-modal-inner">\n        <button class="taza-modal-close" aria-label="close">×</button>\n        <h3 data-i18n>Contact</h3>\n        <div class="social-list">\n          <a href="#" class="social fb" aria-label="facebook">Facebook</a>\n          <a href="#" class="social ig" aria-label="instagram">Instagram</a>\n          <a href="#" class="social tt" aria-label="tiktok">TikTok</a>\n          <a href="#" class="social wa" aria-label="whatsapp">WhatsApp</a>\n        </div>\n      </div>\n    `;
    document.body.appendChild(modal);

    modal.querySelector('.taza-modal-close').addEventListener('click', ()=> modal.classList.add('hidden'));
  }

  function openContactModal(){
    createContactModal();
    const modal = document.getElementById('contact-modal');
    modal.classList.remove('hidden');
  }

  function createContactButton(){
    // try to add into main nav if found, otherwise floating
    const nav = document.querySelector('nav') || document.querySelector('header') || document.body;
    if(nav.querySelector('.contact-btn')) return;
    const b = document.createElement('button');
    b.className = 'contact-btn';
    b.type = 'button';
    b.textContent = 'Contact';
    b.style.cssText = 'margin-left:10px;';
    b.addEventListener('click', openContactModal);
    // append to nav
    nav.appendChild(b);
  }

  function fixCartModalOpen(){
    document.addEventListener('click', (e)=>{
      const el = e.target.closest('.cart-icon, .cart-btn, [data-open-cart]');
      if(!el) return;
      e.preventDefault();
      // try to find existing cart modal and show it
      let cartModal = document.getElementById('cart-modal');
      if(!cartModal){
        cartModal = document.createElement('div');
        cartModal.id = 'cart-modal';
        cartModal.className = 'taza-modal';
        cartModal.innerHTML = `\n          <div class="taza-modal-inner">\n            <button class="taza-modal-close" aria-label="close">×</button>\n            <h3 data-i18n>Cart</h3>\n            <div class="cart-contents">Loading…</div>\n          </div>`;
        document.body.appendChild(cartModal);
        cartModal.querySelector('.taza-modal-close').addEventListener('click', ()=>cartModal.classList.add('hidden'));
      }
      cartModal.classList.remove('hidden');
      // try to populate cart contents if global cart data exists
      const contents = cartModal.querySelector('.cart-contents');
      if(window.__TAZA_CART_DATA__){
        contents.innerHTML = '<ul>' + window.__TAZA_CART_DATA__.map(i => `<li>${i.name} × ${i.qty}</li>`).join('') + '</ul>';
      }
    }, {passive:false});
  }

  function preventMobileFiltersAutoOpen(){
    // close elements with class filter-panel or .filters on mobile
    if(window.innerWidth <= 768){
      document.querySelectorAll('.filter-panel, .filters, .mobile-filter').forEach(el => el.classList.add('hidden'));
    }
    // also prevent any script that auto-opens by listening for custom events could be hard to intercept;
    // we add a CSS rule (in ar-styles.css) to keep them hidden unless explicitly opened
  }

  function init(){
    createSwitch();
    createContactButton();
    fixCartModalOpen();
    preventMobileFiltersAutoOpen();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();