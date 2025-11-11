# WIF (Workload Identity Federation) 설정 가이드

## 🎯 현재 상태

- ✅ GCP 프로젝트: `hyperflow-works-hong`
- ✅ 서비스 계정: `hyperflow-works-sa@hyperflow-works-hong.iam.gserviceaccount.com`
- ✅ `.gitlab-ci.yml` WIF 방식으로 설정됨
- ⚠️ WIF Provider 설정 필요

## 📋 필요한 GitLab CI/CD 변수

`.gitlab-ci.yml`에서 필요한 변수들:

1. **GCP_WIF_PROVIDER** - WIF Provider 경로
2. **GCP_SERVICE_ACCOUNT** - 서비스 계정 이메일
3. **GCP_PROJECT_ID** - GCP 프로젝트 ID
4. **GCP_REGION** - Cloud Run 리전
5. **GCP_AR_REPO** - Artifact Registry 저장소 이름
6. **SERVICE_NAME** - Cloud Run 서비스 이름 (선택사항, 기본값: hyperflow-works)

## 🚀 단계별 설정

### 1단계: GCP에서 WIF Pool 및 Provider 생성

```bash
# 프로젝트 ID 설정
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

# WIF Provider 경로 확인
WIF_PROVIDER="projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/gitlab-pool/providers/gitlab-provider"
echo "WIF Provider: ${WIF_PROVIDER}"
```

### 2단계: 서비스 계정에 WIF 권한 부여

```bash
PROJECT_ID="hyperflow-works-hong"
SERVICE_ACCOUNT="hyperflow-works-sa@${PROJECT_ID}.iam.gserviceaccount.com"
PROJECT_NUMBER=$(gcloud projects describe ${PROJECT_ID} --format="value(projectNumber)")

# 서비스 계정에 WIF 사용 권한 부여
gcloud iam service-accounts add-iam-policy-binding ${SERVICE_ACCOUNT} \
  --project=${PROJECT_ID} \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/gitlab-pool/attribute.project_path/*"
```

### 3단계: Artifact Registry 저장소 생성

```bash
PROJECT_ID="hyperflow-works-hong"
REGION="asia-northeast3"
REPO_NAME="hyperflow-works-repo"

# Artifact Registry 저장소 생성
gcloud artifacts repositories create ${REPO_NAME} \
  --repository-format=docker \
  --location=${REGION} \
  --description="Hyperflow Works Docker images"

echo "Artifact Registry 저장소: ${REPO_NAME}"
```

### 4단계: GitLab CI/CD 변수 설정

GitLab 저장소: https://gitlab.com/seonhohong/hyperflow-works-demohong/-/settings/ci_cd

**Settings → CI/CD → Variables → Add variable**

#### 변수 1: GCP_WIF_PROVIDER
- **Key**: `GCP_WIF_PROVIDER`
- **Value**: `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/gitlab-pool/providers/gitlab-provider`
- **예시**: `projects/818668788313/locations/global/workloadIdentityPools/gitlab-pool/providers/gitlab-provider`
- **Type**: Variable
- **Flags**: 기본값

#### 변수 2: GCP_SERVICE_ACCOUNT
- **Key**: `GCP_SERVICE_ACCOUNT`
- **Value**: `hyperflow-works-sa@hyperflow-works-hong.iam.gserviceaccount.com`
- **Type**: Variable
- **Flags**: 기본값

#### 변수 3: GCP_PROJECT_ID
- **Key**: `GCP_PROJECT_ID`
- **Value**: `hyperflow-works-hong`
- **Type**: Variable
- **Flags**: 기본값

#### 변수 4: GCP_REGION
- **Key**: `GCP_REGION`
- **Value**: `asia-northeast3`
- **Type**: Variable
- **Flags**: 기본값

#### 변수 5: GCP_AR_REPO
- **Key**: `GCP_AR_REPO`
- **Value**: `hyperflow-works-repo` (3단계에서 생성한 저장소 이름)
- **Type**: Variable
- **Flags**: 기본값

