# 설정 가이드 / Setup Guide

[English](#english) | [한국어](#korean)

---

## English

### Step-by-Step Setup Guide

Follow these steps in order to set up and deploy your Hyperflow Works project to GCP Cloud Run.

#### Step 1: GCP Project Setup

1. **Install Google Cloud SDK**
   ```bash
   # macOS
   brew install google-cloud-sdk
   
   # Or download from: https://cloud.google.com/sdk/docs/install
   ```

2. **Login to GCP**
   ```bash
   gcloud auth login
   gcloud auth application-default login
   ```

3. **Create GCP Project**
   ```bash
   gcloud projects create hyperflow-works --name="Hyperflow Works"
   gcloud config set project hyperflow-works
   ```

   ⚠️ **Important**: Replace `hyperflow-works` with your unique project ID (must be globally unique).

4. **Enable Required APIs**
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   ```

5. **Set Default Region**
   ```bash
   gcloud config set run/region asia-northeast3  # Seoul region
   ```

#### Step 2: Create Service Account

1. **Create Service Account**
   ```bash
   gcloud iam service-accounts create hyperflow-works-sa \
     --display-name="Hyperflow Works Service Account"
   ```

2. **Grant Necessary Permissions**
   ```bash
   # Get your project ID
   PROJECT_ID=$(gcloud config get-value project)
   
   # Grant Cloud Run Admin role
   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="serviceAccount:hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/run.admin"
   
   # Grant Storage Admin role (for Container Registry)
   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="serviceAccount:hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/storage.admin"
   
   # Grant Service Account User role
   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="serviceAccount:hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/iam.serviceAccountUser"
   ```

3. **Create Service Account Key**
   ```bash
   PROJECT_ID=$(gcloud config get-value project)
   
   gcloud iam service-accounts keys create gcp-key.json \
     --iam-account=hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com
   ```

   ⚠️ **Important**: Save the `gcp-key.json` file securely. You'll need it for GitLab CI/CD.

4. **Encode Service Account Key to Base64**
   ```bash
   # macOS
   base64 -i gcp-key.json | pbcopy
   
   # Linux
   base64 -i gcp-key.json | xclip -selection clipboard
   
   # Or save to file
   base64 -i gcp-key.json > gcp-key-base64.txt
   ```

#### Step 3: GitLab CI/CD Configuration

1. **Go to GitLab Project**
   - Navigate to your GitLab project
   - Go to **Settings** → **CI/CD** → **Variables**

2. **Add CI/CD Variables**
   Click "Add variable" for each of the following:

   | Variable Name | Value | Protected | Masked |
   |--------------|-------|-----------|--------|
   | `GCP_SERVICE_ACCOUNT_KEY` | Base64 encoded key from Step 2.4 | ✅ | ✅ |
   | `GCP_PROJECT_ID` | Your GCP project ID | ✅ | ❌ |
   | `GCP_SERVICE_NAME` | `hyperflow-works` (or your service name) | ✅ | ❌ |
   | `GCP_REGION` | `asia-northeast3` (Seoul) | ✅ | ❌ |
   | `GCP_PROJECT_HASH` | Optional: Project hash for URL | ✅ | ❌ |

   ⚠️ **Important**: 
   - Mark `GCP_SERVICE_ACCOUNT_KEY` as "Masked" and "Protected"
   - Replace values with your actual values from Steps 1-2

3. **Verify Pipeline Configuration**
   - Ensure `.gitlab-ci.yml` is in the root of your repository
   - Check that the file is committed and pushed

#### Step 4: GitLab Webhook Setup (Optional)

1. **Go to GitLab Project Settings**
   - Navigate to **Settings** → **Webhooks**

2. **Add Webhook**
   - **URL**: Your GCP Cloud Build webhook endpoint (if using webhook deployment)
   - **Trigger**: Push events, Tag push events
   - **Branch**: main, master
   - **Enable SSL verification**: Yes (recommended)

3. **Test Webhook**
   - Click "Test" → "Push events" to test the webhook

#### Step 5: Test Local Build

Before deploying, test the build locally:

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Run Tests**
   ```bash
   pnpm test
   ```

3. **Build Project**
   ```bash
   pnpm build
   ```

4. **Verify Build Output**
   - Check that `frontend/dist/` and `backend/dist/` are created
   - Verify no build errors

5. **Test Docker Build**
   ```bash
   docker build -t hyperflow-works:test .
   docker run -p 3000:3000 hyperflow-works:test
   ```

#### Step 6: Push to GitLab

1. **Commit Changes**
   ```bash
   git add .
   git commit -m "Setup GCP Cloud Run deployment"
   git push origin main
   ```

2. **Monitor Pipeline**
   - Go to GitLab project → **CI/CD** → **Pipelines**
   - Watch the pipeline execution
   - Check for any errors

#### Step 7: Verify Deployment

1. **Check Cloud Run Service**
   - Go to GCP Console → Cloud Run
   - Find your service: `hyperflow-works`
   - Check the URL: `https://hyperflow-works-xxxxx.asia-northeast3.run.app`

2. **Test Deployment**
   - Visit the deployed URL
   - Verify the application is running
   - Check logs if there are issues

#### Troubleshooting

**Pipeline fails at build stage:**
- Check Node.js version (should be 18.x)
- Verify pnpm version (should be 10.10.0)
- Check for dependency issues

**Pipeline fails at test stage:**
- Verify test files are present
- Check Vitest configuration
- Review test output in CI/CD logs

**Deployment fails:**
- Verify service account key is correct (base64 encoded)
- Check if service account has necessary permissions
- Verify project ID and region are correct
- Check Cloud Run logs in GCP Console

**Docker build fails:**
- Check Dockerfile syntax
- Verify all dependencies are installed
- Check build logs for specific errors

**Cloud Run service not responding:**
- Check Cloud Run logs in GCP Console
- Verify environment variables are set
- Check if the port is configured correctly (PORT=3000)
- Verify the application is listening on the correct port

---

## Korean

### 단계별 설정 가이드

Hyperflow Works 프로젝트를 GCP Cloud Run에 설정하고 배포하기 위해 다음 단계를 순서대로 따르세요.

#### 1단계: GCP 프로젝트 설정

1. **Google Cloud SDK 설치**
   ```bash
   # macOS
   brew install google-cloud-sdk
   
   # 또는 다운로드: https://cloud.google.com/sdk/docs/install
   ```

2. **GCP 로그인**
   ```bash
   gcloud auth login
   gcloud auth application-default login
   ```

3. **GCP 프로젝트 생성**
   ```bash
   gcloud projects create hyperflow-works --name="Hyperflow Works"
   gcloud config set project hyperflow-works
   ```

   ⚠️ **중요**: `hyperflow-works`를 고유한 프로젝트 ID로 교체하세요 (전역적으로 고유해야 함).

4. **필수 API 활성화**
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   ```

5. **기본 리전 설정**
   ```bash
   gcloud config set run/region asia-northeast3  # 서울 리전
   ```

#### 2단계: Service Account 생성

1. **Service Account 생성**
   ```bash
   gcloud iam service-accounts create hyperflow-works-sa \
     --display-name="Hyperflow Works Service Account"
   ```

2. **필요한 권한 부여**
   ```bash
   # 프로젝트 ID 가져오기
   PROJECT_ID=$(gcloud config get-value project)
   
   # Cloud Run Admin 역할 부여
   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="serviceAccount:hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/run.admin"
   
   # Storage Admin 역할 부여 (Container Registry용)
   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="serviceAccount:hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/storage.admin"
   
   # Service Account User 역할 부여
   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="serviceAccount:hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/iam.serviceAccountUser"
   ```

3. **Service Account Key 생성**
   ```bash
   PROJECT_ID=$(gcloud config get-value project)
   
   gcloud iam service-accounts keys create gcp-key.json \
     --iam-account=hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com
   ```

   ⚠️ **중요**: `gcp-key.json` 파일을 안전하게 저장하세요. GitLab CI/CD에 필요합니다.

4. **Service Account Key를 Base64로 인코딩**
   ```bash
   # macOS
   base64 -i gcp-key.json | pbcopy
   
   # Linux
   base64 -i gcp-key.json | xclip -selection clipboard
   
   # 또는 파일로 저장
   base64 -i gcp-key.json > gcp-key-base64.txt
   ```

#### 3단계: GitLab CI/CD 구성

1. **GitLab 프로젝트로 이동**
   - GitLab 프로젝트로 이동
   - **Settings** → **CI/CD** → **Variables**로 이동

2. **CI/CD 변수 추가**
   다음 각각에 대해 "Add variable" 클릭:

   | 변수 이름 | 값 | Protected | Masked |
   |----------|-----|-----------|--------|
   | `GCP_SERVICE_ACCOUNT_KEY` | 2.4단계의 Base64 인코딩된 키 | ✅ | ✅ |
   | `GCP_PROJECT_ID` | GCP 프로젝트 ID | ✅ | ❌ |
   | `GCP_SERVICE_NAME` | `hyperflow-works` (또는 서비스 이름) | ✅ | ❌ |
   | `GCP_REGION` | `asia-northeast3` (서울) | ✅ | ❌ |
   | `GCP_PROJECT_HASH` | 선택사항: URL용 프로젝트 해시 | ✅ | ❌ |

   ⚠️ **중요**: 
   - `GCP_SERVICE_ACCOUNT_KEY`를 "Masked" 및 "Protected"로 표시
   - 값은 1-2단계의 실제 값으로 교체

3. **파이프라인 구성 확인**
   - `.gitlab-ci.yml`이 저장소 루트에 있는지 확인
   - 파일이 커밋되고 푸시되었는지 확인

#### 4단계: GitLab Webhook 설정 (선택사항)

1. **GitLab 프로젝트 설정으로 이동**
   - **Settings** → **Webhooks**로 이동

2. **Webhook 추가**
   - **URL**: GCP Cloud Build webhook 엔드포인트 (webhook 배포 사용 시)
   - **Trigger**: Push events, Tag push events
   - **Branch**: main, master
   - **Enable SSL verification**: Yes (권장)

3. **Webhook 테스트**
   - "Test" → "Push events"를 클릭하여 webhook 테스트

#### 5단계: 로컬 빌드 테스트

배포 전에 로컬에서 빌드를 테스트하세요:

1. **의존성 설치**
   ```bash
   pnpm install
   ```

2. **테스트 실행**
   ```bash
   pnpm test
   ```

3. **프로젝트 빌드**
   ```bash
   pnpm build
   ```

4. **빌드 출력 확인**
   - `frontend/dist/`와 `backend/dist/`가 생성되었는지 확인
   - 빌드 오류가 없는지 확인

5. **Docker 빌드 테스트**
   ```bash
   docker build -t hyperflow-works:test .
   docker run -p 3000:3000 hyperflow-works:test
   ```

#### 6단계: GitLab에 푸시

1. **변경사항 커밋**
   ```bash
   git add .
   git commit -m "Setup GCP Cloud Run deployment"
   git push origin main
   ```

2. **파이프라인 모니터링**
   - GitLab 프로젝트 → **CI/CD** → **Pipelines**로 이동
   - 파이프라인 실행 확인
   - 오류 확인

#### 7단계: 배포 확인

1. **Cloud Run 서비스 확인**
   - GCP Console → Cloud Run으로 이동
   - 서비스 찾기: `hyperflow-works`
   - URL 확인: `https://hyperflow-works-xxxxx.asia-northeast3.run.app`

2. **배포 테스트**
   - 배포된 URL 방문
   - 애플리케이션이 실행 중인지 확인
   - 문제가 있으면 로그 확인

#### 문제 해결

**빌드 단계에서 파이프라인 실패:**
- Node.js 버전 확인 (18.x여야 함)
- pnpm 버전 확인 (10.10.0이어야 함)
- 의존성 문제 확인

**테스트 단계에서 파이프라인 실패:**
- 테스트 파일이 있는지 확인
- Vitest 구성 확인
- CI/CD 로그에서 테스트 출력 검토

**배포 실패:**
- Service account key가 올바른지 확인 (base64 인코딩)
- Service account에 필요한 권한이 있는지 확인
- 프로젝트 ID 및 리전이 올바른지 확인
- GCP Console에서 Cloud Run 로그 확인

**Docker 빌드 실패:**
- Dockerfile 구문 확인
- 모든 의존성이 설치되었는지 확인
- 빌드 로그에서 특정 오류 확인

**Cloud Run 서비스가 응답하지 않음:**
- GCP Console에서 Cloud Run 로그 확인
- 환경 변수가 설정되었는지 확인
- 포트가 올바르게 구성되었는지 확인 (PORT=3000)
- 애플리케이션이 올바른 포트에서 수신 대기하는지 확인
