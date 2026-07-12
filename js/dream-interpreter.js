/* AI공장 — AI 꿈해몽 (클라이언트 사이드, 전통 해몽 사전 기반) */
(function () {
  "use strict";

  // luck: good(길) / bad(흉) / neutral(중)
  var DB = [
    { keys: ["용", "이무기"], t: "용", luck: "good", m: "최고의 길몽. 출세·성공·큰 성취를 상징합니다.", tip: "큰 도전을 미루지 마세요. 지금이 기회입니다." },
    { keys: ["뱀", "구렁이", "독사"], t: "뱀", luck: "good", m: "재물과 태몽의 상징. 뱀이 클수록 큰 재물운입니다.", tip: "들어오는 기회·투자 건을 눈여겨보세요." },
    { keys: ["돼지"], t: "돼지", luck: "good", m: "대표적인 재물·복의 상징입니다.", tip: "뜻밖의 수입이 생길 수 있는 시기." },
    { keys: ["똥", "대변", "변을", "배설"], t: "똥·대변", luck: "good", m: "의외로 재물운 대길몽. 횡재수를 뜻합니다.", tip: "금전운이 최고조. 복권·투자에 관심 가져볼 만." },
    { keys: ["물고기", "잉어", "붕어"], t: "물고기", luck: "good", m: "재물과 임신·결실의 상징입니다.", tip: "노력의 수확을 거두는 시기." },
    { keys: ["불", "화재", "불길"], t: "불", luck: "good", m: "사업 번창과 열정. 큰 불은 큰 재물을 뜻합니다.", tip: "일·사업 확장에 좋은 기운입니다." },
    { keys: ["피", "혈"], t: "피", luck: "good", m: "전통 해몽에서 피는 재물을 상징합니다.", tip: "금전운 상승의 신호." },
    { keys: ["죽", "시체", "장례"], t: "죽음", luck: "good", m: "끝과 재생. 오래된 문제가 끝나고 새 국면이 열립니다.", tip: "묵은 일을 정리하기 좋은 때." },
    { keys: ["아기", "아이", "임신", "출산"], t: "아기", luck: "good", m: "새로운 시작과 계획을 상징합니다.", tip: "새 프로젝트·도전을 시작하기 좋은 시기." },
    { keys: ["날", "하늘", "비행", "날아"], t: "하늘을 낢", luck: "good", m: "성취·자유·승진을 뜻하는 길몽입니다.", tip: "목표를 향해 자신 있게 나아가세요." },
    { keys: ["호랑이", "범"], t: "호랑이", luck: "good", m: "귀인과 권력의 상징입니다.", tip: "도움을 주는 사람을 만날 수 있습니다." },
    { keys: ["비", "장마", "소나기"], t: "비", luck: "good", m: "재물과 정화. 걱정이 씻겨 내려갑니다.", tip: "묵은 근심이 해소되는 시기." },
    { keys: ["이빨", "이가", "치아", "이 빠"], t: "이 빠지는 꿈", luck: "bad", m: "구설수·건강 주의, 가족 우환을 경계하라는 뜻입니다.", tip: "말조심하고 건강을 챙기세요." },
    { keys: ["시험", "쫓기", "쫓아", "도망"], t: "쫓기는/시험 꿈", luck: "bad", m: "스트레스와 압박감의 반영입니다.", tip: "부담을 내려놓고 휴식이 필요합니다." },
    { keys: ["고양이"], t: "고양이", luck: "bad", m: "구설·인간관계 갈등을 조심하라는 신호입니다.", tip: "말과 관계에서 신중하세요." },
    { keys: ["거미"], t: "거미", luck: "neutral", m: "꾸준한 노력이 결실을 맺거나, 얽힌 일을 뜻합니다.", tip: "성실함이 보상받는 시기." },
    { keys: ["물", "바다", "강", "호수", "홍수"], t: "물", luck: "neutral", m: "맑은 물은 길, 흙탕물은 흉. 감정과 재물을 상징합니다.", tip: "마음을 정리하고 흐름을 살피세요." },
    { keys: ["산", "등산", "정상"], t: "산", luck: "neutral", m: "목표와 고난 극복. 정상에 오르면 성취를 뜻합니다.", tip: "노력이 결실로 이어질 수 있습니다." },
    { keys: ["집", "이사", "이삿"], t: "집·이사", luck: "neutral", m: "환경 변화와 삶의 전환점을 상징합니다.", tip: "변화를 받아들일 준비를 하세요." },
    { keys: ["결혼", "웨딩", "신랑", "신부"], t: "결혼", luck: "neutral", m: "계약과 변화. 중요한 결정을 앞둔 신호입니다.", tip: "계약·약속은 신중히 검토하세요." },
    { keys: ["조상", "돌아가신", "할머니", "할아버지"], t: "조상", luck: "neutral", m: "조언 또는 경고의 메시지를 담습니다.", tip: "중요한 판단은 신중하게." },
    { keys: ["돈", "지폐", "현금", "돈을"], t: "돈", luck: "neutral", m: "돈을 받으면 지출, 주면 수입 — 반대로 해석하는 경우가 많습니다.", tip: "큰 지출 전 계획을 세워두세요." }
  ];

  var LUCK_TXT = {
    good: { label: "길몽 ✨", color: "#17b26a", msg: "전반적으로 좋은 기운이 감도는 꿈입니다!" },
    bad: { label: "주의 ⚠️", color: "#f79009", msg: "조심하라는 신호가 담긴 꿈입니다. 겁먹기보다 대비하세요." },
    neutral: { label: "중립 🌗", color: "#2b4eff", msg: "변화의 흐름을 담은 꿈입니다. 해석은 상황에 따라 달라집니다." }
  };

  var form = document.getElementById("dForm");
  var input = document.getElementById("dText");
  var box = document.getElementById("dResult");
  var chipsBox = document.getElementById("dChips");

  var EX = ["뱀이 나오는 꿈", "이빨이 빠졌어요", "하늘을 나는 꿈", "돼지꿈", "물에 빠지는 꿈", "돌아가신 할머니"];
  EX.forEach(function (s) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "chip"; b.textContent = s;
    b.addEventListener("click", function () { input.value = s; input.focus(); });
    chipsBox.appendChild(b);
  });

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  function lottoColor(n) {
    if (n <= 10) return "#fbc400";      // 노랑
    if (n <= 20) return "#69c8f2";      // 파랑
    if (n <= 30) return "#ff7272";      // 빨강
    if (n <= 40) return "#aab0b6";      // 회색
    return "#b0d840";                   // 초록
  }
  function lottoBalls(nums) {
    return nums.map(function (n) { return '<span class="lotto-ball" style="background:' + lottoColor(n) + '">' + n + '</span>'; }).join("");
  }

  function luckyNumbers(seedStr) {
    var seed = 0, i;
    for (i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) % 100000;
    seed = seed || 7;
    function next() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed; }
    var set = {}, out = [];
    while (out.length < 6) { var n = (next() % 45) + 1; if (!set[n]) { set[n] = 1; out.push(n); } }
    return out.sort(function (a, b) { return a - b; });
  }

  function interpret(text) {
    var matched = [];
    DB.forEach(function (e) {
      for (var i = 0; i < e.keys.length; i++) {
        if (text.indexOf(e.keys[i]) !== -1) { matched.push(e); break; }
      }
    });
    // 종합 길흉
    var score = { good: 0, bad: 0, neutral: 0 };
    matched.forEach(function (e) { score[e.luck]++; });
    var overall = "neutral";
    if (matched.length) {
      if (score.good >= score.bad && score.good > 0) overall = "good";
      else if (score.bad > score.good) overall = "bad";
      else overall = "neutral";
    }
    return { matched: matched, overall: overall };
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = (input.value || "").trim();
    if (!text) { input.focus(); return; }

    var r = interpret(text);
    var L = LUCK_TXT[r.overall];
    var nums = luckyNumbers(text);

    var symbolsHtml;
    if (r.matched.length) {
      symbolsHtml = r.matched.map(function (e) {
        var badge = LUCK_TXT[e.luck].label;
        var color = LUCK_TXT[e.luck].color;
        return '<div class="sym">' +
          '<div class="sym-head"><b>' + esc(e.t) + '</b><span class="sym-badge" style="background:' + color + '">' + badge + '</span></div>' +
          '<p>' + esc(e.m) + '</p>' +
          '<p class="sym-tip">💡 ' + esc(e.tip) + '</p>' +
          '</div>';
      }).join("");
    } else {
      symbolsHtml = '<div class="sym"><div class="sym-head"><b>일반 해몽</b></div>' +
        '<p>사전에 등록된 상징이 감지되지 않았어요. 대체로 꿈은 무의식의 정리 과정입니다. 인상 깊었던 대상(동물·사람·장소)을 한 단어로 다시 적어보시면 더 정확히 풀어드립니다.</p></div>';
    }

    box.innerHTML =
      '<div class="d-verdict" style="border-color:' + L.color + '">' +
        '<span class="d-verdict-badge" style="background:' + L.color + '">' + L.label + '</span>' +
        '<p>' + L.msg + '</p>' +
      '</div>' +
      '<div class="d-syms">' + symbolsHtml + '</div>' +
      '<div class="d-lucky"><b>🎱 이 꿈이 주는 로또번호</b><div class="d-nums">' +
        lottoBalls(nums) + '</div><small class="lotto-note">재미로 뽑은 번호입니다. 행운을 빌어요! 🍀</small></div>' +
      '<p class="d-disc">※ 재미로 보는 참고용입니다. 전통 해몽 사전을 바탕으로 하며, 실제 운명을 단정하지 않습니다.</p>' +
      '<div class="d-cta">' +
        '<button type="button" class="btn btn-ghost btn-sm js-dcopy">결과 복사</button>' +
        '<a class="btn btn-primary btn-sm" href="mailto:midas6971@gmail.com?subject=' + encodeURIComponent("[AI공장] 운세·해몽 서비스 문의") + '">이런 서비스 만들고 싶어요</a>' +
      '</div>';
    box.hidden = false;
    box.scrollIntoView({ behavior: "smooth", block: "start" });

    var copyBtn = box.querySelector(".js-dcopy");
    if (copyBtn) copyBtn.addEventListener("click", function () {
      var summary = "[AI공장 꿈해몽] " + L.label + " / 로또번호: " + nums.join(", ");
      if (navigator.clipboard) navigator.clipboard.writeText(summary).then(function () {
        var o = copyBtn.textContent; copyBtn.textContent = "복사됨 ✓";
        setTimeout(function () { copyBtn.textContent = o; }, 1500);
      });
    });
  });
})();
