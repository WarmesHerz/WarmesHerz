// header.js
(function(){
  const KEY = "wh_cart_v1";
  const PAYPAL_CHECKOUT_URL = "https://www.paypal.com/ncp/payment/QUPGSWMD59ZSJ";

  function loadCart(){
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch(e){ return []; }
  }
  function saveCart(cart){ localStorage.setItem(KEY, JSON.stringify(cart)); }
  function formatEUR(n){
    return new Intl.NumberFormat("de-DE", { style:"currency", currency:"EUR" }).format(n);
  }
  function subtotal(cart){ return cart.reduce((s,it)=>s + (Number(it.price)||0) * (Number(it.qty)||0), 0); }

  function setCount(cart){
    const el = document.getElementById("whCartCount");
    if(el) el.textContent = String(cart.reduce((s,it)=>s+(Number(it.qty)||0),0));
  }

  function render(){
    const cart = loadCart();
    setCount(cart);

    const itemsEl = document.getElementById("whCartItems");
    const subEl = document.getElementById("whCartSubtotal");
    if(!itemsEl || !subEl) return;

    itemsEl.innerHTML = "";

    if(cart.length === 0){
      const d = document.createElement("div");
      d.style.color = "rgba(0,0,0,.55)";
      d.style.fontSize = "14px";
      d.style.padding = "10px 2px";
      d.textContent = "Dein Warenkorb ist leer.";
      itemsEl.appendChild(d);
      subEl.textContent = formatEUR(0);
      return;
    }

    cart.forEach((it, idx) => {
      const row = document.createElement("div");
      row.className = "wh-item";

      const img = document.createElement("img");
      img.src = it.image || "";
      img.alt = it.title || "Produkt";

      const mid = document.createElement("div");
      const t = document.createElement("div");
      t.className = "wh-item-title";
      t.textContent = it.title || "Produkt";

      const m = document.createElement("div");
      m.className = "wh-item-meta";
      m.textContent = formatEUR(Number(it.price)||0) + (it.sku ? " · " + it.sku : "");

      mid.appendChild(t); mid.appendChild(m);

      const right = document.createElement("div");
      right.className = "wh-item-actions";

      const qty = document.createElement("div");
      qty.className = "wh-qty";

      const minus = document.createElement("button");
      minus.type = "button";
      minus.textContent = "−";
      minus.addEventListener("click", () => {
        const c = loadCart();
        c[idx].qty = (Number(c[idx].qty)||1) - 1;
        if(c[idx].qty <= 0) c.splice(idx, 1);
        saveCart(c); render();
      });

      const qn = document.createElement("span");
      qn.textContent = String(Number(it.qty)||1);

      const plus = document.createElement("button");
      plus.type = "button";
      plus.textContent = "+";
      plus.addEventListener("click", () => {
        const c = loadCart();
        c[idx].qty = (Number(c[idx].qty)||1) + 1;
        saveCart(c); render();
      });

      qty.appendChild(minus); qty.appendChild(qn); qty.appendChild(plus);

      const rm = document.createElement("button");
      rm.className = "wh-remove";
      rm.type = "button";
      rm.textContent = "Entfernen";
      rm.addEventListener("click", () => {
        const c = loadCart();
        c.splice(idx, 1);
        saveCart(c); render();
      });

      right.appendChild(qty);
      right.appendChild(rm);

      row.appendChild(img);
      row.appendChild(mid);
      row.appendChild(right);

      itemsEl.appendChild(row);
    });

    subEl.textContent = formatEUR(subtotal(cart));
  }

  function openCart(){
    document.documentElement.classList.add("wh-cart-open");
    document.getElementById("whCartDrawer")?.setAttribute("aria-hidden","false");
    document.getElementById("whCartOverlay")?.setAttribute("aria-hidden","false");
    render();
  }
  function closeCart(){
    document.documentElement.classList.remove("wh-cart-open");
    document.getElementById("whCartDrawer")?.setAttribute("aria-hidden","true");
    document.getElementById("whCartOverlay")?.setAttribute("aria-hidden","true");
  }

  // Global API for product pages
  window.WHCart = {
    add({ id, title, price, image, sku, qty }){
      const cart = loadCart();
      const found = cart.find(x => x.id === id);
      const addQty = Number(qty || 1);

      if(found) found.qty = (Number(found.qty)||0) + addQty;
      else cart.push({ id, title, price:Number(price)||0, image, sku, qty:addQty });

      saveCart(cart);
      render();
      openCart();
    },
    open: openCart,
    close: closeCart,
    render
  };

  function setOffset(){
    const wrap = document.getElementById("whWrap");
    if(!wrap) return;
    const h = wrap.getBoundingClientRect().height;
    document.documentElement.style.setProperty("--wh-offset", `${Math.ceil(h)}px`);
  }

  function bindUI(){
    document.getElementById("whCartBtn")?.addEventListener("click", openCart);
    document.getElementById("whCartClose")?.addEventListener("click", closeCart);
    document.getElementById("whCartOverlay")?.addEventListener("click", closeCart);

    document.getElementById("whCartCheckout")?.addEventListener("click", () => {
      window.location.href = PAYPAL_CHECKOUT_URL;
    });

    document.addEventListener("keydown", (e) => { if(e.key === "Escape") closeCart(); });

    // burger
    const burger = document.getElementById("whBurger");
    const mobileNav = document.getElementById("whMobileNav");
    burger?.addEventListener("click", () => mobileNav?.classList.toggle("open"));

    // active link highlight
    const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    const map = { "index.html":"startseite", "":"startseite", "heatbelt.html":"heatbelt", "thermogun.html":"thermogun" };
    const active = map[path];
    if(active){
      document.querySelectorAll("[data-nav]").forEach(a=>{
        a.classList.toggle("active", a.getAttribute("data-nav") === active);
      });
    }

    // hide on scroll down, show on scroll up
    const wrap = document.getElementById("whWrap");
    let lastY = window.scrollY || 0;
    let ticking = false;

    function onScroll(){
      const y = window.scrollY || 0;
      const delta = y - lastY;

      if (Math.abs(delta) < 6) return;

      if (y < 80) {
        wrap?.classList.remove("wh-hide");
        lastY = y;
        return;
      }

      if (delta > 0) wrap?.classList.add("wh-hide");
      else wrap?.classList.remove("wh-hide");

      lastY = y;
    }

    window.addEventListener("scroll", () => {
      if(!ticking){
        requestAnimationFrame(() => { onScroll(); ticking = false; });
        ticking = true;
      }
    }, { passive:true });

    // keep offset correct
    window.addEventListener("resize", setOffset, { passive:true });
  }

  // Init after header injected
  window.initWHHeader = function(){
    setOffset();
    bindUI();
    render();
  };
})();
