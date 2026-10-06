(function(){
  "use strict";
  // ---------- simulator ----------
  var st = {ind:"dead", year:2024, base:"prev", ver:"mix"};
  var VER = {rev:"Уточнённые", first:"Первичные", mix:"Как в программе"};
  var BASE = {prev:"Прошлый год", avg:"Среднее за прошлые годы"};

  function compute(ind, year, base, ver){
    var factKey = (ver==="rev") ? "rev" : "first";
    var baseKey = (ver==="first") ? "first" : "rev";
    var fact = D[ind][factKey][year];
    var yrs = base==="prev" ? [year-1] : YEARS.filter(function(y){return y<year;});
    var bvals = yrs.map(function(y){return D[ind][baseKey][y];});
    var b = bvals.reduce(function(s,v){return s+v;},0)/bvals.length;
    var v = (b - fact)/b*100;
    var r = Math.round(v*10)/10;
    return {fact:fact, factKey:factKey, baseKey:baseKey, yrs:yrs, bvals:bvals, base:b, v:v, status: r>0 ? "ok" : (r<0 ? "fail" : "zero")};
  }
  var ICON = {ok:"✓", fail:"✕", zero:"="};
  var VERD = {ok:"Показатель выполнен", fail:"Показатель провален", zero:"Нулевое значение — не выполнен"};

  function render(){
    document.querySelectorAll(".seg").forEach(function(g){
      var k = g.getAttribute("data-k");
      g.querySelectorAll("button").forEach(function(b){ b.setAttribute("aria-pressed", String(String(st[k])===b.getAttribute("data-v"))); });
    });
    var R = compute(st.ind, st.year, st.base, st.ver);
    document.getElementById("r-title").textContent = D[st.ind].name + " · 9 мес. " + st.year + " г.";
    document.getElementById("r-val").textContent = signed(R.v);
    var vd = document.getElementById("r-verdict");
    vd.className = "verdict " + R.status; vd.textContent = ICON[R.status] + " " + VERD[R.status];
    var baseTxt = R.yrs.length===1
      ? R.bvals[0] + " (" + R.yrs[0] + " г., " + (R.baseKey==="rev" ? srcRev(st.ind,R.yrs[0]) : SRC_FIRST[R.yrs[0]]) + ")"
      : "(" + R.bvals.join(" + ") + ") / " + R.bvals.length + " = " + fmt(R.base,1) + " (" + R.yrs[0] + "–" + R.yrs[R.yrs.length-1] + " гг., " + (R.baseKey==="rev"?"уточнённые":"первичные") + ")";
    var factSrc = R.factKey==="rev" ? srcRev(st.ind, st.year) : SRC_FIRST[st.year];
    var note = (st.base==="avg" && st.year===2023) ? "<small>Для 2023 г. в ряду только один предыдущий год, поэтому обе базы совпадают.</small>" : "";
    document.getElementById("r-calc").innerHTML =
      "<div class='f'>(" + fmt(R.base, R.yrs.length>1?1:0) + " − " + R.fact + ") / " + fmt(R.base, R.yrs.length>1?1:0) + " × 100% = " + signed(R.v) + "</div>" +
      "<div>Факт: <b>" + R.fact + "</b> — " + factSrc + "</div>" +
      "<div>База: <b>" + baseTxt + "</b></div>" + note;
    // matrix
    var g = document.getElementById("r-grid"), html = "<div class='hd corner'></div>", okN = 0, total = 0;
    ["rev","first","mix"].forEach(function(v){ html += "<div class='hd'>" + VER[v] + "</div>"; });
    ["prev","avg"].forEach(function(b){
      html += "<div class='hd rowh'>" + BASE[b] + "</div>";
      ["rev","first","mix"].forEach(function(v){
        var c = compute(st.ind, st.year, b, v); total++; if (c.status==="ok") okN++;
        var sel = (b===st.base && v===st.ver) ? " sel" : "";
        html += "<button type='button' class='cell " + c.status + sel + "' data-b='" + b + "' data-v='" + v + "' aria-label='" + BASE[b] + ", " + VER[v] + ": " + signed(c.v) + ", " + VERD[c.status] + "'><span class='ic'>" + ICON[c.status] + "</span>" + signed(c.v) + "</button>";
      });
    });
    g.innerHTML = html;
    g.querySelectorAll(".cell").forEach(function(c){
      c.addEventListener("click", function(){ st.base = c.getAttribute("data-b"); st.ver = c.getAttribute("data-v"); render(); });
    });
    var word = okN===0 ? "ни в одном из " + total + " вариантов" : (okN===total ? "во всех " + total + " вариантах" : "в " + okN + " из " + total + " вариантов");
    document.getElementById("r-sum").innerHTML = "Выполнен <b>" + word + "</b> методики:";
  }
  document.querySelectorAll(".seg").forEach(function(g){
    var k = g.getAttribute("data-k");
    g.querySelectorAll("button").forEach(function(b){
      b.addEventListener("click", function(){ var v = b.getAttribute("data-v"); st[k] = (k==="year") ? +v : v; render(); });
    });
  });
  render();
})();
