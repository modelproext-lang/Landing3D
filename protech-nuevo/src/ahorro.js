  // ===== calculadora de ahorro ZWCAD vs suscripción =====
  document.querySelectorAll('.pt .sv').forEach(function(sv){
    var D=JSON.parse(sv.getAttribute('data-sv')),st={v:1,t:'sa',n:1,cur:25000,plan:'mant',up:3,mv:false,mp:false};
    function fmt(n){return '$'+Math.round(n).toLocaleString('es-MX');}
    var opts=D.map(function(p,i){return '<option value="'+i+'"'+(i===1?' selected':'')+'>'+p.name+'</option>';}).join('');
    sv.innerHTML=
      '<div class="sv-g"><form class="sv-in" onsubmit="return false">'+
        '<div class="sv-st"><div class="sv-h"><span>1</span><h3>Lo que pagas hoy</h3></div>'+
          '<label for="sv-c">¿Cuánto pagas al año por tu suscripción CAD actual? <small>Por licencia, sin IVA</small><span class="sv-money"><span>$</span><input id="sv-c" type="text" inputmode="numeric" value="25,000"><em>MXN / año</em></span></label>'+
          '<div class="sv-pre" role="group" aria-label="Montos de referencia"><span>Referencia:</span><button type="button" data-c="25000">CAD completo ≈ $25,000</button><button type="button" data-c="6800">CAD ligero ≈ $6,800</button></div>'+
        '</div>'+
        '<div class="sv-st"><div class="sv-h"><span>2</span><h3>Tu licencia ZWCAD</h3></div>'+
          '<label for="sv-v">Versión <small class="sv-rec"></small><select id="sv-v">'+opts+'</select></label>'+
          '<div class="sv-f"><span class="sv-l">Tipo de licencia</span><div class="sv-seg" role="radiogroup" aria-label="Tipo de licencia"><button type="button" data-t="sa" class="on" role="radio" aria-checked="true">Standalone</button><button type="button" data-t="net" role="radio" aria-checked="false">Red (flotante)</button></div></div>'+
          '<label for="sv-n">Número de licencias<span class="sv-qty"><button type="button" data-q="-1" aria-label="Quitar una licencia">−</button><input id="sv-n" type="number" min="1" max="200" value="1" inputmode="numeric"><button type="button" data-q="1" aria-label="Agregar una licencia">+</button></span></label>'+
        '</div>'+
        '<div class="sv-st"><div class="sv-h"><span>3</span><h3>Mantenimiento y actualizaciones <em>Opcional</em></h3></div>'+
          '<div class="sv-plans" role="radiogroup" aria-label="Plan de mantenimiento">'+
            '<div class="sv-pl on" data-p="mant" role="radio" aria-checked="true" tabindex="0"><b>Mantenimiento anual</b><small>Aprox. 20 % del valor de la licencia al año, a partir del año 2. Siempre en la última versión.</small><i>Recomendado</i></div>'+
            '<div class="sv-pl" data-p="up" role="radio" aria-checked="false" tabindex="0"><b>Actualización flexible</b><small>Aprox. 30 % del valor de la licencia, solo en el año que decidas actualizar.</small>'+
              '<span class="sv-yrs" role="group" aria-label="Año de actualización"><span>Actualizar en:</span><button type="button" data-y="2">Año 2</button><button type="button" data-y="3" class="on">Año 3</button><button type="button" data-y="4">Año 4</button><button type="button" data-y="5">Año 5</button></span></div>'+
            '<div class="sv-pl" data-p="none" role="radio" aria-checked="false" tabindex="0"><b>Sin mantenimiento</b><small>Usa tu versión el tiempo que quieras, sin pagos adicionales.</small></div>'+
          '</div>'+
        '</div>'+
      '</form>'+
      '<div class="sv-out" aria-live="polite">'+
        '<div class="sv-k">Tu ahorro estimado</div>'+
        '<div class="sv-adv" hidden><b class="sv-adv-t">Hablemos de un plan a tu medida</b><p class="sv-adv-p">Con el presupuesto que indicas, lo mejor es que un asesor te ayude a encontrar un plan flexible. Tenemos diversas opciones para que ZWCAD entre en tu presupuesto.</p><a class="btn btn-p sv-adv-go" href="#" target="_blank" rel="noopener">Hablar con un asesor</a></div>'+
        '<div class="sv-sp" hidden><span><b>¿Buscas una opción más accesible?</b> Tenemos planes especiales para ti.</span><a class="sv-sp-go" href="#" target="_blank" rel="noopener">Conocer planes especiales →</a></div>'+
        '<div class="sv-big"><div><small class="sv-k3">A 3 años</small><b class="sv-s3"></b><span class="sv-p3"></span></div><div class="sv-5"><small>A 5 años <i class="sv-best">Mayor ahorro</i></small><b class="sv-s5"></b><span class="sv-p5"></span></div></div>'+
        '<div class="sv-ch"><div class="sv-cht">Lo que pagas cada año</div><div class="sv-leg"><span><i class="a"></i>Suscripción actual</span><span><i class="b"></i>ZWCAD</span></div><svg class="sv-svg" role="img" aria-label="Pago de cada año"></svg><div class="sv-tip" hidden></div></div>'+
        '<table class="sv-tbl"><thead><tr><th></th><th>3 años</th><th>5 años</th></tr></thead><tbody><tr><td>Suscripción actual</td><td class="sv-c3"></td><td class="sv-c5"></td></tr><tr><td>ZWCAD</td><td class="sv-z3"></td><td class="sv-z5"></td></tr></tbody></table>'+
        '<a class="btn btn-p sv-go" href="#" target="_blank" rel="noopener">Quiero esta cotización</a>'+
      '</div></div>'+
      '<p class="sv-note"><b>Los mantenimientos son opcionales y las actualizaciones flexibles</b>, pero muy recomendables: con mantenimiento anual mantienes tu software actualizado año con año por una fracción de su valor, y aun así ahorras frente a una suscripción. Cálculo estimado con precios sin IVA; los porcentajes de mantenimiento y actualización son aproximados y el costo de tu suscripción lo capturas tú. Funciones y precios sujetos a la edición y versión.</p>';
    var $=function(s){return sv.querySelector(s);},$$=function(s){return sv.querySelectorAll(s);};
    var svg=$('.sv-svg'),tip=$('.sv-tip'),rows=[];
    function num(s){return Math.max(0,parseFloat(String(s).replace(/[^0-9.]/g,''))||0);}
    function calc(){
      var P=D[st.v],lic=(st.t==='net'?P.net:P.sa),n=st.n,a=[],b=[],ya=[],yb=[],ca=0,cb=0;
      for(var y=1;y<=5;y++){
        ca+=st.cur*n;
        var add=y===1?lic*n:0;
        if(st.plan==='mant'&&y>=2)add+=lic*.2*n;
        if(st.plan==='up'&&y===st.up)add+=lic*.3*n;
        cb+=add;a.push(ca);b.push(cb);ya.push(st.cur*n);yb.push(add);}
      return {a:a,b:b,ya:ya,yb:yb,lic:lic,P:P};
    }
    function draw(r){
      var W=svg.clientWidth||520,H=230,pl=58,pr=10,pt=14,pb=28,iw=W-pl-pr,ih=H-pt-pb;
      var max=Math.max.apply(null,r.ya.concat(r.yb))||1,step=Math.pow(10,Math.floor(Math.log10(max/4))),nice=[1,2,2.5,5,10].map(function(m){return m*step;}).find(function(s){return max/s<=5;})||step*10,top=Math.ceil(max/nice)*nice;
      var g='',k;
      for(k=0;k<=top+1e-6;k+=nice){var yy=pt+ih-ih*k/top;g+='<line x1="'+pl+'" x2="'+(W-pr)+'" y1="'+yy+'" y2="'+yy+'" class="gr"/><text x="'+(pl-8)+'" y="'+(yy+4)+'" class="ax" text-anchor="end">'+(k>=1e6?'$'+(k/1e6).toFixed(k%1e6?1:0)+'M':'$'+Math.round(k/1e3)+'k')+'</text>';}
      var gw=iw/5,bw=Math.min(28,(gw-14)/2);rows=[];
      for(var i=0;i<5;i++){var x0=pl+gw*i+gw/2,ha=ih*r.ya[i]/top,hb=ih*r.yb[i]/top;
        g+='<path class="ba" d="'+bar(x0-bw-1,pt+ih,bw,ha)+'"/><path class="bb" d="'+bar(x0+1,pt+ih,bw,hb)+'"/>';
        if(!r.yb[i])g+='<rect class="bz" x="'+(x0+1)+'" y="'+(pt+ih-2)+'" width="'+bw+'" height="2" rx="1"/><text x="'+(x0+1+bw/2)+'" y="'+(pt+ih-8)+'" class="z0" text-anchor="middle">$0</text>';
        g+='<text x="'+x0+'" y="'+(H-8)+'" class="ax" text-anchor="middle">Año '+(i+1)+'</text>';
        g+='<rect class="hit" x="'+(pl+gw*i)+'" y="'+pt+'" width="'+gw+'" height="'+ih+'" data-i="'+i+'"/>';}
      g+='<line x1="'+pl+'" x2="'+(W-pr)+'" y1="'+(pt+ih)+'" y2="'+(pt+ih)+'" class="base"/>';
      svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.setAttribute('height',H);svg.innerHTML=g;
      svg.querySelectorAll('.hit').forEach(function(h){
        function show(){var i=+h.getAttribute('data-i');svg.querySelectorAll('.hit').forEach(function(x){x.classList.toggle('on',x===h);});
          tip.innerHTML='<b>Pago en el año '+(i+1)+'</b><span><i class="a"></i>Suscripción '+fmt(r.ya[i])+'</span><span><i class="b"></i>ZWCAD '+(r.yb[i]?fmt(r.yb[i]):'$0 · sin pago')+'</span><span class="sv-tsv">Ahorro acumulado '+fmt(r.a[i]-r.b[i])+'</span>';
          tip.hidden=false;var bx=h.getBoundingClientRect(),cx=sv.querySelector('.sv-ch').getBoundingClientRect();var left=bx.left-cx.left+bx.width/2;tip.style.left=Math.max(70,Math.min(cx.width-70,left))+'px';}
        h.addEventListener('mouseenter',show);h.addEventListener('click',show);});
      svg.addEventListener('mouseleave',function(){tip.hidden=true;svg.querySelectorAll('.hit').forEach(function(x){x.classList.remove('on');});});
    }
    function bar(x,base,w,h){if(h<=0)return '';var r=Math.min(4,h,w/2);return 'M'+x+','+base+'V'+(base-h+r)+'Q'+x+','+(base-h)+' '+(x+r)+','+(base-h)+'H'+(x+w-r)+'Q'+(x+w)+','+(base-h)+' '+(x+w)+','+(base-h+r)+'V'+base+'Z';}
    var iPro=Math.max(0,D.findIndex(function(x){return /Professional/.test(x.name);})),iStd=Math.max(0,D.findIndex(function(x){return /Standard/.test(x.name);}));
    function tier(){return st.cur>=15000?'hi':(st.cur>=6000?'mid':'low');}
    function setPlan(p){st.plan=p;$$('.sv-pl').forEach(function(x){var on=x.getAttribute('data-p')===p;x.classList.toggle('on',on);x.setAttribute('aria-checked',on);});}
    function auto(){var hi=tier()==='hi';
      if(!st.mv){st.v=hi?iPro:iStd;$('#sv-v').value=st.v;}
      $('.sv-rec').textContent=st.mv?'':'Recomendada para tu caso';
      var bd=sv.querySelector('.sv-pl[data-p=mant] i');if(bd)bd.style.display=hi?'':'none';
      if(!st.mp)setPlan(hi?'mant':'none');}
    function pct(a,b){return a>0?Math.round((a-b)/a*100):0;}
    function render(){
      var r=calc(),s3=r.a[2]-r.b[2],s5=r.a[4]-r.b[4];
      var tr=tier(),bad=tr==='low'||s5<=0;
      $('.sv-adv-t').textContent=tr==='low'?'Hablemos de tus necesidades':'Hablemos de un plan a tu medida';
      $('.sv-adv-p').textContent=tr==='low'?'Cada empresa es distinta. Cuéntanos cuántos usuarios son y cómo trabajan, y te diremos con claridad si ZWCAD es una buena opción para ti.':'Con el presupuesto que indicas, lo mejor es que un asesor te ayude a encontrar un plan flexible. Tenemos diversas opciones para que ZWCAD entre en tu presupuesto.';
      $('.sv-adv-go').textContent=tr==='low'?'Platica con un asesor':'Hablar con un asesor';
      $('.sv-sp').hidden=bad||tr!=='mid';
      $('.sv-sp-go').href=link('Hola ProTech, hoy pago '+fmt(st.cur)+' al año por licencia de CAD (sin IVA) y me interesan los planes especiales de ZWCAD ('+st.n+' licencia(s)).');$('.sv-adv').hidden=!bad;$('.sv-big').hidden=bad;$('.sv-ch').hidden=bad;$('.sv-tbl').hidden=bad;$('.sv-go').hidden=bad;
      $('.sv-adv-go').href=link('Hola ProTech, hoy pago '+fmt(st.cur)+' al año por licencia de CAD (sin IVA) y me interesa ZWCAD ('+st.n+' licencia(s)). '+(tr==='low'?'Me gustaría platicar mi caso con un asesor.':'¿Qué plan flexible me recomiendan?'));
      if(bad)return;
      var pay=5;for(var yy=0;yy<5;yy++){if(r.a[yy]>=r.b[yy]){pay=yy+1;break;}}
      $('.sv-s5').textContent=fmt(s5);
      if(pay===1&&s3>0){$('.sv-k3').textContent='A 3 años';$('.sv-s3').textContent=fmt(s3);$('.sv-p3').textContent=pct(r.a[2],r.b[2])+' % menos · desde el primer año';}else{$('.sv-k3').textContent='Recuperas tu inversión';$('.sv-s3').textContent='Año '+pay;$('.sv-p3').textContent='Desde ahí, todo es ahorro';}
      $('.sv-p5').textContent=pct(r.a[4],r.b[4])+' % menos';
      $('.sv-big').classList.toggle('hl5',tr==='hi');
      
      $('.sv-c3').textContent=fmt(r.a[2]);$('.sv-c5').textContent=fmt(r.a[4]);$('.sv-z3').textContent=fmt(r.b[2]);$('.sv-z5').textContent=fmt(r.b[4]);
      draw(r);
      var plan={mant:'mantenimiento anual',up:'actualización flexible en el año '+st.up,none:'sin mantenimiento'}[st.plan];
      $('.sv-go').href=link('Hola ProTech, calculé mi ahorro con ZWCAD:\n• '+r.P.name+' · '+(st.t==='net'?'Red (flotante)':'Standalone')+' · '+st.n+' licencia(s)\n• Plan: '+plan+'\n• Hoy pago '+fmt(st.cur)+' por licencia al año (sin IVA)\n• Ahorro estimado a 5 años: '+fmt(s5)+'\nQuiero una cotización formal.');
    }
    $('#sv-v').addEventListener('change',function(e){st.v=+e.target.value;st.mv=true;auto();render();});
    $$('.sv-seg button').forEach(function(b){b.addEventListener('click',function(){st.t=b.getAttribute('data-t');$$('.sv-seg button').forEach(function(x){var on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-checked',on);});render();});});
    $('#sv-n').addEventListener('input',function(e){st.n=Math.max(1,Math.min(200,parseInt(e.target.value)||1));render();});
    $('#sv-c').addEventListener('input',function(e){st.cur=num(e.target.value);auto();render();});
    $$('.sv-pre button').forEach(function(b){b.addEventListener('click',function(){st.cur=+b.getAttribute('data-c');$('#sv-c').value=st.cur.toLocaleString('es-MX');auto();render();});});
    $('#sv-c').addEventListener('blur',function(e){e.target.value=st.cur.toLocaleString('es-MX');});
    function pick(el){st.mp=true;st.plan=el.getAttribute('data-p');$$('.sv-pl').forEach(function(x){var on=x===el;x.classList.toggle('on',on);x.setAttribute('aria-checked',on);});render();}
    $$('.sv-pl').forEach(function(el){el.addEventListener('click',function(){pick(el);});el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(el);}});});
    $$('.sv-yrs button').forEach(function(b){b.addEventListener('click',function(e){e.stopPropagation();st.up=+b.getAttribute('data-y');$$('.sv-yrs button').forEach(function(x){x.classList.toggle('on',x===b);});pick(b.closest('.sv-pl'));});});
    $$('.sv-qty button').forEach(function(b){b.addEventListener('click',function(){st.n=Math.max(1,Math.min(200,st.n+ +b.getAttribute('data-q')));$('#sv-n').value=st.n;render();});});
    $('.sv-go').addEventListener('click',function(){track('generate_lead',{form:'ahorro'});});
    sv.querySelectorAll('.sv-adv-go,.sv-sp-go').forEach(function(a){a.addEventListener('click',function(){track('generate_lead',{form:'ahorro-plan-especial'});});});
    auto();render();
    if('ResizeObserver' in window)new ResizeObserver(function(){render();}).observe(svg);
  });
