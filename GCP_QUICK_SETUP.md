# GCP 빠른 설정 가이드 / GCP Quick Setup Guide

[English](#english) | [한국어](#korean)

---

## English

### Quick Setup Guide

Follow these steps to quickly set up GCP for Hyperflow Works deployment.

#### Option 1: Using the Setup Script (Recommended)

1. **Run the setup script**
   ```bash
   ./setup-gcp.sh
   ```

2. **Follow the prompts**
   - Enter your project ID
   - Choose your region
   - The script will create everything for you

3. **Add variables to GitLab CI/CD**
   - The script will provide the Base64 encoded key
   - Copy it to GitLab CI/CD variables

#### Option 2: Manual Setup

##### Step 1: Install Google Cloud SDK

**macOS:**
```bash
brew install google-cloud-sdk
```

**Linux:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

**Windows:**
Download from: https://cloud.google.com/sdk/docs/install-sdk

##### Step 2: Login and Create Project

```bash
# Login
gcloud auth login
gcloud auth application-default login

# Create project
gcloud projects create hyperflow-works-YOURNAME --name="Hyperflow Works"
gcloud config set project hyperflow-works-YOURNAME
```

##### Step 3: Enable APIs

```bash
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

##### Step 4: Set Region

```bash
gcloud config set run/region asia-northeast3
```

##### Step 5: Create Service Account

```bash
PROJECT_ID=$(gcloud config get-value project)

# Create service account
gcloud iam service-accounts create hyperflow-works-sa \
  --display-name="Hyperflow Works Service Account"

# Grant permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

##### Step 6: Create Key and Encode

```bash
# Create key
gcloud iam service-accounts keys create gcp-key.json \
  --iam-account=hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com

# Encode to Base64 (macOS)
base64 -i gcp-key.json | pbcopy

# Or save to file
base64 -i gcp-key.json > gcp-key-base64.txt
```

##### Step 7: Add to GitLab CI/CD

Go to GitLab → Settings → CI/CD → Variables and add:

- `GCP_SERVICE_ACCOUNT_KEY` - Base64 encoded key (Masked ✅)
- `GCP_PROJECT_ID` - Your project ID
- `GCP_SERVICE_NAME` - `hyperflow-works`
- `GCP_REGION` - `asia-northeast3`

#### Verify Setup

```bash
# Check authentication
gcloud auth list

# Check project
gcloud config get-value project

# Check service account
gcloud iam service-accounts list
```

---

## Korean

### 빠른 설정 가이드

Hyperflow Works 배포를 위해 GCP를 빠르게 설정하는 방법입니다.

#### 방법 1: 설정 스크립트 사용 (권장)

1. **설정 스크립트 실행**
   ```bash
   ./setup-gcp.sh
   ```

2. **프롬프트 따라하기**
   - 프로젝트 ID 입력
   - 리전 선택
   - 스크립트가 자동으로 모든 것을 생성합니다

3. **GitLab CI/CD에 변수 추가**
   - 스크립트가 Base64 인코딩된 키를 제공합니다
   - GitLab CI/CD 변수에 복사하세요

#### 방법 2: 수동 설정

##### 1단계: Google Cloud SDK 설치

**macOS:**
```bash
brew install google-cloud-sdk
```

**Linux:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

**Windows:**
다운로드: https://cloud.google.com/sdk/docs/install-sdk

##### 2단계: 로그인 및 프로젝트 생성

```bash
# 로그인
gcloud auth login
gcloud auth application-default login

# 프로젝트 생성
gcloud projects create hyperflow-works-YOURNAME --name="Hyperflow Works"
gcloud config set project hyperflow-works-YOURNAME
```

##### 3단계: API 활성화

```bash
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

##### 4단계: 리전 설정

```bash
gcloud config set run/region asia-northeast3
```

##### 5단계: Service Account 생성

```bash
PROJECT_ID=$(gcloud config get-value project)

# Service account 생성
gcloud iam service-accounts create hyperflow-works-sa \
  --display-name="Hyperflow Works Service Account"

# 권한 부여
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

##### 6단계: 키 생성 및 인코딩

```bash
# 키 생성
gcloud iam service-accounts keys create gcp-key.json \
  --iam-account=hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com

# Base64로 인코딩 (macOS)
base64 -i gcp-key.json | pbcopy

# 또는 파일로 저장
base64 -i gcp-key.json > gcp-key-base64.txt
```

##### 7단계: GitLab CI/CD에 추가

GitLab → Settings → CI/CD → Variables로 이동하여 추가:

- `GCP_SERVICE_ACCOUNT_KEY` - Base64 인코딩된 키 (Masked ✅)
- `GCP_PROJECT_ID` - 프로젝트 ID
- `GCP_SERVICE_NAME` - `hyperflow-works`
- `GCP_REGION` - `asia-northeast3`

#### 설정 확인

```bash
# 인증 확인
gcloud auth list

# 프로젝트 확인
gcloud config get-value project

# Service account 확인
gcloud iam service-accounts list
```

---

## 다음 단계

설정이 완료되면:

1. ✅ GitLab CI/CD 변수 설정
2. ✅ 코드를 GitLab에 푸시
3. ✅ 파이프라인 실행 확인
4. ✅ Cloud Run 서비스 확인

자세한 내용은 `GCP_INSTALLATION_GUIDE.md`를 참조하세요.

