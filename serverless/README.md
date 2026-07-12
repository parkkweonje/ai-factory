# 운세 에이전트 — LLM 자유대화 켜기 (5분)

에이전트를 "GPT처럼 자유 대화하는 AI"로 바꾸려면, API 키를 숨겨줄 **작은 서버(서버리스)** 하나가 필요합니다.
정적 사이트(GitHub Pages)에는 서버가 없어서, 무료로 쓸 수 있는 **Cloudflare Workers**를 씁니다.

## 1. 준비물
- Cloudflare 계정 (무료)
- Anthropic API 키 (console.anthropic.com 에서 발급) — 또는 OpenAI 등 다른 제공자

## 2. 배포
```bash
# Cloudflare CLI 설치
npm install -g wrangler
wrangler login

# 이 폴더에서 워커 생성 후 llm-worker.js 내용을 붙여넣기
# (또는 Cloudflare 대시보드 → Workers & Pages → Create → Worker 에 코드 붙여넣기)

# API 키를 '시크릿'으로 안전하게 등록 (코드에 직접 넣지 마세요)
wrangler secret put ANTHROPIC_API_KEY
# 프롬프트에 키 붙여넣기

# 배포
wrangler deploy
```
배포가 끝나면 `https://<이름>.<계정>.workers.dev` 같은 **URL**이 나옵니다.

## 3. 프런트에 연결
`js/agent.js` 파일 맨 위:
```js
var LLM_ENDPOINT = ""; //  ← 여기에 위 워커 URL을 넣으세요
```
예:
```js
var LLM_ENDPOINT = "https://ai-factory-fortune.myname.workers.dev";
```
저장하고 push 하면, 에이전트에 **🤖 AI 자유상담** 이 실제로 작동합니다.

## 참고
- 모델은 `llm-worker.js`의 `model` 값에서 바꿀 수 있습니다 (기본: 빠르고 저렴한 `claude-haiku-4-5`).
- 비용은 Anthropic 사용량만큼 과금됩니다 (대화당 소액).
- OpenAI 등 다른 제공자를 쓰려면 `fetch` 대상 URL·헤더·본문 형식만 해당 API에 맞게 바꾸면 됩니다.
