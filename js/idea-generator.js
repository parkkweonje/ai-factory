/* AI공장 — 창업 아이디어 생성기 로직 (클라이언트 사이드, 서버 불필요) */
(function () {
  "use strict";

  var SUGGEST = ["반려동물", "요리·레시피", "부동산", "헬스·운동", "육아", "재테크", "여행", "패션", "취업·이직", "중고거래"];

  // 사업 유형(아키타입). 예산/시간 적합도로 가중치.
  // budget: none/low/mid,  time: low/mid/high
  var ARCHETYPES = [
    {
      name: function (k) { return k + " 정보 콘텐츠 채널"; },
      one: function (k) { return "‘" + k + "’ 주제로 블로그·유튜브·뉴스레터를 운영해 트래픽을 수익으로 바꾸는 모델."; },
      ai: function (k) { return "AI로 " + k + " 관련 글·대본·썸네일을 대량 생성하고, 키워드를 분석해 잘 팔리는 주제를 선별합니다."; },
      money: "광고(애드센스)·제휴 마케팅·협찬·자체 디지털 상품 판매",
      steps: function (k) { return ["'" + k + "' 세부 키워드 20개를 AI로 뽑아 콘텐츠 목록 만들기", "주 3회 발행으로 3개월간 축적", "트래픽이 모이면 광고·제휴 링크 붙이기"]; },
      budget: { none: 3, low: 3, mid: 2 }, time: { low: 1, mid: 3, high: 3 }, diff: 2, span: "3~6개월"
    },
    {
      name: function (k) { return k + " 자동화 마이크로 툴"; },
      one: function (k) { return "‘" + k + "’ 사용자가 반복하는 작업을 대신 해주는 작은 웹 도구를 만들어 유료로 파는 모델."; },
      ai: function (k) { return "AI가 " + k + " 데이터를 처리·요약·생성하는 핵심 기능을 담당하고, 나머지는 간단한 웹 화면으로 감쌉니다."; },
      money: "월 구독(SaaS)·건당 과금·프리미엄 기능 유료화",
      steps: function (k) { return ["'" + k + "'에서 가장 귀찮은 반복 작업 1개 정하기", "AI API로 그 작업만 처리하는 MVP 만들기", "커뮤니티에 무료로 풀고 유료 기능 추가"]; },
      budget: { none: 2, low: 3, mid: 3 }, time: { low: 1, mid: 2, high: 3 }, diff: 4, span: "2~4개월"
    },
    {
      name: function (k) { return k + " 디지털 상품 판매"; },
      one: function (k) { return "‘" + k + "’ 관련 템플릿·전자책·프롬프트팩 등 한 번 만들어 계속 파는 디지털 상품 모델."; },
      ai: function (k) { return "AI로 " + k + " 전자책 초안, 노션/엑셀 템플릿, 이미지 등을 빠르게 제작해 제작 시간을 단축합니다."; },
      money: "크몽·탈잉·자체 스토어에서 건별 판매 (재고 없음, 마진 높음)",
      steps: function (k) { return ["'" + k + "' 초보자가 겪는 문제 1개를 해결하는 상품 기획", "AI로 상품(전자책/템플릿) 제작", "스마트스토어·크몽에 등록하고 후기 모으기"]; },
      budget: { none: 3, low: 3, mid: 2 }, time: { low: 3, mid: 3, high: 2 }, diff: 2, span: "1~2개월"
    },
    {
      name: function (k) { return k + " AI 대행 서비스"; },
      one: function (k) { return "‘" + k + "’ 업종 사장님 대신 콘텐츠·마케팅·CS를 AI로 처리해 주는 대행 서비스 모델."; },
      ai: function (k) { return "AI가 " + k + " 매장의 블로그·인스타 글, 리뷰 답변, 고객 문의 응대를 자동 생성합니다."; },
      money: "월 대행 요금(리테이너)·건당 제작비",
      steps: function (k) { return ["동네 '" + k + "' 사장님 3명에게 무료 샘플 제안", "AI 자동화로 결과물 납품하며 후기 확보", "월 정액 대행으로 전환"]; },
      budget: { none: 3, low: 2, mid: 2 }, time: { low: 2, mid: 3, high: 3 }, diff: 3, span: "1~3개월"
    },
    {
      name: function (k) { return k + " 큐레이션 스마트스토어"; },
      one: function (k) { return "‘" + k + "’ 분야에서 잘 팔리는 상품을 골라 소싱·판매하는 온라인 커머스 모델."; },
      ai: function (k) { return "AI로 " + k + " 트렌드와 경쟁 상품을 분석하고, 상세페이지 문구·상품명을 자동 작성합니다."; },
      money: "상품 판매 마진·위탁판매(드롭십)",
      steps: function (k) { return ["AI로 '" + k + "' 급상승 상품 리서치", "위탁/사입으로 5개 상품 등록", "잘 나가는 상품에 광고 태워 확장"]; },
      budget: { none: 1, low: 3, mid: 3 }, time: { low: 2, mid: 3, high: 3 }, diff: 3, span: "2~4개월"
    },
    {
      name: function (k) { return k + " 온라인 클래스·코칭"; },
      one: function (k) { return "‘" + k + "’ 지식을 강의·코칭으로 판매하는 지식 창업 모델."; },
      ai: function (k) { return "AI로 " + k + " 커리큘럼·강의자료·워크북을 제작하고, 자주 묻는 질문 답변을 자동화합니다."; },
      money: "강의 판매·1:1 코칭·멤버십",
      steps: function (k) { return ["'" + k + "' 초보가 원하는 결과 1개 정의", "AI로 4주 커리큘럼과 자료 제작", "소수 베타 수강생으로 검증 후 오픈"]; },
      budget: { none: 3, low: 3, mid: 2 }, time: { low: 2, mid: 3, high: 3 }, diff: 2, span: "1~3개월"
    },
    {
      name: function (k) { return k + " 유료 뉴스레터·멤버십"; },
      one: function (k) { return "‘" + k + "’ 관심층을 모아 고급 정보·커뮤니티를 유료로 제공하는 구독 모델."; },
      ai: function (k) { return "AI로 " + k + " 최신 소식을 매주 요약·큐레이션해 발송 부담을 줄입니다."; },
      money: "유료 구독(월정액)·스폰서십",
      steps: function (k) { return ["'" + k + "' 무료 뉴스레터로 구독자 1,000명 모으기", "AI 큐레이션으로 발송 자동화", "고급 콘텐츠를 유료 멤버십으로 분리"]; },
      budget: { none: 3, low: 2, mid: 2 }, time: { low: 2, mid: 3, high: 2 }, diff: 3, span: "4~8개월"
    }
  ];

  var form = document.getElementById("ideaForm");
  var kwInput = document.getElementById("kw");
  var results = document.getElementById("results");
  var chipsBox = document.getElementById("chips");

  // 추천 키워드 칩
  SUGGEST.forEach(function (s) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = "#" + s;
    b.addEventListener("click", function () { kwInput.value = s; kwInput.focus(); });
    chipsBox.appendChild(b);
  });

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function stars(n) { return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n); }

  function pick(kw, budget, time) {
    // 예산·시간 적합도로 점수 매겨 상위에서 3개를 확률적으로 선택
    var scored = ARCHETYPES.map(function (a) {
      var score = (a.budget[budget] || 1) + (a.time[time] || 1) + Math.random() * 2;
      return { a: a, score: score };
    }).sort(function (x, y) { return y.score - x.score; });
    return scored.slice(0, 3).map(function (o) { return o.a; });
  }

  function render(kw, list) {
    results.innerHTML = "";
    list.forEach(function (a, i) {
      var title = a.name(kw);
      var mail = "mailto:midas6971@gmail.com?subject=" +
        encodeURIComponent("[아이디어 상담] " + title) +
        "&body=" + encodeURIComponent("AI공장 아이디어 생성기에서 나온 아이디어로 상담을 요청합니다.\n\n· 아이디어: " + title + "\n· 관심 분야: " + kw + "\n· 문의 내용: ");
      var steps = a.steps(kw).map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("");
      var el = document.createElement("article");
      el.className = "idea";
      el.style.animationDelay = (i * 0.08) + "s";
      el.innerHTML =
        '<h3>' + esc(title) + '</h3>' +
        '<p class="oneliner">' + esc(a.one(kw)) + '</p>' +
        '<div class="meta">' +
          '<span class="pill diff">난이도 ' + stars(a.diff) + '</span>' +
          '<span class="pill">예상 수익화 ' + esc(a.span) + '</span>' +
        '</div>' +
        '<div class="block"><b>AI 활용법</b><p>' + esc(a.ai(kw)) + '</p></div>' +
        '<div class="block"><b>수익 모델</b><p>' + esc(a.money) + '</p></div>' +
        '<div class="block"><b>시작 3스텝</b><ol>' + steps + '</ol></div>' +
        '<div class="idea-cta">' +
          '<a class="btn btn-primary btn-sm" href="' + mail + '">이 아이디어로 상담받기</a>' +
          '<button type="button" class="btn btn-ghost btn-sm js-copy" data-title="' + esc(title) + '">아이디어 복사</button>' +
        '</div>';
      results.appendChild(el);
    });

    // 복사 버튼
    results.querySelectorAll(".js-copy").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var t = btn.getAttribute("data-title");
        if (navigator.clipboard) {
          navigator.clipboard.writeText(t + " — AI공장 아이디어 생성기").then(function () {
            var o = btn.textContent; btn.textContent = "복사됨 ✓";
            setTimeout(function () { btn.textContent = o; }, 1500);
          });
        }
      });
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var kw = (kwInput.value || "").trim();
    if (!kw) { kw = SUGGEST[Math.floor(Math.random() * SUGGEST.length)]; kwInput.value = kw; }
    var budget = document.getElementById("budget").value;
    var time = document.getElementById("time").value;
    render(kw, pick(kw, budget, time));
    results.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
