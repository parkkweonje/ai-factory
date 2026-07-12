/* AI공장 — 토스페이먼츠 결제위젯 연동 (v2 표준)
   ⚠️ 현재는 토스 공식 '테스트 clientKey'로 동작합니다(테스트 모드).
   실결제 전환: 아래 CLIENT_KEY를 상점의 실제 키로 교체 + 결제 승인 서버(successUrl 처리) 연동 필요. */
(function () {
  "use strict";

  // 토스페이먼츠 문서용 테스트 클라이언트 키 (실결제 시 상점 키로 교체)
  var CLIENT_KEY = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

  // 상품 정보 (URL 파라미터로도 덮어쓸 수 있음: ?name=..&amount=..)
  var params = new URLSearchParams(location.search);
  var ORDER_NAME = params.get("name") || "꿈해몽 프리미엄 리포트";
  var AMOUNT = parseInt(params.get("amount"), 10) || 2900;

  var nameEl = document.getElementById("ck-name");
  var amtEl = document.getElementById("ck-amount");
  if (nameEl) nameEl.textContent = ORDER_NAME;
  if (amtEl) amtEl.textContent = AMOUNT.toLocaleString() + "원";

  var payBtn = document.getElementById("ck-pay");
  var statusEl = document.getElementById("ck-status");

  function setStatus(msg, err) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.color = err ? "#e5484d" : "";
  }

  if (typeof TossPayments === "undefined") {
    setStatus("토스 결제 모듈을 불러오지 못했습니다. 네트워크를 확인해 주세요.", true);
    if (payBtn) payBtn.disabled = true;
    return;
  }

  function orderId() {
    return "order_" + Date.now() + "_" + Math.floor(Math.random() * 1e6);
  }
  function baseUrl(file) {
    return location.origin + location.pathname.replace(/[^/]*$/, file);
  }

  (async function () {
    try {
      var tossPayments = TossPayments(CLIENT_KEY);
      var widgets = tossPayments.widgets({ customerKey: TossPayments.ANONYMOUS });
      await widgets.setAmount({ currency: "KRW", value: AMOUNT });
      await Promise.all([
        widgets.renderPaymentMethods({ selector: "#payment-method", variantKey: "DEFAULT" }),
        widgets.renderAgreement({ selector: "#agreement", variantKey: "AGREEMENT" })
      ]);

      if (payBtn) {
        payBtn.disabled = false;
        payBtn.addEventListener("click", async function () {
          setStatus("결제창을 여는 중…");
          try {
            await widgets.requestPayment({
              orderId: orderId(),
              orderName: ORDER_NAME,
              successUrl: baseUrl("payment-success.html"),
              failUrl: baseUrl("payment-fail.html"),
              customerName: "AI공장 고객"
            });
          } catch (e) {
            setStatus("결제가 취소되었거나 오류가 발생했습니다: " + (e && e.message ? e.message : e), true);
          }
        });
      }
      setStatus("");
    } catch (e) {
      setStatus("결제 위젯을 불러오지 못했습니다: " + (e && e.message ? e.message : e), true);
    }
  })();
})();