#### 변수 6: SERVICE_NAME (선택사항)
- **Key**: `SERVICE_NAME`
- **Value**: `hyperflow-works`
- **Type**: Variable
- **Flags**: 기본값
- **참고**: `.gitlab-ci.yml`에 기본값이 있으므로 생략 가능

### 5단계: GitLab 프로젝트 설정

GitLab에서 OIDC 토큰을 사용하려면:

1. **GitLab 저장소 → Settings → CI/CD**
2. **Token Access** 섹션 확인
3. **CI_JOB_JWT_V2** 토큰이 활성화되어 있는지 확인 (GitLab 15.7+)

### 6단계: 배포 테스트

```bash
# 변경사항 커밋 및 푸시
git add .
git commit -m "Setup: WIF configuration"
git push origin main
```

## ✅ 확인 사항

### GCP 설정 확인

```bash
# WIF Pool 확인
gcloud iam workload-identity-pools list --location=global

# WIF Provider 확인
gcloud iam workload-identity-pools providers list \
  --workload-identity-pool=gitlab-pool \
  --location=global

# Artifact Registry 저장소 확인
gcloud artifacts repositories list --location=asia-northeast3
```

### GitLab 파이프라인 확인

- GitLab 파이프라인: https://gitlab.com/seonhohong/hyperflow-works-demohong/-/pipelines
- 각 단계의 로그 확인:
  - ✅ auth 단계: WIF 인증 성공
  - ✅ build 단계: Docker 이미지 빌드 및 푸시
  - ✅ deploy 단계: Cloud Run 배포

## 🔧 문제 해결

### WIF 인증 실패

**오류**: `ERROR: (gcloud.auth) Could not load credentials`

**해결**:
1. WIF Provider 경로가 올바른지 확인
2. 서비스 계정에 WIF 권한이 부여되었는지 확인
3. GitLab 변수 `GCP_WIF_PROVIDER` 값 확인

### Artifact Registry 권한 오류

**오류**: `PERMISSION_DENIED` 또는 `403 Forbidden`

**해결**:
```bash
# 서비스 계정에 Artifact Registry 권한 부여
gcloud artifacts repositories add-iam-policy-binding ${REPO_NAME} \
  --location=${REGION} \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/artifactregistry.writer"
```

## 📝 빠른 참조

### 프로젝트 정보
- **프로젝트 ID**: `hyperflow-works-hong`
- **프로젝트 번호**: `818668788313` (확인 필요)
- **서비스 계정**: `hyperflow-works-sa@hyperflow-works-hong.iam.gserviceaccount.com`
- **리전**: `asia-northeast3`

### WIF Provider 경로 형식
```
projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL_NAME/providers/PROVIDER_NAME
```

### GitLab 변수 요약
| 변수 | 값 예시 |
|------|---------|
| GCP_WIF_PROVIDER | `projects/818668788313/locations/global/workloadIdentityPools/gitlab-pool/providers/gitlab-provider` |
| GCP_SERVICE_ACCOUNT | `hyperflow-works-sa@hyperflow-works-hong.iam.gserviceaccount.com` |
| GCP_PROJECT_ID | `hyperflow-works-hong` |
| GCP_REGION | `asia-northeast3` |
| GCP_AR_REPO | `hyperflow-works-repo` |

## 🔗 유용한 링크

- GitLab 저장소: https://gitlab.com/seonhohong/hyperflow-works-demohong
- GitLab CI/CD 변수: https://gitlab.com/seonhohong/hyperflow-works-demohong/-/settings/ci_cd
- GitLab 파이프라인: https://gitlab.com/seonhohong/hyperflow-works-demohong/-/pipelines
- GCP Console: https://console.cloud.google.com
- GCP IAM: https://console.cloud.google.com/iam-admin

