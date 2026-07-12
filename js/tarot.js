/* AI공장 — 타로 (메이저 아르카나 22장). 전역 window.AIFTarot 제공 + tarot.html 자체 동작 */
(function () {
  "use strict";

  var DECK = [
    { n: "바보", e: "🃏", m: "새로운 시작과 모험. 순수한 도전의 기운.", tip: "두려움 없이 첫걸음을 내딛으세요." },
    { n: "마법사", e: "🪄", m: "창조와 실행력. 원하는 것을 만들 능력이 있음.", tip: "가진 자원을 적극 활용할 때." },
    { n: "여사제", e: "🌙", m: "직관과 내면의 지혜, 숨겨진 진실.", tip: "서두르지 말고 직감을 믿으세요." },
    { n: "여황제", e: "👑", m: "풍요·사랑·결실. 돌봄과 성장의 기운.", tip: "관계와 결실에 정성을 들이세요." },
    { n: "황제", e: "🏛️", m: "권위·안정·통제. 체계와 리더십.", tip: "규칙을 세우고 주도권을 잡으세요." },
    { n: "교황", e: "📜", m: "전통·조언·배움. 멘토와 신뢰.", tip: "경험자의 조언을 구해보세요." },
    { n: "연인", e: "💞", m: "사랑·선택·조화. 중요한 결정의 순간.", tip: "마음이 이끄는 쪽을 살피세요." },
    { n: "전차", e: "🏇", m: "의지·승리·추진력. 정면 돌파.", tip: "흔들리지 말고 밀고 나가세요." },
    { n: "힘", e: "🦁", m: "용기와 인내, 부드러운 통제력.", tip: "조급함 대신 꾸준함으로." },
    { n: "은둔자", e: "🏮", m: "성찰·고독·지혜. 내면을 돌아볼 때.", tip: "혼자만의 시간에서 답을 찾으세요." },
    { n: "운명의 수레바퀴", e: "🎡", m: "전환점과 행운. 흐름이 바뀝니다.", tip: "변화의 파도에 올라타세요." },
    { n: "정의", e: "⚖️", m: "균형·공정·결정. 원인과 결과.", tip: "공정하고 이성적으로 판단하세요." },
    { n: "매달린 사람", e: "🙃", m: "관점 전환·기다림·희생.", tip: "잠시 멈추고 다르게 바라보세요." },
    { n: "죽음", e: "🦋", m: "끝과 시작, 큰 변화와 재생.", tip: "낡은 것을 놓아야 새것이 옵니다." },
    { n: "절제", e: "🍶", m: "조화·중용·균형 잡힌 흐름.", tip: "무리하지 말고 페이스를 지키세요." },
    { n: "악마", e: "😈", m: "유혹·집착·속박. 얽매임을 경계.", tip: "무엇에 매여 있는지 점검하세요." },
    { n: "탑", e: "🗼", m: "급변·붕괴·각성. 예상 밖의 사건.", tip: "무너짐은 새 토대의 기회입니다." },
    { n: "별", e: "⭐", m: "희망·영감·치유. 밝은 미래의 조짐.", tip: "꿈을 다시 그려보세요." },
    { n: "달", e: "🌗", m: "불안·환상·무의식. 애매함 속 주의.", tip: "확실하지 않은 것은 검증하세요." },
    { n: "태양", e: "☀️", m: "성공·활력·기쁨. 최고의 길카드.", tip: "자신 있게 나아가면 빛납니다." },
    { n: "심판", e: "📣", m: "부활·결산·각성. 재도전의 신호.", tip: "지난 일을 매듭짓고 다시 시작하세요." },
    { n: "세계", e: "🌍", m: "완성·성취·통합. 한 사이클의 결실.", tip: "목표 달성이 눈앞, 마무리에 집중." }
  ];

  function draw3(seed) {
    var pool = DECK.slice(), out = [];
    var s = seed || (Date.now() % 100000) + 1;
    function rnd() { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; }
    for (var i = 0; i < 3; i++) { var idx = Math.floor(rnd() * pool.length); out.push(pool.splice(idx, 1)[0]); }
    return out;
  }

  var POS = ["과거", "현재", "미래"];

  window.AIFTarot = {
    deck: DECK,
    draw: draw3,
    // 챗/페이지 공용: 3장 결과 HTML
    resultHtml: function (cards) {
      var body = cards.map(function (c, i) {
        return '<div class="tr-card"><div class="tr-pos">' + POS[i] + '</div>' +
          '<div class="tr-emoji">' + c.e + '</div>' +
          '<div class="tr-name">' + c.n + '</div>' +
          '<p class="tr-m">' + c.m + '</p>' +
          '<p class="tr-tip">💡 ' + c.tip + '</p></div>';
      }).join("");
      var future = cards[2];
      return '<div class="tr-cards">' + body + '</div>' +
        '<div class="tr-summary"><b>총평</b> — 흐름은 「' + cards[0].n + ' → ' + cards[1].n + ' → ' + cards[2].n +
        '」. 핵심은 <b>미래(' + future.n + ')</b>: ' + future.tip + '</div>';
    }
  };

  // tarot.html 자체 동작
  var form = document.getElementById("tForm");
  if (form) {
    var box = document.getElementById("tResult");
    var q = document.getElementById("tQuestion");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var seedStr = (q && q.value ? q.value : "") + Date.now();
      var seed = 0; for (var i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) % 100000;
      var cards = draw3(seed || undefined);
      box.innerHTML = window.AIFTarot.resultHtml(cards) +
        '<p class="tr-disc">※ 재미로 보는 타로입니다.</p>' +
        '<div class="tr-cta"><button type="button" class="btn btn-ghost btn-sm" onclick="location.reload()">다시 뽑기</button>' +
        '<a class="btn btn-primary btn-sm" href="agent.html">에이전트로 더 물어보기 →</a></div>';
      box.hidden = false;
      box.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
})();
