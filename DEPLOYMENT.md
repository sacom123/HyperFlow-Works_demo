# 배포 가이드 / Deployment Guide

[English](#english) | [한국어](#korean)

---

## English

### Deployment Guide

This guide explains how to deploy Hyperflow Works to GCP Cloud Run using GitLab CI/CD with webhook support.

#### Prerequisites

1. **GCP Account** with an active project
2. **GitLab Account** with a project repository
3. **GCP Service Account** for authentication
4. **Cloud Run API** enabled
5. **Container Registry API** enabled

#### GCP Setup

1. **Create GCP Project**

```bash
gcloud projects create hyperflow-works --name="Hyperflow Works"
gcloud config set project hyperflow-works
```

2. **Enable Required APIs**

```bash
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

3. **Create Service Account**

```bash
# Create service account
gcloud iam service-accounts create hyperflow-works-sa \
  --display-name="Hyperflow Works Service Account"

# Grant necessary permissions
gcloud projects add-iam-policy-binding hyperflow-works \
  --member="serviceAccount:hyperflow-works-sa@hyperflow-works.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding hyperflow-works \
  --member="serviceAccount:hyperflow-works-sa@hyperflow-works.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding hyperflow-works \
  --member="serviceAccount:hyperflow-works-sa@hyperflow-works.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

4. **Create Service Account Key**

```bash
gcloud iam service-accounts keys create gcp-key.json \
  --iam-account=hyperflow-works-sa@hyperflow-works.iam.gserviceaccount.com
```

5. **Set Default Region**

```bash
gcloud config set run/region asia-northeast3  # Seoul region
```

#### GitLab CI/CD Setup

1. **Configure CI/CD Variables**

Go to GitLab project → Settings → CI/CD → Variables and add:

- `GCP_SERVICE_ACCOUNT_KEY` - Base64 encoded service account key JSON (Masked ✅)
- `GCP_PROJECT_ID` - GCP project ID (e.g., `hyperflow-works`)
- `GCP_SERVICE_NAME` - Cloud Run service name (e.g., `hyperflow-works`)
- `GCP_REGION` - Cloud Run region (e.g., `asia-northeast3`)
- `GCP_PROJECT_HASH` - Project hash for URL (optional, for environment URL)

2. **Encode Service Account Key**

```bash
# Encode the service account key to base64
base64 -i gcp-key.json | pbcopy  # macOS
base64 -i gcp-key.json | xclip -selection clipboard  # Linux
```

3. **Configure GitLab Webhook**

To enable webhook support for deployment:

1. Go to GitLab project → Settings → Webhooks
2. Click "Add webhook"
3. Configure the webhook:
   - **URL**: Your GCP Cloud Build webhook endpoint (if using webhook deployment)
   - **Trigger**: Push events, Tag push events
   - **Branch**: main, master
   - **Enable SSL verification**: Yes (recommended)
4. Click "Add webhook"

#### CI/CD Pipeline Overview

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

#### Manual Deployment

You can also deploy manually using gcloud:

```bash
# Build Docker image
docker build -t gcr.io/hyperflow-works/hyperflow-works:latest .

# Push to GCR
docker push gcr.io/hyperflow-works/hyperflow-works:latest

# Deploy to Cloud Run
gcloud run deploy hyperflow-works \
  --image gcr.io/hyperflow-works/hyperflow-works:latest \
  --platform managed \
  --region asia-northeast3 \
  --allow-unauthenticated \
  --port 3000
```

#### Using Cloud Build

You can also use GCP Cloud Build:

```bash
# Submit build to Cloud Build
gcloud builds submit --config cloudbuild.yaml

# Or trigger from Git
gcloud builds triggers create cloud-source-repositories \
  --repo=hyperflow-works \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

#### Troubleshooting

**Deployment fails with authentication error:**
- Verify service account key in GitLab CI/CD variables
- Check if service account has Cloud Run Admin role
- Verify project ID is correct

**Build fails:**
- Check Node.js version (should be 18.x)
- Verify pnpm version (should be 10.10.0)
- Check for dependency issues

**Tests fail:**
- Verify test files are present
- Check Vitest configuration
- Review test output in CI/CD logs

**Cloud Run service not responding:**
- Check Cloud Run logs in GCP Console
- Verify environment variables are set
- Check if the port is configured correctly (PORT=3000)
- Verify the application is listening on the correct port

**Docker build fails:**
- Check Dockerfile syntax
- Verify all dependencies are installed
- Check build logs for specific errors

---

## Korean

### 배포 가이드

이 가이드는 GitLab CI/CD와 webhook 지원을 사용하여 Hyperflow Works를 GCP Cloud Run에 배포하는 방법을 설명합니다.

#### 사전 요구사항

1. 활성 프로젝트가 있는 **GCP 계정**
2. 프로젝트 저장소가 있는 **GitLab 계정**
3. 인증을 위한 **GCP Service Account**
4. **Cloud Run API** 활성화
5. **Container Registry API** 활성화

#### GCP 설정

1. **GCP 프로젝트 생성**

```bash
gcloud projects create hyperflow-works --name="Hyperflow Works"
gcloud config set project hyperflow-works
```

2. **필수 API 활성화**

```bash
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

3. **Service Account 생성**

```bash
# Service account 생성
gcloud iam service-accounts create hyperflow-works-sa \
  --display-name="Hyperflow Works Service Account"

# 필요한 권한 부여
gcloud projects add-iam-policy-binding hyperflow-works \
  --member="serviceAccount:hyperflow-works-sa@hyperflow-works.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding hyperflow-works \
  --member="serviceAccount:hyperflow-works-sa@hyperflow-works.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding hyperflow-works \
  --member="serviceAccount:hyperflow-works-sa@hyperflow-works.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

4. **Service Account Key 생성**

```bash
gcloud iam service-accounts keys create gcp-key.json \
  --iam-account=hyperflow-works-sa@hyperflow-works.iam.gserviceaccount.com
```

5. **기본 리전 설정**

```bash
gcloud config set run/region asia-northeast3  # 서울 리전
```

#### GitLab CI/CD 설정

1. **CI/CD 변수 구성**

GitLab 프로젝트 → 설정 → CI/CD → 변수로 이동하여 추가:

- `GCP_SERVICE_ACCOUNT_KEY` - Base64 인코딩된 service account key JSON (Masked ✅)
- `GCP_PROJECT_ID` - GCP 프로젝트 ID (예: `hyperflow-works`)
- `GCP_SERVICE_NAME` - Cloud Run 서비스 이름 (예: `hyperflow-works`)
- `GCP_REGION` - Cloud Run 리전 (예: `asia-northeast3`)
- `GCP_PROJECT_HASH` - URL용 프로젝트 해시 (선택사항, 환경 URL용)

2. **Service Account Key 인코딩**

```bash
# Service account key를 base64로 인코딩
base64 -i gcp-key.json | pbcopy  # macOS
base64 -i gcp-key.json | xclip -selection clipboard  # Linux
```

3. **GitLab Webhook 구성**

배포를 위한 webhook 지원을 활성화하려면:

1. GitLab 프로젝트 → 설정 → Webhooks로 이동
2. "Add webhook" 클릭
3. Webhook 구성:
   - **URL**: GCP Cloud Build webhook 엔드포인트 (webhook 배포 사용 시)
   - **Trigger**: Push events, Tag push events
   - **Branch**: main, master
   - **Enable SSL verification**: Yes (권장)
4. "Add webhook" 클릭

#### CI/CD 파이프라인 개요

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

#### 수동 배포

gcloud를 사용하여 수동으로 배포할 수도 있습니다:

```bash
# Docker 이미지 빌드
docker build -t gcr.io/hyperflow-works/hyperflow-works:latest .

# GCR에 푸시
docker push gcr.io/hyperflow-works/hyperflow-works:latest

# Cloud Run에 배포
gcloud run deploy hyperflow-works \
  --image gcr.io/hyperflow-works/hyperflow-works:latest \
  --platform managed \
  --region asia-northeast3 \
  --allow-unauthenticated \
  --port 3000
```

#### Cloud Build 사용

GCP Cloud Build를 사용할 수도 있습니다:

```bash
# Cloud Build에 빌드 제출
gcloud builds submit --config cloudbuild.yaml

# 또는 Git에서 트리거
gcloud builds triggers create cloud-source-repositories \
  --repo=hyperflow-works \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

#### 문제 해결

**인증 오류로 배포 실패:**
- GitLab CI/CD 변수에서 service account key 확인
- Service account에 Cloud Run Admin 역할이 있는지 확인
- 프로젝트 ID가 올바른지 확인

**빌드 실패:**
- Node.js 버전 확인 (18.x여야 함)
- pnpm 버전 확인 (10.10.0이어야 함)
- 의존성 문제 확인

**테스트 실패:**
- 테스트 파일이 있는지 확인
- Vitest 구성 확인
- CI/CD 로그에서 테스트 출력 검토

**Cloud Run 서비스가 응답하지 않음:**
- GCP Console에서 Cloud Run 로그 확인
- 환경 변수가 설정되었는지 확인
- 포트가 올바르게 구성되었는지 확인 (PORT=3000)
- 애플리케이션이 올바른 포트에서 수신 대기하는지 확인

**Docker 빌드 실패:**
- Dockerfile 구문 확인
- 모든 의존성이 설치되었는지 확인
- 빌드 로그에서 특정 오류 확인
