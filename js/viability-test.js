/* AI공장 — 사업성 자가진단 테스트 (클라이언트 사이드) */
(function () {
  "use strict";

  // dim: market(시장성) / profit(수익성) / exec(실행 용이성) / ai(AI 적합성)
  var QUESTIONS = [
    { dim: "market", q: "목표 고객(누가 살지)이 얼마나 명확한가요?", opts: [["아주 명확하다", 3], ["어느 정도 그려진다", 2], ["아직 막연하다", 0]] },
    { dim: "market", q: "그 고객에게 이건 얼마나 절실한 문제인가요?", opts: [["매우 절실하다", 3], ["어느 정도 필요하다", 2], ["있으면 좋은 정도", 0]] },
    { dim: "market", q: "비슷한 서비스가 시장에 이미 있나요?", opts: [["많다 (수요 검증됨)", 3], ["조금 있다", 2], ["전혀 없다 (미검증)", 1]] },
    { dim: "profit", q: "고객이 기꺼이 돈을 낼까요?", opts: [["바로 낸다", 3], ["고민 후 낸다", 2], ["무료여야 쓴다", 0]] },
    { dim: "profit", q: "반복 구매·구독이 가능한 모델인가요?", opts: [["반복 결제된다", 3], ["가끔 재구매", 1], ["1회성", 0]] },
    { dim: "profit", q: "남는 이익(마진)이 큰 편인가요?", opts: [["크다", 3], ["보통", 2], ["작다", 1]] },
    { dim: "exec", q: "초기 자본이 얼마나 필요한가요?", opts: [["거의 없음", 3], ["소자본", 2], ["큰 자본 필요", 0]] },
    { dim: "exec", q: "첫 매출까지 예상 기간은?", opts: [["1개월 이내", 3], ["3개월 내외", 2], ["6개월 이상", 0]] },
    { dim: "exec", q: "본인이 이 분야를 잘 아나요?", opts: [["잘 안다", 3], ["조금 안다", 2], ["잘 모른다", 0]] },
    { dim: "ai", q: "AI로 자동화할 여지가 많은가요?", opts: [["많다", 3], ["보통", 2], ["적다", 0]] },
    { dim: "ai", q: "콘텐츠·데이터를 반복 생성하는 일이 있나요?", opts: [["많다", 3], ["조금 있다", 2], ["거의 없다", 0]] }
  ];

  var DIM_LABEL = { market: "시장성", profit: "수익성", exec: "실행 용이성", ai: "AI 적합성" };
  var DIM_TIP = {
    market: "목표 고객과 그들의 '절실한 문제'부터 한 문장으로 정의해 보세요. 고객이 흐릿하면 마케팅 비용이 급증합니다.",
    profit: "‘돈을 내는 순간’을 설계하세요. 반복 결제(구독)나 높은 마진 상품을 붙이면 수익성이 크게 올라갑니다.",
    exec: "초기 자본과 첫 매출 시점을 줄이는 게 핵심입니다. 작게 시작해 3개월 안에 첫 매출을 목표로 하세요.",
    ai: "반복 작업을 AI로 자동화하면 인건비가 줄고 마진이 오릅니다. 자동화 가능한 업무를 목록으로 뽑아 보세요."
  };

  var form = document.getElementById("vForm");
  var resultBox = document.getElementById("vResult");

  // 문항 렌더
  QUESTIONS.forEach(function (item, qi) {
    var wrap = document.createElement("div");
    wrap.className = "q";
    var opts = item.opts.map(function (o, oi) {
      var id = "q" + qi + "_" + oi;
      return '<label class="opt"><input type="radio" name="q' + qi + '" value="' + o[1] + '" id="' + id + '"' + (oi === 0 ? "" : "") + '><span>' + o[0] + '</span></label>';
    }).join("");
    wrap.innerHTML = '<div class="q-head"><span class="q-num">' + (qi + 1) + '</span><span class="q-dim">' + DIM_LABEL[item.dim] + '</span></div>' +
      '<p class="q-text">' + item.q + '</p><div class="opts">' + opts + '</div>';
    form.insertBefore(wrap, form.querySelector(".v-submit"));
  });

  function grade(score) {
    if (score >= 80) return { g: "A", label: "매우 유망", color: "#17b26a", msg: "지금 바로 실행해 볼 만한 사업입니다. 속도가 관건이에요." };
    if (score >= 65) return { g: "B", label: "유망", color: "#2b4eff", msg: "충분히 가능성이 있습니다. 약한 부분만 보완하면 좋아요." };
    if (score >= 50) return { g: "C", label: "보완 필요", color: "#f79009", msg: "가능성은 있지만 리스크가 있습니다. 아래 취약 항목을 먼저 다듬으세요." };
    return { g: "D", label: "재검토 권장", color: "#e5484d", msg: "지금 형태로는 리스크가 큽니다. 아이템을 다시 좁히거나 방향을 바꿔 보세요." };
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var sums = { market: 0, profit: 0, exec: 0, ai: 0 };
    var maxes = { market: 0, profit: 0, exec: 0, ai: 0 };
    var answered = 0;
    QUESTIONS.forEach(function (item, qi) {
      var max = Math.max.apply(null, item.opts.map(function (o) { return o[1]; }));
      maxes[item.dim] += max;
      var sel = form.querySelector('input[name="q' + qi + '"]:checked');
      if (sel) { sums[item.dim] += parseInt(sel.value, 10); answered++; }
    });

    if (answered < QUESTIONS.length) {
      alert("모든 문항에 답해 주세요. (" + answered + "/" + QUESTIONS.length + ")");
      return;
    }

    var dims = ["market", "profit", "exec", "ai"];
    var per = {};
    dims.forEach(function (d) { per[d] = Math.round(sums[d] / maxes[d] * 25); });
    var total = per.market + per.profit + per.exec + per.ai;
    var g = grade(total);

    // 취약 항목
    var weakest = dims.slice().sort(function (a, b) { return (per[a] / 25) - (per[b] / 25); })[0];

    var bars = dims.map(function (d) {
      var pct = Math.round(per[d] / 25 * 100);
      return '<div class="v-bar"><span class="v-bar-l">' + DIM_LABEL[d] + '</span>' +
        '<span class="v-bar-track"><i style="width:' + pct + '%"></i></span>' +
        '<span class="v-bar-v">' + per[d] + '/25</span></div>';
    }).join("");

    resultBox.innerHTML =
      '<div class="v-score-card">' +
        '<div class="v-grade" style="background:' + g.color + '">' + g.g + '</div>' +
        '<div class="v-score-main">' +
          '<div class="v-score-num">' + total + '<small>/100</small></div>' +
          '<div class="v-score-label">' + g.label + '</div>' +
        '</div>' +
      '</div>' +
      '<p class="v-msg">' + g.msg + '</p>' +
      '<div class="v-bars">' + bars + '</div>' +
      '<div class="v-tip"><b>가장 약한 항목: ' + DIM_LABEL[weakest] + '</b><p>' + DIM_TIP[weakest] + '</p></div>' +
      '<div class="v-cta">' +
        '<a class="btn btn-primary" href="mailto:midas6971@gmail.com?subject=' + encodeURIComponent("[사업성 진단] 결과 상담 (" + total + "점 · " + g.g + "등급)") + '&body=' + encodeURIComponent("사업성 자가진단 결과로 상담을 요청합니다.\n\n· 종합: " + total + "/100 (" + g.g + "등급)\n· 시장성 " + per.market + " · 수익성 " + per.profit + " · 실행 " + per.exec + " · AI " + per.ai + "\n· 문의 내용: ") + '">이 결과로 상담받기</a>' +
        '<a class="btn btn-ghost" href="idea-generator.html">아이디어 다시 찾기</a>' +
      '</div>';
    resultBox.hidden = false;
    resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
