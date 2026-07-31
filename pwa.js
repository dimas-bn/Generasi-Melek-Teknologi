(function(){
  "use strict";

  var DISMISS_KEY = 'geletek-install-dismissed-at';
  var DISMISS_DAYS = 7;
  var deferredPrompt = null;
  var banner, installBtn, dismissBtn, bannerTitle, bannerText, bannerIcon;

  function isStandalone(){
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true; // iOS Safari
  }

  function isIOS(){
    return /iphone|ipad|ipod/i.test(window.navigator.userAgent) &&
           !window.MSStream;
  }

  function isSafari(){
    var ua = window.navigator.userAgent;
    return /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);
  }

  function wasRecentlyDismissed(){
    var raw = localStorage.getItem(DISMISS_KEY);
    if(!raw) return false;
    var dismissedAt = parseInt(raw, 10);
    if(isNaN(dismissedAt)) return false;
    var elapsedDays = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
    return elapsedDays < DISMISS_DAYS;
  }

  function markDismissed(){
    try{ localStorage.setItem(DISMISS_KEY, String(Date.now())); }catch(e){}
  }

  function clearDismissed(){
    try{ localStorage.removeItem(DISMISS_KEY); }catch(e){}
  }

  function buildBanner(){
    var el = document.createElement('div');
    el.className = 'install-banner';
    el.id = 'install-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Pasang aplikasi GELETEK');
    el.innerHTML =
      '<div class="install-banner__icon">' +
        '<svg width="26" height="26" viewBox="0 0 44 44"><polygon points="22,4 39,13 39,31 22,40 5,31 5,13" fill="none" stroke="currentColor" stroke-width="2.6"/><circle cx="22" cy="22" r="6" fill="currentColor"/></svg>' +
      '</div>' +
      '<div class="install-banner__body">' +
        '<p class="install-banner__title" id="install-banner-title">Pasang GELETEK di perangkat ini</p>' +
        '<p class="install-banner__text" id="install-banner-text">Akses lebih cepat dan tetap bisa dibuka meski sedang offline.</p>' +
      '</div>' +
      '<div class="install-banner__actions">' +
        '<button class="install-banner__btn install-banner__btn--ghost" id="install-banner-dismiss" type="button">Nanti Saja</button>' +
        '<button class="install-banner__btn install-banner__btn--primary" id="install-banner-install" type="button">Instal</button>' +
      '</div>' +
      '<button class="install-banner__close" id="install-banner-close" type="button" aria-label="Tutup">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>' +
      '</button>';
    document.body.appendChild(el);
    return el;
  }

  function showBanner(variant){
    if(isStandalone() || wasRecentlyDismissed()) return;
    if(!banner) banner = buildBanner();

    bannerTitle = document.getElementById('install-banner-title');
    bannerText = document.getElementById('install-banner-text');
    installBtn = document.getElementById('install-banner-install');
    dismissBtn = document.getElementById('install-banner-dismiss');
    var closeBtn = document.getElementById('install-banner-close');

    if(variant === 'ios'){
      bannerTitle.textContent = 'Pasang GELETEK di iPhone/iPad';
      bannerText.innerHTML = 'Ketuk tombol <strong>Bagikan</strong> di Safari, lalu pilih <strong>&ldquo;Tambah ke Layar Utama&rdquo;</strong>.';
      installBtn.textContent = 'Mengerti';
      installBtn.onclick = function(){ hideBanner(); markDismissed(); };
    } else {
      bannerTitle.textContent = 'Pasang GELETEK di perangkat ini';
      bannerText.textContent = 'Akses lebih cepat dan tetap bisa dibuka meski sedang offline.';
      installBtn.textContent = 'Instal';
      installBtn.onclick = function(){
        if(!deferredPrompt) return;
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function(choice){
          if(choice.outcome === 'accepted'){
            hideBanner();
          } else {
            markDismissed();
            hideBanner();
          }
          deferredPrompt = null;
        });
      };
    }

    dismissBtn.onclick = function(){ markDismissed(); hideBanner(); };
    closeBtn.onclick = function(){ markDismissed(); hideBanner(); };

    requestAnimationFrame(function(){
      requestAnimationFrame(function(){ banner.classList.add('is-visible'); });
    });
  }

  function hideBanner(){
    if(!banner) return;
    banner.classList.remove('is-visible');
  }

  function init(){
    // Registrasi service worker
    if('serviceWorker' in navigator){
      window.addEventListener('load', function(){
        navigator.serviceWorker.register('./sw.js').catch(function(){ /* diamkan saja jika gagal */ });
      });
    }

    if(isStandalone()) return; // sudah terpasang, tidak perlu tawarkan lagi

    // Android / desktop Chrome & Edge: event resmi
    window.addEventListener('beforeinstallprompt', function(e){
      e.preventDefault();
      deferredPrompt = e;
      setTimeout(function(){ showBanner('standard'); }, 1200);
    });

    window.addEventListener('appinstalled', function(){
      hideBanner();
      clearDismissed();
      deferredPrompt = null;
    });

    // iOS Safari: tidak ada beforeinstallprompt, tampilkan instruksi manual
    if(isIOS() && isSafari() && !wasRecentlyDismissed()){
      setTimeout(function(){ showBanner('ios'); }, 1800);
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
