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
    var bs=w.querySelectorAll('.tabs button');
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
      document.title=pg.getAttribute('data-title')||document.title;
    }
    window.addEventListener('hashchange',show);show();
  }
})();
