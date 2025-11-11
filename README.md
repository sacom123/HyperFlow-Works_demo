# Hyperflow Works

[English](#english) | [한국어](#korean)

---

## English

### Hyperflow Works deployment on GCP Cloud Run

Hyperflow Works is a modern web application built with React 18, Koa.js, and Ant Design, designed based on Figma designs. The application is deployed to Google Cloud Platform (GCP) Cloud Run using GitLab CI/CD with Workload Identity Federation (WIF) for secure authentication.

This README documents the project structure, deployment architecture, CI/CD pipeline, installation details, and operational procedures.

**Table of Contents:**
- [Hyperflow Works Components](#hyperflow-works-components)
- [Deployment Architecture](#deployment-architecture)
- [Deployment Locations](#deployment-locations)
- [Server Components](#server-components)
- [Running the Application](#running-the-application)
- [CI/CD Pipeline](#cicd-pipeline)
- [Installation Details](#installation-details)
- [Access and URLs](#access-and-urls)
- [Development Workflow](#development-workflow)

---

### Hyperflow Works Components

The following components are deployed and running on GCP Cloud Run:

#### Web Applications

- **Main Application** - The primary Hyperflow Works web application
  - Frontend: React 18 with Vite build system
  - Backend: Koa.js REST API server
  - UI Framework: Ant Design component library
  - Internationalization: i18next with 20+ language support
  - Deployed on: GCP Cloud Run (serverless container platform)

#### Services

- **Frontend Application Server** (Node.js/Koa.js based)
  - Serves React application built with Vite
  - Handles static file serving in production
  - Port: 3000 (configurable via `PORT` environment variable)
  - Runs in a single container serving both frontend and backend

- **Backend API Server** (Node.js/Koa.js based)
  - RESTful API endpoints
  - Error handling middleware
  - Request logging middleware
  - CORS support
  - JSON body parsing

#### Infrastructure Components

- **GCP Cloud Run** - Serverless container platform hosting the application
- **Artifact Registry** - Docker image registry for container images
- **GitLab CI/CD** - Automated build and deployment pipeline
- **GitHub Actions** - Code synchronization from GitHub to GitLab
- **Workload Identity Federation (WIF)** - Secure authentication without service account keys

---

### Deployment Architecture

#### CI/CD Flow

```
GitHub Repository
    ↓ (Push to main/master)
GitHub Actions (sync-to-gitlab.yml)
    ↓ (Auto-sync)
GitLab Repository
    ↓ (Triggers pipeline)
GitLab CI/CD Pipeline (.gitlab-ci.yml)
    ↓
Stage 1: Auth (WIF Authentication)
    ↓
Stage 2: Build (Cloud Build)
    ↓
Stage 3: Deploy (Cloud Run)
    ↓
GCP Cloud Run Service
```

#### Authentication Method

The deployment uses **Workload Identity Federation (WIF)** instead of service account keys:

1. **GitLab OIDC Token** → Exchanged for GCP credentials via WIF
2. **No service account keys** stored in GitLab variables
3. **Secure authentication** using OIDC tokens from GitLab CI/CD

#### Container Architecture

- **Single Container Deployment**: Both frontend and backend run in one container
- **Frontend**: Served as static files by the backend server
- **Backend**: Koa.js server that serves both API routes and static frontend files
- **Port**: 3000 (exposed to Cloud Run)

---

### Deployment Locations

#### GCP Resources

- **Project ID**: `hyperflow-works-hong`
- **Project Number**: `818668788313`
- **Region**: `asia-northeast3` (Seoul, South Korea)
- **Cloud Run Service**: `hyperflow-works`
- **Artifact Registry Repository**: `hyperflow-works-repo`
- **Workload Identity Pool**: `gitlab-pool`
- **Workload Identity Provider**: `gitlab-provider`

#### Repository Locations

- **GitHub Repository**: `https://github.com/sacom123/HyperFlow-Works_demo`
- **GitLab Repository**: `https://gitlab.com/seonhohong/hyperflow-works-demohong`

#### Service URLs

- **Production URL**: `https://hyperflow-works-<hash>-<region>.a.run.app`
  - URL is generated automatically by Cloud Run
  - Check GitLab pipeline logs or GCP Console for exact URL

---

### Server Components

#### Project Structure

```
hyperflow-works/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── Home.tsx        # Landing page with hero, features, LLM support
│   │   │   ├── Login.tsx       # User authentication page
│   │   │   ├── Dashboard.tsx   # Main dashboard with sidebar navigation
│   │   │   ├── HyperAgents.tsx # Hyper Agents management page
│   │   │   ├── Library.tsx     # Resource library page
│   │   │   └── KnowledgeBase.tsx # Knowledge base management page
│   │   ├── components/         # Reusable UI components
│   │   │   ├── AppHeader.tsx   # Application header with navigation
│   │   │   ├── AppSider.tsx    # Sidebar navigation component
│   │   │   ├── LanguageSelector.tsx # Multi-language selector
│   │   │   ├── PricingModal.tsx # Pricing information modal
│   │   │   └── SettingsModal.tsx # User settings modal
│   │   ├── services/           # API service layer
│   │   │   └── api.ts          # API client with axios
│   │   ├── utils/              # Utility functions
│   │   │   └── api.ts          # API helper utilities
│   │   ├── i18n/               # Internationalization
│   │   │   ├── config.ts       # i18n configuration
│   │   │   └── locales/        # Translation files (20+ languages)
│   │   ├── assets/             # Static assets
│   │   │   └── images/         # Image assets (AVIF format)
│   │   ├── types/              # TypeScript type definitions
│   │   │   └── index.ts        # Shared type definitions
│   │   ├── test/               # Test configuration
│   │   │   └── setup.ts        # Vitest test setup
│   │   ├── App.tsx             # Main application component
│   │   ├── App.css             # Application styles
│   │   ├── main.tsx            # Application entry point
│   │   └── index.css           # Global CSS styles
│   ├── public/                 # Public static files
│   │   └── images/             # Public images (AVIF/PNG)
│   ├── scripts/                # Build and utility scripts
│   │   └── convert-to-avif.mjs # Image conversion to AVIF format
│   ├── index.html              # HTML template
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.ts          # Vite build configuration
│   ├── tsconfig.json           # TypeScript configuration
│   └── vitest.config.ts        # Vitest test configuration
│
├── backend/                     # Koa.js backend application
│   ├── src/
│   │   ├── routes/             # API route definitions
│   │   │   └── index.ts        # Main API routes
│   │   ├── middleware/         # Koa middleware
│   │   │   ├── errorHandler.ts # Centralized error handling
│   │   │   └── logger.ts       # Request logging middleware
│   │   ├── index.ts            # Application entry point
│   │   │                        # - Starts Koa server
│   │   │                        # - Serves frontend static files in production
│   │   │                        # - Handles API routes
│   │   └── index.test.ts       # Backend unit tests
│   ├── package.json            # Backend dependencies
│   ├── tsconfig.json           # TypeScript configuration
│   └── vitest.config.ts        # Vitest test configuration
│
├── .gitlab-ci.yml              # GitLab CI/CD pipeline configuration
│                               # - Stage 1: Auth (WIF authentication)
│                               # - Stage 2: Build (Cloud Build)
│                               # - Stage 3: Deploy (Cloud Run)
├── .github/workflows/          # GitHub Actions workflows
│   ├── sync-to-gitlab.yml     # GitHub to GitLab auto-sync workflow
│   └── mirror-to-gitlab.yml   # Alternative mirror workflow
├── cloudbuild.yaml             # GCP Cloud Build configuration
├── Dockerfile                  # Multi-stage Docker build
│                               # - Builder stage: Install deps & build
│                               # - Production stage: Run application
├── setup-gitlab-gcp.sh        # GCP setup automation script
├── convert-images-to-avif.sh  # Image conversion utility
├── DEPLOYMENT.md              # Detailed deployment guide
├── WIF_SETUP_GUIDE.md         # Workload Identity Federation setup
├── WIF_QUICK_START.md         # Quick WIF setup reference
├── package.json                # Root package.json (pnpm workspace)
├── pnpm-lock.yaml              # pnpm lock file
├── pnpm-workspace.yaml         # pnpm workspace configuration
└── README.md                   # This file
```

#### Configuration Files

- **`.gitlab-ci.yml`**: GitLab CI/CD pipeline with 3 stages (auth, build, deploy)
- **`Dockerfile`**: Multi-stage Docker build for production
- **`cloudbuild.yaml`**: GCP Cloud Build configuration
- **`.github/workflows/sync-to-gitlab.yml`**: GitHub Actions workflow for auto-sync

---

### Running the Application

#### Local Development

**Prerequisites:**
- Node.js 18.x or higher
- pnpm 10.10.0 or higher
- Git for version control

**Installation:**

```bash
# Clone the repository
git clone https://github.com/sacom123/HyperFlow-Works_demo.git
cd hyperflow-works

# Install dependencies
pnpm install
```

**Development Mode:**

```bash
# Run both frontend and backend in development mode
pnpm dev
```

This starts:
- **Frontend**: http://localhost:5173 (Vite dev server with HMR)
- **Backend**: http://localhost:3000 (Koa.js server)

**Build for Production:**

```bash
# Build both frontend and backend
pnpm build
```

Built files:
- `frontend/dist/` - Frontend build output (Vite)
- `backend/dist/` - Backend build output (TypeScript)

**Testing:**

```bash
# Run all tests
pnpm test

# Run frontend tests only
pnpm --filter frontend test

# Run backend tests only
pnpm --filter backend test

# Run tests with coverage
pnpm --filter frontend test:coverage
pnpm --filter backend test:coverage
```

**Linting:**

```bash
# Lint all projects
pnpm lint

# Lint frontend only
pnpm --filter frontend lint

# Lint backend only
pnpm --filter backend lint
```

#### Production Deployment

The application is automatically deployed via GitLab CI/CD when code is pushed to the `main` or `master` branch.

**Manual Deployment (if needed):**

```bash
# Build Docker image
docker build -t asia-northeast3-docker.pkg.dev/hyperflow-works-hong/hyperflow-works-repo/hyperflow-works:latest .

# Push to Artifact Registry
docker push asia-northeast3-docker.pkg.dev/hyperflow-works-hong/hyperflow-works-repo/hyperflow-works:latest

# Deploy to Cloud Run
gcloud run deploy hyperflow-works \
  --image asia-northeast3-docker.pkg.dev/hyperflow-works-hong/hyperflow-works-repo/hyperflow-works:latest \
  --platform managed \
  --region asia-northeast3 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10
```

---

### CI/CD Pipeline

#### Pipeline Stages

The GitLab CI/CD pipeline consists of three stages:

1. **Auth Stage** (`auth`)
   - Authenticates with GCP using Workload Identity Federation
   - Exchanges GitLab OIDC token for GCP credentials
   - Sets GCP project configuration
   - **Image**: `gcr.io/google.com/cloudsdktool/cloud-sdk:slim`

2. **Build Stage** (`build`)
   - Uses GCP Cloud Build to build Docker image
   - Pushes image to Artifact Registry
   - **Image**: `gcr.io/google.com/cloudsdktool/cloud-sdk:slim`
   - **Depends on**: `auth` stage

3. **Deploy Stage** (`deploy`)
   - Deploys Docker image to Cloud Run
   - Configures Cloud Run service settings
   - Outputs service URL
   - **Image**: `gcr.io/google.com/cloudsdktool/cloud-sdk:slim`
   - **Depends on**: `build` stage
   - **Runs on**: `main` or `master` branch only

#### Required GitLab CI/CD Variables

Configure in GitLab: **Settings → CI/CD → Variables**

| Variable | Description | Example |
|----------|-------------|---------|
| `GCP_WIF_PROVIDER` | Workload Identity Provider path | `projects/818668788313/locations/global/workloadIdentityPools/gitlab-pool/providers/gitlab-provider` |
| `GCP_SERVICE_ACCOUNT` | Service account email | `hyperflow-works-sa@hyperflow-works-hong.iam.gserviceaccount.com` |
| `GCP_PROJECT_ID` | GCP project ID | `hyperflow-works-hong` |
| `GCP_REGION` | Cloud Run region | `asia-northeast3` |
| `GCP_AR_REPO` | Artifact Registry repository name | `hyperflow-works-repo` |
| `SERVICE_NAME` | Cloud Run service name (optional) | `hyperflow-works` |

#### GitHub Actions Workflow

**Workflow**: `.github/workflows/sync-to-gitlab.yml`

- **Trigger**: Push to `main` or `master` branch
- **Action**: Automatically syncs code to GitLab repository
- **Required Secret**: `GITLAB_TOKEN` (GitLab Personal Access Token with `write_repository` scope)

---

### Installation Details

#### GCP Setup

1. **Create GCP Project**
   ```bash
   gcloud projects create hyperflow-works-hong --name="Hyperflow Works"
   gcloud config set project hyperflow-works-hong
   ```

2. **Enable Required APIs**
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable artifactregistry.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable iamcredentials.googleapis.com
   gcloud services enable sts.googleapis.com
   ```

3. **Create Service Account**
   ```bash
   gcloud iam service-accounts create hyperflow-works-sa \
     --display-name="Hyperflow Works Service Account"
   ```

4. **Grant Permissions**
   ```bash
   PROJECT_ID="hyperflow-works-hong"
   SERVICE_ACCOUNT="hyperflow-works-sa@${PROJECT_ID}.iam.gserviceaccount.com"
   
   # Cloud Run permissions
   gcloud projects add-iam-policy-binding ${PROJECT_ID} \
     --member="serviceAccount:${SERVICE_ACCOUNT}" \
     --role="roles/run.admin"
   
   # Artifact Registry permissions
   gcloud projects add-iam-policy-binding ${PROJECT_ID} \
     --member="serviceAccount:${SERVICE_ACCOUNT}" \
     --role="roles/artifactregistry.writer"
   
   # Service Account User
   gcloud projects add-iam-policy-binding ${PROJECT_ID} \
     --member="serviceAccount:${SERVICE_ACCOUNT}" \
     --role="roles/iam.serviceAccountUser"
   ```

5. **Set Up Workload Identity Federation**
   ```bash
   PROJECT_ID="hyperflow-works-hong"
   PROJECT_NUMBER=$(gcloud projects describe ${PROJECT_ID} --format="value(projectNumber)")
   
   # Create Workload Identity Pool
   gcloud iam workload-identity-pools create gitlab-pool \
     --project=${PROJECT_ID} \
     --location="global" \
     --display-name="GitLab CI/CD Pool"
   
   # Create Workload Identity Provider
   gcloud iam workload-identity-pools providers create-oidc gitlab-provider \
     --project=${PROJECT_ID} \
     --location="global" \
     --workload-identity-pool="gitlab-pool" \
     --display-name="GitLab Provider" \
     --attribute-mapping="google.subject=assertion.sub,attribute.aud=assertion.aud,attribute.project_path=assertion.project_path" \
     --issuer-uri="https://gitlab.com"
   
   # Grant WIF permission to service account
   SERVICE_ACCOUNT="hyperflow-works-sa@${PROJECT_ID}.iam.gserviceaccount.com"
   gcloud iam service-accounts add-iam-policy-binding ${SERVICE_ACCOUNT} \
     --project=${PROJECT_ID} \
     --role="roles/iam.workloadIdentityUser" \
     --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/gitlab-pool/attribute.project_path/*"
   ```

6. **Create Artifact Registry Repository**
   ```bash
   gcloud artifacts repositories create hyperflow-works-repo \
     --repository-format=docker \
     --location=asia-northeast3 \
     --description="Hyperflow Works Docker images"
   ```

#### GitLab Setup

1. **Configure CI/CD Variables**
   - Go to GitLab repository → Settings → CI/CD → Variables
   - Add all required variables (see [CI/CD Pipeline](#cicd-pipeline) section)

2. **Verify OIDC Token Access**
   - GitLab 15.7+ automatically provides `CI_JOB_JWT_V2` token
   - Verify in GitLab: Settings → CI/CD → Token Access

#### GitHub Setup

1. **Create GitLab Personal Access Token**
   - Go to https://gitlab.com/-/profile/personal_access_tokens
   - Create token with `write_repository` scope
   - Copy the token

2. **Add GitHub Secret**
   - Go to GitHub repository → Settings → Secrets and variables → Actions
   - Add `GITLAB_TOKEN` with the GitLab Personal Access Token

---

### Access and URLs

#### Service Access

- **Production Service**: Cloud Run automatically generates a URL
  - Format: `https://hyperflow-works-<hash>-<region>.a.run.app`
  - Check GitLab pipeline logs or GCP Console for exact URL

#### Monitoring and Logs

- **GitLab Pipelines**: https://gitlab.com/seonhohong/hyperflow-works-demohong/-/pipelines
- **GCP Cloud Run Console**: https://console.cloud.google.com/run
- **GCP Logs**: https://console.cloud.google.com/logs

#### Repository Access

- **GitHub**: https://github.com/sacom123/HyperFlow-Works_demo
- **GitLab**: https://gitlab.com/seonhohong/hyperflow-works-demohong

---

### Development Workflow

#### Daily Development

1. **Make Changes**
   ```bash
   git checkout -b feature/your-feature-name
   # Make code changes
   ```

2. **Test Locally**
   ```bash
   pnpm dev
   # Test in browser at http://localhost:5173
   ```

3. **Run Tests**
   ```bash
   pnpm test
   pnpm lint
   ```

4. **Commit and Push**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Create PR on GitHub
   - After merge to `main`, automatic deployment starts

#### Deployment Process

1. **Code Push to GitHub** (`main` branch)
   - Triggers GitHub Actions workflow

2. **GitHub → GitLab Sync**
   - GitHub Actions automatically syncs code to GitLab

3. **GitLab CI/CD Pipeline**
   - **Auth**: Authenticates with GCP using WIF
   - **Build**: Builds Docker image using Cloud Build
   - **Deploy**: Deploys to Cloud Run

4. **Service Available**
   - New version is live on Cloud Run
   - Check pipeline logs for service URL

---

### Tech Stack

#### Frontend
- **React 18** - Latest React version with concurrent features
- **Vite** - Fast build tool and dev server
- **Ant Design** - Enterprise UI component library
- **TypeScript** - Type-safe JavaScript
- **Vitest** - Fast unit test framework
- **React Router** - Client-side routing
- **i18next** - Internationalization framework (20+ languages)

#### Backend
- **Node.js 18** - JavaScript runtime
- **Koa.js** - Lightweight web framework
- **TypeScript** - Type-safe JavaScript
- **Vitest** - Fast unit test framework

#### Deployment & Infrastructure
- **GCP Cloud Run** - Serverless container platform
- **Artifact Registry** - Docker image registry
- **GitLab CI/CD** - Automated deployment pipeline
- **GitHub Actions** - Code synchronization
- **Workload Identity Federation** - Secure authentication
- **Docker** - Containerization

---

### Environment Variables

#### Frontend
Create `.env` in `frontend/` directory:
```env
VITE_API_URL=http://localhost:3000/api
```

#### Backend
Create `.env` in `backend/` directory:
```env
PORT=3000
NODE_ENV=development
```

#### Production (Cloud Run)
Environment variables are set via Cloud Run configuration:
- `NODE_ENV=production`
- `PORT=3000` (automatically set by Cloud Run)

---

### Troubleshooting

#### Port Conflicts
- **Frontend**: Change port in `frontend/vite.config.ts`
- **Backend**: Change `PORT` environment variable

#### Dependency Issues
```bash
rm -rf node_modules frontend/node_modules backend/node_modules
pnpm install
```

#### Build Issues
```bash
rm -rf .pnpm-store
pnpm install
pnpm build
```

#### Deployment Issues

**WIF Authentication Failure:**
- Verify `GCP_WIF_PROVIDER` variable is correct
- Check service account has WIF permissions
- Verify Workload Identity Pool and Provider exist

**Cloud Build Failure:**
- Check Cloud Build API is enabled
- Verify service account has Cloud Build permissions
- Check Dockerfile syntax

**Cloud Run Deployment Failure:**
- Verify image exists in Artifact Registry
- Check service account has Cloud Run permissions
- Verify region matches Artifact Registry location

---

### Contributing

We welcome contributions! Please see the [Contributing Guide](#contributing) section for details.

#### Coding Standards
- Use TypeScript for type safety
- Follow ESLint rules
- Write meaningful commit messages
- Add tests for new features
- Update documentation for user-facing changes

#### Commit Message Format
- `Add:` for new features
- `Fix:` for bug fixes
- `Update:` for updates
- `Refactor:` for refactoring
- `Docs:` for documentation

---

### License

MIT License

### Contact

For questions or issues, please create an issue on GitHub:
https://github.com/sacom123/HyperFlow-Works_demo/issues

---

## Korean

### Hyperflow Works GCP Cloud Run 배포

Hyperflow Works는 Figma 디자인을 기반으로 구축된 React 18, Koa.js, Ant Design을 사용한 현대적인 웹 애플리케이션입니다. 애플리케이션은 Workload Identity Federation (WIF)을 사용한 안전한 인증과 함께 GitLab CI/CD를 통해 Google Cloud Platform (GCP) Cloud Run에 배포됩니다.

이 README는 프로젝트 구조, 배포 아키텍처, CI/CD 파이프라인, 설치 세부사항 및 운영 절차를 문서화합니다.

**목차:**
- [Hyperflow Works 컴포넌트](#hyperflow-works-컴포넌트)
- [배포 아키텍처](#배포-아키텍처)
- [배포 위치](#배포-위치)
- [서버 컴포넌트](#서버-컴포넌트)
- [애플리케이션 실행](#애플리케이션-실행)
- [CI/CD 파이프라인](#cicd-파이프라인)
- [설치 세부사항](#설치-세부사항)
- [접근 및 URL](#접근-및-url)
- [개발 워크플로우](#개발-워크플로우)

---

### Hyperflow Works 컴포넌트

다음 컴포넌트가 GCP Cloud Run에 배포되어 실행 중입니다:

#### 웹 애플리케이션

- **메인 애플리케이션** - 주요 Hyperflow Works 웹 애플리케이션
  - 프론트엔드: Vite 빌드 시스템을 사용한 React 18
  - 백엔드: Koa.js REST API 서버
  - UI 프레임워크: Ant Design 컴포넌트 라이브러리
  - 국제화: 20개 이상의 언어를 지원하는 i18next
  - 배포 위치: GCP Cloud Run (서버리스 컨테이너 플랫폼)

#### 서비스

- **프론트엔드 애플리케이션 서버** (Node.js/Koa.js 기반)
  - Vite로 빌드된 React 애플리케이션 제공
  - 프로덕션에서 정적 파일 제공 처리
  - 포트: 3000 (`PORT` 환경 변수로 설정 가능)
  - 프론트엔드와 백엔드를 모두 제공하는 단일 컨테이너에서 실행

- **백엔드 API 서버** (Node.js/Koa.js 기반)
  - RESTful API 엔드포인트
  - 에러 처리 미들웨어
  - 요청 로깅 미들웨어
  - CORS 지원
  - JSON body 파싱

#### 인프라 컴포넌트

- **GCP Cloud Run** - 애플리케이션을 호스팅하는 서버리스 컨테이너 플랫폼
- **Artifact Registry** - 컨테이너 이미지를 위한 Docker 이미지 레지스트리
- **GitLab CI/CD** - 자동화된 빌드 및 배포 파이프라인
- **GitHub Actions** - GitHub에서 GitLab으로의 코드 동기화
- **Workload Identity Federation (WIF)** - 서비스 계정 키 없이 안전한 인증

---

### 배포 아키텍처

#### CI/CD 흐름

```
GitHub 저장소
    ↓ (main/master 브랜치에 푸시)
GitHub Actions (sync-to-gitlab.yml)
    ↓ (자동 동기화)
GitLab 저장소
    ↓ (파이프라인 트리거)
GitLab CI/CD 파이프라인 (.gitlab-ci.yml)
    ↓
1단계: Auth (WIF 인증)
    ↓
2단계: Build (Cloud Build)
    ↓
3단계: Deploy (Cloud Run)
    ↓
GCP Cloud Run 서비스
```

#### 인증 방법

배포는 서비스 계정 키 대신 **Workload Identity Federation (WIF)**을 사용합니다:

1. **GitLab OIDC 토큰** → WIF를 통해 GCP 자격 증명으로 교환
2. **서비스 계정 키 없음** - GitLab 변수에 저장되지 않음
3. **안전한 인증** - GitLab CI/CD의 OIDC 토큰 사용

#### 컨테이너 아키텍처

- **단일 컨테이너 배포**: 프론트엔드와 백엔드가 하나의 컨테이너에서 실행
- **프론트엔드**: 백엔드 서버가 정적 파일로 제공
- **백엔드**: API 라우트와 정적 프론트엔드 파일을 모두 제공하는 Koa.js 서버
- **포트**: 3000 (Cloud Run에 노출)

---

### 배포 위치

#### GCP 리소스

- **프로젝트 ID**: `hyperflow-works-hong`
- **프로젝트 번호**: `818668788313`
- **리전**: `asia-northeast3` (서울, 대한민국)
- **Cloud Run 서비스**: `hyperflow-works`
- **Artifact Registry 저장소**: `hyperflow-works-repo`
- **Workload Identity Pool**: `gitlab-pool`
- **Workload Identity Provider**: `gitlab-provider`

#### 저장소 위치

- **GitHub 저장소**: `https://github.com/sacom123/HyperFlow-Works_demo`
- **GitLab 저장소**: `https://gitlab.com/seonhohong/hyperflow-works-demohong`

#### 서비스 URL

- **프로덕션 URL**: `https://hyperflow-works-<hash>-<region>.a.run.app`
  - URL은 Cloud Run이 자동으로 생성
  - 정확한 URL은 GitLab 파이프라인 로그 또는 GCP Console에서 확인

---

### 서버 컴포넌트

#### 프로젝트 구조

프로젝트 구조는 [English](#server-components) 섹션과 동일합니다.

#### 설정 파일

- **`.gitlab-ci.yml`**: 3단계(auth, build, deploy)로 구성된 GitLab CI/CD 파이프라인
- **`Dockerfile`**: 프로덕션용 멀티 스테이지 Docker 빌드
- **`cloudbuild.yaml`**: GCP Cloud Build 설정
- **`.github/workflows/sync-to-gitlab.yml`**: 자동 동기화를 위한 GitHub Actions 워크플로우

---

### 애플리케이션 실행

#### 로컬 개발

**사전 요구사항:**
- Node.js 18.x 이상
- pnpm 10.10.0 이상
- 버전 관리를 위한 Git

**설치:**

```bash
# 저장소 클론
git clone https://github.com/sacom123/HyperFlow-Works_demo.git
cd hyperflow-works

# 의존성 설치
pnpm install
```

**개발 모드:**

```bash
# 프론트엔드와 백엔드를 개발 모드로 실행
pnpm dev
```

다음이 시작됩니다:
- **프론트엔드**: http://localhost:5173 (HMR이 있는 Vite 개발 서버)
- **백엔드**: http://localhost:3000 (Koa.js 서버)

**프로덕션 빌드:**

```bash
# 프론트엔드와 백엔드 빌드
pnpm build
```

빌드된 파일:
- `frontend/dist/` - 프론트엔드 빌드 출력 (Vite)
- `backend/dist/` - 백엔드 빌드 출력 (TypeScript)

**테스트:**

```bash
# 모든 테스트 실행
pnpm test

# 프론트엔드 테스트만 실행
pnpm --filter frontend test

# 백엔드 테스트만 실행
pnpm --filter backend test

# 커버리지와 함께 테스트 실행
pnpm --filter frontend test:coverage
pnpm --filter backend test:coverage
```

**린팅:**

```bash
# 모든 프로젝트 린트
pnpm lint

# 프론트엔드만 린트
pnpm --filter frontend lint

# 백엔드만 린트
pnpm --filter backend lint
```

#### 프로덕션 배포

애플리케이션은 `main` 또는 `master` 브랜치에 코드가 푸시되면 GitLab CI/CD를 통해 자동으로 배포됩니다.

**수동 배포 (필요한 경우):**

```bash
# Docker 이미지 빌드
docker build -t asia-northeast3-docker.pkg.dev/hyperflow-works-hong/hyperflow-works-repo/hyperflow-works:latest .

# Artifact Registry에 푸시
docker push asia-northeast3-docker.pkg.dev/hyperflow-works-hong/hyperflow-works-repo/hyperflow-works:latest

# Cloud Run에 배포
gcloud run deploy hyperflow-works \
  --image asia-northeast3-docker.pkg.dev/hyperflow-works-hong/hyperflow-works-repo/hyperflow-works:latest \
  --platform managed \
  --region asia-northeast3 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10
```

---

### CI/CD 파이프라인

#### 파이프라인 단계

GitLab CI/CD 파이프라인은 세 단계로 구성됩니다:

1. **Auth 단계** (`auth`)
   - Workload Identity Federation을 사용하여 GCP 인증
   - GitLab OIDC 토큰을 GCP 자격 증명으로 교환
   - GCP 프로젝트 설정 구성
   - **이미지**: `gcr.io/google.com/cloudsdktool/cloud-sdk:slim`

2. **Build 단계** (`build`)
   - GCP Cloud Build를 사용하여 Docker 이미지 빌드
   - Artifact Registry에 이미지 푸시
   - **이미지**: `gcr.io/google.com/cloudsdktool/cloud-sdk:slim`
   - **의존성**: `auth` 단계

3. **Deploy 단계** (`deploy`)
   - Docker 이미지를 Cloud Run에 배포
   - Cloud Run 서비스 설정 구성
   - 서비스 URL 출력
   - **이미지**: `gcr.io/google.com/cloudsdktool/cloud-sdk:slim`
   - **의존성**: `build` 단계
   - **실행 조건**: `main` 또는 `master` 브랜치에서만

#### 필수 GitLab CI/CD 변수

GitLab에서 설정: **Settings → CI/CD → Variables**

| 변수 | 설명 | 예시 |
|------|------|------|
| `GCP_WIF_PROVIDER` | Workload Identity Provider 경로 | `projects/818668788313/locations/global/workloadIdentityPools/gitlab-pool/providers/gitlab-provider` |
| `GCP_SERVICE_ACCOUNT` | 서비스 계정 이메일 | `hyperflow-works-sa@hyperflow-works-hong.iam.gserviceaccount.com` |
| `GCP_PROJECT_ID` | GCP 프로젝트 ID | `hyperflow-works-hong` |
| `GCP_REGION` | Cloud Run 리전 | `asia-northeast3` |
| `GCP_AR_REPO` | Artifact Registry 저장소 이름 | `hyperflow-works-repo` |
| `SERVICE_NAME` | Cloud Run 서비스 이름 (선택사항) | `hyperflow-works` |

#### GitHub Actions 워크플로우

**워크플로우**: `.github/workflows/sync-to-gitlab.yml`

- **트리거**: `main` 또는 `master` 브랜치에 푸시
- **동작**: 코드를 GitLab 저장소에 자동 동기화
- **필수 Secret**: `GITLAB_TOKEN` (`write_repository` 권한이 있는 GitLab Personal Access Token)

---

### 설치 세부사항

#### GCP 설정

1. **GCP 프로젝트 생성**
   ```bash
   gcloud projects create hyperflow-works-hong --name="Hyperflow Works"
   gcloud config set project hyperflow-works-hong
   ```

2. **필요한 API 활성화**
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable artifactregistry.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   gcloud services enable iamcredentials.googleapis.com
   gcloud services enable sts.googleapis.com
   ```

3. **서비스 계정 생성**
   ```bash
   gcloud iam service-accounts create hyperflow-works-sa \
     --display-name="Hyperflow Works Service Account"
   ```

4. **권한 부여**
   ```bash
   PROJECT_ID="hyperflow-works-hong"
   SERVICE_ACCOUNT="hyperflow-works-sa@${PROJECT_ID}.iam.gserviceaccount.com"
   
   # Cloud Run 권한
   gcloud projects add-iam-policy-binding ${PROJECT_ID} \
     --member="serviceAccount:${SERVICE_ACCOUNT}" \
     --role="roles/run.admin"
   
   # Artifact Registry 권한
   gcloud projects add-iam-policy-binding ${PROJECT_ID} \
     --member="serviceAccount:${SERVICE_ACCOUNT}" \
     --role="roles/artifactregistry.writer"
   
   # 서비스 계정 사용자
   gcloud projects add-iam-policy-binding ${PROJECT_ID} \
     --member="serviceAccount:${SERVICE_ACCOUNT}" \
     --role="roles/iam.serviceAccountUser"
   ```

5. **Workload Identity Federation 설정**
   ```bash
   PROJECT_ID="hyperflow-works-hong"
   PROJECT_NUMBER=$(gcloud projects describe ${PROJECT_ID} --format="value(projectNumber)")
   
   # Workload Identity Pool 생성
   gcloud iam workload-identity-pools create gitlab-pool \
     --project=${PROJECT_ID} \
     --location="global" \
     --display-name="GitLab CI/CD Pool"
   
   # Workload Identity Provider 생성
   gcloud iam workload-identity-pools providers create-oidc gitlab-provider \
     --project=${PROJECT_ID} \
     --location="global" \
     --workload-identity-pool="gitlab-pool" \
     --display-name="GitLab Provider" \
     --attribute-mapping="google.subject=assertion.sub,attribute.aud=assertion.aud,attribute.project_path=assertion.project_path" \
     --issuer-uri="https://gitlab.com"
   
   # 서비스 계정에 WIF 권한 부여
   SERVICE_ACCOUNT="hyperflow-works-sa@${PROJECT_ID}.iam.gserviceaccount.com"
   gcloud iam service-accounts add-iam-policy-binding ${SERVICE_ACCOUNT} \
     --project=${PROJECT_ID} \
     --role="roles/iam.workloadIdentityUser" \
     --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/gitlab-pool/attribute.project_path/*"
   ```

6. **Artifact Registry 저장소 생성**
   ```bash
   gcloud artifacts repositories create hyperflow-works-repo \
     --repository-format=docker \
     --location=asia-northeast3 \
     --description="Hyperflow Works Docker images"
   ```

#### GitLab 설정

1. **CI/CD 변수 구성**
   - GitLab 저장소 → Settings → CI/CD → Variables로 이동
   - 모든 필수 변수 추가 (섹션 [CI/CD 파이프라인](#cicd-파이프라인) 참조)

2. **OIDC 토큰 접근 확인**
   - GitLab 15.7+는 자동으로 `CI_JOB_JWT_V2` 토큰 제공
   - GitLab에서 확인: Settings → CI/CD → Token Access

#### GitHub 설정

1. **GitLab Personal Access Token 생성**
   - https://gitlab.com/-/profile/personal_access_tokens 접속
   - `write_repository` 권한이 있는 토큰 생성
   - 토큰 복사

2. **GitHub Secret 추가**
   - GitHub 저장소 → Settings → Secrets and variables → Actions
   - GitLab Personal Access Token으로 `GITLAB_TOKEN` 추가

---

### 접근 및 URL

#### 서비스 접근

- **프로덕션 서비스**: Cloud Run이 자동으로 URL 생성
  - 형식: `https://hyperflow-works-<hash>-<region>.a.run.app`
  - 정확한 URL은 GitLab 파이프라인 로그 또는 GCP Console에서 확인

#### 모니터링 및 로그

- **GitLab 파이프라인**: https://gitlab.com/seonhohong/hyperflow-works-demohong/-/pipelines
- **GCP Cloud Run Console**: https://console.cloud.google.com/run
- **GCP 로그**: https://console.cloud.google.com/logs

#### 저장소 접근

- **GitHub**: https://github.com/sacom123/HyperFlow-Works_demo
- **GitLab**: https://gitlab.com/seonhohong/hyperflow-works-demohong

---

### 개발 워크플로우

#### 일상적인 개발

1. **변경사항 작성**
   ```bash
   git checkout -b feature/your-feature-name
   # 코드 변경
   ```

2. **로컬 테스트**
   ```bash
   pnpm dev
   # 브라우저에서 http://localhost:5173 테스트
   ```

3. **테스트 실행**
   ```bash
   pnpm test
   pnpm lint
   ```

4. **커밋 및 푸시**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   git push origin feature/your-feature-name
   ```

5. **Pull Request 생성**
   - GitHub에서 PR 생성
   - `main`에 병합 후 자동 배포 시작

#### 배포 프로세스

1. **GitHub에 코드 푸시** (`main` 브랜치)
   - GitHub Actions 워크플로우 트리거

2. **GitHub → GitLab 동기화**
   - GitHub Actions가 코드를 GitLab에 자동 동기화

3. **GitLab CI/CD 파이프라인**
   - **Auth**: WIF를 사용하여 GCP 인증
   - **Build**: Cloud Build를 사용하여 Docker 이미지 빌드
   - **Deploy**: Cloud Run에 배포

4. **서비스 사용 가능**
   - 새 버전이 Cloud Run에서 라이브
   - 서비스 URL은 파이프라인 로그에서 확인

---

### 기술 스택

#### 프론트엔드
- **React 18** - 동시 기능이 있는 최신 React 버전
- **Vite** - 빠른 빌드 도구 및 개발 서버
- **Ant Design** - 엔터프라이즈 UI 컴포넌트 라이브러리
- **TypeScript** - 타입 안전 JavaScript
- **Vitest** - 빠른 단위 테스트 프레임워크
- **React Router** - 클라이언트 사이드 라우팅
- **i18next** - 국제화 프레임워크 (20개 이상의 언어)

#### 백엔드
- **Node.js 18** - JavaScript 런타임
- **Koa.js** - 경량 웹 프레임워크
- **TypeScript** - 타입 안전 JavaScript
- **Vitest** - 빠른 단위 테스트 프레임워크

#### 배포 및 인프라
- **GCP Cloud Run** - 서버리스 컨테이너 플랫폼
- **Artifact Registry** - Docker 이미지 레지스트리
- **GitLab CI/CD** - 자동화된 배포 파이프라인
- **GitHub Actions** - 코드 동기화
- **Workload Identity Federation** - 안전한 인증
- **Docker** - 컨테이너화

---

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

#### 프로덕션 (Cloud Run)
환경 변수는 Cloud Run 설정을 통해 설정됩니다:
- `NODE_ENV=production`
- `PORT=3000` (Cloud Run이 자동으로 설정)

---

### 문제 해결

#### 포트 충돌
- **프론트엔드**: `frontend/vite.config.ts`에서 포트 변경
- **백엔드**: `PORT` 환경 변수 변경

#### 의존성 문제
```bash
rm -rf node_modules frontend/node_modules backend/node_modules
pnpm install
```

#### 빌드 문제
```bash
rm -rf .pnpm-store
pnpm install
pnpm build
```

#### 배포 문제

**WIF 인증 실패:**
- `GCP_WIF_PROVIDER` 변수가 올바른지 확인
- 서비스 계정에 WIF 권한이 있는지 확인
- Workload Identity Pool과 Provider가 존재하는지 확인

**Cloud Build 실패:**
- Cloud Build API가 활성화되었는지 확인
- 서비스 계정에 Cloud Build 권한이 있는지 확인
- Dockerfile 구문 확인

**Cloud Run 배포 실패:**
- Artifact Registry에 이미지가 존재하는지 확인
- 서비스 계정에 Cloud Run 권한이 있는지 확인
- 리전이 Artifact Registry 위치와 일치하는지 확인

---

### 기여하기

기여를 환영합니다! 자세한 내용은 [기여하기](#기여하기) 섹션을 참조하세요.

#### 코딩 표준
- 타입 안정성을 위해 TypeScript 사용
- ESLint 규칙 따르기
- 의미 있는 커밋 메시지 작성
- 새 기능에 대한 테스트 추가
- 사용자 대상 변경사항에 대한 문서 업데이트

#### 커밋 메시지 형식
- `Add:` 새 기능
- `Fix:` 버그 수정
- `Update:` 업데이트
- `Refactor:` 리팩토링
- `Docs:` 문서

---

### 라이선스

MIT License

### 연락처

질문이나 이슈가 있으면 GitHub에서 이슈를 생성해주세요:
https://github.com/sacom123/HyperFlow-Works_demo/issues
