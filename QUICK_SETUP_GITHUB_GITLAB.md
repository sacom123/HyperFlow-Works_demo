# 🚀 GitHub → GitLab 자동 동기화 빠른 설정

## 📋 저장소 정보

- **GitHub**: https://github.com/sacom123/HyperFlow-Works_demo
- **GitLab**: https://gitlab.com/sacom123/hyperflow-works-hong

## ✅ 단계별 설정

### 1단계: GitLab Personal Access Token 생성

1. 접속: https://gitlab.com/-/profile/personal_access_tokens
2. **Token name**: `github-sync`
3. **Scopes**: ✅ `write_repository`
4. **Create personal access token** 클릭
5. **Token 복사** (다시 볼 수 없음!)

### 2단계: GitHub Secrets 설정

1. 접속: https://github.com/sacom123/HyperFlow-Works_demo/settings/secrets/actions
2. **New repository secret** 클릭
3. 다음 Secrets 추가:

#### GITLAB_TOKEN (필수!)
- **Name**: `GITLAB_TOKEN`
- **Secret**: 위에서 생성한 GitLab Token

#### GCP 관련 Secrets
- `GCP_SERVICE_ACCOUNT_KEY`: `base64 -i gcp-key.json | pbcopy`
- `GCP_PROJECT_ID`: `hyperflow-works-hong`
- `GCP_SERVICE_NAME`: `hyperflow-works`
- `GCP_REGION`: `asia-northeast3`

### 3단계: Git 저장소 초기화 및 푸시

**프로젝트 폴더에서 실행:**

```bash
# 1. Git 초기화
git init

# 2. 사용자 정보 설정
git config user.name "Your Name"
git config user.email "your_email@example.com"

# 3. 파일 추가 및 커밋
git add .
git commit -m "Initial commit: Setup GitHub to GitLab sync"

# 4. main 브랜치로 변경
git branch -M main

# 5. GitHub 원격 저장소 추가
git remote add origin git@github.com:sacom123/HyperFlow-Works_demo.git

# 6. GitHub에 푸시
git push -u origin main
```

### 4단계: 확인

1. **GitHub Actions**: GitHub 저장소 → Actions 탭
2. **GitLab 동기화**: GitLab 저장소 → Repository → Files
3. **GitLab CI/CD**: GitLab 저장소 → CI/CD → Pipelines

## 🔄 자동 동기화 흐름

```
GitHub에 푸시
    ↓
GitHub Actions 실행
    ↓
GitLab에 자동 동기화
    ↓
GitLab CI/CD 실행
    ↓
GCP Cloud Run 배포
```

## 📝 일상적인 사용

```bash
# 코드 수정 후
git add .
git commit -m "Update: 변경 사항"
git push origin main

# 자동으로 GitLab에 동기화되고 CI/CD 실행!
```

## ✅ 완료!

이제 GitHub에만 푸시하면 GitLab에 자동으로 동기화되고 CI/CD가 실행됩니다!

