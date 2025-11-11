# GitLab SSH 키 등록 가이드

## 🔑 SSH 키 생성 및 GitLab 등록

GitLab에 코드를 푸시하기 위해 SSH 키를 생성하고 등록하는 방법입니다.

## 1단계: SSH 키 확인

먼저 기존 SSH 키가 있는지 확인하세요:

```bash
# SSH 키 확인
ls -la ~/.ssh/
```

다음 파일 중 하나가 있으면 기존 키를 사용할 수 있습니다:
- `id_rsa.pub` (RSA 키)
- `id_ed25519.pub` (ED25519 키 - 권장)

## 2단계: SSH 키 생성 (기존 키가 없는 경우)

### 방법 1: ED25519 키 생성 (권장)

```bash
# ED25519 키 생성 (더 안전하고 빠름)
ssh-keygen -t ed25519 -C "your_email@example.com"
```

### 방법 2: RSA 키 생성 (기존 방식)

```bash
# RSA 키 생성
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

**키 생성 시:**
- 파일 저장 위치: `~/.ssh/id_ed25519` (Enter 키로 기본값 사용)
- passphrase: 비워두거나 설정 (선택사항)

## 3단계: SSH 키 확인 및 복사

### 공개 키 확인

```bash
# ED25519 키 확인
cat ~/.ssh/id_ed25519.pub

# 또는 RSA 키 확인
cat ~/.ssh/id_rsa.pub
```

### 공개 키를 클립보드에 복사

**macOS:**
```bash
# ED25519 키 복사
pbcopy < ~/.ssh/id_ed25519.pub

# 또는 RSA 키 복사
pbcopy < ~/.ssh/id_rsa.pub
```

**Linux:**
```bash
# ED25519 키 복사
xclip -selection clipboard < ~/.ssh/id_ed25519.pub

# 또는 RSA 키 복사
xclip -selection clipboard < ~/.ssh/id_rsa.pub
```

## 4단계: GitLab에 SSH 키 등록

### GitLab 웹사이트에서 등록

1. **GitLab 로그인**
   - https://gitlab.com 에 로그인

2. **프로필 설정으로 이동**
   - 우측 상단 프로필 아이콘 클릭
   - **Preferences** 클릭
   - 또는 직접 이동: https://gitlab.com/-/profile

3. **SSH Keys 섹션으로 이동**
   - 좌측 메뉴에서 **SSH Keys** 클릭
   - 또는 직접 이동: https://gitlab.com/-/profile/keys

4. **SSH 키 추가**
   - **Add new key** 버튼 클릭
   - **Key** 필드에 클립보드의 공개 키 붙여넣기 (Cmd+V)
   - **Title** 필드에 키 이름 입력 (예: `MacBook Pro`, `개발 PC` 등)
   - **Expiration date** (선택사항): 키 만료일 설정
   - **Add key** 버튼 클릭

### 키 등록 확인

등록이 완료되면 SSH Keys 목록에 키가 표시됩니다:
- Key: 키의 시작 부분이 표시됨
- Title: 설정한 이름
- Created: 생성일
- Expires: 만료일 (설정한 경우)

## 5단계: SSH 연결 테스트

### GitLab 연결 테스트

```bash
# GitLab에 SSH로 연결 테스트
ssh -T git@gitlab.com
```

**성공 메시지:**
```
Welcome to GitLab, @username!
```

**오류가 발생하는 경우:**
- SSH 키가 등록되지 않았는지 확인
- 키 파일 권한 확인 (아래 참고)

### SSH 에이전트에 키 추가 (선택사항)

```bash
# SSH 에이전트 시작
eval "$(ssh-agent -s)"

# SSH 키 추가
ssh-add ~/.ssh/id_ed25519
# 또는
ssh-add ~/.ssh/id_rsa
```

## 6단계: Git 저장소 설정

### 기존 저장소에 SSH URL 설정

```bash
# 현재 원격 저장소 확인
git remote -v

# SSH URL로 변경 (HTTPS에서 SSH로 변경하는 경우)
git remote set-url origin git@gitlab.com:username/project-name.git

# 또는 GitLab에서 제공하는 SSH URL 사용
# GitLab 프로젝트 → Clone → Clone with SSH
```

### 새 저장소 클론 (SSH 사용)

```bash
# SSH URL로 클론
git clone git@gitlab.com:username/project-name.git
```

## 7단계: 테스트

### 코드 푸시 테스트

```bash
# 변경사항 커밋
git add .
git commit -m "Test SSH connection"

# 푸시 테스트
git push origin main
```

성공하면 SSH 키가 정상적으로 작동하는 것입니다!

## 🔧 문제 해결

### SSH 키 권한 오류

SSH 키 파일의 권한을 확인하고 수정하세요:

```bash
# SSH 디렉토리 권한 설정
chmod 700 ~/.ssh

# 개인 키 권한 설정
chmod 600 ~/.ssh/id_ed25519
# 또는
chmod 600 ~/.ssh/id_rsa

# 공개 키 권한 설정
chmod 644 ~/.ssh/id_ed25519.pub
# 또는
chmod 644 ~/.ssh/id_rsa.pub
```

### SSH 연결 실패

```bash
# 상세 로그로 연결 테스트
ssh -vT git@gitlab.com

# SSH 설정 확인
cat ~/.ssh/config
```

### 여러 SSH 키 사용

여러 GitLab 계정이나 서비스를 사용하는 경우 SSH config 파일 설정:

```bash
# SSH config 파일 편집
nano ~/.ssh/config
```

다음 내용 추가:

```
# GitLab Personal
Host gitlab.com
  HostName gitlab.com
  User git
  IdentityFile ~/.ssh/id_ed25519
  IdentitiesOnly yes
```

### 키가 인식되지 않는 경우

```bash
# SSH 에이전트에 키 추가
ssh-add ~/.ssh/id_ed25519

# 추가된 키 확인
ssh-add -l

# 모든 키 제거 후 다시 추가
ssh-add -D
ssh-add ~/.ssh/id_ed25519
```

## 📝 빠른 참조

### SSH 키 생성 및 등록 (한 번에)

```bash
# 1. SSH 키 생성
ssh-keygen -t ed25519 -C "your_email@example.com"

# 2. 공개 키 복사 (macOS)
pbcopy < ~/.ssh/id_ed25519.pub

# 3. GitLab에 등록
# - https://gitlab.com/-/profile/keys
# - Add new key 클릭
# - 클립보드 내용 붙여넣기

# 4. 연결 테스트
ssh -T git@gitlab.com
```

## 🔗 유용한 링크

- GitLab SSH Keys: https://gitlab.com/-/profile/keys
- GitLab SSH 문서: https://docs.gitlab.com/ee/ssh/
- SSH 키 생성 가이드: https://docs.gitlab.com/ee/ssh/#generate-an-ssh-key-pair

## ✅ 체크리스트

- [ ] SSH 키 생성 완료
- [ ] 공개 키를 클립보드에 복사
- [ ] GitLab에 SSH 키 등록
- [ ] SSH 연결 테스트 성공
- [ ] Git 원격 저장소 URL이 SSH로 설정됨
- [ ] 코드 푸시 테스트 성공

## 🚀 다음 단계

SSH 키 등록이 완료되면:

1. **GitLab CI/CD 변수 설정** (이미 완료했다면 생략)
2. **코드 푸시**:
   ```bash
   git add .
   git commit -m "Setup SSH and CI/CD"
   git push origin main
   ```

3. **파이프라인 확인**:
   - GitLab → Build → Pipelines
   - 파이프라인 실행 상태 확인

