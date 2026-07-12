/* AI공장 — 띠·오행 궁합 (재미용, 삼합/육합/충 + 오행 상생상극) */
(function () {
  "use strict";

  var STEM_OHENG = ["목", "목", "화", "화", "토", "토", "금", "금", "수", "수"];
  var BRANCH = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"];
  var EMOJI = ["🐭", "🐮", "🐯", "🐰", "🐲", "🐍", "🐴", "🐑", "🐵", "🐔", "🐶", "🐷"];

  // 삼합 그룹(오행)
  var SAMHAP = { 0: "수", 8: "수", 4: "수", 2: "화", 6: "화", 10: "화", 11: "목", 3: "목", 7: "목", 5: "금", 9: "금", 1: "금" };
  // 육합 쌍
  var YUKHAP = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]];
  // 충 쌍
  var CHUNG = [[0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11]];

  function has(pairs, a, b) { return pairs.some(function (p) { return (p[0] === a && p[1] === b) || (p[0] === b && p[1] === a); }); }
  function ohengRel(a, b) {
    if (a === b) return "same";
    var sheng = { "목": "화", "화": "토", "토": "금", "금": "수", "수": "목" };
    var geuk = { "목": "토", "토": "수", "수": "화", "화": "금", "금": "목" };
    if (sheng[a] === b || sheng[b] === a) return "sheng";
    if (geuk[a] === b || geuk[b] === a) return "geuk";
    return "neutral";
  }

  function info(year) {
    var s = ((year - 4) % 10 + 10) % 10;
    var b = ((year - 4) % 12 + 12) % 12;
    return { tti: BRANCH[b], emoji: EMOJI[b], oheng: STEM_OHENG[s], b: b };
  }

  var form = document.getElementById("cForm");
  if (!form) return;
  var box = document.getElementById("cResult");

  function grade(score) {
    if (score >= 90) return { l: "천생연분 💕", c: "#e5484d", m: "서로를 끌어당기는 최고의 궁합! 함께라면 시너지가 큽니다." };
    if (score >= 75) return { l: "아주 좋은 궁합 💖", c: "#17b26a", m: "잘 맞는 사이입니다. 서로의 강점을 살려보세요." };
    if (score >= 60) return { l: "무난한 궁합 🙂", c: "#2b4eff", m: "큰 문제 없이 어울립니다. 배려가 관계를 키웁니다." };
    if (score >= 45) return { l: "노력이 필요해요 🌱", c: "#f79009", m: "다른 점이 있지만, 이해하면 오히려 보완이 됩니다." };
    return { l: "도전적인 궁합 🔥", c: "#8a8fa3", m: "성향 차이가 큰 편. 대화와 존중이 특히 중요합니다." };
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var y1 = parseInt(document.getElementById("cY1").value, 10);
    var y2 = parseInt(document.getElementById("cY2").value, 10);
    var n1 = (document.getElementById("cN1").value || "나").trim();
    var n2 = (document.getElementById("cN2").value || "상대").trim();
    if (!y1 || !y2 || y1 < 1930 || y2 < 1930 || y1 > 2025 || y2 > 2025) { alert("두 사람의 태어난 연도를 1930~2025로 입력해 주세요."); return; }

    var A = info(y1), B = info(y2);
    var score = 60;
    var pts = [];

    if (A.b === B.b) { score += 8; pts.push(["good", "같은 띠 — 서로를 잘 이해합니다"]); }
    else if (SAMHAP[A.b] === SAMHAP[B.b]) { score += 25; pts.push(["good", "삼합(三合) — 최고의 조합, 손발이 척척 맞습니다"]); }
    else if (has(YUKHAP, A.b, B.b)) { score += 20; pts.push(["good", "육합(六合) — 서로 끌리는 인연입니다"]); }
    else if (has(CHUNG, A.b, B.b)) { score -= 25; pts.push(["bad", "충(冲) — 부딪힐 수 있으니 배려가 필요합니다"]); }

    var rel = ohengRel(A.oheng, B.oheng);
    if (rel === "sheng") { score += 12; pts.push(["good", "오행 상생 — 서로를 살려주는 기운입니다"]); }
    else if (rel === "same") { score += 5; pts.push(["good", "같은 오행 — 통하는 부분이 많습니다"]); }
    else if (rel === "geuk") { score -= 12; pts.push(["bad", "오행 상극 — 가치관 차이를 조율해야 합니다"]); }

    score = Math.max(38, Math.min(98, score));
    var g = grade(score);

    var pointsHtml = pts.map(function (p) {
      return '<li class="' + (p[0] === "good" ? "pg" : "pb") + '">' + (p[0] === "good" ? "✓ " : "⚠ ") + p[1] + '</li>';
    }).join("") || '<li class="pg">무난하게 어울리는 조합입니다</li>';

    box.innerHTML =
      '<div class="c-people">' +
        '<div class="c-person"><div class="c-emoji">' + A.emoji + '</div><b>' + esc(n1) + '</b><span>' + A.tti + '띠 · ' + A.oheng + '</span></div>' +
        '<div class="c-heart">💘</div>' +
        '<div class="c-person"><div class="c-emoji">' + B.emoji + '</div><b>' + esc(n2) + '</b><span>' + B.tti + '띠 · ' + B.oheng + '</span></div>' +
      '</div>' +
      '<div class="c-score">' +
        '<div class="c-score-num" style="color:' + g.c + '">' + score + '<small>점</small></div>' +
        '<div class="c-bar"><i style="width:' + score + '%;background:' + g.c + '"></i></div>' +
        '<div class="c-grade" style="color:' + g.c + '">' + g.l + '</div>' +
      '</div>' +
      '<p class="c-msg">' + g.m + '</p>' +
      '<ul class="c-points">' + pointsHtml + '</ul>' +
      '<p class="c-disc">※ 재미로 보는 띠·오행 궁합입니다. 정밀 궁합은 두 사람의 사주팔자를 함께 봐야 합니다.</p>' +
      '<div class="c-cta">' +
        '<button type="button" class="btn btn-ghost btn-sm js-ccopy">결과 복사</button>' +
        '<a class="btn btn-primary btn-sm" href="mailto:midas6971@gmail.com?subject=' + encodeURIComponent("[AI공장] 궁합/운세 서비스 문의") + '">이런 서비스 만들고 싶어요</a>' +
      '</div>';
    box.hidden = false;
    box.scrollIntoView({ behavior: "smooth", block: "start" });

    var cp = box.querySelector(".js-ccopy");
    if (cp) cp.addEventListener("click", function () {
      var t = "[AI공장 궁합] " + n1 + "(" + A.tti + "띠) ♥ " + n2 + "(" + B.tti + "띠) = " + score + "점 · " + g.l;
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () {
        var o = cp.textContent; cp.textContent = "복사됨 ✓"; setTimeout(function () { cp.textContent = o; }, 1500);
      });
    });
  });

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
})();
