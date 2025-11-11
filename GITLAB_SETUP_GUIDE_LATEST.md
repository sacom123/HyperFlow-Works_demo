# GitLab CI/CD 변수 설정 가이드 (최신 버전)

## 🎯 GitLab 변수 추가 화면 설정 방법

GitLab의 "변수 추가" 모달 창이 열려있는 상태에서 다음 단계를 따라하세요.

## 📋 변수 추가 순서

### 1번째 변수: GCP_SERVICE_ACCOUNT_KEY

**모달 창에서 설정:**

1. **유형 (Type)**: 
   - `변수(기본값)` 선택 (기본값 그대로)

2. **환경 (Environment)**:
   - `모두(기본값)` 선택 (기본값 그대로)

3. **시계 (Visibility)**:
   - ✅ **"가면을 쓰고 숨김" (Masked and Hidden)** 선택
   - ⚠️ 중요: "가면을 쓴"이 아닌 "가면을 쓰고 숨김"을 선택해야 합니다!
   - 이렇게 하면 변수가 저장된 후 CI/CD 설정에서도 값이 공개되지 않습니다.

4. **깃발 (Flags)**:
   - ✅ **"변수 보호" (Protect variable)**: 체크
   - ❌ **"변수 참조 확장" (Expand variable references)**: 체크 해제

5. **설명 (선택 사항)**:
   - `GCP Service Account Key (Base64 encoded)` (선택사항)

6. **열쇠 (Key)**:
   - `GCP_SERVICE_ACCOUNT_KEY`

7. **값 (Value)**:
   - 클립보드에 복사한 Base64 인코딩된 키 전체 내용 붙여넣기
   - ⚠️ 중요: 전체 키를 붙여넣어야 합니다 (여러 줄)
   - 키 복사 명령어: `base64 -i gcp-key.json | pbcopy`

8. **"변수 추가" 버튼 클릭**

---

### 2번째 변수: GCP_PROJECT_ID

1. **유형 (Type)**: `변수(기본값)` (기본값)

2. **환경 (Environment)**: `모두(기본값)` (기본값)

3. **시계 (Visibility)**:
   - ✅ **"보이는" (Visible)** 선택
   - (이 변수는 민감하지 않으므로 보이게 설정 가능)

4. **깃발 (Flags)**:
   - ✅ **"변수 보호" (Protect variable)**: 체크
   - ❌ **"변수 참조 확장" (Expand variable references)**: 체크 해제

5. **열쇠 (Key)**:
   - `GCP_PROJECT_ID`

6. **값 (Value)**:
   - `hyperflow-works-hong`

7. **"변수 추가" 버튼 클릭**

---

### 3번째 변수: GCP_SERVICE_NAME

1. **유형 (Type)**: `변수(기본값)` (기본값)

2. **환경 (Environment)**: `모두(기본값)` (기본값)

3. **시계 (Visibility)**:
   - ✅ **"보이는" (Visible)** 선택

4. **깃발 (Flags)**:
   - ✅ **"변수 보호" (Protect variable)**: 체크
   - ❌ **"변수 참조 확장" (Expand variable references)**: 체크 해제

5. **열쇠 (Key)**:
   - `GCP_SERVICE_NAME`

6. **값 (Value)**:
   - `hyperflow-works`

7. **"변수 추가" 버튼 클릭**

---

### 4번째 변수: GCP_REGION

1. **유형 (Type)**: `변수(기본값)` (기본값)

2. **환경 (Environment)**: `모두(기본값)` (기본값)

3. **시계 (Visibility)**:
   - ✅ **"보이는" (Visible)** 선택

4. **깃발 (Flags)**:
   - ✅ **"변수 보호" (Protect variable)**: 체크
   - ❌ **"변수 참조 확장" (Expand variable references)**: 체크 해제

5. **열쇠 (Key)**:
   - `GCP_REGION`

6. **값 (Value)**:
   - `asia-northeast3`

7. **"변수 추가" 버튼 클릭**

---

### 5번째 변수: GCP_PROJECT_HASH (선택사항)

이 변수는 선택사항입니다. 비워둬도 작동합니다.

1. **유형 (Type)**: `변수(기본값)` (기본값)

2. **환경 (Environment)**: `모두(기본값)` (기본값)

3. **시계 (Visibility)**:
   - ✅ **"보이는" (Visible)** 선택

4. **깃발 (Flags)**:
   - ✅ **"변수 보호" (Protect variable)**: 체크
   - ❌ **"변수 참조 확장" (Expand variable references)**: 체크 해제

5. **열쇠 (Key)**:
   - `GCP_PROJECT_HASH`

6. **값 (Value)**:
   - (비워둬도 됨)

7. **"변수 추가" 버튼 클릭**

---

## ✅ 설정 확인

변수를 모두 추가한 후, "프로젝트 변수" 섹션에서 다음과 같이 표시되어야 합니다:

```
GCP_SERVICE_ACCOUNT_KEY  [가면을 쓰고 숨김] [변수 보호]
GCP_PROJECT_ID           [보이는] [변수 보호] hyperflow-works-hong
GCP_SERVICE_NAME         [보이는] [변수 보호] hyperflow-works
GCP_REGION               [보이는] [변수 보호] asia-northeast3
GCP_PROJECT_HASH         [보이는] [변수 보호] (비어있음)
```

