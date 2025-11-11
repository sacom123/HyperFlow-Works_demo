# GitHub → GitLab 자동 동기화 설정

## 🎯 목표

GitHub에 커밋하면 GitLab에 자동으로 동기화되고, GitLab에서 CI/CD가 실행되어 GCP에 배포됩니다.

## 📋 저장소 정보

- **GitHub**: https://github.com/sacom123/HyperFlow-Works_demo
- **GitLab**: https://gitlab.com/sacom123/hyperflow-works-hong

## 🚀 설정 단계

### 1단계: GitLab Personal Access Token 생성

1. **GitLab 접속**
   - https://gitlab.com/-/profile/personal_access_tokens

2. **Token 생성**
   - **Token name**: `github-sync`
   - **Expiration date**: (선택사항, 비워두면 만료 없음)
   - **Select scopes**:
     - ✅ **write_repository** (필수)
   - **Create personal access token** 클릭

3. **Token 복사**
   - 생성된 토큰을 복사하세요 (예: `glpat-xxxxxxxxxxxxxxxxxxxx`)
   - ⚠️ **토큰은 다시 볼 수 없으므로 안전하게 저장하세요!**

### 2단계: GitHub Secrets 설정

1. **GitHub 저장소 접속**
   - https://github.com/sacom123/HyperFlow-Works_demo/settings/secrets/actions

2. **Secrets 추가**

#### Secret 1: GITLAB_TOKEN
- **Name**: `GITLAB_TOKEN`
- **Secret**: 위에서 생성한 GitLab Personal Access Token
- **Add secret** 클릭

#### Secret 2-5: GCP 관련 Secrets (이미 설정했다면 생략)

- `GCP_SERVICE_ACCOUNT_KEY`: Base64 인코딩된 키
- `GCP_PROJECT_ID`: `hyperflow-works-hong`
- `GCP_SERVICE_NAME`: `hyperflow-works`
- `GCP_REGION`: `asia-northeast3`

### 3단계: Git 저장소 초기화 및 GitHub에 푸시

터미널에서 실행 (프로젝트 폴더에서):

```bash
# 1. Git 저장소 초기화
git init

# 2. Git 사용자 정보 설정
git config user.name "Your Name"
git config user.email "your_email@example.com"

# 3. 모든 파일 추가
git add .

# 4. 커밋
git commit -m "Initial commit: Setup GitHub to GitLab sync"

# 5. main 브랜치로 변경
git branch -M main

# 6. GitHub 원격 저장소 추가
git remote add origin git@github.com:sacom123/HyperFlow-Works_demo.git

# 7. GitHub에 푸시
git push -u origin main
```

### 4단계: 자동 동기화 확인

1. **GitHub Actions 확인**
   - GitHub 저장소 → Actions 탭
   - "Sync to GitLab" 워크플로우가 실행됩니다

2. **GitLab 동기화 확인**
   - GitLab 저장소 → Repository → Files
   - 코드가 동기화되었는지 확인

3. **GitLab CI/CD 확인**
   - GitLab 저장소 → CI/CD → Pipelines
   - 파이프라인이 자동으로 실행됩니다

## 🔄 워크플로우

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

## ✅ 설정 확인

### GitHub Actions 확인

```bash
# GitHub 저장소 → Actions 탭
# "Sync to GitLab" 워크플로우 확인
```

### GitLab 동기화 확인

```bash
# GitLab 저장소 → Repository → Files
# 코드가 동기화되었는지 확인
```

### GitLab CI/CD 확인

```bash
# GitLab 저장소 → CI/CD → Pipelines
# 파이프라인 실행 상태 확인
```

## 🔧 문제 해결

### GitHub Actions가 GitLab에 푸시하지 않는 경우

1. **GITLAB_TOKEN 확인**:
   - GitHub Secrets에 토큰이 올바르게 설정되었는지 확인
   - GitLab Token에 `write_repository` 권한이 있는지 확인

2. **저장소 URL 확인**:
   - `.github/workflows/sync-to-gitlab.yml` 파일 확인
   - GitLab 저장소 URL이 올바른지 확인

### GitLab CI/CD가 실행되지 않는 경우

1. **파이프라인 파일 확인**:
   - `.gitlab-ci.yml` 파일이 저장소에 있는지 확인
   - 파일이 올바르게 커밋되었는지 확인

2. **GitLab CI/CD 변수 확인**:
   - GitLab 저장소 → Settings → CI/CD → Variables
   - GCP 관련 변수가 올바르게 설정되었는지 확인

## 📚 참고 문서

- `GITHUB_TO_GITLAB_SYNC.md` - 상세한 동기화 가이드
- `GITLAB_SETUP_GUIDE.md` - GitLab CI/CD 변수 설정
- `GCP_INSTALLATION_GUIDE.md` - GCP 설정 가이드

