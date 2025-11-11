# GCP 다음 단계 설정 가이드

현재 상태: ✅ 로그인 완료, ✅ 프로젝트 생성 완료 (`hyperflow-works-hong`)

## 🚀 빠른 설정 (자동 스크립트)

다음 명령어를 실행하면 자동으로 모든 설정이 완료됩니다:

```bash
./setup-gcp-next-steps.sh
```

스크립트가 다음을 자동으로 수행합니다:
1. ✅ Cloud Resource Manager API 활성화
2. ✅ 필요한 API 활성화 (Cloud Run, Container Registry, Cloud Build)
3. ✅ 리전 설정 (asia-northeast3 - 서울)
4. ✅ Service Account 생성
5. ✅ 권한 부여
6. ✅ 키 파일 생성 및 Base64 인코딩

## 📝 수동 설정 (단계별)

스크립트를 사용하지 않으려면 다음 단계를 따라하세요:

### 1단계: Cloud Resource Manager API 활성화 (필수)

```bash
gcloud services enable cloudresourcemanager.googleapis.com
```

이 API가 활성화되어야 다른 API들을 활성화할 수 있습니다.

### 2단계: 필요한 API 활성화

```bash
# Cloud Run API
gcloud services enable run.googleapis.com

# Container Registry API
gcloud services enable containerregistry.googleapis.com

# Cloud Build API
gcloud services enable cloudbuild.googleapis.com
```

### 3단계: 리전 설정

```bash
# 서울 리전 설정
gcloud config set run/region asia-northeast3
gcloud config set compute/region asia-northeast3
```

### 4단계: Service Account 생성

```bash
PROJECT_ID=$(gcloud config get-value project)

# Service Account 생성
gcloud iam service-accounts create hyperflow-works-sa \
  --display-name="Hyperflow Works Service Account" \
  --description="Service account for Hyperflow Works deployment"
```

### 5단계: 권한 부여

```bash
PROJECT_ID=$(gcloud config get-value project)

# Cloud Run Admin 역할
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

# Storage Admin 역할 (Container Registry용)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

# Service Account User 역할
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

### 6단계: 키 파일 생성

```bash
PROJECT_ID=$(gcloud config get-value project)

# 키 파일 생성
gcloud iam service-accounts keys create gcp-key.json \
  --iam-account=hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com
```

### 7단계: Base64 인코딩

```bash
# macOS - 클립보드에 복사
base64 -i gcp-key.json | pbcopy

# Linux - 파일로 저장
base64 -i gcp-key.json > gcp-key-base64.txt
```

## ✅ 설정 확인

설정이 완료되면 다음 명령어로 확인할 수 있습니다:

```bash
./check-gcp-status.sh
```

## 📋 GitLab CI/CD 변수 설정

설정이 완료되면 GitLab에 다음 변수들을 추가하세요:

1. **GitLab 프로젝트로 이동**
   - Settings → CI/CD → Variables

2. **다음 변수 추가:**
   - `GCP_SERVICE_ACCOUNT_KEY`: Base64 인코딩된 키 (Masked ✅, Protected ✅)
   - `GCP_PROJECT_ID`: `hyperflow-works-hong`
   - `GCP_SERVICE_NAME`: `hyperflow-works`
   - `GCP_REGION`: `asia-northeast3`
   - `GCP_PROJECT_HASH`: (비워둬도 됨)

## 🚀 배포 테스트

설정이 완료되면:

```bash
# 변경사항 커밋
git add .
git commit -m "Setup GCP Cloud Run deployment"
git push origin main

# GitLab CI/CD 파이프라인에서 배포 상태 확인
```

## 🔍 문제 해결

### API 활성화 오류
```bash
# Cloud Resource Manager API가 먼저 활성화되어야 합니다
gcloud services enable cloudresourcemanager.googleapis.com

# 몇 분 대기 후 다시 시도
```

### 권한 오류
```bash
# 현재 사용자 계정 확인
gcloud auth list

# 프로젝트 권한 확인
gcloud projects get-iam-policy $(gcloud config get-value project)
```

### Service Account 생성 오류
```bash
# 프로젝트 ID 확인
gcloud config get-value project

# Service Account 목록 확인
gcloud iam service-accounts list
```

## 📚 참고 문서

- `GCP_INSTALLATION_GUIDE.md` - 전체 설치 가이드
- `SETUP_GUIDE.md` - 상세 설정 가이드
- `DEPLOYMENT.md` - 배포 가이드

