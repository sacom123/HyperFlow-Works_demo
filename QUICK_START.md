# 빠른 시작 가이드 / Quick Start Guide

## 🚀 빠른 체크리스트

### ✅ 필수 사전 준비
- [ ] GCP 계정 및 프로젝트
- [ ] GitLab 프로젝트
- [ ] Google Cloud SDK 설치 (`gcloud --version`)
- [ ] Node.js 18.x 설치 (`node --version`)
- [ ] pnpm 10.10.0 설치 (`pnpm --version`)
- [ ] Docker 설치 (`docker --version`)

### 📋 단계별 체크리스트

#### 1. GCP 프로젝트 및 Service Account 생성
```bash
# 1. GCP 로그인
gcloud auth login
gcloud auth application-default login

# 2. 프로젝트 생성 (이름은 고유해야 함)
gcloud projects create hyperflow-works-YOURNAME --name="Hyperflow Works"
gcloud config set project hyperflow-works-YOURNAME

# 3. 필수 API 활성화
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# 4. Service Account 생성
gcloud iam service-accounts create hyperflow-works-sa \
  --display-name="Hyperflow Works Service Account"

# 5. 권한 부여
PROJECT_ID=$(gcloud config get-value project)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.admin"
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# 6. Service Account Key 생성
gcloud iam service-accounts keys create gcp-key.json \
  --iam-account=hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com

# 7. Base64 인코딩 (macOS)
base64 -i gcp-key.json | pbcopy
```
**출력값 저장**: Base64 인코딩된 키, 프로젝트 ID

#### 2. GitLab CI/CD 변수 설정
GitLab 프로젝트 → Settings → CI/CD → Variables에서 추가:

- `GCP_SERVICE_ACCOUNT_KEY` = 위의 Base64 인코딩된 키 (Masked ✅)
- `GCP_PROJECT_ID` = 위의 프로젝트 ID
- `GCP_SERVICE_NAME` = `hyperflow-works` (또는 원하는 이름)
- `GCP_REGION` = `asia-northeast3` (서울 리전)
- `GCP_PROJECT_HASH` = 선택사항 (비워둬도 됨)

#### 3. 로컬 테스트
```bash
# 의존성 설치
pnpm install

# 테스트 실행
pnpm test

# 빌드 테스트
pnpm build

# Docker 빌드 테스트
docker build -t hyperflow-works:test .
docker run -p 3000:3000 hyperflow-works:test
```

#### 4. GitLab에 푸시
```bash
git add .
git commit -m "Setup GCP Cloud Run deployment"
git push origin main
```

#### 5. 배포 확인
- GitLab → CI/CD → Pipelines에서 파이프라인 실행 확인
- GCP Console → Cloud Run에서 배포 상태 확인
- 웹 앱 URL 방문하여 동작 확인

## 🔍 문제 발생 시

### 파이프라인 실패
1. GitLab CI/CD 로그 확인
2. 변수 값이 올바른지 확인 (특히 Base64 인코딩)
3. Service Account 권한 확인
4. GCP 프로젝트 ID 확인

### 배포 실패
1. GCP Console → Cloud Run → Logs에서 로그 확인
2. Service Account 키가 올바른지 확인
3. Docker 이미지가 GCR에 푸시되었는지 확인
4. Cloud Run 서비스 생성 확인

### 웹 앱이 동작하지 않음
1. GCP Console → Cloud Run → Logs
2. 포트 설정 확인 (PORT=3000)
3. 환경 변수 확인 (NODE_ENV=production)
4. 백엔드가 올바르게 시작되는지 확인

### Docker 빌드 실패
1. Dockerfile 구문 확인
2. 모든 의존성이 설치되었는지 확인
3. 빌드 로그에서 특정 오류 확인
4. 로컬에서 Docker 빌드 테스트

## 📚 자세한 가이드

더 자세한 내용은 다음 문서를 참조하세요:
- `SETUP_GUIDE.md` - 상세한 설정 가이드
- `DEPLOYMENT.md` - 배포 관련 상세 정보
- `README.md` - 프로젝트 전체 문서

## 🎯 다음 단계

1. ✅ GCP 프로젝트 생성 및 설정
2. ✅ Service Account 생성 및 권한 부여
3. ✅ GitLab CI/CD 변수 설정
4. ✅ 로컬 빌드 및 테스트
5. ✅ GitLab에 푸시 및 배포 확인
6. ✅ Cloud Run 서비스 URL 확인 및 테스트
