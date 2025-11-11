# GitHub 저장소 설정 및 배포 가이드

## 🚀 GitHub에 프로젝트 올리기

GitHub에 코드를 올리고 GitHub Actions를 통해 GCP Cloud Run에 배포하는 방법입니다.

## 1단계: GitHub 저장소 생성

### GitHub 웹사이트에서 생성

1. **GitHub 접속**
   - https://github.com 에 로그인

2. **새 저장소 생성**
   - 우측 상단 **+** 버튼 클릭
   - **New repository** 선택

3. **저장소 설정**
   - **Repository name**: `hyperflow-works` (또는 원하는 이름)
   - **Description**: `Hyperflow Works - React 18 + Koa.js + Ant Design`
   - **Visibility**: 
     - ✅ **Public** (공개) - 무료
     - ✅ **Private** (비공개) - 유료 (또는 GitHub Pro)
   - **Initialize this repository with**:
     - ❌ Add a README file (체크 해제 - 이미 README가 있음)
     - ❌ Add .gitignore (체크 해제 - 이미 .gitignore가 있음)
     - ❌ Choose a license (체크 해제)
   - **Create repository** 클릭

4. **저장소 URL 확인**
   - 생성된 저장소 페이지에서 SSH URL 확인
   - 예: `git@github.com:username/hyperflow-works.git`

## 2단계: GitHub SSH 키 등록 (아직 안 했다면)

### SSH 키 확인

```bash
# SSH 키가 있는지 확인
ls -la ~/.ssh/id_ed25519.pub
```

### 공개 키 복사

```bash
# 공개 키를 클립보드에 복사
pbcopy < ~/.ssh/id_ed25519.pub
```

### GitHub에 SSH 키 등록

1. **GitHub 접속**
   - https://github.com/settings/keys

2. **SSH 키 추가**
   - **New SSH key** 클릭
   - **Title**: 키 이름 입력 (예: `MacBook Pro`)
   - **Key**: 클립보드 내용 붙여넣기 (Cmd+V)
   - **Add SSH key** 클릭

### SSH 연결 테스트

```bash
ssh -T git@github.com
```

**성공 메시지:**
```
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

## 3단계: Git 원격 저장소 설정

### 현재 원격 저장소 확인

```bash
git remote -v
```

### GitHub 원격 저장소 추가

```bash
# GitHub 저장소 URL (본인의 저장소 URL로 변경)
git remote add github git@github.com:username/hyperflow-works.git

# 또는 기존 origin을 GitHub로 변경
git remote set-url origin git@github.com:username/hyperflow-works.git
```

### 원격 저장소 확인

```bash
git remote -v
```

다음과 같이 표시되어야 합니다:
```
github  git@github.com:username/hyperflow-works.git (fetch)
github  git@github.com:username/hyperflow-works.git (push)
```

## 4단계: 코드 푸시

### 변경사항 커밋 및 푸시

```bash
# 변경사항 확인
git status

# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit: Setup project with GCP Cloud Run deployment"

# GitHub에 푸시
git push github main

