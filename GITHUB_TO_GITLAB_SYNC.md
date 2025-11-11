# GitHub → GitLab 자동 동기화 설정 가이드

## 🎯 목표

GitHub에 커밋하면 GitLab에 자동으로 동기화되고, GitLab에서 CI/CD가 실행되어 GCP Cloud Run에 배포됩니다.

## 📋 설정 방법

### 방법 1: GitHub Actions로 GitLab에 자동 푸시 (권장)

#### 1단계: GitLab Personal Access Token 생성

1. **GitLab 접속**
   - https://gitlab.com/-/profile/personal_access_tokens

2. **Personal Access Token 생성**
   - **Token name**: `github-sync` (또는 원하는 이름)
   - **Expiration date**: (선택사항)
   - **Scopes**: 
     - ✅ **write_repository** (필수)
     - ✅ **api** (선택사항)
   - **Create personal access token** 클릭

3. **Token 복사**
   - 생성된 토큰을 안전하게 저장하세요
   - ⚠️ **토큰은 다시 볼 수 없으므로 반드시 복사하세요!**

#### 2단계: GitHub Secrets 설정

1. **GitHub 저장소 접속**
   - https://github.com/sacom123/HyperFlow-Works_demo

2. **Settings → Secrets and variables → Actions**
   - **New repository secret** 클릭

3. **GITLAB_TOKEN Secret 추가**
   - **Name**: `GITLAB_TOKEN`
   - **Secret**: 위에서 생성한 GitLab Personal Access Token
   - **Add secret** 클릭

4. **기존 GCP Secrets 확인**
   - `GCP_SERVICE_ACCOUNT_KEY`
   - `GCP_PROJECT_ID`: `hyperflow-works-hong`
   - `GCP_SERVICE_NAME`: `hyperflow-works`
   - `GCP_REGION`: `asia-northeast3`

#### 3단계: Git 저장소 설정

```bash
# 1. Git 저장소 초기화 (아직 안 했다면)
git init

# 2. Git 사용자 정보 설정
git config user.name "Your Name"
git config user.email "your_email@example.com"

# 3. GitHub 원격 저장소 추가
git remote add origin git@github.com:sacom123/HyperFlow-Works_demo.git

# 4. 모든 파일 추가
git add .

# 5. 커밋
git commit -m "Initial commit: Setup GitHub to GitLab sync"

# 6. main 브랜치로 변경
git branch -M main

# 7. GitHub에 푸시
git push -u origin main
```

#### 4단계: GitHub Actions 확인

1. **GitHub 저장소 → Actions 탭**
2. **Sync to GitLab** 워크플로우 확인
3. GitHub에 푸시하면 자동으로 GitLab에 동기화됩니다
4. GitLab에서 CI/CD가 자동으로 실행됩니다

### 방법 2: GitLab Push Mirroring 설정 (대안)

GitLab의 Push Mirroring 기능을 사용할 수도 있습니다:

1. **GitLab 저장소 → Settings → Repository → Mirroring repositories**
2. **Push to a remote repository** 선택
3. **Git repository URL**: `https://github.com/sacom123/HyperFlow-Works_demo.git`
4. **Authentication method**: Password
5. **Password**: GitHub Personal Access Token
6. **Mirror direction**: Push
7. **Trigger**: 즉시 또는 예약
8. **Save changes** 클릭

## 🔄 워크플로우

### 자동 동기화 흐름

```
1. GitHub에 코드 푸시
   ↓
2. GitHub Actions가 자동으로 실행
   ↓
3. GitLab에 코드 동기화
   ↓
4. GitLab CI/CD 파이프라인 자동 실행
   ↓
5. GCP Cloud Run에 배포
```

## 📝 설정 확인

### GitHub Actions 확인

1. **GitHub 저장소 → Actions 탭**
2. **Sync to GitLab** 워크플로우 확인
3. 실행 로그 확인

### GitLab CI/CD 확인

1. **GitLab 저장소 → CI/CD → Pipelines**
2. 파이프라인 실행 상태 확인
3. 배포 로그 확인

## 🔧 문제 해결

### GitHub Actions 실패

1. **GITLAB_TOKEN 확인**:
   - GitHub Secrets에 `GITLAB_TOKEN`이 올바르게 설정되었는지 확인
   - GitLab Personal Access Token이 유효한지 확인

2. **권한 확인**:
   - GitLab Token에 `write_repository` 권한이 있는지 확인

3. **저장소 URL 확인**:
   - `.github/workflows/sync-to-gitlab.yml` 파일의 GitLab URL 확인
   - `sacom123/hyperflow-works-hong`이 올바른지 확인

### GitLab 동기화 실패

1. **GitLab 저장소 확인**:
   - GitLab 저장소가 존재하는지 확인
   - 저장소 권한 확인

2. **브랜치 이름 확인**:
   - GitHub와 GitLab의 브랜치 이름이 일치하는지 확인
   - `main` 또는 `master`

### GitLab CI/CD가 실행되지 않는 경우

1. **파이프라인 트리거 확인**:
   - GitLab 저장소 → Settings → CI/CD → General pipelines
   - 파이프라인이 활성화되어 있는지 확인

2. **`.gitlab-ci.yml` 파일 확인**:
   - 파일이 저장소 루트에 있는지 확인
   - 파일이 올바르게 커밋되었는지 확인

## ✅ 체크리스트

- [ ] GitLab Personal Access Token 생성
- [ ] GitHub Secrets에 `GITLAB_TOKEN` 추가
- [ ] GitHub Secrets에 GCP 관련 Secrets 추가
- [ ] Git 저장소 초기화 및 GitHub에 푸시
- [ ] GitHub Actions 워크플로우 확인
- [ ] GitLab에 코드 동기화 확인
- [ ] GitLab CI/CD 파이프라인 실행 확인
- [ ] GCP Cloud Run 배포 확인

## 🚀 사용 방법

### 일상적인 작업 흐름

```bash
# 1. 코드 수정
# ... 코드 작성 ...

# 2. 변경사항 커밋
git add .
git commit -m "Update: 변경 사항"

# 3. GitHub에 푸시
git push origin main

# 4. 자동으로:
#    - GitHub Actions가 GitLab에 동기화
#    - GitLab CI/CD가 실행
#    - GCP Cloud Run에 배포
```

## 🔗 유용한 링크

- GitHub 저장소: https://github.com/sacom123/HyperFlow-Works_demo
- GitLab 저장소: https://gitlab.com/sacom123/hyperflow-works-hong
- GitLab Personal Access Tokens: https://gitlab.com/-/profile/personal_access_tokens
- GitHub Secrets: 저장소 → Settings → Secrets and variables → Actions
- GitLab CI/CD: 저장소 → CI/CD → Pipelines

