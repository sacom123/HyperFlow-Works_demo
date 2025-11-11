# 🚀 GitHub에 올리기 - 지금 바로 시작

## 1단계: GitHub 저장소 생성

1. 브라우저에서 접속: **https://github.com/new**
2. 저장소 설정:
   - **Repository name**: `hyperflow-works` (또는 원하는 이름)
   - **Description**: `Hyperflow Works - React 18 + Koa.js`
   - **Public** 또는 **Private** 선택
   - ⚠️ **README, .gitignore, license는 추가하지 마세요!** (이미 있음)
3. **Create repository** 클릭
4. 저장소 URL 확인: `git@github.com:username/hyperflow-works.git`

## 2단계: Git 저장소 초기화 및 푸시

터미널에서 다음 명령어를 **순서대로** 실행하세요:

```bash
# 1. Git 저장소 초기화
git init

# 2. Git 사용자 정보 설정 (아직 안 했다면)
git config user.name "Your Name"
git config user.email "your_email@example.com"

# 3. 모든 파일 추가
git add .

# 4. 커밋
git commit -m "Initial commit: Setup project with GCP Cloud Run deployment"

# 5. main 브랜치로 변경
git branch -M main

# 6. GitHub 원격 저장소 추가 (본인의 저장소 URL로 변경)
git remote add origin git@github.com:username/hyperflow-works.git

# 7. GitHub에 푸시
git push -u origin main
```

## 3단계: GitHub Secrets 설정

1. **GitHub 저장소 페이지 → Settings → Secrets and variables → Actions**
2. **New repository secret** 클릭하여 다음 Secrets 추가:

### GCP_SERVICE_ACCOUNT_KEY
- **Name**: `GCP_SERVICE_ACCOUNT_KEY`
- **Secret**: Base64 인코딩된 키
- 키 준비: `base64 -i gcp-key.json | pbcopy`

### GCP_PROJECT_ID
- **Name**: `GCP_PROJECT_ID`
- **Secret**: `hyperflow-works-hong`

### GCP_SERVICE_NAME
- **Name**: `GCP_SERVICE_NAME`
- **Secret**: `hyperflow-works`

### GCP_REGION
- **Name**: `GCP_REGION`
- **Secret**: `asia-northeast3`

### GCP_PROJECT_HASH (선택사항)
- **Name**: `GCP_PROJECT_HASH`
- **Secret**: (비워둬도 됨)

## 4단계: GitHub Actions 확인

1. **GitHub 저장소 → Actions 탭**
2. 워크플로우가 자동으로 실행됩니다
3. 배포 상태 확인

## ✅ 완료!

이제 GitHub에 코드가 올라가고 자동으로 GCP Cloud Run에 배포됩니다!

## 🔍 문제 해결

### 푸시 오류
- SSH 키가 GitHub에 등록되어 있는지 확인
- 원격 저장소 URL이 올바른지 확인
- `ssh -T git@github.com`로 연결 테스트

### GitHub Actions 실패
- Secrets가 올바르게 설정되었는지 확인
- 워크플로우 로그 확인
- GCP Service Account 권한 확인
