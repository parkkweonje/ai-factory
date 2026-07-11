# AI공장 (AI Factory)

> AI로 돈 버는 회사 — 창업 아이디어 발굴부터 유행 사업 벤치마킹, AI 수익화 자동화까지.

회사 소개용 정적 랜딩 페이지입니다. HTML / CSS / JavaScript 만으로 만들어졌고, 별도의 빌드 과정 없이 그대로 배포됩니다.

## 구성

```
company-website/
├── index.html        # 랜딩 페이지 (Hero · 서비스 · 진행방식 · 회사소개 · 문의)
├── css/
│   └── style.css     # 전체 스타일 (반응형)
├── js/
│   └── main.js       # 메뉴 토글 · 스크롤 애니메이션 · 카운트업
├── .nojekyll         # GitHub Pages에서 정적 파일 원본 그대로 서빙
└── README.md
```

## 로컬에서 보기

빌드가 필요 없습니다. 파일을 브라우저로 바로 열거나, 간단한 서버로 확인하세요.

```bash
# 방법 1: 파일 직접 열기
open index.html          # macOS

# 방법 2: 로컬 서버 (Python 3)
python3 -m http.server 8000
# 브라우저에서 http://localhost:8000 접속
```

## 배포 (GitHub Pages)

1. GitHub 저장소 → **Settings → Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `main` / `/ (root)` 선택 후 Save
4. 잠시 후 `https://<사용자명>.github.io/company-website/` 로 접속

## 수정 가이드

| 바꾸고 싶은 것 | 위치 |
|---|---|
| 회사명 · 문구 | `index.html` |
| 색상 · 폰트 · 여백 | `css/style.css` 상단 `:root` 변수 |
| 서비스 항목 | `index.html`의 `#services` 섹션 |
| 연락처 (이메일/전화) | `index.html`의 `#contact`, `footer` |

## 연락처

- 이메일: midas6971@gmail.com
- 전화: 010-3250-6878

---
© 2026 AI공장 (AI Factory). All rights reserved.
