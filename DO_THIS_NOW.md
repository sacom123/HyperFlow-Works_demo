# 🎯 지금 바로 해야 할 것

## 1단계: GitLab Personal Access Token 생성

1. 브라우저에서 접속: **https://gitlab.com/-/profile/personal_access_tokens**
2. **Token name**: `github-sync`
3. **Scopes**: ✅ **write_repository** 체크
4. **Create personal access token** 클릭
5. **Token 복사** (예: `glpat-xxxxxxxxxxxxxxxxxxxx`)

## 2단계: GitHub Secrets 설정

1. 브라우저에서 접속: **https://github.com/sacom123/HyperFlow-Works_demo/settings/secrets/actions**
2. **New repository secret** 클릭
3. 다음 Secrets 추가:

### GITLAB_TOKEN (필수!)
- **Name**: `GITLAB_TOKEN`
- **Secret**: 1단계에서 복사한 GitLab Token

### GCP_SERVICE_ACCOUNT_KEY
- **Name**: `GCP_SERVICE_ACCOUNT_KEY`
- **Secret**: Base64 인코딩된 키
- 키 준비 (터미널에서):
  ```bash
  base64 -i gcp-key.json | pbcopy
  ```

### GCP_PROJECT_ID
- **Name**: `GCP_PROJECT_ID`
- **Secret**: `hyperflow-works-hong`

### GCP_SERVICE_NAME
- **Name**: `GCP_SERVICE_NAME`
- **Secret**: `hyperflow-works`

### GCP_REGION
- **Name**: `GCP_REGION`
- **Secret**: `asia-northeast3`

## 3단계: Git 저장소 초기화 및 푸시

**터미널에서 실행 (프로젝트 폴더에서):**

```bash
# 1. Git 초기화
git init

# 2. 사용자 정보 설정
git config user.name "Your Name"
git config user.email "your_email@example.com"

# 3. 파일 추가
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

## 4단계: 확인

1. **GitHub Actions**: https://github.com/sacom123/HyperFlow-Works_demo/actions
   - "Sync to GitLab" 워크플로우 확인

2. **GitLab 동기화**: https://gitlab.com/sacom123/hyperflow-works-hong
   - 코드가 동기화되었는지 확인

3. **GitLab CI/CD**: https://gitlab.com/sacom123/hyperflow-works-hong/-/pipelines
   - 파이프라인 실행 확인

## ✅ 완료!

이제 GitHub에만 푸시하면 자동으로:
- GitLab에 동기화
- GitLab CI/CD 실행
- GCP Cloud Run에 배포

됩니다!
