# GCP 설치 및 설정 가이드 / GCP Installation Guide

[English](#english) | [한국어](#korean)

---

## English

### GCP Installation and Setup Guide

This guide will walk you through installing Google Cloud SDK and setting up your GCP project from scratch.

#### Step 1: Install Google Cloud SDK

##### macOS Installation

1. **Install using Homebrew (Recommended)**
   ```bash
   # Install Homebrew if you don't have it
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   
   # Install Google Cloud SDK
   brew install google-cloud-sdk
   ```

2. **Or download and install manually**
   ```bash
   # Download the SDK
   curl https://sdk.cloud.google.com | bash
   
   # Restart your shell or run:
   exec -l $SHELL
   ```

3. **Verify installation**
   ```bash
   gcloud --version
   ```

   You should see output similar to:
   ```
   Google Cloud SDK 400.0.0
   ...
   ```

##### Linux Installation

```bash
# Download and install
curl https://sdk.cloud.google.com | bash

# Restart your shell
exec -l $SHELL

# Verify installation
gcloud --version
```

##### Windows Installation

1. Download the installer from: https://cloud.google.com/sdk/docs/install-sdk
2. Run the installer and follow the instructions
3. Open a new command prompt and verify:
   ```cmd
   gcloud --version
   ```

#### Step 2: Initialize and Authenticate

1. **Initialize gcloud**
   ```bash
   gcloud init
   ```

   This will:
   - Prompt you to log in
   - Ask you to select or create a project
   - Set your default region/zone

2. **Login to your Google account**
   ```bash
   gcloud auth login
   ```

   This will open a browser window for authentication.

3. **Set up Application Default Credentials**
   ```bash
   gcloud auth application-default login
   ```

   This is needed for local development and CI/CD.

4. **Verify authentication**
   ```bash
   gcloud auth list
   ```

#### Step 3: Create a GCP Project

1. **Create a new project**
   ```bash
   gcloud projects create hyperflow-works-YOURNAME \
     --name="Hyperflow Works" \
     --set-as-default
   ```

   ⚠️ **Important**: Replace `YOURNAME` with your unique identifier. Project IDs must be globally unique.

2. **Or use the GCP Console**
   - Go to: https://console.cloud.google.com
   - Click "Select a project" → "New Project"
   - Enter project name and click "Create"

3. **Set the project as default**
   ```bash
   gcloud config set project hyperflow-works-YOURNAME
   ```

4. **Verify project setup**
   ```bash
   gcloud config list
   ```

#### Step 4: Enable Required APIs

1. **Enable Cloud Run API**
   ```bash
   gcloud services enable run.googleapis.com
   ```

2. **Enable Container Registry API**
   ```bash
   gcloud services enable containerregistry.googleapis.com
   ```

3. **Enable Cloud Build API**
   ```bash
   gcloud services enable cloudbuild.googleapis.com
   ```

4. **Verify enabled APIs**
   ```bash
   gcloud services list --enabled
   ```

#### Step 5: Set Default Region

1. **Set default region (Seoul - asia-northeast3)**
   ```bash
   gcloud config set run/region asia-northeast3
   ```

2. **Set default compute region**
   ```bash
   gcloud config set compute/region asia-northeast3
   ```

3. **Verify configuration**
   ```bash
   gcloud config list
   ```

#### Step 6: Create Service Account

1. **Create service account**
   ```bash
   PROJECT_ID=$(gcloud config get-value project)
   
   gcloud iam service-accounts create hyperflow-works-sa \
     --display-name="Hyperflow Works Service Account" \
     --description="Service account for Hyperflow Works deployment"
   ```

2. **Grant Cloud Run Admin role**
   ```bash
   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="serviceAccount:hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/run.admin"
   ```

3. **Grant Storage Admin role (for Container Registry)**
   ```bash
   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="serviceAccount:hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/storage.admin"
   ```

4. **Grant Service Account User role**
   ```bash
   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="serviceAccount:hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/iam.serviceAccountUser"
   ```

5. **Verify service account**
   ```bash
   gcloud iam service-accounts list
   ```

#### Step 7: Create Service Account Key

1. **Create and download the key**
   ```bash
   PROJECT_ID=$(gcloud config get-value project)
   
   gcloud iam service-accounts keys create gcp-key.json \
     --iam-account=hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com
   ```

   ⚠️ **Important**: Keep this file secure! Don't commit it to git.

2. **Add to .gitignore**
   ```bash
   echo "gcp-key.json" >> .gitignore
   echo "gcp-key-base64.txt" >> .gitignore
   ```

3. **Encode key to Base64 (for GitLab CI/CD)**
   ```bash
   # macOS
   base64 -i gcp-key.json | pbcopy
   
   # Linux
   base64 -i gcp-key.json | xclip -selection clipboard
   
   # Or save to file
   base64 -i gcp-key.json > gcp-key-base64.txt
   ```

#### Step 8: Verify Setup

1. **Test authentication**
   ```bash
   gcloud auth list
   ```

2. **Test project access**
   ```bash
   gcloud projects describe $(gcloud config get-value project)
   ```

3. **Test service account**
   ```bash
   PROJECT_ID=$(gcloud config get-value project)
   gcloud iam service-accounts describe hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com
   ```

#### Step 9: Install Docker (if not installed)

1. **macOS - Install Docker Desktop**
   ```bash
   brew install --cask docker
   ```

   Or download from: https://www.docker.com/products/docker-desktop

2. **Verify Docker installation**
   ```bash
   docker --version
   docker run hello-world
   ```

#### Step 10: Configure GitLab CI/CD Variables

1. **Go to GitLab Project**
   - Navigate to your GitLab project
   - Go to **Settings** → **CI/CD** → **Variables**

2. **Add the following variables:**
   - `GCP_SERVICE_ACCOUNT_KEY` - Paste the Base64 encoded key (Masked ✅, Protected ✅)
   - `GCP_PROJECT_ID` - Your project ID (e.g., `hyperflow-works-YOURNAME`)
   - `GCP_SERVICE_NAME` - Service name (e.g., `hyperflow-works`)
   - `GCP_REGION` - Region (e.g., `asia-northeast3`)
   - `GCP_PROJECT_HASH` - Optional (can be left empty)

#### Troubleshooting

**gcloud command not found:**
- Make sure you've installed the SDK
- Restart your terminal
- Check your PATH: `echo $PATH`

**Authentication errors:**
- Run `gcloud auth login` again
- Run `gcloud auth application-default login`
- Check your account: `gcloud auth list`

**Permission errors:**
- Verify service account has correct roles
- Check project permissions in GCP Console
- Verify you're using the correct project: `gcloud config get-value project`

**API not enabled:**
- Enable the API: `gcloud services enable <api-name>`
- Wait a few minutes for propagation
- Check in GCP Console: APIs & Services

**Docker not working:**
- Make sure Docker Desktop is running (macOS/Windows)
- Check Docker daemon: `docker ps`
- Restart Docker Desktop if needed

---

## Korean

### GCP 설치 및 설정 가이드

이 가이드는 Google Cloud SDK를 설치하고 GCP 프로젝트를 처음부터 설정하는 방법을 단계별로 안내합니다.

#### 1단계: Google Cloud SDK 설치

##### macOS 설치

1. **Homebrew를 사용한 설치 (권장)**
   ```bash
   # Homebrew가 없으면 설치
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   
   # Google Cloud SDK 설치
   brew install google-cloud-sdk
   ```

2. **또는 수동 다운로드 및 설치**
   ```bash
   # SDK 다운로드
   curl https://sdk.cloud.google.com | bash
   
   # 쉘 재시작 또는 실행:
   exec -l $SHELL
   ```

3. **설치 확인**
   ```bash
   gcloud --version
   ```

   다음과 같은 출력이 보여야 합니다:
   ```
   Google Cloud SDK 400.0.0
   ...
   ```

##### Linux 설치

```bash
# 다운로드 및 설치
curl https://sdk.cloud.google.com | bash

# 쉘 재시작
exec -l $SHELL

# 설치 확인
gcloud --version
```

##### Windows 설치

1. 설치 프로그램 다운로드: https://cloud.google.com/sdk/docs/install-sdk
2. 설치 프로그램 실행 및 지시사항 따르기
3. 새 명령 프롬프트 열고 확인:
   ```cmd
   gcloud --version
   ```

#### 2단계: 초기화 및 인증

1. **gcloud 초기화**
   ```bash
   gcloud init
   ```

   이것은 다음을 수행합니다:
   - 로그인 요청
   - 프로젝트 선택 또는 생성 요청
   - 기본 리전/존 설정

2. **Google 계정으로 로그인**
   ```bash
   gcloud auth login
   ```

   이것은 인증을 위해 브라우저 창을 엽니다.

3. **Application Default Credentials 설정**
   ```bash
   gcloud auth application-default login
   ```

   이것은 로컬 개발 및 CI/CD에 필요합니다.

4. **인증 확인**
   ```bash
   gcloud auth list
   ```

#### 3단계: GCP 프로젝트 생성

1. **새 프로젝트 생성**
   ```bash
   gcloud projects create hyperflow-works-YOURNAME \
     --name="Hyperflow Works" \
     --set-as-default
   ```

   ⚠️ **중요**: `YOURNAME`을 고유한 식별자로 교체하세요. 프로젝트 ID는 전역적으로 고유해야 합니다.

2. **또는 GCP Console 사용**
   - 이동: https://console.cloud.google.com
   - "Select a project" → "New Project" 클릭
   - 프로젝트 이름 입력 및 "Create" 클릭

3. **프로젝트를 기본값으로 설정**
   ```bash
   gcloud config set project hyperflow-works-YOURNAME
   ```

4. **프로젝트 설정 확인**
   ```bash
   gcloud config list
   ```

#### 4단계: 필요한 API 활성화

1. **Cloud Run API 활성화**
   ```bash
   gcloud services enable run.googleapis.com
   ```

2. **Container Registry API 활성화**
   ```bash
   gcloud services enable containerregistry.googleapis.com
   ```

3. **Cloud Build API 활성화**
   ```bash
   gcloud services enable cloudbuild.googleapis.com
   ```

4. **활성화된 API 확인**
   ```bash
   gcloud services list --enabled
   ```

#### 5단계: 기본 리전 설정

1. **기본 리전 설정 (서울 - asia-northeast3)**
   ```bash
   gcloud config set run/region asia-northeast3
   ```

2. **기본 compute 리전 설정**
   ```bash
   gcloud config set compute/region asia-northeast3
   ```

3. **설정 확인**
   ```bash
   gcloud config list
   ```

#### 6단계: Service Account 생성

1. **Service account 생성**
   ```bash
   PROJECT_ID=$(gcloud config get-value project)
   
   gcloud iam service-accounts create hyperflow-works-sa \
     --display-name="Hyperflow Works Service Account" \
     --description="Service account for Hyperflow Works deployment"
   ```

2. **Cloud Run Admin 역할 부여**
   ```bash
   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="serviceAccount:hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/run.admin"
   ```

3. **Storage Admin 역할 부여 (Container Registry용)**
   ```bash
   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="serviceAccount:hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/storage.admin"
   ```

4. **Service Account User 역할 부여**
   ```bash
   gcloud projects add-iam-policy-binding $PROJECT_ID \
     --member="serviceAccount:hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/iam.serviceAccountUser"
   ```

5. **Service account 확인**
   ```bash
   gcloud iam service-accounts list
   ```

#### 7단계: Service Account Key 생성

1. **키 생성 및 다운로드**
   ```bash
   PROJECT_ID=$(gcloud config get-value project)
   
   gcloud iam service-accounts keys create gcp-key.json \
     --iam-account=hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com
   ```

   ⚠️ **중요**: 이 파일을 안전하게 보관하세요! git에 커밋하지 마세요.

2. **.gitignore에 추가**
   ```bash
   echo "gcp-key.json" >> .gitignore
   echo "gcp-key-base64.txt" >> .gitignore
   ```

3. **Base64로 인코딩 (GitLab CI/CD용)**
   ```bash
   # macOS
   base64 -i gcp-key.json | pbcopy
   
   # Linux
   base64 -i gcp-key.json | xclip -selection clipboard
   
   # 또는 파일로 저장
   base64 -i gcp-key.json > gcp-key-base64.txt
   ```

#### 8단계: 설정 확인

1. **인증 테스트**
   ```bash
   gcloud auth list
   ```

2. **프로젝트 접근 테스트**
   ```bash
   gcloud projects describe $(gcloud config get-value project)
   ```

3. **Service account 테스트**
   ```bash
   PROJECT_ID=$(gcloud config get-value project)
   gcloud iam service-accounts describe hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com
   ```

#### 9단계: Docker 설치 (설치되어 있지 않은 경우)

1. **macOS - Docker Desktop 설치**
   ```bash
   brew install --cask docker
   ```

   또는 다운로드: https://www.docker.com/products/docker-desktop

2. **Docker 설치 확인**
   ```bash
   docker --version
   docker run hello-world
   ```

#### 10단계: GitLab CI/CD 변수 설정

1. **GitLab 프로젝트로 이동**
   - GitLab 프로젝트로 이동
   - **Settings** → **CI/CD** → **Variables**로 이동

2. **다음 변수 추가:**
   - `GCP_SERVICE_ACCOUNT_KEY` - Base64 인코딩된 키 붙여넣기 (Masked ✅, Protected ✅)
   - `GCP_PROJECT_ID` - 프로젝트 ID (예: `hyperflow-works-YOURNAME`)
   - `GCP_SERVICE_NAME` - 서비스 이름 (예: `hyperflow-works`)
   - `GCP_REGION` - 리전 (예: `asia-northeast3`)
   - `GCP_PROJECT_HASH` - 선택사항 (비워둬도 됨)

#### 문제 해결

**gcloud 명령어를 찾을 수 없음:**
- SDK가 설치되었는지 확인
- 터미널 재시작
- PATH 확인: `echo $PATH`

**인증 오류:**
- `gcloud auth login` 다시 실행
- `gcloud auth application-default login` 실행
- 계정 확인: `gcloud auth list`

**권한 오류:**
- Service account에 올바른 역할이 있는지 확인
- GCP Console에서 프로젝트 권한 확인
- 올바른 프로젝트를 사용하는지 확인: `gcloud config get-value project`

**API가 활성화되지 않음:**
- API 활성화: `gcloud services enable <api-name>`
- 전파를 위해 몇 분 대기
- GCP Console에서 확인: APIs & Services

**Docker가 작동하지 않음:**
- Docker Desktop이 실행 중인지 확인 (macOS/Windows)
- Docker daemon 확인: `docker ps`
- 필요시 Docker Desktop 재시작

