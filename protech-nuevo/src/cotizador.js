  // ===== cotizador de licencias =====
  function money(n){return '$'+Math.round(n).toLocaleString('es-MX');}
  document.querySelectorAll('.pt .cz').forEach(function(cz){
    var D=JSON.parse(cz.getAttribute('data-cz')),st={p:0,v:null,t:'standalone',q:1},shown=0,raf=null;
    function hot(pi){var pl=D[pi].plans;for(var k=0;k<pl.length;k++)if(pl[k].hot)return k;return 0;}
    st.v=hot(0);
    cz.innerHTML=
      '<div class="cz-grid"><div class="cz-main">'+
      '<div class="cz-step"><div class="cz-h"><span>1</span><h3>¿Qué software necesitas?</h3></div><div class="cz-prod" role="radiogroup" aria-label="Producto"></div></div>'+
      '<div class="cz-step"><div class="cz-h"><span>2</span><h3>Elige la versión</h3></div><div class="cz-plans" role="radiogroup" aria-label="Versión"></div><div class="cz-feats"></div></div>'+
      '<div class="cz-step"><div class="cz-h"><span>3</span><h3>Tipo de licencia</h3></div><div class="cz-type" role="radiogroup" aria-label="Tipo de licencia">'+
        '<button type="button" role="radio" data-t="standalone"><b>Standalone</b><small>Se activa en una computadora. Ideal para usuarios individuales.</small><em></em></button>'+
        '<button type="button" role="radio" data-t="network"><b>Red (flotante)</b><small>Se instala en un servidor y la comparte tu equipo: cada licencia la usa una persona a la vez.</small><em></em></button>'+
      '</div></div>'+
      '<div class="cz-step"><div class="cz-h"><span>4</span><h3>¿Cuántas licencias?</h3></div><div class="cz-qty">'+
        '<div class="cz-step-q"><button type="button" data-q="-1" aria-label="Quitar una licencia">−</button><input class="cz-q" type="number" min="1" max="100" value="1" inputmode="numeric" aria-label="Número de licencias"><button type="button" data-q="1" aria-label="Agregar una licencia">+</button></div>'+
        '<div class="cz-chips"><button type="button" data-set="1">1</button><button type="button" data-set="3">3</button><button type="button" data-set="5">5</button><button type="button" data-set="10">10</button></div>'+
      '</div></div>'+
      '</div><aside class="cz-sum" aria-live="polite">'+
        '<div class="cz-sum-h"><img alt="" width="44" height="44"><div><small>Tu configuración</small><b class="cz-s-name"></b></div></div>'+
        '<dl><div><dt>Tipo</dt><dd class="cz-s-type"></dd></div><div><dt>Precio por licencia</dt><dd class="cz-s-unit"></dd></div><div><dt>Cantidad</dt><dd class="cz-s-qty"></dd></div></dl>'+
        '<div class="cz-total"><small>Total</small><b class="cz-s-total"></b><span>MXN · licencia perpetua, pago único</span></div>'+
        '<p class="cz-hint"></p>'+
        '<a class="btn btn-p cz-go" href="#" target="_blank" rel="noopener">Solicitar cotización formal</a>'+
        '<a class="btn cz-trial" href="#" target="_blank" rel="noopener">Probar gratis 30 días</a>'+
        '<ul class="cz-perks"><li>Sin renovaciones obligatorias</li><li>Instalación y activación incluidas</li><li>Soporte técnico en México</li></ul>'+
      '</aside></div>'+
      '<div class="cz-bar"><div><small>Total</small><b class="cz-b-total"></b></div><a class="btn btn-p cz-go" href="#" target="_blank" rel="noopener">Cotizar</a></div>';
    var $=function(s){return cz.querySelector(s);},$$=function(s){return cz.querySelectorAll(s);};
    var prodBox=$('.cz-prod');
    D.forEach(function(p,i){var b=document.createElement('button');b.type='button';b.setAttribute('role','radio');
      b.innerHTML='<img src="'+p.logo+'" alt="" width="40" height="40"><span><b>'+p.label+'</b><small>'+p.sub+'</small></span>';
      b.addEventListener('click',function(){if(st.p===i)return;st.p=i;st.v=hot(i);render(true);});prodBox.appendChild(b);});
    $$('.cz-type button').forEach(function(b){b.addEventListener('click',function(){st.t=b.getAttribute('data-t');render();});});
    var q=$(".cz-q");
    function setQ(n){st.q=Math.max(1,Math.min(100,n|0||1));q.value=st.q;render();}
    $$('[data-q]').forEach(function(b){b.addEventListener('click',function(){setQ(st.q+ +b.getAttribute('data-q'));});});
    $$('[data-set]').forEach(function(b){b.addEventListener('click',function(){setQ(+b.getAttribute('data-set'));});});
    q.addEventListener('input',function(){if(q.value!=='')setQ(+q.value);});
    function unit(pl){return st.t==='network'?pl.net:pl.price;}
    function show(v){$('.cz-s-total').textContent=v;$('.cz-b-total').textContent=v;}
    function tween(to){cancelAnimationFrame(raf);var from=shown,t0=null;
      if(reduce){shown=to;show(money(to));return;}
      function f(ts){if(!t0)t0=ts;var k=Math.min((ts-t0)/450,1),v=from+(to-from)*(1-Math.pow(1-k,3));show(money(v));if(k<1)raf=requestAnimationFrame(f);else shown=to;}
      raf=requestAnimationFrame(f);}
    function render(prodChanged){
      var P=D[st.p],pl=P.plans[st.v];
      prodBox.querySelectorAll('button').forEach(function(b,i){b.classList.toggle('on',i===st.p);b.setAttribute('aria-checked',i===st.p);});
      var box=$('.cz-plans');
      if(prodChanged){box.innerHTML='';P.plans.forEach(function(x,i){var b=document.createElement('button');b.type='button';b.setAttribute('role','radio');
        b.innerHTML=(x.hot?'<i>Recomendado</i>':'')+'<b>'+x.name+'</b><small>'+x.desc+'</small><strong></strong>';
        b.addEventListener('click',function(){st.v=i;render();});box.appendChild(b);});}
      box.querySelectorAll('button').forEach(function(b,i){var u=unit(P.plans[i]);b.classList.toggle('on',i===st.v);b.setAttribute('aria-checked',i===st.v);
        b.querySelector('strong').textContent=u?money(u):'A cotizar';});
      $('.cz-feats').innerHTML='<small>'+pl.name+' incluye</small><ul>'+pl.feats.map(function(f){return '<li>'+f+'</li>';}).join('')+'</ul>';
      $$('.cz-type button').forEach(function(b){var t=b.getAttribute('data-t'),on=t===st.t;b.classList.toggle('on',on);b.setAttribute('aria-checked',on);
        var u=t==='network'?pl.net:pl.price;b.querySelector('em').textContent=u?money(u)+' por licencia':'Precio a cotizar';});
      var u=unit(pl),name=pl.name,type=st.t==='network'?'Red (flotante)':'Standalone';
      $('.cz-sum-h img').src=P.logo;$('.cz-s-name').textContent=name;$('.cz-s-type').textContent=type;
      $('.cz-s-unit').textContent=u?money(u):'A cotizar';$('.cz-s-qty').textContent=st.q+(st.q===1?' licencia':' licencias');
      if(u){tween(u*st.q);cz.classList.remove('quote');}else{cancelAnimationFrame(raf);shown=0;show('A cotizar');cz.classList.add('quote');}
      var h='';
      if(!u)h='La licencia de red de '+P.label+' se cotiza según el número de usuarios. Escríbenos y te enviamos el precio.';
      else if(st.q>=5)h='Para '+st.q+' licencias, pregunta por precio especial por volumen.';
      else if(st.t==='standalone'&&st.q>=3&&pl.net)h='Si tus '+st.q+' usuarios no trabajan al mismo tiempo, una licencia de red compartida puede salirte más barata.';
      $('.cz-hint').textContent=h;$('.cz-hint').hidden=!h;
      var msg='Hola ProTech, quiero una cotización formal:\n• Producto: '+name+'\n• Tipo: '+type+'\n• Cantidad: '+st.q+(u?'\n• Total de lista: '+money(u*st.q)+' MXN':'')+'\nMi nombre y empresa: ';
      $$('.cz-go').forEach(function(a){a.href=link(msg);});
      $('.cz-trial').href=link('Hola ProTech, quiero la prueba gratis de 30 días de '+name+'.');
    }
    $$('.cz-go').forEach(function(a){a.addEventListener('click',function(){track('generate_lead',{form:'cotizador'});});});
    render(true);
    if('IntersectionObserver' in window){var bar=$('.cz-bar'),inMain=false,sumVis=false;
      function upd(){var on=inMain&&!sumVis;bar.classList.toggle('show',on);document.documentElement.classList.toggle('cz-on',!!document.querySelector('.pt .cz-bar.show'));}
      new IntersectionObserver(function(es){inMain=es[0].isIntersecting;upd();}).observe($('.cz-main'));
      new IntersectionObserver(function(es){sumVis=es[0].isIntersecting;upd();},{threshold:.35}).observe($('.cz-sum'));}
  });
