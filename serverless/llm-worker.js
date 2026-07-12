/**
 * AI공장 — 운세 에이전트 LLM 백엔드 (Cloudflare Workers)
 *
 * 이 워커는 API 키를 서버에 안전하게 보관하고, 프런트(agent.js)의 요청을 받아
 * Anthropic Claude API를 호출한 뒤 답변만 돌려줍니다.
 * (API 키는 절대 프런트엔드에 두면 안 됩니다 — 그래서 이 서버가 필요합니다.)
 *
 * 배포 방법은 같은 폴더의 README.md 참고.
 */

const SYSTEM_PROMPT =
  "당신은 'AI공장'의 친근한 운세 상담 에이전트입니다. 사주·타로·꿈해몽·궁합 등 운세 주제를 " +
  "재미있고 따뜻하게 상담합니다. 단정적인 예언이나 의료·투자·법률 조언은 피하고, " +
  "'재미로 보는 참고'라는 점을 자연스럽게 전제하세요. 한국어로 2~4문장, 간결하고 다정하게 답하세요.";

export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST")
      return new Response("Method Not Allowed", { status: 405, headers: cors });

    try {
      const body = await request.json();
      const message = String(body.message || "").slice(0, 2000);
      if (!message) return json({ reply: "메시지를 입력해 주세요." }, cors);

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY, // wrangler secret 로 등록
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 400,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: message }],
        }),
      });

      const data = await res.json();
      const reply =
        (data && data.content && data.content[0] && data.content[0].text) ||
        "죄송해요, 지금은 답변을 못 드렸어요.";
      return json({ reply }, cors);
    } catch (e) {
      return json({ reply: "오류가 발생했어요: " + (e && e.message ? e.message : e) }, cors);
    }
  },
};

function json(obj, cors) {
  return new Response(JSON.stringify(obj), {
    headers: { ...cors, "content-type": "application/json" },
  });
}
