# GitHub에 푸시하기 - 실행 위치 안내

## ✅ 실행 위치

**프로젝트 폴더 안에서 실행하세요!**

현재 터미널이 이미 프로젝트 폴더에 있으므로 그대로 실행하면 됩니다.

## 📍 현재 위치 확인

터미널에서 다음 명령어로 확인:

```bash
pwd
```

다음과 같이 표시되어야 합니다:
```
/Users/seonho/Desktop/code/hyperflow-works
```

## 🚀 실행 순서

### 1단계: GitHub 저장소 생성 (브라우저)

1. https://github.com/new 접속
2. 저장소 생성
3. 저장소 URL 확인 (예: `git@github.com:username/hyperflow-works.git`)

### 2단계: Git 초기화 및 푸시 (터미널 - 프로젝트 폴더에서)

**현재 터미널에서 바로 실행하세요!**

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

# 6. GitHub 원격 저장소 추가 (본인의 저장소 URL로 변경!)
git remote add origin git@github.com:YOUR_USERNAME/hyperflow-works.git

# 7. GitHub에 푸시
git push -u origin main
```

## ⚠️ 중요 사항

1. **프로젝트 폴더에서 실행**: 
   - `/Users/seonho/Desktop/code/hyperflow-works` 폴더 안에서 실행
   - 다른 폴더에서 실행하면 안 됩니다!

2. **저장소 URL 확인**:
   - 6번 명령어에서 `YOUR_USERNAME`을 본인의 GitHub 사용자 이름으로 변경
   - 저장소 이름도 본인이 만든 이름으로 변경

3. **SSH 키 확인**:
   - GitHub에 SSH 키가 등록되어 있어야 합니다
   - 테스트: `ssh -T git@github.com`

## 🔍 현재 위치 확인 방법

터미널에서 다음 명령어로 확인:

```bash
# 현재 위치 확인
pwd

# 현재 폴더의 파일 확인
ls -la

# package.json이 보이면 올바른 위치입니다
ls package.json
```

## ✅ 올바른 위치인지 확인

다음 파일들이 보이면 올바른 위치입니다:
- `package.json`
- `frontend/` 폴더
- `backend/` 폴더
- `README.md`
- `.gitlab-ci.yml`

## 🚨 잘못된 위치에서 실행했다면?

다른 폴더에서 실행했다면:

```bash
# 프로젝트 폴더로 이동
cd /Users/seonho/Desktop/code/hyperflow-works

# 위치 확인
pwd

# 그 다음 Git 명령어 실행
```

## 📝 빠른 체크리스트

- [ ] 터미널이 프로젝트 폴더에 있는지 확인 (`pwd`로 확인)
- [ ] GitHub 저장소 생성 완료
- [ ] GitHub 저장소 URL 확인
- [ ] Git 저장소 초기화 (`git init`)
- [ ] 파일 추가 및 커밋 (`git add .`, `git commit`)
- [ ] 원격 저장소 추가 (`git remote add origin`)
- [ ] 푸시 (`git push -u origin main`)

