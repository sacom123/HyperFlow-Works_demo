# SSH 키 등록 빠른 가이드

## 🚀 가장 쉬운 방법: 자동 스크립트

```bash
./setup-ssh-key.sh
```

스크립트가 자동으로:
1. SSH 키 생성 (기존 키가 없으면)
2. 공개 키를 클립보드에 복사
3. GitLab 등록 안내
4. SSH 연결 테스트

## 📝 수동 설정 (단계별)

### 1단계: SSH 키 생성

```bash
# ED25519 키 생성 (권장)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Enter 키로 기본값 사용
# passphrase는 비워두거나 설정 (선택사항)
```

### 2단계: 공개 키 복사

```bash
# macOS - 클립보드에 복사
pbcopy < ~/.ssh/id_ed25519.pub

# Linux - 클립보드에 복사
xclip -selection clipboard < ~/.ssh/id_ed25519.pub

# 또는 키 내용 보기
cat ~/.ssh/id_ed25519.pub
```

### 3단계: GitLab에 등록

1. **GitLab 접속**: https://gitlab.com/-/profile/keys
2. **Add new key** 클릭
3. **Key** 필드에 클립보드 내용 붙여넣기 (Cmd+V)
4. **Title** 입력 (예: `MacBook Pro`)
5. **Add key** 클릭

### 4단계: 연결 테스트

```bash
ssh -T git@gitlab.com
```

**성공 메시지:**
```
Welcome to GitLab, @username!
```

### 5단계: Git 원격 URL 변경 (필요한 경우)

```bash
# 현재 URL 확인
git remote -v

# SSH URL로 변경
git remote set-url origin git@gitlab.com:username/project-name.git

# 확인
git remote -v
```

## ✅ 완료!

이제 GitLab에 코드를 푸시할 수 있습니다!

```bash
git add .
git commit -m "Setup SSH"
git push origin main
```