# 또는 origin으로 설정했다면
git push origin main
```

## 5단계: GitHub Secrets 설정

GitHub Actions에서 GCP에 배포하기 위해 Secrets를 설정해야 합니다.

### GitHub Secrets 추가

1. **GitHub 저장소 페이지 접속**
   - 저장소 페이지로 이동
   - **Settings** 클릭

2. **Secrets 설정**
   - 좌측 메뉴에서 **Secrets and variables** 클릭
   - **Actions** 선택
   - **New repository secret** 클릭

3. **Secrets 추가**

#### Secret 1: GCP_SERVICE_ACCOUNT_KEY

- **Name**: `GCP_SERVICE_ACCOUNT_KEY`
- **Secret**: Base64 인코딩된 Service Account 키
- **Add secret** 클릭

키를 준비하려면:
```bash
# Base64 인코딩된 키를 클립보드에 복사
base64 -i gcp-key.json | pbcopy
```

#### Secret 2: GCP_PROJECT_ID

- **Name**: `GCP_PROJECT_ID`
- **Secret**: `hyperflow-works-hong`
- **Add secret** 클릭

#### Secret 3: GCP_SERVICE_NAME

- **Name**: `GCP_SERVICE_NAME`
- **Secret**: `hyperflow-works`
- **Add secret** 클릭

#### Secret 4: GCP_REGION

- **Name**: `GCP_REGION`
- **Secret**: `asia-northeast3`
- **Add secret** 클릭

#### Secret 5: GCP_PROJECT_HASH (선택사항)

- **Name**: `GCP_PROJECT_HASH`
- **Secret**: (비워둬도 됨)
- **Add secret** 클릭

### Secrets 확인

설정한 Secrets가 다음과 같이 표시되어야 합니다:
```
✅ GCP_SERVICE_ACCOUNT_KEY  (값이 숨김 처리됨)
✅ GCP_PROJECT_ID           (값이 숨김 처리됨)
✅ GCP_SERVICE_NAME         (값이 숨김 처리됨)
✅ GCP_REGION               (값이 숨김 처리됨)
✅ GCP_PROJECT_HASH         (값이 숨김 처리됨, 선택사항)
```

## 6단계: GitHub Actions 확인

### 워크플로우 파일 확인

`.github/workflows/ci-cd.yml` 파일이 있는지 확인:

```bash
ls -la .github/workflows/ci-cd.yml
```

파일이 있으면 GitHub Actions가 자동으로 작동합니다.

### GitHub Actions 활성화

1. **GitHub 저장소 페이지**
   - **Actions** 탭 클릭
   - 워크플로우가 자동으로 활성화됩니다

2. **워크플로우 실행**
   - 코드를 푸시하면 자동으로 워크플로우가 실행됩니다
   - **Actions** 탭에서 실행 상태 확인

## 7단계: 배포 확인

### GitHub Actions 실행 확인

1. **GitHub 저장소 → Actions 탭**
2. **워크플로우 실행 상태 확인**
3. **각 단계의 로그 확인**

### GCP Cloud Run 확인

1. **GCP Console 접속**
   - https://console.cloud.google.com/run

2. **서비스 확인**
   - `hyperflow-works` 서비스 확인
   - 서비스 URL 확인

3. **배포된 앱 확인**
   - 서비스 URL 방문
   - 애플리케이션이 정상 작동하는지 확인

## 🔧 GitLab과 GitHub 동시 사용

GitLab과 GitHub를 모두 사용하려면:

### 원격 저장소 설정

```bash
# GitLab 원격 저장소 (기존)
git remote add gitlab git@gitlab.com:username/hyperflow-works.git

# GitHub 원격 저장소
git remote add github git@github.com:username/hyperflow-works.git

# 원격 저장소 확인
git remote -v
```

### 양쪽에 푸시

```bash
# GitLab에 푸시
git push gitlab main

# GitHub에 푸시
git push github main

# 또는 양쪽에 동시에 푸시
git push gitlab main && git push github main
```

## 📋 빠른 참조

### GitHub 저장소 생성 후 푸시

```bash
# 1. GitHub 저장소 생성 (웹사이트에서)

# 2. 원격 저장소 추가
git remote add github git@github.com:username/hyperflow-works.git

# 3. 코드 푸시
git add .
git commit -m "Setup GitHub repository"
git push github main
```

### GitHub Secrets 설정

1. GitHub 저장소 → Settings → Secrets and variables → Actions
2. 다음 Secrets 추가:
   - `GCP_SERVICE_ACCOUNT_KEY`: Base64 인코딩된 키
   - `GCP_PROJECT_ID`: `hyperflow-works-hong`
   - `GCP_SERVICE_NAME`: `hyperflow-works`
   - `GCP_REGION`: `asia-northeast3`

### GitHub Actions 확인

1. GitHub 저장소 → Actions 탭
2. 워크플로우 실행 상태 확인
3. 배포 로그 확인

## 🔍 문제 해결

### 푸시 오류

```bash
# 원격 저장소 URL 확인
git remote -v

# SSH 연결 테스트
ssh -T git@github.com

# 권한 확인
git config user.name
git config user.email
```

### GitHub Actions 실패

1. **Secrets 확인**: 모든 Secrets가 올바르게 설정되었는지 확인
2. **워크플로우 파일 확인**: `.github/workflows/ci-cd.yml` 파일 확인
3. **로그 확인**: Actions 탭에서 상세 로그 확인

### GCP 인증 오류

1. **GCP_SERVICE_ACCOUNT_KEY 확인**: Base64 인코딩이 올바른지 확인
2. **Service Account 권한 확인**: GCP에서 권한 확인
3. **키 재생성**: 필요시 키를 재생성하고 Secrets 업데이트

## ✅ 체크리스트

- [ ] GitHub 저장소 생성
- [ ] GitHub SSH 키 등록
- [ ] Git 원격 저장소 설정
- [ ] 코드 푸시
- [ ] GitHub Secrets 설정
- [ ] GitHub Actions 워크플로우 확인
- [ ] 배포 확인

## 🔗 유용한 링크

- GitHub: https://github.com
- GitHub SSH Keys: https://github.com/settings/keys
- GitHub Secrets: 저장소 → Settings → Secrets and variables → Actions
- GitHub Actions: 저장소 → Actions 탭
- GCP Cloud Run: https://console.cloud.google.com/run

