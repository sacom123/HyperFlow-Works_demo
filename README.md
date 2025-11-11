# Hyperflow Works

[English](#english) | [한국어](#korean)

---

## English

Hyperflow Works is a modern web application built with React 18, Koa.js, and Ant Design, designed based on Figma designs. The project uses Vite for building, Vitest for testing, and is deployed to GCP Cloud Run via GitLab CI/CD with webhook support.

### Tech Stack

#### Frontend
- **React 18** - Latest React version
- **Vite** - Fast build tool
- **Ant Design** - UI component library
- **TypeScript** - Type safety
- **Vitest** - Testing framework
- **React Router** - Routing
- **i18next** - Internationalization

#### Backend
- **Node.js** - Runtime environment
- **Koa.js** - Web framework
- **TypeScript** - Type safety
- **Vitest** - Testing framework

#### Deployment & CI/CD
- **GCP Cloud Run** - Serverless container platform
- **GitLab CI/CD** - Automated deployment pipeline with webhook support
- **GitHub Actions** - CI/CD workflow (optional)
- **Docker** - Containerization
- **Google Container Registry (GCR)** - Container image registry

### Project Structure

```
hyperflow-works/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── Home.tsx        # Landing page
│   │   │   ├── Login.tsx       # Login page
│   │   │   ├── Dashboard.tsx   # Dashboard page
│   │   │   ├── HyperAgents.tsx # Hyper Agents page
│   │   │   ├── Library.tsx     # Library page
│   │   │   └── KnowledgeBase.tsx # Knowledge Base page
│   │   ├── components/         # Reusable components
│   │   │   ├── AppHeader.tsx   # Application header
│   │   │   ├── AppSider.tsx    # Sidebar component
│   │   │   ├── LanguageSelector.tsx # Language selector
│   │   │   ├── PricingModal.tsx # Pricing modal
│   │   │   └── SettingsModal.tsx # Settings modal
│   │   ├── services/           # API services
│   │   │   └── api.ts          # API client
│   │   ├── utils/              # Utility functions
│   │   │   └── api.ts          # API utilities
│   │   ├── i18n/               # Internationalization
│   │   │   ├── config.ts       # i18n configuration
│   │   │   └── locales/        # Translation files
│   │   ├── assets/             # Static assets
│   │   │   └── images/         # Image assets
│   │   ├── types/              # TypeScript types
│   │   │   └── index.ts        # Type definitions
│   │   ├── test/               # Test setup
│   │   │   └── setup.ts        # Test configuration
│   │   ├── App.tsx             # Main app component
│   │   ├── App.css             # App styles
│   │   ├── main.tsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── public/                 # Public static files
│   │   └── images/             # Public images
│   ├── scripts/                # Build scripts
│   │   └── convert-to-avif.mjs # Image conversion script
│   ├── index.html              # HTML template
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.ts          # Vite configuration
│   ├── tsconfig.json           # TypeScript configuration
│   └── vitest.config.ts        # Vitest configuration (in vite.config.ts)
│
├── backend/                     # Koa.js backend application
│   ├── src/
│   │   ├── routes/             # Route definitions
│   │   │   └── index.ts        # API routes
│   │   ├── middleware/         # Middleware
│   │   │   ├── errorHandler.ts # Error handling middleware
│   │   │   └── logger.ts       # Logging middleware
│   │   ├── index.ts            # Application entry point
│   │   └── index.test.ts       # Backend tests
│   ├── package.json            # Backend dependencies
│   ├── tsconfig.json           # TypeScript configuration
│   └── vitest.config.ts        # Vitest configuration
│
├── .gitlab-ci.yml              # GitLab CI/CD configuration
├── .github/workflows/          # GitHub Actions workflows
│   └── sync-to-gitlab.yml     # GitHub to GitLab sync workflow
├── cloudbuild.yaml             # GCP Cloud Build configuration
├── Dockerfile                  # Docker configuration
├── DEPLOYMENT.md               # Deployment guide
├── package.json                # Root package.json (pnpm workspace)
├── pnpm-lock.yaml              # pnpm lock file
├── pnpm-workspace.yaml         # pnpm workspace configuration
└── README.md                   # This file
```

### Prerequisites

- **Node.js** 18.x or higher
- **pnpm** 10.10.0 or higher
- **Git** for version control

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd hyperflow-works
```

2. **Install dependencies**

```bash
pnpm install
```

This will install all dependencies for both frontend and backend using pnpm workspace.

### Usage

#### Development

Run both frontend and backend in development mode:

```bash
pnpm dev
```

This will start:
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:3000 (Koa.js server)

#### Build

Build both frontend and backend for production:

```bash
pnpm build
```

Built files will be generated in:
- `frontend/dist/` - Frontend build output (Vite)
- `backend/dist/` - Backend build output (TypeScript)

#### Testing

Run all tests using Vitest:

```bash
# Run all tests
pnpm test

# Run frontend tests only
pnpm --filter frontend test

# Run backend tests only
pnpm --filter backend test

# Run tests with UI
pnpm --filter frontend test:ui
pnpm --filter backend test:ui

# Run tests with coverage
pnpm --filter frontend test:coverage
pnpm --filter backend test:coverage
```

#### Linting

Run ESLint to check code quality:

```bash
# Lint all projects
pnpm lint

# Lint frontend only
pnpm --filter frontend lint

# Lint backend only
pnpm --filter backend lint
```

### Deployment

#### GCP Cloud Run Deployment via GitLab CI/CD

The project is configured to deploy automatically to GCP Cloud Run using GitLab CI/CD. The workflow supports automatic synchronization from GitHub to GitLab, which then triggers the CI/CD pipeline.

##### GitHub → GitLab Auto Sync

When you push code to GitHub, it automatically syncs to GitLab, which then triggers the CI/CD pipeline:

1. **Push to GitHub** → GitHub Actions syncs to GitLab
2. **GitLab receives sync** → GitLab CI/CD pipeline triggers
3. **Build & Test** → Frontend and backend are built and tested
4. **Deploy** → Application is deployed to GCP Cloud Run

##### Prerequisites

1. **GCP Account** with Cloud Run API enabled
2. **GitHub Secrets** configured:
   - `GITLAB_TOKEN` - GitLab Personal Access Token with `write_repository` scope
   - `GCP_SERVICE_ACCOUNT_KEY` - Base64 encoded GCP service account key JSON
   - `GCP_PROJECT_ID` - GCP project ID
   - `GCP_SERVICE_NAME` - Cloud Run service name
   - `GCP_REGION` - Cloud Run region (e.g., `asia-northeast3`)
3. **GitLab CI/CD Variables** configured (same as GitHub Secrets):
   - `GCP_SERVICE_ACCOUNT_KEY` - Base64 encoded GCP service account key JSON
   - `GCP_PROJECT_ID` - GCP project ID
   - `GCP_SERVICE_NAME` - Cloud Run service name
   - `GCP_REGION` - Cloud Run region (e.g., `asia-northeast3`)
   - `GCP_PROJECT_HASH` - Optional: Project hash for URL

##### GitHub Actions Setup

1. **Create GitLab Personal Access Token**
   - Go to https://gitlab.com/-/profile/personal_access_tokens
   - Create token with `write_repository` scope
   - Copy the token

2. **Add GitHub Secrets**
   - Go to GitHub repository → Settings → Secrets and variables → Actions
   - Add `GITLAB_TOKEN` with your GitLab Personal Access Token
   - Add GCP-related secrets (see Prerequisites)

##### CI/CD Pipeline

The GitLab CI/CD pipeline consists of three stages:

1. **Build Stage**
   - Builds frontend with Vite
   - Builds backend with TypeScript
   - Creates build artifacts

2. **Test Stage**
   - Runs Vitest tests for frontend
   - Runs Vitest tests for backend
   - Generates test coverage reports

3. **Deploy Stage**
   - Builds Docker image
   - Pushes image to Google Container Registry (GCR)
   - Deploys to Cloud Run
   - Only runs on main/master branch

##### Manual Deployment

You can also deploy manually using gcloud:

```bash
# Build Docker image
docker build -t gcr.io/PROJECT_ID/hyperflow-works:latest .

# Push to GCR
docker push gcr.io/PROJECT_ID/hyperflow-works:latest

# Deploy to Cloud Run
gcloud run deploy hyperflow-works \
  --image gcr.io/PROJECT_ID/hyperflow-works:latest \
  --platform managed \
  --region asia-northeast3 \
  --allow-unauthenticated \
  --port 3000
```

### Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
   - Click the "Fork" button on GitHub

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, maintainable code
   - Follow the existing code style
   - Add tests for new features
   - Update documentation if needed

4. **Run tests and linting**
   ```bash
   pnpm test
   pnpm lint
   ```

5. **Commit your changes**
   ```bash
   git commit -m "Add: your feature description"
   ```
   Follow conventional commit messages:
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for updates
   - `Refactor:` for refactoring
   - `Docs:` for documentation

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill in the PR description
   - Submit the PR

8. **Code Review**
   - Wait for maintainers to review your PR
   - Address any feedback or requested changes
   - Once approved, your PR will be merged

#### Coding Standards

- Use TypeScript for type safety
- Follow ESLint rules
- Write meaningful commit messages
- Add tests for new features
- Update documentation for user-facing changes
- Keep code DRY (Don't Repeat Yourself)
- Use meaningful variable and function names

#### Testing Guidelines

- Write unit tests for components and functions
- Write integration tests for API endpoints
- Aim for high test coverage
- Test edge cases and error scenarios

### Features

#### Frontend Features
- **Landing Page** - Hero section, features, LLM support, workflows
- **Login Page** - User authentication
- **Dashboard** - Main dashboard with sidebar navigation
- **Hyper Agents** - Agent management
- **Library** - Resource library
- **Knowledge Base** - Knowledge base management
- **Settings** - User settings and preferences
- **Multi-language Support** - i18n with 20+ languages
- **Responsive Design** - Mobile, tablet, and desktop support

#### Backend Features
- **REST API** - RESTful API endpoints
- **Error Handling** - Centralized error handling
- **Logging** - Request logging middleware
- **CORS** - Cross-origin resource sharing
- **Body Parsing** - JSON body parsing

### Environment Variables

#### Frontend
Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

#### Backend
Create a `.env` file in the `backend/` directory:

```env
PORT=3000
NODE_ENV=development
```

### Troubleshooting

#### Port Conflicts

If ports are already in use:
- **Frontend**: Change port in `frontend/vite.config.ts`
- **Backend**: Change `PORT` environment variable

#### Dependency Issues

```bash
# Remove node_modules and reinstall
rm -rf node_modules frontend/node_modules backend/node_modules
pnpm install
```

#### Build Issues

```bash
# Clear pnpm store and reinstall
rm -rf .pnpm-store
pnpm install
pnpm build
```

### License

MIT License

### Contact

For questions or issues, please create an issue on GitHub.

---

## Korean

Hyperflow Works는 Figma 디자인을 기반으로 구축된 React 18, Koa.js, Ant Design을 사용한 현대적인 웹 애플리케이션입니다. 프로젝트는 Vite로 빌드하고, Vitest로 테스트하며, GitLab CI/CD를 통해 GCP Cloud Run에 배포됩니다 (webhook 지원).

### 기술 스택

#### 프론트엔드
- **React 18** - 최신 React 버전
- **Vite** - 빠른 빌드 도구
- **Ant Design** - UI 컴포넌트 라이브러리
- **TypeScript** - 타입 안정성
- **Vitest** - 테스트 프레임워크
- **React Router** - 라우팅
- **i18next** - 국제화

#### 백엔드
- **Node.js** - 런타임 환경
- **Koa.js** - 웹 프레임워크
- **TypeScript** - 타입 안정성
- **Vitest** - 테스트 프레임워크

#### 배포 및 CI/CD
- **GCP Cloud Run** - 서버리스 컨테이너 플랫폼
- **GitLab CI/CD** - Webhook 지원 자동 배포 파이프라인
- **GitHub Actions** - CI/CD 워크플로우 (선택사항)
- **Docker** - 컨테이너화
- **Google Container Registry (GCR)** - 컨테이너 이미지 레지스트리

### 프로젝트 구조

```
hyperflow-works/
├── frontend/                    # React 프론트엔드 애플리케이션
│   ├── src/
│   │   ├── pages/              # 페이지 컴포넌트
│   │   │   ├── Home.tsx        # 랜딩 페이지
│   │   │   ├── Login.tsx       # 로그인 페이지
│   │   │   ├── Dashboard.tsx   # 대시보드 페이지
│   │   │   ├── HyperAgents.tsx # Hyper Agents 페이지
│   │   │   ├── Library.tsx     # 라이브러리 페이지
│   │   │   └── KnowledgeBase.tsx # 지식 베이스 페이지
│   │   ├── components/         # 재사용 가능한 컴포넌트
│   │   │   ├── AppHeader.tsx   # 애플리케이션 헤더
│   │   │   ├── AppSider.tsx    # 사이드바 컴포넌트
│   │   │   ├── LanguageSelector.tsx # 언어 선택기
│   │   │   ├── PricingModal.tsx # 가격 모달
│   │   │   └── SettingsModal.tsx # 설정 모달
│   │   ├── services/           # API 서비스
│   │   │   └── api.ts          # API 클라이언트
│   │   ├── utils/              # 유틸리티 함수
│   │   │   └── api.ts          # API 유틸리티
│   │   ├── i18n/               # 국제화
│   │   │   ├── config.ts       # i18n 설정
│   │   │   └── locales/        # 번역 파일
│   │   ├── assets/             # 정적 assets
│   │   │   └── images/         # 이미지 assets
│   │   ├── types/              # TypeScript 타입
│   │   │   └── index.ts        # 타입 정의
│   │   ├── test/               # 테스트 설정
│   │   │   └── setup.ts        # 테스트 구성
│   │   ├── App.tsx             # 메인 앱 컴포넌트
│   │   ├── App.css             # 앱 스타일
│   │   ├── main.tsx            # 진입점
│   │   └── index.css           # 전역 스타일
│   ├── public/                 # 공개 정적 파일
│   │   └── images/             # 공개 이미지
│   ├── scripts/                # 빌드 스크립트
│   │   └── convert-to-avif.mjs # 이미지 변환 스크립트
│   ├── index.html              # HTML 템플릿
│   ├── package.json            # 프론트엔드 의존성
│   ├── vite.config.ts          # Vite 설정
│   ├── tsconfig.json           # TypeScript 설정
│   └── vitest.config.ts        # Vitest 설정 (vite.config.ts에 포함)
│
├── backend/                     # Koa.js 백엔드 애플리케이션
│   ├── src/
│   │   ├── routes/             # 라우트 정의
│   │   │   └── index.ts        # API 라우트
│   │   ├── middleware/         # 미들웨어
│   │   │   ├── errorHandler.ts # 에러 처리 미들웨어
│   │   │   └── logger.ts       # 로깅 미들웨어
│   │   ├── index.ts            # 애플리케이션 진입점
│   │   └── index.test.ts       # 백엔드 테스트
│   ├── package.json            # 백엔드 의존성
│   ├── tsconfig.json           # TypeScript 설정
│   └── vitest.config.ts        # Vitest 설정
│
├── .gitlab-ci.yml              # GitLab CI/CD 설정
├── .github/workflows/          # GitHub Actions 워크플로우
│   └── sync-to-gitlab.yml     # GitHub to GitLab 동기화 워크플로우
├── cloudbuild.yaml             # GCP Cloud Build 설정
├── Dockerfile                  # Docker 설정
├── DEPLOYMENT.md               # 배포 가이드
├── package.json                # 루트 package.json (pnpm workspace)
├── pnpm-lock.yaml              # pnpm lock 파일
├── pnpm-workspace.yaml         # pnpm workspace 설정
└── README.md                   # 이 파일
```

### 사전 요구사항

- **Node.js** 18.x 이상
- **pnpm** 10.10.0 이상
- **Git** 버전 관리용

### 설치

1. **저장소 클론**

```bash
git clone <repository-url>
cd hyperflow-works
```

2. **의존성 설치**

```bash
pnpm install
```

이 명령어는 pnpm workspace를 사용하여 프론트엔드와 백엔드의 모든 의존성을 설치합니다.

### 사용 방법

#### 개발

프론트엔드와 백엔드를 개발 모드로 실행:

```bash
pnpm dev
```

다음이 시작됩니다:
- **프론트엔드**: http://localhost:5173 (Vite 개발 서버)
- **백엔드**: http://localhost:3000 (Koa.js 서버)

#### 빌드

프론트엔드와 백엔드를 프로덕션용으로 빌드:

```bash
pnpm build
```

빌드된 파일은 다음 위치에 생성됩니다:
- `frontend/dist/` - 프론트엔드 빌드 출력 (Vite)
- `backend/dist/` - 백엔드 빌드 출력 (TypeScript)

#### 테스트

Vitest를 사용하여 모든 테스트 실행:

```bash
# 모든 테스트 실행
pnpm test

# 프론트엔드 테스트만 실행
pnpm --filter frontend test

# 백엔드 테스트만 실행
pnpm --filter backend test

# UI와 함께 테스트 실행
pnpm --filter frontend test:ui
pnpm --filter backend test:ui

# 커버리지와 함께 테스트 실행
pnpm --filter frontend test:coverage
pnpm --filter backend test:coverage
```

#### 린팅

ESLint를 실행하여 코드 품질 확인:

```bash
# 모든 프로젝트 린트
pnpm lint

# 프론트엔드만 린트
pnpm --filter frontend lint

# 백엔드만 린트
pnpm --filter backend lint
```

### 배포

#### GitLab CI/CD를 통한 GCP Cloud Run 배포

프로젝트는 GitLab CI/CD를 사용하여 GCP Cloud Run에 자동으로 배포되도록 구성되어 있습니다. 워크플로우는 GitHub에서 GitLab로의 자동 동기화를 지원합니다.

##### GitHub → GitLab 자동 동기화

GitHub에 코드를 푸시하면 자동으로 GitLab에 동기화되고, 이는 CI/CD 파이프라인을 트리거합니다:

1. **GitHub에 푸시** → GitHub Actions가 GitLab에 동기화
2. **GitLab이 동기화 수신** → GitLab CI/CD 파이프라인 트리거
3. **빌드 & 테스트** → 프론트엔드와 백엔드 빌드 및 테스트
4. **배포** → 애플리케이션이 GCP Cloud Run에 배포

##### 사전 요구사항

1. **GCP 계정** 및 Cloud Run API 활성화
2. **GitHub Secrets** 설정:
   - `GITLAB_TOKEN` - `write_repository` 권한이 있는 GitLab Personal Access Token
   - `GCP_SERVICE_ACCOUNT_KEY` - Base64 인코딩된 GCP 서비스 계정 키 JSON
   - `GCP_PROJECT_ID` - GCP 프로젝트 ID
   - `GCP_SERVICE_NAME` - Cloud Run 서비스 이름
   - `GCP_REGION` - Cloud Run 리전 (예: `asia-northeast3`)
3. **GitLab CI/CD 변수** 설정 (GitHub Secrets와 동일):
   - `GCP_SERVICE_ACCOUNT_KEY` - Base64 인코딩된 GCP 서비스 계정 키 JSON
   - `GCP_PROJECT_ID` - GCP 프로젝트 ID
   - `GCP_SERVICE_NAME` - Cloud Run 서비스 이름
   - `GCP_REGION` - Cloud Run 리전 (예: `asia-northeast3`)
   - `GCP_PROJECT_HASH` - 선택사항: URL용 프로젝트 해시

##### GitHub Actions 설정

1. **GitLab Personal Access Token 생성**
   - https://gitlab.com/-/profile/personal_access_tokens 접속
   - `write_repository` 권한이 있는 토큰 생성
   - 토큰 복사

2. **GitHub Secrets 추가**
   - GitHub 저장소 → Settings → Secrets and variables → Actions
   - GitLab Personal Access Token으로 `GITLAB_TOKEN` 추가
   - GCP 관련 Secrets 추가 (사전 요구사항 참조)

##### CI/CD 파이프라인

GitLab CI/CD 파이프라인은 세 단계로 구성됩니다:

1. **빌드 단계**
   - Vite로 프론트엔드 빌드
   - TypeScript로 백엔드 빌드
   - 빌드 아티팩트 생성

2. **테스트 단계**
   - 프론트엔드 Vitest 테스트 실행
   - 백엔드 Vitest 테스트 실행
   - 테스트 커버리지 리포트 생성

3. **배포 단계**
   - Docker 이미지 빌드
   - Google Container Registry (GCR)에 이미지 푸시
   - Cloud Run에 배포
   - main/master 브랜치에서만 실행

##### 수동 배포

gcloud를 사용하여 수동으로 배포할 수도 있습니다:

```bash
# Docker 이미지 빌드
docker build -t gcr.io/PROJECT_ID/hyperflow-works:latest .

# GCR에 푸시
docker push gcr.io/PROJECT_ID/hyperflow-works:latest

# Cloud Run에 배포
gcloud run deploy hyperflow-works \
  --image gcr.io/PROJECT_ID/hyperflow-works:latest \
  --platform managed \
  --region asia-northeast3 \
  --allow-unauthenticated \
  --port 3000
```

### 기여하기

기여를 환영합니다! 다음 단계를 따라주세요:

1. **저장소 Fork**
   - GitHub에서 "Fork" 버튼 클릭

2. **기능 브랜치 생성**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **변경사항 작성**
   - 깨끗하고 유지보수가 가능한 코드 작성
   - 기존 코드 스타일 따르기
   - 새 기능에 대한 테스트 추가
   - 필요시 문서 업데이트

4. **테스트 및 린팅 실행**
   ```bash
   pnpm test
   pnpm lint
   ```

5. **변경사항 커밋**
   ```bash
   git commit -m "Add: your feature description"
   ```
   Conventional commit 메시지 따르기:
   - `Add:` 새 기능
   - `Fix:` 버그 수정
   - `Update:` 업데이트
   - `Refactor:` 리팩토링
   - `Docs:` 문서

6. **Fork에 푸시**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Pull Request 생성**
   - GitHub의 원본 저장소로 이동
   - "New Pull Request" 클릭
   - Fork 및 브랜치 선택
   - PR 설명 작성
   - PR 제출

8. **코드 리뷰**
   - 유지보수자가 PR을 리뷰할 때까지 대기
   - 피드백 또는 요청된 변경사항 처리
   - 승인되면 PR이 병합됨

#### 코딩 표준

- 타입 안정성을 위해 TypeScript 사용
- ESLint 규칙 따르기
- 의미 있는 커밋 메시지 작성
- 새 기능에 대한 테스트 추가
- 사용자 대상 변경사항에 대한 문서 업데이트
- 코드 DRY 유지 (Don't Repeat Yourself)
- 의미 있는 변수 및 함수 이름 사용

#### 테스트 가이드라인

- 컴포넌트 및 함수에 대한 단위 테스트 작성
- API 엔드포인트에 대한 통합 테스트 작성
- 높은 테스트 커버리지 목표
- 엣지 케이스 및 에러 시나리오 테스트

### 기능

#### 프론트엔드 기능
- **랜딩 페이지** - Hero 섹션, 기능, LLM 지원, 워크플로우
- **로그인 페이지** - 사용자 인증
- **대시보드** - 사이드바 네비게이션이 있는 메인 대시보드
- **Hyper Agents** - 에이전트 관리
- **라이브러리** - 리소스 라이브러리
- **지식 베이스** - 지식 베이스 관리
- **설정** - 사용자 설정 및 환경설정
- **다국어 지원** - 20개 이상의 언어로 i18n
- **반응형 디자인** - 모바일, 태블릿, 데스크톱 지원

#### 백엔드 기능
- **REST API** - RESTful API 엔드포인트
- **에러 처리** - 중앙화된 에러 처리
- **로깅** - 요청 로깅 미들웨어
- **CORS** - 교차 출처 리소스 공유
- **Body 파싱** - JSON body 파싱

### 환경 변수

#### 프론트엔드
`frontend/` 디렉토리에 `.env` 파일 생성:

```env
VITE_API_URL=http://localhost:3000/api
```

#### 백엔드
`backend/` 디렉토리에 `.env` 파일 생성:

```env
PORT=3000
NODE_ENV=development
```

### 문제 해결

#### 포트 충돌

포트가 이미 사용 중인 경우:
- **프론트엔드**: `frontend/vite.config.ts`에서 포트 변경
- **백엔드**: `PORT` 환경 변수 변경

#### 의존성 문제

```bash
# node_modules 제거 후 재설치
rm -rf node_modules frontend/node_modules backend/node_modules
pnpm install
```

#### 빌드 문제

```bash
# pnpm store 정리 후 재설치
rm -rf .pnpm-store
pnpm install
pnpm build
```

### 라이선스

MIT License

### 연락처

질문이나 이슈가 있으면 GitHub에서 이슈를 생성해주세요.
