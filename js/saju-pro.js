/* AI공장 — 정식 사주(사주팔자) : 년·월·일·시 4기둥 + 오행 분포
   일주는 JDN 기준(2019-01-27 갑자로 검증). 년주는 입춘, 월주는 절기 근사 적용. */
(function () {
  "use strict";

  var STEM = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
  var JIJI = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
  var STEM_OH = ["목", "목", "화", "화", "토", "토", "금", "금", "수", "수"];
  var BR_OH = ["수", "토", "목", "목", "토", "화", "화", "토", "금", "금", "토", "수"];
  var BR_ANIMAL = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"];

  var OH_TRAIT = {
    "목": "성장·기획·인정이 강한 리더형. 새로운 일을 벌이고 키우는 데 능합니다.",
    "화": "열정·표현·추진력이 뛰어난 스타형. 사람을 끌고 분위기를 이끕니다.",
    "토": "신용·포용·안정의 중재자형. 믿음직하고 사람을 모읍니다.",
    "금": "결단·의리·재물 감각이 강한 실행형. 맺고 끊음이 분명합니다.",
    "수": "지혜·유연·소통의 전략가형. 정보와 흐름을 읽는 데 강합니다."
  };
  var OH_COLOR = { "목": "#17b26a", "화": "#e5484d", "토": "#f79009", "금": "#8a8fa3", "수": "#2b4eff" };

  function jdn(y, m, d) { var a = Math.floor((14 - m) / 12); var yy = y + 4800 - a; var mm = m + 12 * a - 3; return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045; }

  // 절기 근사: 양력 (월,일) → 월지(지지 index)
  function monthBranch(m, d) {
    var b = { 1: [6, 1, 0], 2: [4, 2, 1], 3: [6, 3, 2], 4: [5, 4, 3], 5: [6, 5, 4], 6: [6, 6, 5], 7: [7, 7, 6], 8: [8, 8, 7], 9: [8, 9, 8], 10: [8, 10, 9], 11: [7, 11, 10], 12: [7, 0, 11] }[m];
    return d >= b[0] ? b[1] : b[2];
  }

  function pillars(y, m, d, hour) {
    // 년주 (입춘 근사: 2/4 이전은 전년)
    var yUse = y;
    if (m === 1 || (m === 2 && d < 4)) yUse = y - 1;
    var yS = ((yUse - 4) % 10 + 10) % 10;
    var yB = ((yUse - 4) % 12 + 12) % 12;

    // 월주
    var mB = monthBranch(m, d);
    var startStem = ((yS % 5) * 2 + 2) % 10;            // 五虎遁: 인월 천간
    var seq = ((mB - 2) % 12 + 12) % 12;                // 인월=0 기준 순번
    var mS = (startStem + seq) % 10;

    // 일주 (검증된 JDN)
    var j = jdn(y, m, d);
    var dS = ((j + 9) % 10 + 10) % 10;
    var dB = ((j + 1) % 12 + 12) % 12;

    // 시주
    var hB = null, hS = null;
    if (hour !== null && hour !== "") {
      var h = parseInt(hour, 10);
      hB = Math.floor((h + 1) / 2) % 12;
      var ziStem = (dS % 5) * 2 % 10;                   // 五鼠遁: 자시 천간
      hS = (ziStem + hB) % 10;
    }
    return { y: [yS, yB], m: [mS, mB], d: [dS, dB], h: hB === null ? null : [hS, hB] };
  }

  var form = document.getElementById("spForm");
  if (!form) return;
  var box = document.getElementById("spResult");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var y = parseInt(document.getElementById("spYear").value, 10);
    var m = parseInt(document.getElementById("spMonth").value, 10);
    var d = parseInt(document.getElementById("spDay").value, 10);
    var hour = document.getElementById("spHour").value;
    if (!y || y < 1900 || y > 2025) { alert("연도를 1900~2025로 입력해 주세요."); return; }
    if (!m || m < 1 || m > 12 || !d || d < 1 || d > 31) { alert("월(1~12)과 일(1~31)을 정확히 입력해 주세요."); return; }

    var P = pillars(y, m, d, hour);
    var cols = [["시", P.h], ["일", P.d], ["월", P.m], ["년", P.y]];

    // 오행 분포
    var cnt = { "목": 0, "화": 0, "토": 0, "금": 0, "수": 0 };
    [P.y, P.m, P.d, P.h].forEach(function (p) { if (p) { cnt[STEM_OH[p[0]]]++; cnt[BR_OH[p[1]]]++; } });
    var totalC = Object.keys(cnt).reduce(function (s, k) { return s + cnt[k]; }, 0);

    var ilgan = STEM[P.d[0]];
    var ilganOh = STEM_OH[P.d[0]];

    // 팔자 그리드
    var stemRow = cols.map(function (c) {
      if (!c[1]) return '<td class="pj-empty">·</td>';
      var oh = STEM_OH[c[1][0]];
      var isIl = (c[0] === "일");
      return '<td class="pj-cell' + (isIl ? ' pj-il' : '') + '" style="border-color:' + OH_COLOR[oh] + '"><b>' + STEM[c[1][0]] + '</b><span>' + oh + '</span></td>';
    }).join("");
    var brRow = cols.map(function (c) {
      if (!c[1]) return '<td class="pj-empty">·</td>';
      var oh = BR_OH[c[1][1]];
      return '<td class="pj-cell" style="border-color:' + OH_COLOR[oh] + '"><b>' + JIJI[c[1][1]] + '</b><span>' + oh + '</span></td>';
    }).join("");
    var headRow = cols.map(function (c) { return '<th>' + c[0] + '주</th>'; }).join("");

    // 오행 막대
    var bars = ["목", "화", "토", "금", "수"].map(function (k) {
      var pct = Math.round(cnt[k] / totalC * 100);
      return '<div class="oh-bar"><span class="oh-l" style="color:' + OH_COLOR[k] + '">' + k + ' ' + cnt[k] + '</span>' +
        '<span class="oh-track"><i style="width:' + pct + '%;background:' + OH_COLOR[k] + '"></i></span></div>';
    }).join("");

    // 강약 총평
    var maxK = "목", minK = "목";
    ["화", "토", "금", "수"].forEach(function (k) { if (cnt[k] > cnt[maxK]) maxK = k; if (cnt[k] < cnt[minK]) minK = k; });
    var missing = ["목", "화", "토", "금", "수"].filter(function (k) { return cnt[k] === 0; });
    var balanceMsg = missing.length
      ? "사주에 <b>" + missing.join("·") + "</b> 기운이 없습니다. 해당 오행의 색·방향·활동을 보완하면 균형에 도움이 됩니다."
      : "오행이 비교적 고르게 갖춰졌습니다. 가장 강한 기운은 <b>" + maxK + "</b>, 약한 기운은 <b>" + minK + "</b>입니다.";

    box.innerHTML =
      '<div class="pj-wrap"><table class="pj"><thead><tr>' + headRow + '</tr></thead>' +
        '<tbody><tr>' + stemRow + '</tr><tr>' + brRow + '</tr></tbody></table></div>' +
      (P.h ? '' : '<p class="pj-note">※ 태어난 시간을 모름으로 두어 <b>시주</b>는 제외했습니다.</p>') +
      '<div class="sp-block hl"><b>나(일간) — ' + ilgan + ' (' + ilganOh + ')</b><p>' + OH_TRAIT[ilganOh] + '</p></div>' +
      '<div class="sp-block"><b>오행 분포</b><div class="oh-bars">' + bars + '</div><p class="oh-msg">' + balanceMsg + '</p></div>' +
      '<p class="sp-disc">※ 일주는 정밀 계산(검증 완료), 년주는 입춘·월주는 절기 근사를 적용했습니다. 태어난 시(진태양시) 보정은 미반영이라 시주 경계는 오차가 있을 수 있습니다.</p>' +
      '<div class="sp-cta"><a class="btn btn-primary btn-sm" href="mailto:midas6971@gmail.com?subject=' + encodeURIComponent("[AI공장] 정밀 사주 상담 문의") + '">정밀 해석 상담받기</a></div>';
    box.hidden = false;
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
