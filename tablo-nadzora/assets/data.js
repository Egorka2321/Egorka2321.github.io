"use strict";
// Общие данные сайта: 9 месяцев каждого года по программам профилактики Ростехнадзора
  // 9-month data from Rostekhnadzor prevention programmes
var YEARS = [2022, 2023, 2024, 2025];
var D = {
    acc:  { name:"Аварии на ОПО", unit:"аварий",
            first:{2022:69,2023:67,2024:60,2025:57}, rev:{2022:69,2023:65,2024:60,2025:57} },
    dead: { name:"Погибшие в авариях", unit:"погибших",
            first:{2022:32,2023:31,2024:31,2025:44}, rev:{2022:32,2023:33,2024:33,2025:44} }
  };
var SRC_FIRST = {2022:"программа на 2024 г.",2023:"программа на 2024 г.",2024:"программа на 2025 г.",2025:"программа на 2026 г."};
  function srcRev(ind, y){
    if (y===2023) return "программа на 2025 г.";
    if (y===2024 && ind==="dead") return "программа на 2026 г.";
    return SRC_FIRST[y];
  }
var fmt = function(x, d){ return x.toLocaleString("ru-RU",{minimumFractionDigits:d||0, maximumFractionDigits:d||0}); };
var signed = function(x){ var r = Math.round(x*10)/10; if (r===0) return "0%"; return (r>0?"+":"−") + fmt(Math.abs(r),1) + "%"; };