## 🔑 키 파일 준비

터미널에서 다음 명령어를 실행하여 키를 클립보드에 복사하세요:

```bash
# 키 파일이 있는지 확인
ls -la gcp-key.json

# Base64 인코딩하여 클립보드에 복사 (macOS)
base64 -i gcp-key.json | pbcopy

# 키가 클립보드에 복사되었습니다!
```

키 파일이 없다면:

```bash
PROJECT_ID=$(gcloud config get-value project)

gcloud iam service-accounts keys create gcp-key.json \
  --iam-account=hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com

# Base64 인코딩
base64 -i gcp-key.json | pbcopy
```

## ⚠️ 중요 사항

### GCP_SERVICE_ACCOUNT_KEY 설정 시

1. **Visibility 설정**:
   - ✅ **"가면을 쓰고 숨김" (Masked and Hidden)** 선택
   - "가면을 쓴"만 선택하면 CI/CD 설정에서 값이 공개될 수 있습니다
   - "가면을 쓰고 숨김"을 선택하면 저장 후 절대 공개되지 않습니다

2. **값 입력**:
   - Base64 인코딩된 키의 **전체 내용**을 붙여넣어야 합니다
   - 앞뒤 공백이나 줄바꿈이 없어야 합니다
   - 한 줄로 붙여넣어야 합니다

3. **변수 보호**:
   - 반드시 "변수 보호"를 체크하세요
   - 보호된 브랜치(main, master)에서만 사용됩니다

### 다른 변수들 설정 시

1. **GCP_PROJECT_ID**, **GCP_SERVICE_NAME**, **GCP_REGION**:
   - Visibility: "보이는" (Visible) 선택 가능
   - 민감하지 않은 정보이므로 보이게 설정해도 안전합니다

2. **변수 보호**:
   - 모든 변수에 "변수 보호"를 체크하세요
   - 프로덕션 배포에만 사용되도록 보호됩니다

## 🧪 변수 테스트

변수 설정 후 테스트:

1. **코드 푸시**:
   ```bash
   git add .
   git commit -m "Setup GitLab CI/CD variables"
   git push origin main
   ```

2. **파이프라인 확인**:
   - GitLab → Build → Pipelines
   - 파이프라인 실행 상태 확인
   - 각 단계의 로그 확인

3. **변수 사용 확인**:
   - 파이프라인 로그에서 변수가 올바르게 사용되는지 확인
   - GCP_SERVICE_ACCOUNT_KEY는 마스킹되어 표시됩니다

## 🔍 문제 해결

### 변수가 인식되지 않는 경우

1. **변수 이름 확인**:
   - 대소문자 정확히 일치하는지 확인
   - 언더스코어(_) 사용 확인

2. **변수 보호 확인**:
   - "변수 보호"가 체크되어 있고
   - main/master 브랜치에서 실행 중인지 확인

3. **환경 범위 확인**:
   - "모두(기본값)"로 설정되어 있는지 확인

### 인증 오류가 발생하는 경우

1. **GCP_SERVICE_ACCOUNT_KEY 확인**:
   - Base64 인코딩이 올바른지 확인
   - 전체 키가 복사되었는지 확인
   - 앞뒤 공백이 없는지 확인

2. **키 재생성**:
   ```bash
   PROJECT_ID=$(gcloud config get-value project)
   gcloud iam service-accounts keys create gcp-key.json \
     --iam-account=hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com
   base64 -i gcp-key.json | pbcopy
   ```
   - GitLab에서 기존 변수를 삭제하고 새로 추가

3. **Service Account 권한 확인**:
   ```bash
   PROJECT_ID=$(gcloud config get-value project)
   gcloud projects get-iam-policy $PROJECT_ID \
     --flatten="bindings[].members" \
     --filter="bindings.members:serviceAccount:hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com"
   ```

## 📝 체크리스트

변수 설정 완료 후 확인:

- [ ] GCP_SERVICE_ACCOUNT_KEY가 "가면을 쓰고 숨김"으로 설정됨
- [ ] GCP_SERVICE_ACCOUNT_KEY에 "변수 보호"가 체크됨
- [ ] GCP_PROJECT_ID가 올바른 프로젝트 ID로 설정됨
- [ ] GCP_SERVICE_NAME이 설정됨
- [ ] GCP_REGION이 올바른 리전으로 설정됨
- [ ] 모든 변수에 "변수 보호"가 체크됨
- [ ] "변수 참조 확장"이 체크 해제됨
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
   - GitLab → Build → Pipelines
   - 파이프라인 실행 상태 확인

3. **배포 확인**:
   - GCP Console → Cloud Run
   - 서비스가 배포되었는지 확인
   - 서비스 URL 확인

## 🔗 유용한 링크

- GitLab CI/CD 변수: https://docs.gitlab.com/ee/ci/variables/
- GitLab 변수 보안: https://docs.gitlab.com/ee/ci/variables/#cicd-variable-security
- GCP Cloud Run: https://console.cloud.google.com/run

