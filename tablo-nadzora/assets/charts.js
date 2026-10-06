(function(){
  "use strict";
  // ---------- data table ----------
  var tb = document.getElementById("data-tbody");
  YEARS.forEach(function(y){
    var tr = document.createElement("tr");
    var where = SRC_FIRST[y] + (srcRev("dead",y)!==SRC_FIRST[y] ? "; уточнение — " + srcRev("dead",y) : "");
    tr.innerHTML = "<td>9 мес. "+y+" г.</td><td class='n'>"+D.acc.first[y]+"</td><td class='n'>"+D.acc.rev[y]+"</td><td class='n'>"+D.dead.first[y]+"</td><td class='n'>"+D.dead.rev[y]+"</td><td>"+where+"</td>";
    tb.appendChild(tr);
  });

  // ---------- line charts (SVG) ----------
  function lineChart(el, ind){
    var W=520, H=260, m={t:24,r:44,b:30,l:36};
    var iw=W-m.l-m.r, ih=H-m.t-m.b;
    var vals = YEARS.map(function(y){return D[ind].rev[y];}).concat(YEARS.map(function(y){return D[ind].first[y];}));
    var maxV = Math.max.apply(null, vals);
    var minV = Math.min.apply(null, vals);
    var step = 5;
    var top = Math.ceil(maxV*1.08/step)*step;
    var bot = Math.floor(minV*0.85/step)*step;
    var x = function(i){ return m.l + iw*(i/(YEARS.length-1)); };
    var y = function(v){ return m.t + ih*(1 - (v-bot)/(top-bot)); };
    var ns="http://www.w3.org/2000/svg";
    var s = '<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+D[ind].name+', 9 месяцев 2022–2025 гг.">';
    s += '<g class="grid">';
    for (var t=bot; t<=top; t+=step){ s += '<line x1="'+m.l+'" x2="'+(W-m.r)+'" y1="'+y(t)+'" y2="'+y(t)+'"/>'; }
    s += '</g><g class="axis">';
    for (t=bot; t<=top; t+=step){ s += '<text x="'+(m.l-8)+'" y="'+(y(t)+4)+'" text-anchor="end">'+t+'</text>'; }
    YEARS.forEach(function(yr,i){ s += '<text x="'+x(i)+'" y="'+(H-8)+'" text-anchor="middle">'+yr+'</text>'; });
    s += '</g>';
    function path(key){ return YEARS.map(function(yr,i){ return (i?"L":"M")+x(i)+","+y(D[ind][key][yr]); }).join(""); }
    s += '<path d="'+path("first")+'" fill="none" stroke="var(--s2)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>';
    s += '<path d="'+path("rev")+'" fill="none" stroke="var(--s1)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>';
    YEARS.forEach(function(yr,i){
      var a=D[ind].first[yr], b=D[ind].rev[yr];
      if (a!==b) s += '<circle cx="'+x(i)+'" cy="'+y(a)+'" r="5" fill="var(--s2)" stroke="#fff" stroke-width="2"/>';
      s += '<circle cx="'+x(i)+'" cy="'+y(b)+'" r="5" fill="var(--s1)" stroke="#fff" stroke-width="2"/>';
    });
    // direct labels: endpoint + revisions
    var last = YEARS.length-1, ly = YEARS[last];
    s += '<text x="'+(x(last)+10)+'" y="'+(y(D[ind].rev[ly])+4)+'" font-size="13" font-weight="600" fill="var(--ink)">'+D[ind].rev[ly]+'</text>';
    YEARS.forEach(function(yr,i){
      var a=D[ind].first[yr], b=D[ind].rev[yr];
      if (a!==b){
        var up = b > a;
        s += '<text x="'+x(i)+'" y="'+(y(b)+(up?-11:18))+'" text-anchor="middle" font-size="12" font-weight="600" fill="var(--ink)">'+b+'</text>';
        s += '<text x="'+x(i)+'" y="'+(y(a)+(up?18:-11))+'" text-anchor="middle" font-size="12" fill="var(--ink-2)">'+a+'</text>';
      }
    });
    // crosshair + hit areas
    s += '<line class="xh" x1="0" x2="0" y1="'+m.t+'" y2="'+(m.t+ih)+'" stroke="var(--hair-2)" stroke-width="1" opacity="0"/>';
    YEARS.forEach(function(yr,i){
      var bw = iw/(YEARS.length-1);
      s += '<rect data-i="'+i+'" x="'+(x(i)-bw/2)+'" y="'+m.t+'" width="'+bw+'" height="'+ih+'" fill="transparent" tabindex="0" aria-label="'+yr+'"/>';
    });
    s += '</svg><div class="tip" role="tooltip"></div>';
    el.innerHTML = s;
    var svg = el.querySelector("svg"), tip = el.querySelector(".tip"), xh = el.querySelector(".xh");
    function show(i){
      var yr = YEARS[i], a=D[ind].first[yr], b=D[ind].rev[yr];
      xh.setAttribute("x1", x(i)); xh.setAttribute("x2", x(i)); xh.setAttribute("opacity", 1);
      tip.innerHTML = "<b>9 мес. "+yr+" г.</b>"+
        "<div class='row'><span><span class='k' style='background:var(--s1)'></span>Последняя оценка</span><b>"+b+"</b></div>"+
        "<div class='row'><span><span class='k' style='background:var(--s2)'></span>Первая публикация</span><b>"+a+"</b></div>"+
        "<div class='src'>"+(a!==b ? "Пересмотр: "+SRC_FIRST[yr]+" → "+srcRev(ind,yr) : "Источник: "+SRC_FIRST[yr])+"</div>";
      var r = svg.getBoundingClientRect(), k = r.width / W;
      var px = x(i)*k, py = y(Math.max(a,b))*k;
      px = Math.max(100, Math.min(r.width-100, px));
      tip.style.left = px+"px"; tip.style.top = py+"px"; tip.style.opacity = 1;
    }
    function hide(){ tip.style.opacity = 0; xh.setAttribute("opacity",0); }
    el.querySelectorAll("rect[data-i]").forEach(function(rc){
      var i = +rc.getAttribute("data-i");
      rc.addEventListener("mouseenter", function(){show(i);});
      rc.addEventListener("focus", function(){show(i);});
      rc.addEventListener("touchstart", function(){show(i);}, {passive:true});
      rc.addEventListener("mouseleave", hide);
      rc.addEventListener("blur", hide);
    });
  }
  lineChart(document.getElementById("ch-acc"), "acc");
  lineChart(document.getElementById("ch-dead"), "dead");

})();
