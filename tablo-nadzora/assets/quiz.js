(function(){
  "use strict";
  // can: true — можно установить ключевым показателем; false — запрещено ч. 7 ст. 30 248-ФЗ
  var Q = [
    {t:"Количество проведённых профилактических визитов", can:false,
     ex:"Прямо запрещено: «количество проведённых профилактических мероприятий». Использовать можно только как индикативный показатель для мониторинга."},
    {t:"Число погибших в авариях на 1 000 ОПО", can:true,
     ex:"Можно: это результат — вред охраняемым ценностям, нормированный на число объектов. Мы предлагаем именно такую нормировку."},
    {t:"Количество выявленных нарушений обязательных требований", can:false,
     ex:"Запрещено: «количество выявленных нарушений». Такой показатель поощряет искать нарушения, а не предотвращать аварии."},
    {t:"Доля критических нарушений, устранённых в первоначальный срок", can:true,
     ex:"Можно: это доля устранённых, а не число выявленных. Это наш КПР 3 «Устранить»."},
    {t:"Сумма наложенных административных штрафов", can:false,
     ex:"Запрещено: «количество и размер штрафов». Иначе надзор превращается в план по штрафам."},
    {t:"Доля инцидентов, по которым надзор принял меры в течение 30 дней", can:true,
     ex:"Можно: считается доля отработанных сигналов, а не число мероприятий. Это наш КПР 1 «Опередить»."},
    {t:"Количество внеплановых проверок по индикаторам риска", can:false,
     ex:"Запрещено: «количество проведённых контрольных (надзорных) мероприятий». А вот доля таких проверок, выявивших нарушения, — допустимый индикативный показатель."},
    {t:"Число лиц, привлечённых к ответственности", can:false,
     ex:"Запрещено: «количество контролируемых лиц, привлечённых к ответственности»."}
  ];
  var box = document.getElementById("quiz"), sc = document.getElementById("qscore");
  var ans, right;

  function render(){
    ans = 0; right = 0; box.innerHTML = "";
    Q.forEach(function(q){
      var d = document.createElement("div");
      d.className = "q";
      d.innerHTML = "<div class='t'>"+q.t+"</div><div class='bs'><button type='button' data-a='1'>Можно сделать ключевым</button><button type='button' data-a='0'>Запрещено ч. 7 ст. 30</button></div><div class='ex' aria-live='polite'></div>";
      box.appendChild(d);
      d.querySelectorAll("button").forEach(function(b){
        b.addEventListener("click", function(){
          var a = b.getAttribute("data-a")==="1", ok = (a===q.can);
          ans++; if (ok) right++;
          d.querySelectorAll("button").forEach(function(x){
            x.disabled = true;
            var xa = x.getAttribute("data-a")==="1";
            if (xa===q.can) x.classList.add("right"); else if (x===b) x.classList.add("wrong");
          });
          d.querySelector(".ex").innerHTML = (ok ? "<b style='color:var(--good)'>✓ Верно.</b> " : "<b style='color:var(--bad)'>✕ Неверно.</b> ") + q.ex;
          d.classList.add("done");
          update();
        });
      });
    });
    update();
  }
  function update(){
    if (!ans){ sc.innerHTML = "Ответьте на все " + Q.length + " карточек — счёт появится здесь."; return; }
    var end = ans===Q.length;
    sc.innerHTML = "Верно: <b>" + right + " из " + ans + "</b>" + (end ? (right===Q.length ? ". Все ответы верные." : ".") + " <button type='button' class='btn ghost' id='qreset' style='margin-left:8px;padding:6px 12px'>Пройти заново</button>" : "");
    var r = document.getElementById("qreset");
    if (r) r.addEventListener("click", render);
  }
  render();
})();
