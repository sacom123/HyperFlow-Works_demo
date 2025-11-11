# GitLab CI/CD 변수 설정 가이드

## 📋 필요한 정보 준비

GitLab CI/CD 변수를 설정하기 전에 다음 정보를 준비하세요:

1. **GCP 프로젝트 ID**: `hyperflow-works-hong`
2. **GCP 서비스 이름**: `hyperflow-works` (또는 원하는 이름)
3. **GCP 리전**: `asia-northeast3`
4. **GCP Service Account 키**: Base64 인코딩된 키

## 🔑 Service Account 키 준비

### 키 파일이 있는 경우

터미널에서 다음 명령어를 실행하여 Base64 인코딩된 키를 클립보드에 복사하세요:

```bash
# macOS
base64 -i gcp-key.json | pbcopy

# Linux
base64 -i gcp-key.json | xclip -selection clipboard
```

### 키 파일이 없는 경우

먼저 키 파일을 생성하세요:

```bash
PROJECT_ID=$(gcloud config get-value project)

gcloud iam service-accounts keys create gcp-key.json \
  --iam-account=hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com

# Base64 인코딩 (macOS)
base64 -i gcp-key.json | pbcopy
```

## 🔧 GitLab CI/CD 변수 설정

### 1단계: GitLab 프로젝트 접속

1. GitLab에 로그인
2. 프로젝트 페이지로 이동
3. 좌측 메뉴에서 **Settings** 클릭
4. 하위 메뉴에서 **CI/CD** 클릭
5. **Variables** 섹션으로 스크롤
6. **Expand** 버튼 클릭

### 2단계: 변수 추가

**Add variable** 버튼을 클릭하여 다음 변수들을 하나씩 추가하세요:

#### 변수 1: GCP_SERVICE_ACCOUNT_KEY

- **Key**: `GCP_SERVICE_ACCOUNT_KEY`
- **Value**: 클립보드에 복사한 Base64 인코딩된 키 (전체 내용)
- **Type**: Variable
- **Environment scope**: All (default)
- **Flags**:
  - ✅ **Protect variable**: 체크 (보호된 브랜치에서만 사용)
  - ✅ **Mask variable**: 체크 (로그에서 값 숨김)
  - ❌ **Expand variable reference**: 체크 해제

**⚠️ 중요**: 
- Value 필드에 Base64 인코딩된 키의 **전체 내용**을 붙여넣어야 합니다
- 여러 줄이므로 주의해서 복사하세요

#### 변수 2: GCP_PROJECT_ID

- **Key**: `GCP_PROJECT_ID`
- **Value**: `hyperflow-works-hong`
- **Type**: Variable
- **Environment scope**: All (default)
- **Flags**:
  - ✅ **Protect variable**: 체크
  - ❌ **Mask variable**: 체크 해제
  - ❌ **Expand variable reference**: 체크 해제

#### 변수 3: GCP_SERVICE_NAME

- **Key**: `GCP_SERVICE_NAME`
- **Value**: `hyperflow-works`
- **Type**: Variable
- **Environment scope**: All (default)
- **Flags**:
  - ✅ **Protect variable**: 체크
  - ❌ **Mask variable**: 체크 해제
  - ❌ **Expand variable reference**: 체크 해제

#### 변수 4: GCP_REGION

- **Key**: `GCP_REGION`
- **Value**: `asia-northeast3`
- **Type**: Variable
- **Environment scope**: All (default)
- **Flags**:
  - ✅ **Protect variable**: 체크
  - ❌ **Mask variable**: 체크 해제
  - ❌ **Expand variable reference**: 체크 해제

#### 변수 5: GCP_PROJECT_HASH (선택사항)

- **Key**: `GCP_PROJECT_HASH`
- **Value**: (비워둬도 됨 또는 프로젝트 해시)
- **Type**: Variable
- **Environment scope**: All (default)
- **Flags**:
  - ✅ **Protect variable**: 체크
  - ❌ **Mask variable**: 체크 해제
  - ❌ **Expand variable reference**: 체크 해제

**참고**: 이 변수는 환경 URL 생성에 사용됩니다. 비워둬도 작동합니다.

### 3단계: 변수 확인

설정한 변수들이 다음과 같이 표시되어야 합니다:

