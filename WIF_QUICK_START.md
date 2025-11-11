# 🚀 WIF 설정 빠른 시작

## 지금 바로 해야 할 것 (순서대로)

### 1단계: 프로젝트 번호 확인

```bash
gcloud projects describe hyperflow-works-hong --format="value(projectNumber)"
```

이 값을 복사하세요 (예: `818668788313`)

### 2단계: WIF Pool 및 Provider 생성

```bash
PROJECT_ID="hyperflow-works-hong"
PROJECT_NUMBER="818668788313"  # 1단계에서 확인한 값

# WIF Pool 생성
gcloud iam workload-identity-pools create gitlab-pool \
  --project=${PROJECT_ID} \
  --location="global" \
  --display-name="GitLab CI/CD Pool"

# WIF Provider 생성
gcloud iam workload-identity-pools providers create-oidc gitlab-provider \
  --project=${PROJECT_ID} \
  --location="global" \
  --workload-identity-pool="gitlab-pool" \
  --display-name="GitLab Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.aud=assertion.aud,attribute.project_path=assertion.project_path" \
  --issuer-uri="https://gitlab.com"
```

### 3단계: 서비스 계정에 WIF 권한 부여

```bash
PROJECT_ID="hyperflow-works-hong"
PROJECT_NUMBER="818668788313"  # 1단계에서 확인한 값
SERVICE_ACCOUNT="hyperflow-works-sa@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud iam service-accounts add-iam-policy-binding ${SERVICE_ACCOUNT} \
  --project=${PROJECT_ID} \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/gitlab-pool/attribute.project_path/*"
```

### 4단계: Artifact Registry 저장소 생성

```bash
gcloud artifacts repositories create hyperflow-works-repo \
  --repository-format=docker \
  --location=asia-northeast3 \
  --description="Hyperflow Works Docker images"
```

### 5단계: GitLab CI/CD 변수 설정

**GitLab 저장소**: https://gitlab.com/seonhohong/hyperflow-works-demohong/-/settings/ci_cd

**Settings → CI/CD → Variables → Add variable**

다음 변수들을 추가:

1. **GCP_WIF_PROVIDER**
   - Value: `projects/818668788313/locations/global/workloadIdentityPools/gitlab-pool/providers/gitlab-provider`
   - (PROJECT_NUMBER는 1단계에서 확인한 값)

2. **GCP_SERVICE_ACCOUNT**
   - Value: `hyperflow-works-sa@hyperflow-works-hong.iam.gserviceaccount.com`

3. **GCP_PROJECT_ID**
   - Value: `hyperflow-works-hong`

4. **GCP_REGION**
   - Value: `asia-northeast3`

5. **GCP_AR_REPO**
   - Value: `hyperflow-works-repo`

### 6단계: 배포 테스트

```bash
git add .
git commit -m "Setup: WIF configuration"
git push origin main
```

## ✅ 확인

- GitLab 파이프라인: https://gitlab.com/seonhohong/hyperflow-works-demohong/-/pipelines
- GCP Cloud Run: https://console.cloud.google.com/run

## 📝 참고

자세한 내용은 `WIF_SETUP_GUIDE.md`를 참고하세요.

