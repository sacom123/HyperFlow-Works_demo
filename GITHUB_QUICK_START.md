# GitHub 빠른 시작 가이드

## 🚀 가장 쉬운 방법: 자동 스크립트

```bash
./setup-github-repo.sh
```

스크립트가 자동으로:
1. Git 저장소 초기화
2. Git 사용자 정보 설정
3. GitHub 원격 저장소 설정
4. 안내 메시지 표시

## 📝 수동 설정 (단계별)

### 1단계: GitHub 저장소 생성

1. **GitHub 접속**: https://github.com/new
2. **저장소 설정**:
   - Repository name: `hyperflow-works`
   - Description: `Hyperflow Works - React 18 + Koa.js`
   - Public 또는 Private 선택
   - **README, .gitignore, license는 추가하지 마세요** (이미 있음)
3. **Create repository** 클릭

### 2단계: Git 저장소 초기화

```bash
# Git 저장소 초기화
git init

# Git 사용자 정보 설정 (아직 안 했다면)
git config user.name "Your Name"
git config user.email "your_email@example.com"
```

### 3단계: GitHub 원격 저장소 설정

```bash
# GitHub 저장소 URL (본인의 것으로 변경)
git remote add origin git@github.com:username/hyperflow-works.git

# 확인
git remote -v
```

### 4단계: 코드 커밋 및 푸시

```bash
# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit: Setup project with GCP Cloud Run deployment"

# main 브랜치로 변경
git branch -M main

# GitHub에 푸시
git push -u origin main
```

### 5단계: GitHub Secrets 설정

1. **GitHub 저장소 → Settings → Secrets and variables → Actions**
2. **New repository secret** 클릭
3. 다음 Secrets 추가:

#### Secret 1: GCP_SERVICE_ACCOUNT_KEY
- **Name**: `GCP_SERVICE_ACCOUNT_KEY`
- **Secret**: Base64 인코딩된 키
- 키 준비: `base64 -i gcp-key.json | pbcopy`

#### Secret 2: GCP_PROJECT_ID
- **Name**: `GCP_PROJECT_ID`
- **Secret**: `hyperflow-works-hong`

#### Secret 3: GCP_SERVICE_NAME
- **Name**: `GCP_SERVICE_NAME`
- **Secret**: `hyperflow-works`

#### Secret 4: GCP_REGION
- **Name**: `GCP_REGION`
- **Secret**: `asia-northeast3`

#### Secret 5: GCP_PROJECT_HASH (선택사항)
- **Name**: `GCP_PROJECT_HASH`
- **Secret**: (비워둬도 됨)

### 6단계: GitHub Actions 확인

1. **GitHub 저장소 → Actions 탭**
2. 워크플로우가 자동으로 실행됩니다
3. 배포 상태 확인

## ✅ 완료!

이제 GitHub에 코드가 올라가고 자동으로 GCP Cloud Run에 배포됩니다!

## 🔗 유용한 링크

- GitHub 저장소 생성: https://github.com/new
- GitHub Secrets: 저장소 → Settings → Secrets and variables → Actions
- GitHub Actions: 저장소 → Actions 탭
- GCP Cloud Run: https://console.cloud.google.com/run

