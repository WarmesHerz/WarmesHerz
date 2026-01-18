<!-- ===== WARMESHERZ HEADER ===== -->
<style>
:root{
  --wh-topbar:#3c3c3a;
  --wh-header:#fbfaf7;
  --wh-text:#111;
  --wh-muted:rgba(0,0,0,.55);
  --wh-border:rgba(0,0,0,.12);
}

/* ----- TOPBAR ----- */
.wh-topbar{background:var(--wh-topbar);color:#fff;font-size:13px}
.wh-topbar-inner{
  max-width:1400px;margin:0 auto;padding:10px 20px;
  display:flex;align-items:center;justify-content:center
}
.wh-topbar b{font-weight:600}

/* ----- HEADER STICKY + HIDE ----- */
.wh-header{
  background:var(--wh-header);
  border-bottom:1px solid var(--wh-border);
  position:fixed;
  top:0;left:0;right:0;
  z-index:999;
  transition:transform .22s ease;
}
.wh-header.wh-hide{ transform:translateY(-110%); }

.wh-header-spacer{ height:92px; }   /* verhindert das „Reinschneiden“ */

.wh-header-inner{
  max-width:1400px;margin:0 auto;
  padding:14px 20px;
  display:grid;
  grid-template-columns:1fr auto 1fr;
  align-items:center;
}

/* ----- BRAND ----- */
.wh-brand{
  display:flex;align-items:center;gap:12px;
  text-decoration:none;color:#111;
}
.wh-logo{
  width:52px;height:52px;
  object-fit:contain;
}
.wh-brand-name{
  font-size:20px;
  font-weight:300;
  letter-spacing:.4px;
}

/* ----- NAV ----- */
.wh-nav{
  display:flex;gap:34px;justify-content:center
}
.wh-nav-link{
  text-decoration:none;
  color:rgba(0,0,0,.7);
  font-size:14px;
}
.wh-nav-link.active{color:#111;font-weight:600}

/* ----- CART BUTTON (DEIN DESIGN) ----- */
.wh-cart-btn{
  width:52px;height:46px;
  border:1px solid rgba(0,0,0,.14);
  background:#fff;
  border-radius:14px;
  position:relative;
  cursor:pointer;
}
.wh-cart-btn:hover{background:#f9f9f9}

.wh-cart-count{
  position:absolute;
  top:6px;right:6px;
  background:#111;color:#fff;
  border-radius:999px;
  min-width:18px;height:18px;
  display:flex;align-items:center;justify-content:center;
  font-size:12px;
}

/* ----- DRAWER (GENAU WIE VORHER) ----- */
.wh-cart-overlay{
  position:fixed;inset:0;
  background:rgba(0,0,0,.35);
  opacity:0;pointer-events:none;
  transition:.22s;
  z-index:1000
}
.wh-cart-drawer{
  position:fixed;top:0;right:0;
  height:100%;width:390px;
  background:#fff;
  transform:translateX(110%);
  transition:.26s;
  z-index:1001;
  display:flex;flex-direction:column;
}

.wh-cart-open .wh-cart-overlay{opacity:1;pointer-events:auto}
.wh-cart-open .wh-cart-drawer{transform:translateX(0)}

/* ----- MOBILE ----- */
@media(max-width:900px){
  .wh-header-inner{grid-template-columns:1fr auto}
  .wh-nav{display:none}
}
</style>

<div class="wh-topbar">
  <div class="wh-topbar-inner">
    <span><b>Kostenloser Versand</b> auf alle Bestellungen</span>
  </div>
</div>

<header class="wh-header" id="whHeader">
  <div class="wh-header-inner">

    <a class="wh-brand" href="index.html">
      <img class="wh-logo" src="LOGO.jpg">
      <span class="wh-brand-name">WarmesHerz</span>
    </a>

    <nav class="wh-nav">
      <a class="wh-nav-link" href="index.html">Startseite</a>
      <a class="wh-nav-link" href="heatbelt.html">HeatBelt Pro™</a>
      <a class="wh-nav-link" href="thermogun.html">ThermoGun Pro™</a>
    </nav>

    <button class="wh-cart-btn" id="whCartBtn">
      <!-- DEIN ICON AUS BILD -->
      <img src="cart-icon.png" style="width:24px">
      <span class="wh-cart-count" id="whCartCount">0</span>
    </button>

  </div>
</header>

<div class="wh-header-spacer"></div>

<div class="wh-cart-overlay" id="whCartOverlay"></div>

<aside class="wh-cart-drawer" id="whCartDrawer">
  <div class="wh-cart-body" id="whCartItems"></div>

  <div style="padding:18px">
    <button class="wh-cart-checkout" id="whCartCheckout">
      Zur Kasse
    </button>
  </div>
</aside>

<script src="header.js"></script>
