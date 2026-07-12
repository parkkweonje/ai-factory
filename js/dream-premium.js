/* AI공장 — 꿈해몽 프리미엄 : 재물·애정·건강·심리 4영역 심층 해석 */
(function () {
  "use strict";

  // dim: 재물 / 애정 / 건강 / 심리
  var DB = [
    { keys: ["용", "이무기"], t: "용", luck: "good", dim: "재물", m: "출세와 큰 성공, 재물의 대길몽." },
    { keys: ["뱀", "구렁이", "독사"], t: "뱀", luck: "good", dim: "재물", m: "재물·태몽의 상징. 기회가 들어옵니다." },
    { keys: ["돼지"], t: "돼지", luck: "good", dim: "재물", m: "재물과 복이 들어오는 길몽." },
    { keys: ["똥", "대변", "배설"], t: "똥·대변", luck: "good", dim: "재물", m: "재물운 대길, 횡재수." },
    { keys: ["물고기", "잉어"], t: "물고기", luck: "good", dim: "재물", m: "재물·결실, 임신의 상징." },
    { keys: ["불", "화재"], t: "불", luck: "good", dim: "재물", m: "사업 번창과 재물 확장." },
    { keys: ["피", "혈"], t: "피", luck: "good", dim: "재물", m: "재물이 들어오는 신호." },
    { keys: ["돈", "지폐", "현금"], t: "돈", luck: "neutral", dim: "재물", m: "받으면 지출, 주면 수입 — 반대 해석." },
    { keys: ["결혼", "웨딩", "신랑", "신부"], t: "결혼", luck: "neutral", dim: "애정", m: "새로운 인연·계약, 관계의 전환점." },
    { keys: ["키스", "포옹", "연인", "애인"], t: "애정 장면", luck: "good", dim: "애정", m: "애정운 상승, 관계가 깊어집니다." },
    { keys: ["아기", "아이", "임신", "출산"], t: "아기", luck: "good", dim: "애정", m: "새 시작·인연, 계획의 결실." },
    { keys: ["고양이"], t: "고양이", luck: "bad", dim: "애정", m: "구설·삼각관계 등 관계 주의." },
    { keys: ["헤어", "이별", "떠나"], t: "이별", luck: "bad", dim: "애정", m: "관계의 변화·정리 신호." },
    { keys: ["이빨", "이가", "치아", "이 빠"], t: "이 빠지는 꿈", luck: "bad", dim: "건강", m: "건강·가족 우환 주의, 구설수." },
    { keys: ["아프", "병원", "다치", "수술"], t: "질병·부상", luck: "bad", dim: "건강", m: "건강 관리 필요, 피로 신호." },
    { keys: ["죽", "시체", "장례"], t: "죽음", luck: "good", dim: "심리", m: "끝과 재생, 새 국면의 시작." },
    { keys: ["쫓기", "쫓아", "도망", "시험"], t: "쫓기는/시험 꿈", luck: "bad", dim: "심리", m: "스트레스·압박의 반영, 휴식 필요." },
    { keys: ["날", "하늘", "비행"], t: "하늘을 낢", luck: "good", dim: "심리", m: "자유·성취 욕구, 승진운." },
    { keys: ["물", "바다", "강", "홍수"], t: "물", luck: "neutral", dim: "심리", m: "감정 상태. 맑으면 길, 흙탕물이면 흉." },
    { keys: ["떨어", "추락", "낭떠러지"], t: "추락", luck: "bad", dim: "심리", m: "불안·통제감 상실, 부담을 점검." },
    { keys: ["호랑이", "범"], t: "호랑이", luck: "good", dim: "심리", m: "귀인·권력, 도움을 주는 사람." },
    { keys: ["조상", "돌아가신", "할머니", "할아버지"], t: "조상", luck: "neutral", dim: "심리", m: "조언 또는 경고의 메시지." },
    { keys: ["집", "이사"], t: "집·이사", luck: "neutral", dim: "심리", m: "환경 변화와 삶의 전환점." },
    { keys: ["비", "장마"], t: "비", luck: "good", dim: "재물", m: "재물과 정화, 근심 해소." }
  ];

  var DIMS = ["재물", "애정", "건강", "심리"];
  var DIM_ICON = { "재물": "💰", "애정": "💖", "건강": "🩺", "심리": "🧠" };
  var DIM_DEFAULT = {
    "재물": "특별한 재물 신호는 없습니다. 무리한 지출만 삼가면 평온한 흐름입니다.",
    "애정": "관계에 큰 변화 신호는 없습니다. 지금의 인연에 정성을 들이면 좋습니다.",
    "건강": "건강 관련 경고는 보이지 않습니다. 규칙적인 생활을 유지하세요.",
    "심리": "심리적으로 안정된 편입니다. 하고 싶던 일을 시도해 볼 시기입니다."
  };
  var LUCK = { good: "길함 ✨", bad: "주의 ⚠️", neutral: "보통 🌗" };
  var LUCK_C = { good: "#17b26a", bad: "#f79009", neutral: "#2b4eff" };

  function lucky(seedStr) {
    var s = 0, i; for (i = 0; i < seedStr.length; i++) s = (s * 31 + seedStr.charCodeAt(i)) % 100000; s = s || 7;
    function n() { s = (s * 1103515245 + 12345) & 0x7fffffff; return s; }
    var set = {}, out = []; while (out.length < 6) { var v = (n() % 45) + 1; if (!set[v]) { set[v] = 1; out.push(v); } }
    return out.sort(function (a, b) { return a - b; });
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function lottoColor(n) { return n <= 10 ? "#fbc400" : n <= 20 ? "#69c8f2" : n <= 30 ? "#ff7272" : n <= 40 ? "#aab0b6" : "#b0d840"; }
  function lottoBalls(nums) { return nums.map(function (n) { return '<span class="lotto-ball" style="background:' + lottoColor(n) + '">' + n + '</span>'; }).join(""); }

  var form = document.getElementById("dpForm");
  if (!form) return;
  var input = document.getElementById("dpText");
  var box = document.getElementById("dpResult");
  var chipsBox = document.getElementById("dpChips");

  ["뱀이 쫓아오는 꿈", "이빨이 빠졌어요", "돈을 줍는 꿈", "물에 빠지는 꿈", "돌아가신 할머니"].forEach(function (s) {
    var b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.textContent = s;
    b.addEventListener("click", function () { input.value = s; input.focus(); }); chipsBox.appendChild(b);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = (input.value || "").trim();
    if (!text) { input.focus(); return; }

    var matched = [];
    DB.forEach(function (en) { for (var i = 0; i < en.keys.length; i++) { if (text.indexOf(en.keys[i]) !== -1) { matched.push(en); break; } } });

    var score = { good: 0, bad: 0, neutral: 0 };
    matched.forEach(function (e2) { score[e2.luck]++; });
    var overall = matched.length ? (score.good >= score.bad && score.good > 0 ? "good" : score.bad > score.good ? "bad" : "neutral") : "neutral";

    // 영역별 종합
    var dimHtml = DIMS.map(function (dim) {
      var ins = matched.filter(function (m2) { return m2.dim === dim; });
      var body;
      if (ins.length) {
        var good = ins.filter(function (x) { return x.luck === "good"; }).length;
        var bad = ins.filter(function (x) { return x.luck === "bad"; }).length;
        var lu = good > bad ? "good" : bad > good ? "bad" : "neutral";
        body = '<span class="dp-tag" style="background:' + LUCK_C[lu] + '">' + LUCK[lu] + '</span>' +
          '<p>' + ins.map(function (x) { return esc(x.t) + ": " + esc(x.m); }).join(" ") + '</p>';
      } else {
        body = '<span class="dp-tag" style="background:#8a8fa3">정보 없음</span><p>' + DIM_DEFAULT[dim] + '</p>';
      }
      return '<div class="dp-dim"><h4>' + DIM_ICON[dim] + ' ' + dim + '운</h4>' + body + '</div>';
    }).join("");

    // 행동 조언
    var advice = {
      good: ["기회가 열리는 시기 — 미루던 일을 실행하세요.", "주변에 도움을 청하면 일이 커집니다.", "작은 성공을 기록해 흐름을 이어가세요."],
      bad: ["큰 결정은 2~3일 미루고 정보를 더 모으세요.", "건강과 말(구설)을 특히 조심하세요.", "휴식과 정리로 컨디션을 회복하세요."],
      neutral: ["변화의 신호에 귀 기울이세요.", "현재를 점검하고 우선순위를 정하세요.", "무리하지 말고 페이스를 유지하세요."]
    }[overall];

    var nums = lucky(text);

    box.innerHTML =
      '<div class="dp-head" style="border-color:' + LUCK_C[overall] + '">' +
        '<span class="dp-badge" style="background:' + LUCK_C[overall] + '">종합 ' + LUCK[overall] + '</span>' +
        '<p>' + (matched.length ? "감지된 상징 " + matched.length + "개를 4개 영역으로 심층 분석했습니다." : "등록된 상징이 없어 일반 흐름으로 안내합니다. 인상 깊었던 대상을 한 단어로 적으면 더 정확합니다.") + '</p>' +
      '</div>' +
      '<div class="dp-grid">' + dimHtml + '</div>' +
      '<div class="dp-advice"><h4>🎯 3일간의 행동 조언</h4><ol><li>' + advice.join("</li><li>") + '</li></ol></div>' +
      '<div class="dp-lucky"><b>🎱 이 꿈이 주는 로또번호</b><div class="dp-nums">' + lottoBalls(nums) + '</div><small class="lotto-note">재미로 뽑은 번호입니다. 행운을 빌어요! 🍀</small></div>' +
      '<p class="dp-disc">※ 재미로 보는 참고용 심층 해몽입니다.</p>' +
      '<div class="dp-cta"><a class="btn btn-primary btn-sm" href="mailto:midas6971@gmail.com?subject=' + encodeURIComponent("[AI공장] 운세·해몽 서비스 문의") + '">이런 서비스 만들고 싶어요</a></div>';
    box.hidden = false;
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
