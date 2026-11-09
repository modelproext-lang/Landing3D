  // ===== calculadora de ahorro ZWCAD vs suscripción =====
  document.querySelectorAll('.pt .sv').forEach(function(sv){
    var D=JSON.parse(sv.getAttribute('data-sv')),st={v:1,t:'sa',n:1,cur:30000,plan:'mant',up:3};
    function fmt(n){return '$'+Math.round(n).toLocaleString('es-MX');}
    var opts=D.map(function(p,i){return '<option value="'+i+'"'+(i===1?' selected':'')+'>'+p.name+'</option>';}).join('');
    sv.innerHTML=
      '<div class="sv-g"><form class="sv-in" onsubmit="return false">'+
        '<label for="sv-v">Versión de ZWCAD<select id="sv-v">'+opts+'</select></label>'+
        '<div class="sv-f"><span class="sv-l">Tipo de licencia</span><div class="sv-seg" role="radiogroup" aria-label="Tipo de licencia"><button type="button" data-t="sa" class="on" role="radio" aria-checked="true">Standalone</button><button type="button" data-t="net" role="radio" aria-checked="false">Red (flotante)</button></div></div>'+
        '<label for="sv-n">Número de licencias<input id="sv-n" type="number" min="1" max="200" value="1" inputmode="numeric"></label>'+
        '<label for="sv-c">¿Cuánto pagas hoy al año por licencia? <small>Tu suscripción CAD actual, en MXN</small><span class="sv-money"><span>$</span><input id="sv-c" type="text" inputmode="numeric" value="30,000"></span></label>'+
        '<div class="sv-f"><span class="sv-l">Mantenimiento y actualizaciones <em>Opcional</em></span><div class="sv-plans" role="radiogroup" aria-label="Plan de mantenimiento">'+
          '<button type="button" data-p="mant" class="on" role="radio" aria-checked="true"><b>Mantenimiento anual</b><small>20 % del valor de la licencia al año, a partir del año 2. Siempre en la última versión.</small><i>Recomendado</i></button>'+
          '<button type="button" data-p="up" role="radio" aria-checked="false"><b>Actualización flexible</b><small>30 % del valor de la licencia, solo en el año que decidas actualizar.</small></button>'+
          '<button type="button" data-p="none" role="radio" aria-checked="false"><b>Sin mantenimiento</b><small>Usa tu versión el tiempo que quieras, sin pagos adicionales.</small></button>'+
        '</div><label for="sv-y" class="sv-yr" hidden>Actualizar en el año<select id="sv-y"><option>2</option><option selected>3</option><option>4</option><option>5</option></select></label></div>'+
      '</form>'+
      '<div class="sv-out" aria-live="polite">'+
        '<div class="sv-k">Tu ahorro estimado</div>'+
        '<div class="sv-big"><div><small>A 3 años</small><b class="sv-s3"></b><span class="sv-p3"></span></div><div><small>A 5 años</small><b class="sv-s5"></b><span class="sv-p5"></span></div></div>'+
        '<div class="sv-ch"><div class="sv-leg"><span><i class="a"></i>Suscripción actual</span><span><i class="b"></i>ZWCAD</span></div><svg class="sv-svg" role="img" aria-label="Costo acumulado por año"></svg><div class="sv-tip" hidden></div></div>'+
        '<table class="sv-tbl"><thead><tr><th></th><th>3 años</th><th>5 años</th></tr></thead><tbody><tr><td>Suscripción actual</td><td class="sv-c3"></td><td class="sv-c5"></td></tr><tr><td>ZWCAD</td><td class="sv-z3"></td><td class="sv-z5"></td></tr></tbody></table>'+
        '<a class="btn btn-p sv-go" href="#" target="_blank" rel="noopener">Quiero esta cotización</a>'+
      '</div></div>'+
      '<p class="sv-note"><b>Los mantenimientos son opcionales y las actualizaciones flexibles</b>, pero muy recomendables: con mantenimiento anual mantienes tu software actualizado año con año por una fracción de su valor, y aun así ahorras frente a una suscripción. Cálculo estimado con precios de lista + IVA; el costo de tu suscripción lo capturas tú. Funciones y precios sujetos a la edición y versión.</p>';
    var $=function(s){return sv.querySelector(s);},$$=function(s){return sv.querySelectorAll(s);};
    var svg=$('.sv-svg'),tip=$('.sv-tip'),rows=[];
    function num(s){return Math.max(0,parseFloat(String(s).replace(/[^0-9.]/g,''))||0);}
    function calc(){
      var P=D[st.v],lic=(st.t==='net'?P.net:P.sa),n=st.n,a=[],b=[],ca=0,cb=0;
      for(var y=1;y<=5;y++){
        ca+=st.cur*n;
        var add=y===1?lic*n:0;
        if(st.plan==='mant'&&y>=2)add+=lic*.2*n;
        if(st.plan==='up'&&y===st.up)add+=lic*.3*n;
        cb+=add;a.push(ca);b.push(cb);}
      return {a:a,b:b,lic:lic,P:P};
    }
    function draw(r){
      var W=svg.clientWidth||520,H=230,pl=58,pr=10,pt=14,pb=28,iw=W-pl-pr,ih=H-pt-pb;
      var max=Math.max.apply(null,r.a.concat(r.b))||1,step=Math.pow(10,Math.floor(Math.log10(max/4))),nice=[1,2,2.5,5,10].map(function(m){return m*step;}).find(function(s){return max/s<=5;})||step*10,top=Math.ceil(max/nice)*nice;
      var g='',k;
      for(k=0;k<=top+1e-6;k+=nice){var yy=pt+ih-ih*k/top;g+='<line x1="'+pl+'" x2="'+(W-pr)+'" y1="'+yy+'" y2="'+yy+'" class="gr"/><text x="'+(pl-8)+'" y="'+(yy+4)+'" class="ax" text-anchor="end">'+(k>=1e6?'$'+(k/1e6).toFixed(k%1e6?1:0)+'M':'$'+Math.round(k/1e3)+'k')+'</text>';}
      var gw=iw/5,bw=Math.min(28,(gw-14)/2);rows=[];
      for(var i=0;i<5;i++){var x0=pl+gw*i+gw/2,ha=ih*r.a[i]/top,hb=ih*r.b[i]/top;
        g+='<path class="ba" d="'+bar(x0-bw-1,pt+ih,bw,ha)+'"/><path class="bb" d="'+bar(x0+1,pt+ih,bw,hb)+'"/>';
        g+='<text x="'+x0+'" y="'+(H-8)+'" class="ax" text-anchor="middle">Año '+(i+1)+'</text>';
        g+='<rect class="hit" x="'+(pl+gw*i)+'" y="'+pt+'" width="'+gw+'" height="'+ih+'" data-i="'+i+'"/>';}
      g+='<line x1="'+pl+'" x2="'+(W-pr)+'" y1="'+(pt+ih)+'" y2="'+(pt+ih)+'" class="base"/>';
      svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.setAttribute('height',H);svg.innerHTML=g;
      svg.querySelectorAll('.hit').forEach(function(h){
        function show(){var i=+h.getAttribute('data-i');svg.querySelectorAll('.hit').forEach(function(x){x.classList.toggle('on',x===h);});
          tip.innerHTML='<b>Año '+(i+1)+' · acumulado</b><span><i class="a"></i>Suscripción '+fmt(r.a[i])+'</span><span><i class="b"></i>ZWCAD '+fmt(r.b[i])+'</span><span class="sv-tsv">Ahorro '+fmt(r.a[i]-r.b[i])+'</span>';
          tip.hidden=false;var bx=h.getBoundingClientRect(),cx=sv.querySelector('.sv-ch').getBoundingClientRect();var left=bx.left-cx.left+bx.width/2;tip.style.left=Math.max(70,Math.min(cx.width-70,left))+'px';}
        h.addEventListener('mouseenter',show);h.addEventListener('click',show);});
      svg.addEventListener('mouseleave',function(){tip.hidden=true;svg.querySelectorAll('.hit').forEach(function(x){x.classList.remove('on');});});
    }
    function bar(x,base,w,h){if(h<=0)return '';var r=Math.min(4,h,w/2);return 'M'+x+','+base+'V'+(base-h+r)+'Q'+x+','+(base-h)+' '+(x+r)+','+(base-h)+'H'+(x+w-r)+'Q'+(x+w)+','+(base-h)+' '+(x+w)+','+(base-h+r)+'V'+base+'Z';}
    function pct(a,b){return a>0?Math.round((a-b)/a*100):0;}
    function render(){
      var r=calc(),s3=r.a[2]-r.b[2],s5=r.a[4]-r.b[4];
      $('.sv-s3').textContent=fmt(s3);$('.sv-s5').textContent=fmt(s5);
      $('.sv-p3').textContent=s3>0?pct(r.a[2],r.b[2])+' % menos':'Sin ahorro en este plazo';
      $('.sv-p5').textContent=s5>0?pct(r.a[4],r.b[4])+' % menos':'Sin ahorro en este plazo';
      sv.classList.toggle('neg3',s3<=0);sv.classList.toggle('neg5',s5<=0);
      $('.sv-c3').textContent=fmt(r.a[2]);$('.sv-c5').textContent=fmt(r.a[4]);$('.sv-z3').textContent=fmt(r.b[2]);$('.sv-z5').textContent=fmt(r.b[4]);
      draw(r);
      var plan={mant:'mantenimiento anual',up:'actualización flexible en el año '+st.up,none:'sin mantenimiento'}[st.plan];
      $('.sv-go').href=link('Hola ProTech, calculé mi ahorro con ZWCAD:\n• '+r.P.name+' · '+(st.t==='net'?'Red (flotante)':'Standalone')+' · '+st.n+' licencia(s)\n• Plan: '+plan+'\n• Hoy pago '+fmt(st.cur)+' por licencia al año\n• Ahorro estimado a 5 años: '+fmt(s5)+'\nQuiero una cotización formal.');
    }
    $('#sv-v').addEventListener('change',function(e){st.v=+e.target.value;render();});
    $$('.sv-seg button').forEach(function(b){b.addEventListener('click',function(){st.t=b.getAttribute('data-t');$$('.sv-seg button').forEach(function(x){var on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-checked',on);});render();});});
    $('#sv-n').addEventListener('input',function(e){st.n=Math.max(1,Math.min(200,parseInt(e.target.value)||1));render();});
    $('#sv-c').addEventListener('input',function(e){st.cur=num(e.target.value);render();});
    $('#sv-c').addEventListener('blur',function(e){e.target.value=st.cur.toLocaleString('es-MX');});
    $$('.sv-plans button').forEach(function(b){b.addEventListener('click',function(){st.plan=b.getAttribute('data-p');$$('.sv-plans button').forEach(function(x){var on=x===b;x.classList.toggle('on',on);x.setAttribute('aria-checked',on);});$('.sv-yr').hidden=st.plan!=='up';render();});});
    $('#sv-y').addEventListener('change',function(e){st.up=+e.target.value;render();});
    $('.sv-go').addEventListener('click',function(){track('generate_lead',{form:'ahorro'});});
    render();
    if('ResizeObserver' in window)new ResizeObserver(function(){render();}).observe(svg);
  });
