# 🚀 지금 바로 시작하기

## 가장 쉬운 방법: 자동 설정 스크립트 실행

터미널에서 다음 명령어를 **순서대로** 실행하세요:

```bash
# 1. 스크립트 실행 (모든 설정을 자동으로 완료)
./setup-gcp-next-steps.sh
```

스크립트가 실행되면:
- API 활성화
- 리전 설정
- Service Account 생성
- 권한 부여
- 키 파일 생성

모두 자동으로 처리됩니다!

---

## 수동으로 설정하기 (단계별)

스크립트를 사용하지 않으려면 다음 명령어를 **순서대로** 실행하세요:

### 1단계: Cloud Resource Manager API 활성화 (필수!)

```bash
gcloud services enable cloudresourcemanager.googleapis.com
```

### 2단계: 필요한 API 활성화

```bash
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 3단계: 리전 설정

```bash
gcloud config set run/region asia-northeast3
```

### 4단계: Service Account 생성

```bash
PROJECT_ID=$(gcloud config get-value project)

gcloud iam service-accounts create hyperflow-works-sa \
  --display-name="Hyperflow Works Service Account"
```

### 5단계: 권한 부여

```bash
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
```

### 6단계: 키 파일 생성

```bash
PROJECT_ID=$(gcloud config get-value project)

gcloud iam service-accounts keys create gcp-key.json \
  --iam-account=hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com
```

### 7단계: Base64 인코딩 (GitLab용)

```bash
base64 -i gcp-key.json | pbcopy
```

이 명령어는 키를 Base64로 인코딩해서 클립보드에 복사합니다.

---

## 설정 확인

설정이 완료되면 확인:

```bash
./check-gcp-status.sh
```

---

## 다음 단계

설정이 완료되면:

1. **GitLab CI/CD 변수 설정**
   - GitLab 프로젝트 → Settings → CI/CD → Variables
   - 다음 변수 추가:
     - `GCP_SERVICE_ACCOUNT_KEY`: (클립보드의 Base64 키)
     - `GCP_PROJECT_ID`: `hyperflow-works-hong`
     - `GCP_SERVICE_NAME`: `hyperflow-works`
     - `GCP_REGION`: `asia-northeast3`

2. **코드 푸시**
   ```bash
   git add .
   git commit -m "Setup GCP deployment"
   git push origin main
   ```

3. **배포 확인**
   - GitLab CI/CD 파이프라인에서 확인

---

## 💡 추천

**자동 스크립트를 사용하는 것을 강력히 추천합니다!**
- 오류 발생 가능성 낮음
- 모든 설정이 자동으로 완료
- 시간 절약

```bash
./setup-gcp-next-steps.sh
```

