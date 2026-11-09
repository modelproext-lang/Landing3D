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
    var auto=['section h2','section .lead','.feat>div','.prod','.plan','.step','.vs .card','details','.st','.rs>div','.dl>div','.partner','.split>img','form','.z3-adv>a','.z3-ctrl>div','.z3-cases>article','.z3-reviews>figure','.z3-badges','.z3-points>div','.z3-loop','.z3-startup','.about-glass>li','.how-c','#soluciones .pb','.cn-b>li','.cn-card','.nv-c','.of-map'];
    document.querySelectorAll('.pt').forEach(function(r){
      auto.forEach(function(sel){r.querySelectorAll(sel).forEach(function(el){
        if(el.closest('.hs')||el.hasAttribute('data-aos'))return;
        var a='fade-up';if(el.matches('.split>img,.vs .card.g'))a='fade-left';if(el.matches('.vs .card.x'))a='fade-right';if(el.matches('.partner,.z3-loop'))a='zoom';
        el.setAttribute('data-aos',a);
        var sib=el.parentNode?Array.prototype.indexOf.call(el.parentNode.children,el):0;
        if(el.matches('.feat>div,.prod,.plan,.step,.st,.rs>div,.dl>div,details,.about-glass>li,.how-c,.z3-adv>a,.z3-ctrl>div,.z3-cases>article,.z3-reviews>figure,.z3-points>div'))el.style.setProperty('--d',Math.min(sib,5)*0.08+'s');
      });});
      r.classList.add('aos');
    });
    var io=new IntersectionObserver(function(es){es.forEach(function(e){var rep=e.target.closest('[data-aos-repeat]');if(e.isIntersecting){e.target.classList.add('in');if(!rep)io.unobserve(e.target);}else if(rep&&e.boundingClientRect.top>0){e.target.classList.remove('in');}});},{rootMargin:'0px 0px -8% 0px',threshold:.08});
    document.querySelectorAll('.pt [data-aos], .pt .bars').forEach(function(el){io.observe(el);});
    var co=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;co.unobserve(e.target);
      var el=e.target,end=parseFloat(el.getAttribute('data-count')),dec=+(el.getAttribute('data-dec')||0),plain=el.hasAttribute('data-plain'),start=plain?end-40:0,t0=null;
      function step(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/1600,1),v=start+(end-start)*(1-Math.pow(1-p,3));el.textContent=dec?v.toFixed(dec):Math.round(v).toString();if(p<1)requestAnimationFrame(step);}
      requestAnimationFrame(step);});},{threshold:.5});
    document.querySelectorAll('.pt [data-count]').forEach(function(el){co.observe(el);});
  }else{document.querySelectorAll('.pt .bars').forEach(function(b){b.classList.add('in');});}
  // "Cómo trabajamos": en pantallas táctiles, tocar una tarjeta la activa (tocar fuera la regresa)
  if(window.matchMedia&&matchMedia('(hover: none)').matches){
    document.querySelectorAll('.pt .how-c').forEach(function(c){c.addEventListener('click',function(){var on=!c.classList.contains('on');document.querySelectorAll('.pt .how-c.on').forEach(function(x){x.classList.remove('on');});if(on)c.classList.add('on');});});
    document.addEventListener('click',function(e){if(!e.target.closest('.how-c'))document.querySelectorAll('.pt .how-c.on').forEach(function(x){x.classList.remove('on');});});
  }
  // carrusel de logos: autoplay lento por scroll, pausa en hover/toque, arrastre con mouse y dedo
  document.querySelectorAll('.pt .mq').forEach(function(mq){
    var first=mq.querySelector('ul'),paused=false,resume=null,acc=0,last=0,touch=window.matchMedia&&matchMedia('(hover: none)').matches,tick=0;
    var SPEED=reduce?0:28; // px por segundo
    function loopW(){return first.getBoundingClientRect().width;}
    function wrap(){var w=loopW();if(w&&mq.scrollLeft>=w)mq.scrollLeft-=w;else if(mq.scrollLeft<=0&&w)mq.scrollLeft+=w;}
    function hold(ms){paused=true;clearTimeout(resume);if(ms)resume=setTimeout(function(){paused=false;},ms);}
    function center(){if(!touch)return;var r=mq.getBoundingClientRect(),cx=r.left+r.width/2,best=null,bd=1e9;
      mq.querySelectorAll('li').forEach(function(li){var b=li.getBoundingClientRect(),d=Math.abs(b.left+b.width/2-cx);if(d<bd){bd=d;best=li;}});
      mq.querySelectorAll('li.on').forEach(function(li){if(li!==best)li.classList.remove('on');});if(best)best.classList.add('on');}
    function step(ts){var dt=last?Math.min((ts-last)/1000,.05):0;last=ts;
      if(!paused&&SPEED&&mq.getBoundingClientRect().bottom>0){acc+=SPEED*dt;var px=Math.floor(acc);if(px){acc-=px;mq.scrollLeft+=px;wrap();}}
      if(++tick%12===0)center();requestAnimationFrame(step);}
    mq.scrollLeft=1;
    mq.addEventListener('mouseenter',function(){hold(0);});
    mq.addEventListener('mouseleave',function(){paused=false;});
    mq.addEventListener('touchstart',function(){hold(0);},{passive:true});
    mq.addEventListener('touchend',function(){hold(2500);},{passive:true});
    mq.addEventListener('scroll',function(){if(paused)wrap();},{passive:true});
    var dx=null,sl=0;
    mq.addEventListener('mousedown',function(e){dx=e.clientX;sl=mq.scrollLeft;mq.classList.add('drag');e.preventDefault();});
    window.addEventListener('mousemove',function(e){if(dx===null)return;mq.scrollLeft=sl-(e.clientX-dx);wrap();});
    window.addEventListener('mouseup',function(){if(dx===null)return;dx=null;mq.classList.remove('drag');});
    requestAnimationFrame(step);
  });
  // portada ZWCAD: red de puntos de datos que reacciona al mouse
  document.querySelectorAll('.pt .zb-data').forEach(function(cv){
    var host=cv.parentNode,ctx=cv.getContext('2d'),W=0,H=0,dpr=Math.min(window.devicePixelRatio||1,2),pts=[],mx=-1e4,my=-1e4,run=true,vis=true;
    function size(){var r=host.getBoundingClientRect();W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
      var n=Math.round(Math.min(110,W*H/9000));pts=[];for(var i=0;i<n;i++)pts.push({x:W*(.3+Math.random()*.7),y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*1.6+.8,b:Math.random()});}
    function draw(){
      ctx.clearRect(0,0,W,H);
      for(var i=0;i<pts.length;i++){var p=pts[i];
        if(!reduce){var dx=p.x-mx,dy=p.y-my,d2=dx*dx+dy*dy;if(d2<5200){var f=(5200-d2)/5200*.9;p.vx+=dx/Math.sqrt(d2+1)*f*.18;p.vy+=dy/Math.sqrt(d2+1)*f*.18;}
          p.vx*=.985;p.vy*=.985;if(Math.abs(p.vx)<.08)p.vx+=(Math.random()-.5)*.04;if(Math.abs(p.vy)<.08)p.vy+=(Math.random()-.5)*.04;
          p.x+=p.vx;p.y+=p.vy;if(p.x<W*.25||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;}
        for(var k=i+1;k<pts.length;k++){var q=pts[k],ex=p.x-q.x,ey=p.y-q.y,e=ex*ex+ey*ey;if(e<9000){ctx.strokeStyle='rgba(90,184,255,'+(1-e/9000)*.35+')';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}}
        var near=(p.x-mx)*(p.x-mx)+(p.y-my)*(p.y-my)<32000;
        ctx.fillStyle=near?'rgba(155,230,255,.95)':'rgba(90,184,255,'+(.45+p.b*.4)+')';ctx.beginPath();ctx.arc(p.x,p.y,near?p.r+1:p.r,0,6.283);ctx.fill();}
      if(mx>0){for(var t=0;t<pts.length;t++){var a=pts[t],gx=a.x-mx,gy=a.y-my,g=gx*gx+gy*gy;if(g<32000){ctx.strokeStyle='rgba(60,240,200,'+(1-g/32000)*.6+')';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(mx,my);ctx.stroke();}}}
      if(run&&vis&&!reduce)requestAnimationFrame(draw);}
    host.addEventListener('mousemove',function(e){var r=host.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;});
    host.addEventListener('mouseleave',function(){mx=my=-1e4;});
    host.addEventListener('touchmove',function(e){var r=host.getBoundingClientRect(),t=e.touches[0];mx=t.clientX-r.left;my=t.clientY-r.top;},{passive:true});
    host.addEventListener('touchend',function(){mx=my=-1e4;},{passive:true});
    if('IntersectionObserver' in window)new IntersectionObserver(function(es){var was=vis;vis=es[0].isIntersecting&&!host.closest('[hidden]');if(vis&&!was&&!reduce)requestAnimationFrame(draw);}).observe(host);
    window.addEventListener('resize',function(){size();if(reduce)draw();});
    size();requestAnimationFrame(draw);
    if('ResizeObserver' in window)new ResizeObserver(function(){var r=host.getBoundingClientRect();if(r.width&&(Math.abs(r.width-W)>2||Math.abs(r.height-H)>2||!pts.length)){size();vis=true;requestAnimationFrame(draw);}}).observe(host);
  });
  // videos de YouTube: el reproductor solo se carga al hacer clic
  document.querySelectorAll('.pt .vd-frame').forEach(function(f){
    var b=f.querySelector('.vd-play');if(!b)return;
    b.addEventListener('click',function(){var id=f.getAttribute('data-yt');
      if(document.querySelector('[data-page]')){if(!f.querySelector('.vd-msg')){var m=document.createElement('div');m.className='vd-msg';m.textContent='Vista previa: el video se reproduce aquí mismo en el sitio publicado.';f.appendChild(m);}return;}
      var i=document.createElement('iframe');
      i.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0&modestbranding=1'+(f.getAttribute('data-start')?'&start='+f.getAttribute('data-start'):'');i.title=b.getAttribute('aria-label');
      i.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';i.allowFullscreen=true;f.innerHTML='';f.appendChild(i);
      track('video_play',{video:id});});
  });
  // acordeón con medios (ZWCAD): avanza solo, pausa al pasar el mouse
  document.querySelectorAll('.pt [data-ac]').forEach(function(ac){
    var items=ac.querySelectorAll('.ac-i'),media=ac.querySelectorAll('.ac-m'),cur=0,t=null,DUR=6000,seen=false;
    ac.style.setProperty('--acdur',DUR/1000+'s');
    function vid(k,play){var v=media[k]&&media[k].querySelector('video');if(!v)return;if(play){v.preload='auto';var p=v.play();if(p&&p.catch)p.catch(function(){});}else{v.pause();}}
    function go(k,user){items[cur].classList.remove('on');media[cur].classList.remove('on');items[cur].querySelector('.ac-h').setAttribute('aria-expanded','false');vid(cur,false);
      cur=(k+items.length)%items.length;var it=items[cur];it.classList.remove('on');void it.offsetWidth;it.classList.add('on');media[cur].classList.add('on');it.querySelector('.ac-h').setAttribute('aria-expanded','true');vid(cur,true);
      clearTimeout(t);if(!reduce&&!ac.classList.contains('paused')&&seen)t=setTimeout(function(){go(cur+1);},DUR);}
    items.forEach(function(it,k){it.querySelector('.ac-h').addEventListener('click',function(){go(k,true);});});
    ac.addEventListener('mouseenter',function(){ac.classList.add('paused');clearTimeout(t);});
    ac.addEventListener('mouseleave',function(){ac.classList.remove('paused');clearTimeout(t);if(!reduce&&seen)t=setTimeout(function(){go(cur+1);},DUR/2);});
    if('IntersectionObserver' in window)new IntersectionObserver(function(es){var v=es[0].isIntersecting;if(v&&!seen){seen=true;go(cur);}else if(!v){clearTimeout(t);}else if(v&&!t){go(cur);}},{threshold:.35}).observe(ac);
  });
  // funciones ZWCAD: chips, video visible se reproduce, clic abre vista ampliada
  document.querySelectorAll('.pt .fx').forEach(function(sec){
    function playVisible(){sec.querySelectorAll('.fx-tab').forEach(function(t){t.querySelectorAll('.fx-p').forEach(function(p){var v=p.querySelector('video');if(!v)return;
      if(!t.hidden&&!p.hidden&&inView){v.preload='auto';var r=v.play();if(r&&r.catch)r.catch(function(){});}else v.pause();});});}
    var inView=false;
    sec.querySelectorAll('.fx-tab').forEach(function(t){t.querySelectorAll('.fx-chip').forEach(function(c){c.addEventListener('click',function(){var i=c.getAttribute('data-i');
      t.querySelectorAll('.fx-chip').forEach(function(x){var on=x===c;x.classList.toggle('on',on);x.setAttribute('aria-selected',on);});
      t.querySelectorAll('.fx-p').forEach(function(p){var on=p.getAttribute('data-i')===i;p.hidden=!on;p.classList.toggle('on',on);});
      c.scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'});playVisible();});});});
    sec.querySelectorAll('.fx-tabs button').forEach(function(b){b.addEventListener('click',function(){setTimeout(playVisible,0);});});
    if('IntersectionObserver' in window)new IntersectionObserver(function(es){inView=es[0].isIntersecting;playVisible();},{threshold:.25}).observe(sec);
  });
  var lb=document.querySelector('.pt .fx-lb');
  if(lb){var lbIn=lb.querySelector('.fx-lb-in'),last=null;
    function closeLb(){lb.hidden=true;lbIn.innerHTML='';document.documentElement.style.overflow='';if(last)last.focus();}
    document.querySelectorAll('.pt .fx-media').forEach(function(m){m.addEventListener('click',function(){last=m;var v=m.querySelector('video'),im=m.querySelector('img'),n;
      if(v){n=document.createElement('video');n.src=v.currentSrc||v.src;n.controls=true;n.autoplay=true;n.loop=true;n.muted=true;n.playsInline=true;n.currentTime=v.currentTime||0;}
      else{n=document.createElement('img');n.src=im.src;n.alt=im.alt;}
      lbIn.innerHTML='';lbIn.appendChild(n);lb.hidden=false;document.documentElement.style.overflow='hidden';lb.querySelector('.fx-lb-x').focus();track('feature_zoom',{feature:m.getAttribute('aria-label')});});});
    lb.querySelector('.fx-lb-x').addEventListener('click',closeLb);
    lb.addEventListener('click',function(e){if(e.target===lb)closeLb();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!lb.hidden)closeLb();});
  }
  // planes: selector Standalone / Red
  document.querySelectorAll('.pt [data-lic-wrap]').forEach(function(w){
    var bs=w.querySelectorAll('.lic-sw button');
    function fmt(n){return '$'+Number(n).toLocaleString('es-MX');}
    function set(t){
      bs.forEach(function(b){var on=b.getAttribute('data-lic')===t;b.classList.toggle('on',on);b.setAttribute('aria-checked',on);});
      w.querySelectorAll('.lic-info p').forEach(function(p){p.hidden=p.getAttribute('data-for')!==t;});
      var lbl=t==='net'?'Red (flotante)':'Standalone';
      w.querySelectorAll('.plan[data-sa]').forEach(function(c){var v=t==='net'&&c.getAttribute('data-net')?c.getAttribute('data-net'):c.getAttribute('data-sa');
        var a=c.querySelector('.lic-amt');a.textContent=fmt(v);a.classList.remove('bump');void a.offsetWidth;a.classList.add('bump');setTimeout(function(){a.classList.remove('bump');},350);
        c.querySelector('.lic-lbl').textContent=lbl;
        var go=c.querySelector('.lic-go');go.href=link('Hola ProTech, quiero '+c.getAttribute('data-name')+' con licencia '+lbl+' ('+fmt(v)+' MXN + IVA).');});
    }
    bs.forEach(function(b){b.addEventListener('click',function(){set(b.getAttribute('data-lic'));});});
  });
  // menú flotante de secciones con resaltado de la sección actual
  document.querySelectorAll('.pt .pnav').forEach(function(nav){
    var page=nav.closest('[data-page]')||document,links=[].slice.call(nav.querySelectorAll('.pnav-l a')),
        secs=links.map(function(a){return page.querySelector(a.getAttribute('href'));}),hero=page.querySelector('.zb, .z3-hero, .phero, .hs'),cur=-1;
    function vis(){return !nav.closest('[hidden]');}
    function upd(){
      if(!vis()){document.documentElement.classList.remove('pnav-show');return;}
      var h=hero?hero.getBoundingClientRect().bottom:0,show=h<80;
      nav.classList.toggle('show',show);document.documentElement.classList.toggle('pnav-show',show);
      var y=innerHeight*.35,k=-1;secs.forEach(function(s,i){if(s&&s.getBoundingClientRect().top<=y)k=i;});
      if(k!==cur){cur=k;links.forEach(function(a,i){a.classList.toggle('on',i===k);if(i===k)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});
        if(k>=0){var l=links[k],box=l.parentNode;box.scrollTo({left:l.offsetLeft-box.clientWidth/2+l.clientWidth/2,behavior:reduce?'auto':'smooth'});}}
    }
    links.forEach(function(a,i){a.addEventListener('click',function(e){var s=secs[i];if(!s)return;e.preventDefault();s.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});});});
    nav.querySelector('.pnav-b').addEventListener('click',function(e){var s=secs[0];if(s){e.preventDefault();s.scrollIntoView({behavior:reduce?'auto':'smooth'});}});
    addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);addEventListener('hashchange',function(){cur=-1;setTimeout(upd,60);});upd();
  });
  // misión, visión y valores: la tarjeta activa se expande (hover, foco o toque)
  document.querySelectorAll('.pt .mv-g').forEach(function(g){
    var cs=g.querySelectorAll('.mv-c');
    function act(c){cs.forEach(function(x){x.classList.toggle('on',x===c);});}
    cs.forEach(function(c){c.addEventListener('mouseenter',function(){act(c);});c.addEventListener('focus',function(){act(c);});c.addEventListener('click',function(){act(c);});});
  });
  // mapa de oficinas: en el sitio publicado se carga Google Maps al acercarse; en la vista previa queda la tarjeta
  document.querySelectorAll('.pt .of-map[data-map]').forEach(function(a){
    if(document.querySelector('[data-page]'))return;
    function load(){var w=document.createElement('div');w.className='of-map of-map-live';
      var f=document.createElement('iframe');f.src='https://www.google.com/maps?q='+encodeURIComponent(a.getAttribute('data-map'))+'&z=16&output=embed';
      f.title='Mapa de oficinas ProTech en Querétaro';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.setAttribute('allowfullscreen','');
      var l=document.createElement('a');l.className='of-map-open';l.href=a.href;l.target='_blank';l.rel='noopener';l.textContent='Abrir en Google Maps →';
      w.appendChild(f);w.appendChild(l);a.replaceWith(w);}
    if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){io.disconnect();load();}},{rootMargin:'300px'});io.observe(a);}else load();
  });
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
