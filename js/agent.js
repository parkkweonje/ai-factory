/* AI공장 — AI 운세 에이전트 (대화형, 규칙 기반, 클라이언트 사이드)
   사주 · 꿈해몽 · 궁합을 하나의 챗 인터페이스로 통합 */
(function () {
  "use strict";

  /* ===== 공통 데이터 ===== */
  var STEM = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
  var JIJI = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
  var STEM_OH = ["목", "목", "화", "화", "토", "토", "금", "금", "수", "수"];
  var BRANCH = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"];
  var EMOJI = ["🐭", "🐮", "🐯", "🐰", "🐲", "🐍", "🐴", "🐑", "🐵", "🐔", "🐶", "🐷"];
  var OH_INFO = {
    "목": { color: "청록색", trait: "성장·기획·리더 기질" },
    "화": { color: "빨간색", trait: "열정·표현·추진력" },
    "토": { color: "노란색", trait: "신용·포용·안정" },
    "금": { color: "흰색", trait: "결단·의리·재물감각" },
    "수": { color: "검정·파란색", trait: "지혜·유연·소통" }
  };
  var FORTUNE_2026 = { "쥐": "귀인 도움으로 재물운 상승.", "소": "노력이 결실로 이어집니다.", "호랑이": "변화·도전에 유리한 해.", "토끼": "인간관계가 재물로. 말조심.", "용": "큰 기회의 해, 과감함이 성공.", "뱀": "기운 상승, 자신감을 가지세요.", "말": "건강·계약 신중히, 명예운은 good.", "양": "안정 속 성장, 내실 다지기.", "원숭이": "아이디어가 돈이 됩니다.", "닭": "성실함이 빛나는 해.", "개": "귀인운 강함, 도약의 해.", "돼지": "재물운 탄탄, 뜻밖의 수입." };

  var SAMHAP = { 0: "수", 8: "수", 4: "수", 2: "화", 6: "화", 10: "화", 11: "목", 3: "목", 7: "목", 5: "금", 9: "금", 1: "금" };
  var YUKHAP = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]];
  var CHUNG = [[0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11]];

  var DREAM = [
    { k: ["용", "이무기"], t: "용", l: "good", m: "출세·성공·재물의 대길몽." },
    { k: ["뱀", "구렁이"], t: "뱀", l: "good", m: "재물·태몽, 기회가 들어옵니다." },
    { k: ["돼지"], t: "돼지", l: "good", m: "재물과 복이 들어옵니다." },
    { k: ["똥", "대변"], t: "똥", l: "good", m: "재물운 대길, 횡재수." },
    { k: ["물고기", "잉어"], t: "물고기", l: "good", m: "재물·결실의 상징." },
    { k: ["불", "화재"], t: "불", l: "good", m: "사업 번창·재물 확장." },
    { k: ["돈", "지폐"], t: "돈", l: "neutral", m: "받으면 지출, 주면 수입(반대)." },
    { k: ["이빨", "이가", "치아", "이 빠"], t: "이 빠지는 꿈", l: "bad", m: "구설·건강 주의." },
    { k: ["쫓기", "쫓아", "도망", "시험"], t: "쫓기는 꿈", l: "bad", m: "스트레스·압박, 휴식 필요." },
    { k: ["죽", "시체"], t: "죽음", l: "good", m: "끝과 재생, 새 시작." },
    { k: ["아기", "임신", "출산"], t: "아기", l: "good", m: "새 시작·계획의 결실." },
    { k: ["날", "하늘", "비행"], t: "하늘을 낢", l: "good", m: "성취·자유·승진운." },
    { k: ["물", "바다", "홍수"], t: "물", l: "neutral", m: "감정 상태, 맑으면 길." },
    { k: ["호랑이", "범"], t: "호랑이", l: "good", m: "귀인·권력의 상징." },
    { k: ["고양이"], t: "고양이", l: "bad", m: "구설·관계 주의." },
    { k: ["비", "장마"], t: "비", l: "good", m: "재물·근심 해소." },
    { k: ["돌아가신", "조상", "할머니", "할아버지"], t: "조상", l: "neutral", m: "조언·경고의 메시지." }
  ];
  var LUCK = { good: { t: "길몽 ✨", c: "#17b26a" }, bad: { t: "주의 ⚠️", c: "#f79009" }, neutral: { t: "중립 🌗", c: "#2b4eff" } };

  /* ===== 유틸 ===== */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function lottoColor(n) { return n <= 10 ? "#fbc400" : n <= 20 ? "#69c8f2" : n <= 30 ? "#ff7272" : n <= 40 ? "#aab0b6" : "#b0d840"; }
  function lotto(seedStr) {
    var s = 0, i; for (i = 0; i < seedStr.length; i++) s = (s * 31 + seedStr.charCodeAt(i)) % 100000; s = s || 7;
    function n() { s = (s * 1103515245 + 12345) & 0x7fffffff; return s; }
    var set = {}, out = []; while (out.length < 6) { var v = (n() % 45) + 1; if (!set[v]) { set[v] = 1; out.push(v); } }
    return out.sort(function (a, b) { return a - b; });
  }
  function lottoHtml(nums) { return '<div class="ag-lotto">🎱 로또번호 ' + nums.map(function (n) { return '<span style="background:' + lottoColor(n) + '">' + n + '</span>'; }).join("") + '</div>'; }
  function has(pairs, a, b) { return pairs.some(function (p) { return (p[0] === a && p[1] === b) || (p[0] === b && p[1] === a); }); }

  /* ===== 계산 ===== */
  function sajuInfo(y) {
    var s = ((y - 4) % 10 + 10) % 10, b = ((y - 4) % 12 + 12) % 12;
    return { stem: STEM[s], jiji: JIJI[b], oh: STEM_OH[s], tti: BRANCH[b], emoji: EMOJI[b], b: b };
  }
  function sajuReply(y) {
    var I = sajuInfo(y);
    var nums = lotto("saju" + y);
    return '<div class="ag-card">' +
      '<div class="ag-h">' + I.emoji + ' ' + y + '년생 · <b>' + I.tti + '띠</b> (' + I.stem + I.jiji + '년)</div>' +
      '<p><b>' + I.oh + ' 기운</b> — ' + OH_INFO[I.oh].trait + '</p>' +
      '<p><b>2026 운세</b> — ' + FORTUNE_2026[I.tti] + '</p>' +
      '<p><b>행운의 색</b> ' + OH_INFO[I.oh].color + '</p>' +
      lottoHtml(nums) +
      '<a class="ag-link" href="saju-pro.html">정식 사주팔자(4기둥) 보기 →</a></div>';
  }
  function dreamReply(text) {
    var matched = [];
    DREAM.forEach(function (e) { for (var i = 0; i < e.k.length; i++) { if (text.indexOf(e.k[i]) !== -1) { matched.push(e); break; } } });
    var sc = { good: 0, bad: 0, neutral: 0 }; matched.forEach(function (e) { sc[e.l]++; });
    var ov = matched.length ? (sc.good >= sc.bad && sc.good > 0 ? "good" : sc.bad > sc.good ? "bad" : "neutral") : "neutral";
    var syms = matched.length ? matched.map(function (e) { return '<p>· <b>' + esc(e.t) + '</b>: ' + esc(e.m) + '</p>'; }).join("")
      : '<p>등록된 상징을 못 찾았어요. 인상 깊었던 대상(동물·사람·장소)을 한 단어로 적어주시면 더 정확해요.</p>';
    var nums = lotto(text);
    return '<div class="ag-card">' +
      '<div class="ag-h" style="color:' + LUCK[ov].c + '">종합: ' + LUCK[ov].t + '</div>' + syms + lottoHtml(nums) +
      '<a class="ag-link" href="dream-premium.html">4영역 프리미엄 해몽 보기 →</a></div>';
  }
  function gunghapReply(y1, y2) {
    var A = sajuInfo(y1), B = sajuInfo(y2), score = 60, pts = [];
    if (A.b === B.b) { score += 8; pts.push("같은 띠 — 서로 잘 이해합니다"); }
    else if (SAMHAP[A.b] === SAMHAP[B.b]) { score += 25; pts.push("삼합 — 최고의 조합!"); }
    else if (has(YUKHAP, A.b, B.b)) { score += 20; pts.push("육합 — 서로 끌리는 인연"); }
    else if (has(CHUNG, A.b, B.b)) { score -= 25; pts.push("충 — 배려가 필요해요"); }
    var sh = { "목": "화", "화": "토", "토": "금", "금": "수", "수": "목" }, gk = { "목": "토", "토": "수", "수": "화", "화": "금", "금": "목" };
    if (A.oh === B.oh) { score += 5; pts.push("같은 오행 — 통하는 게 많아요"); }
    else if (sh[A.oh] === B.oh || sh[B.oh] === A.oh) { score += 12; pts.push("오행 상생 — 서로를 살려줘요"); }
    else if (gk[A.oh] === B.oh || gk[B.oh] === A.oh) { score -= 12; pts.push("오행 상극 — 조율이 필요해요"); }
    score = Math.max(38, Math.min(98, score));
    var grade = score >= 90 ? "천생연분 💕" : score >= 75 ? "아주 좋은 궁합 💖" : score >= 60 ? "무난한 궁합 🙂" : score >= 45 ? "노력이 필요해요 🌱" : "도전적인 궁합 🔥";
    return '<div class="ag-card">' +
      '<div class="ag-h">' + A.emoji + ' ' + A.tti + '띠 ♥ ' + B.emoji + ' ' + B.tti + '띠</div>' +
      '<div class="ag-score">' + score + '점 · ' + grade + '</div>' +
      pts.map(function (p) { return '<p>· ' + p + '</p>'; }).join("") +
      '<a class="ag-link" href="compatibility.html">이름 넣어 자세히 보기 →</a></div>';
  }

  /* ===== 채팅 UI ===== */
  var chat = document.getElementById("ag-chat");
  var form = document.getElementById("ag-form");
  var inputEl = document.getElementById("ag-input");
  var state = { mode: null, temp: null };

  function scroll() { chat.scrollTop = chat.scrollHeight; }
  function bubble(who, html) {
    var d = document.createElement("div");
    d.className = "ag-msg ag-" + who;
    d.innerHTML = (who === "bot" ? '<div class="ag-ava">🔮</div>' : '') + '<div class="ag-body">' + html + '</div>';
    chat.appendChild(d); scroll();
  }
  function botText(t) { bubble("bot", '<p>' + t + '</p>'); }
  function user(t) { bubble("user", '<p>' + esc(t) + '</p>'); }

  function menu() {
    bubble("bot", '<p>무엇을 봐드릴까요? 아래에서 골라주세요.</p><div class="ag-chips">' +
      '<button class="ag-chip" data-c="saju">🔮 사주</button>' +
      '<button class="ag-chip" data-c="dream">🌙 꿈해몽</button>' +
      '<button class="ag-chip" data-c="gunghap">💘 궁합</button>' +
      '</div>');
  }

  function start(mode) {
    state.mode = mode; state.temp = null;
    if (mode === "saju") botText("생년(태어난 해)을 알려주세요. 예: <b>1995</b> 또는 1995-03-15 (양력)");
    else if (mode === "dream") botText("어떤 꿈을 꾸셨나요? 자유롭게 적어주세요. 예: <b>커다란 뱀이 나오는 꿈</b>");
    else if (mode === "gunghap") botText("두 사람의 태어난 해를 알려주세요. 예: <b>1995, 1993</b>");
  }

  function extractYears(t) { var m = t.match(/(19|20)\d{2}/g); return m ? m.map(Number) : []; }

  function process(t) {
    if (!state.mode) {
      // 자연어에서 의도 추정
      if (/궁합/.test(t)) return start("gunghap");
      if (/꿈|해몽/.test(t)) return start("dream");
      if (/사주|운세|띠/.test(t)) return start("saju");
      botText("사주 · 꿈해몽 · 궁합 중에 골라주세요 🙂"); return menu();
    }
    if (state.mode === "saju") {
      var ys = extractYears(t);
      if (!ys.length) { botText("태어난 해를 4자리로 알려주세요. 예: 1995"); return; }
      bubble("bot", sajuReply(ys[0])); done();
    } else if (state.mode === "dream") {
      if (t.length < 2) { botText("꿈 내용을 조금 더 적어주세요."); return; }
      bubble("bot", dreamReply(t)); done();
    } else if (state.mode === "gunghap") {
      var yy = extractYears(t);
      if (yy.length < 2) { botText("두 사람의 태어난 해를 함께 알려주세요. 예: 1995, 1993"); return; }
      bubble("bot", gunghapReply(yy[0], yy[1])); done();
    }
  }

  function done() {
    state.mode = null;
    setTimeout(function () {
      bubble("bot", '<p>또 봐드릴까요?</p><div class="ag-chips">' +
        '<button class="ag-chip" data-c="saju">🔮 사주</button>' +
        '<button class="ag-chip" data-c="dream">🌙 꿈해몽</button>' +
        '<button class="ag-chip" data-c="gunghap">💘 궁합</button></div>');
    }, 400);
  }

  chat.addEventListener("click", function (e) {
    var b = e.target.closest(".ag-chip");
    if (!b) return;
    var labels = { saju: "사주 볼게요", dream: "꿈해몽 볼게요", gunghap: "궁합 볼게요" };
    user(labels[b.getAttribute("data-c")] || b.textContent);
    start(b.getAttribute("data-c"));
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var t = (inputEl.value || "").trim();
    if (!t) return;
    user(t); inputEl.value = "";
    setTimeout(function () { process(t); }, 250);
  });

  // 인트로
  botText("안녕하세요! AI공장 <b>운세 에이전트</b>예요 🔮 사주·꿈해몽·궁합을 바로 봐드립니다.");
  setTimeout(menu, 350);
})();
