/* AI공장 — 간이 사주 (재미용, 년주·오행·띠 기반. 클라이언트 사이드) */
(function () {
  "use strict";

  var STEM = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
  var STEM_OHENG = ["목", "목", "화", "화", "토", "토", "금", "금", "수", "수"];
  var STEM_YIN = ["양", "음", "양", "음", "양", "음", "양", "음", "양", "음"];
  var BRANCH = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"];
  var JIJI = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
  var BRANCH_EMOJI = ["🐭", "🐮", "🐯", "🐰", "🐲", "🐍", "🐴", "🐑", "🐵", "🐔", "🐶", "🐷"];

  var OHENG = {
    "목": { color: "청록색", dir: "동쪽", trait: "성장·배려·기획력이 강하고 리더 기질이 있습니다.", job: "교육·기획·콘텐츠·스타트업" },
    "화": { color: "빨간색", dir: "남쪽", trait: "열정적이고 표현력이 뛰어나며 사람을 끄는 힘이 있습니다.", job: "마케팅·예술·방송·영업" },
    "토": { color: "노란색", dir: "중앙", trait: "신용과 포용력이 있고 안정감을 주는 중재자형입니다.", job: "부동산·중개·컨설팅·요식" },
    "금": { color: "흰색", dir: "서쪽", trait: "결단력과 의리가 있고 재물 감각이 뛰어납니다.", job: "금융·법률·제조·유통" },
    "수": { color: "검정·파란색", dir: "북쪽", trait: "지혜롭고 유연하며 소통과 정보에 강합니다.", job: "연구·IT·무역·기획" }
  };

  // 2026 병오년(화) 띠별 한 줄 운세
  var FORTUNE_2026 = {
    "쥐": "귀인의 도움으로 재물운 상승. 협업에서 기회가 열립니다.",
    "소": "노력이 결실로. 꾸준함이 인정받는 해입니다.",
    "호랑이": "변화와 도전에 유리. 새 시작이 잘 풀립니다.",
    "토끼": "인간관계가 재물로 이어집니다. 말조심은 필수.",
    "용": "큰 기회가 오는 해. 과감함이 성공을 부릅니다.",
    "뱀": "본인의 해(사·오 기운)와 통해 기운 상승. 자신감을 가지세요.",
    "말": "삼재·본명년 기운, 건강·계약 신중히. 다만 명예운은 좋음.",
    "양": "안정 속 성장. 저축과 내실을 다지기 좋은 해.",
    "원숭이": "아이디어가 돈이 됩니다. 부업·투잡에 유리.",
    "닭": "성실함이 빛을 봅니다. 이직·이동운 양호.",
    "개": "귀인운 강함. 도움받아 한 단계 도약합니다.",
    "돼지": "재물운 탄탄. 뜻밖의 수입 가능성 있습니다."
  };

  function lucky(seed) {
    var s = seed % 100000 || 7;
    function n() { s = (s * 1103515245 + 12345) & 0x7fffffff; return s; }
    var set = {}, out = [];
    while (out.length < 6) { var v = (n() % 45) + 1; if (!set[v]) { set[v] = 1; out.push(v); } }
    return out.sort(function (a, b) { return a - b; });
  }

  var form = document.getElementById("sForm");
  if (!form) return;
  var box = document.getElementById("sResult");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var y = parseInt(document.getElementById("sYear").value, 10);
    var m = parseInt(document.getElementById("sMonth").value, 10);
    var d = parseInt(document.getElementById("sDay").value, 10);
    var gender = document.getElementById("sGender").value;

    if (!y || y < 1900 || y > 2025) { alert("태어난 연도를 1900~2025 사이로 입력해 주세요."); return; }
    if (!m || m < 1 || m > 12) { alert("태어난 월을 1~12로 입력해 주세요."); return; }
    if (!d || d < 1 || d > 31) { alert("태어난 일을 1~31로 입력해 주세요."); return; }

    var stemIdx = ((y - 4) % 10 + 10) % 10;
    var branchIdx = ((y - 4) % 12 + 12) % 12;
    var stem = STEM[stemIdx];
    var oheng = STEM_OHENG[stemIdx];
    var yin = STEM_YIN[stemIdx];
    var tti = BRANCH[branchIdx];
    var jiji = JIJI[branchIdx];
    var emoji = BRANCH_EMOJI[branchIdx];
    var info = OHENG[oheng];

    // 태어난 계절 오행 (양력 기준, 간이)
    var season = (m >= 3 && m <= 5) ? { s: "봄", o: "목" } :
                 (m >= 6 && m <= 8) ? { s: "여름", o: "화" } :
                 (m >= 9 && m <= 11) ? { s: "가을", o: "금" } :
                 { s: "겨울", o: "수" };

    var nums = lucky(y * 10000 + m * 100 + d);
    var f2026 = FORTUNE_2026[tti];

    box.innerHTML =
      '<div class="s-top">' +
        '<div class="s-emoji">' + emoji + '</div>' +
        '<div>' +
          '<div class="s-title">' + y + '년생 · ' + tti + '띠</div>' +
          '<div class="s-sub">' + stem + jiji + '년생 · <b>' + oheng + '(' + yin + ')</b> 기운 · ' + season.s + ' 태생</div>' +
        '</div>' +
      '</div>' +
      '<div class="s-block"><b>나의 타고난 기운 — ' + oheng + '</b><p>' + info.trait + '</p></div>' +
      '<div class="s-block"><b>어울리는 분야</b><p>' + info.job + '</p></div>' +
      '<div class="s-block hl"><b>2026 병오년(丙午) 운세 — ' + tti + '띠</b><p>' + f2026 + '</p></div>' +
      '<div class="s-lucky-row">' +
        '<div class="s-chip"><span>행운의 색</span><b>' + info.color + '</b></div>' +
        '<div class="s-chip"><span>행운의 방향</span><b>' + info.dir + '</b></div>' +
        '<div class="s-chip"><span>성별</span><b>' + (gender === "f" ? "여성" : gender === "m" ? "남성" : "-") + '</b></div>' +
      '</div>' +
      '<div class="s-lucky"><b>🍀 행운의 숫자</b><div class="s-nums">' + nums.map(function (n) { return '<span>' + n + '</span>'; }).join("") + '</div></div>' +
      '<p class="s-disc">※ 재미로 보는 간이 사주입니다. 년주·오행·띠 기준이며, 정식 만세력(월·일·시주)과는 다를 수 있습니다.</p>' +
      '<div class="s-cta">' +
        '<a class="btn btn-primary btn-sm" href="mailto:midas6971@gmail.com?subject=' + encodeURIComponent("[AI공장] 사주·운세 서비스 문의") + '">이런 서비스 만들고 싶어요</a>' +
      '</div>';
    box.hidden = false;
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
