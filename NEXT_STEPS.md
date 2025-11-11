# 🎯 다음 단계: GitHub → GitLab 자동 동기화 설정

## ✅ 현재 상태

- ✅ Git 저장소 초기화 완료
- ✅ GitHub 원격 저장소 설정 완료 (`git@github.com:sacom123/HyperFlow-Works_demo`)
- ✅ GitHub Actions 워크플로우 파일 생성 완료 (`.github/workflows/sync-to-gitlab.yml`)

## 📋 지금 해야 할 것

### 1단계: GitLab Personal Access Token 생성 (필수!)

1. **브라우저에서 접속**
   - https://gitlab.com/-/profile/personal_access_tokens

2. **Token 생성**
   - **Token name**: `github-sync`
   - **Expiration date**: (선택사항, 비워두면 만료 없음)
   - **Select scopes**:
     - ✅ **write_repository** (필수!)
   - **Create personal access token** 클릭

3. **Token 복사**
   - 생성된 토큰을 복사하세요 (예: `glpat-xxxxxxxxxxxxxxxxxxxx`)
   - ⚠️ **토큰은 다시 볼 수 없으므로 안전하게 저장하세요!**

### 2단계: GitHub Secrets 설정 (필수!)

1. **브라우저에서 접속**
   - https://github.com/sacom123/HyperFlow-Works_demo/settings/secrets/actions

2. **Secrets 추가**

#### GITLAB_TOKEN (필수!)
- **Name**: `GITLAB_TOKEN`
- **Secret**: 1단계에서 복사한 GitLab Personal Access Token
- **Add secret** 클릭

#### GCP 관련 Secrets (이미 설정했다면 생략)

- `GCP_SERVICE_ACCOUNT_KEY`: Base64 인코딩된 키
  - 키 준비: `base64 -i gcp-key.json | pbcopy`
- `GCP_PROJECT_ID`: `hyperflow-works-hong`
- `GCP_SERVICE_NAME`: `hyperflow-works`
- `GCP_REGION`: `asia-northeast3`

### 3단계: 변경사항 커밋 및 푸시

**터미널에서 실행 (프로젝트 폴더에서):**

```bash
# 1. 새로 만든 파일들 추가
git add .

# 2. 커밋
git commit -m "Add: GitHub to GitLab sync workflow"

# 3. GitHub에 푸시
git push origin main
```

### 4단계: 확인

1. **GitHub Actions 확인**
   - https://github.com/sacom123/HyperFlow-Works_demo/actions
   - "Sync to GitLab" 워크플로우가 실행되는지 확인

2. **GitLab 동기화 확인**
   - https://gitlab.com/sacom123/hyperflow-works-hong
   - 코드가 동기화되었는지 확인

3. **GitLab CI/CD 확인**
   - https://gitlab.com/sacom123/hyperflow-works-hong/-/pipelines
   - 파이프라인이 자동으로 실행되는지 확인

## 🔄 자동 동기화 흐름

```
GitHub에 푸시
    ↓
GitHub Actions 실행 (sync-to-gitlab.yml)
    ↓
GitLab에 자동 동기화
    ↓
GitLab CI/CD 파이프라인 실행 (.gitlab-ci.yml)
    ↓
GCP Cloud Run에 배포
```

## 📝 일상적인 사용

이제부터는 GitHub에만 푸시하면 됩니다:

```bash
# 코드 수정
# ... 코드 작성 ...

# 변경사항 커밋
git add .
git commit -m "Update: 변경 사항"

# GitHub에 푸시 (자동으로 GitLab에 동기화되고 CI/CD 실행)
git push origin main
```

## 🔧 문제 해결

### GitHub Actions가 GitLab에 푸시하지 않는 경우

1. **GITLAB_TOKEN 확인**
   - GitHub Secrets에 토큰이 올바르게 설정되었는지 확인
   - GitLab Token에 `write_repository` 권한이 있는지 확인

2. **저장소 URL 확인**
   - `.github/workflows/sync-to-gitlab.yml` 파일 확인
   - GitLab 저장소 URL이 올바른지 확인: `sacom123/hyperflow-works-hong`

### GitLab CI/CD가 실행되지 않는 경우

1. **파이프라인 파일 확인**
   - `.gitlab-ci.yml` 파일이 저장소에 있는지 확인
   - 파일이 올바르게 커밋되었는지 확인

2. **GitLab CI/CD 변수 확인**
   - GitLab 저장소 → Settings → CI/CD → Variables
   - GCP 관련 변수가 올바르게 설정되었는지 확인

## 🔗 유용한 링크

- GitHub 저장소: https://github.com/sacom123/HyperFlow-Works_demo
- GitLab 저장소: https://gitlab.com/sacom123/hyperflow-works-hong
- GitLab Personal Access Tokens: https://gitlab.com/-/profile/personal_access_tokens
- GitHub Secrets: https://github.com/sacom123/HyperFlow-Works_demo/settings/secrets/actions
- GitLab CI/CD: https://gitlab.com/sacom123/hyperflow-works-hong/-/pipelines

## ✅ 체크리스트

- [ ] GitLab Personal Access Token 생성
- [ ] GitHub Secrets에 `GITLAB_TOKEN` 추가
- [ ] GitHub Secrets에 GCP 관련 Secrets 추가 (이미 설정했다면 생략)
- [ ] 변경사항 커밋 및 GitHub에 푸시
- [ ] GitHub Actions 워크플로우 확인
- [ ] GitLab에 코드 동기화 확인
- [ ] GitLab CI/CD 파이프라인 실행 확인
- [ ] GCP Cloud Run 배포 확인

