(function(){
  var WA='524426044489';
  function link(m){return 'https://wa.me/'+WA+'?text='+encodeURIComponent(m);}
  function track(ev,p){try{if(window.gtag)gtag('event',ev,p||{});if(window.fbq)fbq('track',ev==='generate_lead'?'Lead':'Contact');}catch(e){}}
  var root=document;
  root.querySelectorAll('.wa').forEach(function(a){
    a.href=link(a.getAttribute('data-msg')||'Hola ProTech');a.target='_blank';a.rel='noopener';
    a.addEventListener('click',function(){track('whatsapp_click',{label:a.getAttribute('data-msg')});});
  });
  // tabs (each .tabs-wrap is independent)
  root.querySelectorAll('.tabs-wrap').forEach(function(w){
    var bs=w.querySelectorAll('.tabs button, .z3-tablist button');
    bs.forEach(function(b){b.addEventListener('click',function(){
      bs.forEach(function(x){x.classList.toggle('on',x===b);});
      w.querySelectorAll('[data-panel]').forEach(function(p){p.hidden=p.getAttribute('data-panel')!==b.getAttribute('data-tab');});
    });});
  });
  // forms -> WhatsApp
  root.querySelectorAll('form[data-wa]').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();var parts=[f.getAttribute('data-wa')];
      f.querySelectorAll('[data-label]').forEach(function(el){if(el.value)parts.push(el.getAttribute('data-label')+': '+el.value);});
      track('generate_lead',{form:f.id});
      var a=document.createElement('a');a.href=link(parts.join('\n'));a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove();
    });
  });
  // menu
  var nav=root.querySelector('.nav'),bg=root.querySelector('.burger');
  bg.addEventListener('click',function(){var o=nav.classList.toggle('mopen');bg.setAttribute('aria-expanded',o);});
  root.querySelectorAll('.dd-t').forEach(function(t){t.addEventListener('click',function(){
    var li=t.parentNode,o=li.classList.toggle('open');t.setAttribute('aria-expanded',o);
    root.querySelectorAll('.dd.open').forEach(function(x){if(x!==li){x.classList.remove('open');x.querySelector('.dd-t').setAttribute('aria-expanded','false');}});
  });});
  document.addEventListener('click',function(e){if(!e.target.closest('.dd'))root.querySelectorAll('.dd.open').forEach(function(x){x.classList.remove('open');});});

  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  // hero slider
  document.querySelectorAll('.pt .hs').forEach(function(hs){
    var slides=hs.querySelectorAll('.hs-slide'),nav=hs.querySelector('.hs-nav'),i=0,t=null,DUR=7000;
    hs.style.setProperty('--dur',DUR/1000+'s');
    slides.forEach(function(sl,k){var b=document.createElement('button');b.type='button';b.setAttribute('role','tab');b.textContent=sl.getAttribute('data-tab');
      b.addEventListener('click',function(){go(k,true);});nav.appendChild(b);});
    var tabs=nav.querySelectorAll('button');
    function go(k,user){
      slides[i].classList.remove('on');tabs[i].classList.remove('on');tabs[i].setAttribute('aria-selected','false');
      i=(k+slides.length)%slides.length;
      slides[i].classList.add('on');var tb=tabs[i];tb.classList.remove('on');void tb.offsetWidth;tb.classList.add('on');tb.setAttribute('aria-selected','true');
      hs.classList.toggle('is-dark',slides[i].classList.contains('dark'));
      slides.forEach(function(s,n){s.setAttribute('aria-hidden',n!==i);});
      clearTimeout(t);if(!reduce&&!hs.classList.contains('paused'))t=setTimeout(function(){go(i+1);},DUR);
    }
    hs.addEventListener('mouseenter',function(){hs.classList.add('paused');clearTimeout(t);});
    hs.addEventListener('mouseleave',function(){hs.classList.remove('paused');clearTimeout(t);if(!reduce)t=setTimeout(function(){go(i+1);},DUR/2);});
    var sx=null;hs.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;},{passive:true});
    hs.addEventListener('touchend',function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)go(i+(dx<0?1:-1),true);sx=null;});
    go(0);
  });
  // scroll reveal (AOS-like) + counters + bars
  if('IntersectionObserver' in window&&!reduce){
    var auto=['section h2','section .lead','.feat>div','.prod','.plan','.step','.vs .card','details','.st','.rs>div','.dl>div','.partner','.split>img','form','.z3-adv>a','.z3-ctrl>div','.z3-cases>article','.z3-reviews>figure','.z3-badges','.z3-points>div','.z3-loop','.z3-startup'];
    document.querySelectorAll('.pt').forEach(function(r){
      auto.forEach(function(sel){r.querySelectorAll(sel).forEach(function(el){
        if(el.closest('.hs')||el.hasAttribute('data-aos'))return;
        var a='fade-up';if(el.matches('.split>img,.vs .card.g'))a='fade-left';if(el.matches('.vs .card.x'))a='fade-right';if(el.matches('.partner,.z3-loop'))a='zoom';
        el.setAttribute('data-aos',a);
        var sib=el.parentNode?Array.prototype.indexOf.call(el.parentNode.children,el):0;
        if(el.matches('.feat>div,.prod,.plan,.step,.st,.rs>div,.dl>div,details,.z3-adv>a,.z3-ctrl>div,.z3-cases>article,.z3-reviews>figure,.z3-points>div'))el.style.setProperty('--d',Math.min(sib,5)*0.08+'s');
      });});
      r.classList.add('aos');
    });
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px',threshold:.08});
    document.querySelectorAll('.pt [data-aos], .pt .bars').forEach(function(el){io.observe(el);});
    var co=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;co.unobserve(e.target);
      var el=e.target,end=parseFloat(el.getAttribute('data-count')),dec=+(el.getAttribute('data-dec')||0),plain=el.hasAttribute('data-plain'),start=plain?end-40:0,t0=null;
      function step(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/1600,1),v=start+(end-start)*(1-Math.pow(1-p,3));el.textContent=dec?v.toFixed(dec):Math.round(v).toString();if(p<1)requestAnimationFrame(step);}
      requestAnimationFrame(step);});},{threshold:.5});
    document.querySelectorAll('.pt [data-count]').forEach(function(el){co.observe(el);});
  }else{document.querySelectorAll('.pt .bars').forEach(function(b){b.classList.add('in');});}
  // single-file preview: hash router
  var pages=root.querySelectorAll('[data-page]');
  if(pages.length>1){
    function show(){
      var h=(location.hash||'#inicio').slice(1),pg=root.querySelector('[data-page="'+h+'"]'),target=null;
      if(!pg){target=document.getElementById(h);pg=target?target.closest('[data-page]'):null;}
      if(!pg)pg=root.querySelector('[data-page="inicio"]');
      pages.forEach(function(p){p.hidden=p!==pg;});
      root.querySelectorAll('.menu a').forEach(function(a){if(a.getAttribute('href')==='#'+pg.getAttribute('data-page'))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
      nav.classList.remove('mopen');root.querySelectorAll('.dd.open').forEach(function(x){x.classList.remove('open');});
      if(target)target.scrollIntoView();else window.scrollTo(0,0);
      pg.querySelectorAll('[data-aos]:not(.in)').forEach(function(el){var r=el.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)el.classList.add('in');});
      document.title=pg.getAttribute('data-title')||document.title;
    }
    window.addEventListener('hashchange',show);show();
  }
})();