```
GCP_SERVICE_ACCOUNT_KEY  [Protected] [Masked]
GCP_PROJECT_ID           [Protected] hyperflow-works-hong
GCP_SERVICE_NAME         [Protected] hyperflow-works
GCP_REGION               [Protected] asia-northeast3
GCP_PROJECT_HASH         [Protected] (optional)
```

## 🧪 변수 테스트

### 방법 1: GitLab CI/CD 파이프라인 실행

1. 코드를 GitLab에 푸시:
   ```bash
   git add .
   git commit -m "Setup GitLab CI/CD variables"
   git push origin main
   ```

2. GitLab 프로젝트 → **CI/CD** → **Pipelines**로 이동
3. 파이프라인 실행 확인
4. 각 단계의 로그 확인

### 방법 2: 변수 값 확인 (디버깅용)

파이프라인의 `.gitlab-ci.yml` 파일에 다음을 추가하여 변수가 올바르게 설정되었는지 확인할 수 있습니다:

```yaml
# 디버깅용 (실제 사용 시 제거)
test:variables:
  stage: build
  script:
    - echo "GCP_PROJECT_ID: $GCP_PROJECT_ID"
    - echo "GCP_SERVICE_NAME: $GCP_SERVICE_NAME"
    - echo "GCP_REGION: $GCP_REGION"
    # GCP_SERVICE_ACCOUNT_KEY는 Masked이므로 출력하지 않음
```

## 🔍 문제 해결

### 변수가 인식되지 않는 경우

1. **변수 이름 확인**: 대소문자 정확히 일치하는지 확인
2. **Protect variable**: 보호된 브랜치에서만 사용 가능한지 확인
3. **Environment scope**: All로 설정되어 있는지 확인
4. **파이프라인 재실행**: 변수 추가 후 파이프라인을 다시 실행

### 인증 오류가 발생하는 경우

1. **GCP_SERVICE_ACCOUNT_KEY 확인**: 
   - Base64 인코딩이 올바른지 확인
   - 전체 키가 복사되었는지 확인 (여러 줄)
   - 앞뒤 공백이 없는지 확인

2. **Service Account 권한 확인**:
   ```bash
   PROJECT_ID=$(gcloud config get-value project)
   gcloud projects get-iam-policy $PROJECT_ID \
     --flatten="bindings[].members" \
     --filter="bindings.members:serviceAccount:hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com"
   ```

3. **키 파일 재생성**:
   ```bash
   PROJECT_ID=$(gcloud config get-value project)
   gcloud iam service-accounts keys create gcp-key.json \
     --iam-account=hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com
   base64 -i gcp-key.json | pbcopy
   ```

### 빌드 실패하는 경우

1. **GitLab CI/CD 로그 확인**: 어느 단계에서 실패했는지 확인
2. **Docker 빌드 오류**: `.gitlab-ci.yml` 파일의 Docker 설정 확인
3. **권한 오류**: Service Account 권한 확인
4. **API 활성화 확인**: GCP에서 필요한 API가 활성화되어 있는지 확인

## 📝 체크리스트

설정 완료 후 다음을 확인하세요:

- [ ] GCP_SERVICE_ACCOUNT_KEY가 추가되었고 Masked로 설정됨
- [ ] GCP_PROJECT_ID가 올바른 프로젝트 ID로 설정됨
- [ ] GCP_SERVICE_NAME이 설정됨
- [ ] GCP_REGION이 올바른 리전으로 설정됨
- [ ] 모든 변수가 Protected로 설정됨
- [ ] 코드가 GitLab에 푸시됨
- [ ] 파이프라인이 실행됨

## 🚀 다음 단계

변수 설정이 완료되면:

1. **코드 푸시**:
   ```bash
   git add .
   git commit -m "Setup GitLab CI/CD for GCP deployment"
   git push origin main
   ```

2. **파이프라인 확인**:
   - GitLab → CI/CD → Pipelines
   - 파이프라인 실행 상태 확인

3. **배포 확인**:
   - GCP Console → Cloud Run
   - 서비스가 배포되었는지 확인

## 🔗 유용한 링크

- GitLab CI/CD 변수: https://docs.gitlab.com/ee/ci/variables/
- GitLab 프로젝트 설정: 프로젝트 → Settings → CI/CD → Variables
- GCP Cloud Run: https://console.cloud.google.com/run

