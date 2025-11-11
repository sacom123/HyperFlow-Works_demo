#!/bin/bash

# GitLab SSH 키 생성 및 등록 스크립트

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔑 GitLab SSH 키 설정${NC}"
echo "===================="
echo ""

# 이메일 주소 입력
read -p "GitLab에 등록된 이메일 주소를 입력하세요: " EMAIL

if [ -z "$EMAIL" ]; then
    echo -e "${RED}❌ 이메일 주소가 입력되지 않았습니다${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ 이메일: $EMAIL${NC}"
echo ""

# SSH 디렉토리 생성
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 기존 키 확인
if [ -f ~/.ssh/id_ed25519.pub ]; then
    echo -e "${YELLOW}⚠️  기존 ED25519 키가 있습니다: ~/.ssh/id_ed25519.pub${NC}"
    read -p "기존 키를 사용하시겠습니까? (y/n): " USE_EXISTING
    if [ "$USE_EXISTING" = "y" ]; then
        KEY_FILE="~/.ssh/id_ed25519.pub"
        echo -e "${GREEN}✅ 기존 키를 사용합니다${NC}"
    else
        echo "새 키를 생성합니다..."
        ssh-keygen -t ed25519 -C "$EMAIL" -f ~/.ssh/id_ed25519 -N ""
        KEY_FILE="~/.ssh/id_ed25519.pub"
        echo -e "${GREEN}✅ 새 키 생성 완료${NC}"
    fi
elif [ -f ~/.ssh/id_rsa.pub ]; then
    echo -e "${YELLOW}⚠️  기존 RSA 키가 있습니다: ~/.ssh/id_rsa.pub${NC}"
    read -p "기존 키를 사용하시겠습니까? (y/n): " USE_EXISTING
    if [ "$USE_EXISTING" = "y" ]; then
        KEY_FILE="~/.ssh/id_rsa.pub"
        echo -e "${GREEN}✅ 기존 키를 사용합니다${NC}"
    else
        echo "새 키를 생성합니다..."
        ssh-keygen -t ed25519 -C "$EMAIL" -f ~/.ssh/id_ed25519 -N ""
        KEY_FILE="~/.ssh/id_ed25519.pub"
        echo -e "${GREEN}✅ 새 키 생성 완료${NC}"
    fi
else
    echo "SSH 키를 생성합니다..."
    ssh-keygen -t ed25519 -C "$EMAIL" -f ~/.ssh/id_ed25519 -N ""
    KEY_FILE="~/.ssh/id_ed25519.pub"
    echo -e "${GREEN}✅ 키 생성 완료${NC}"
fi

echo ""

# 키 권한 설정
if [ -f ~/.ssh/id_ed25519 ]; then
    chmod 600 ~/.ssh/id_ed25519
    chmod 644 ~/.ssh/id_ed25519.pub
elif [ -f ~/.ssh/id_rsa ]; then
    chmod 600 ~/.ssh/id_rsa
    chmod 644 ~/.ssh/id_rsa.pub
fi

# 공개 키 표시 및 복사
echo -e "${BLUE}📋 공개 키${NC}"
echo "===================="
echo ""

if [ -f ~/.ssh/id_ed25519.pub ]; then
    echo "ED25519 키:"
    cat ~/.ssh/id_ed25519.pub
    echo ""
    
    # 클립보드에 복사
    if [[ "$OSTYPE" == "darwin"* ]]; then
        pbcopy < ~/.ssh/id_ed25519.pub
        echo -e "${GREEN}✅ 공개 키가 클립보드에 복사되었습니다!${NC}"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xclip -selection clipboard < ~/.ssh/id_ed25519.pub
        echo -e "${GREEN}✅ 공개 키가 클립보드에 복사되었습니다!${NC}"
    else
        echo -e "${YELLOW}⚠️  클립보드에 자동 복사할 수 없습니다. 위의 키를 수동으로 복사하세요.${NC}"
    fi
elif [ -f ~/.ssh/id_rsa.pub ]; then
    echo "RSA 키:"
    cat ~/.ssh/id_rsa.pub
    echo ""
    
    # 클립보드에 복사
    if [[ "$OSTYPE" == "darwin"* ]]; then
        pbcopy < ~/.ssh/id_rsa.pub
        echo -e "${GREEN}✅ 공개 키가 클립보드에 복사되었습니다!${NC}"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xclip -selection clipboard < ~/.ssh/id_rsa.pub
        echo -e "${GREEN}✅ 공개 키가 클립보드에 복사되었습니다!${NC}"
    else
        echo -e "${YELLOW}⚠️  클립보드에 자동 복사할 수 없습니다. 위의 키를 수동으로 복사하세요.${NC}"
    fi
fi

echo ""
echo "===================="
echo -e "${BLUE}📝 GitLab에 SSH 키 등록${NC}"
echo "===================="
echo ""
echo "1. GitLab 웹사이트 접속: https://gitlab.com/-/profile/keys"
echo "2. 'Add new key' 버튼 클릭"
echo "3. 'Key' 필드에 클립보드의 공개 키 붙여넣기 (Cmd+V 또는 Ctrl+V)"
echo "4. 'Title' 필드에 키 이름 입력 (예: MacBook Pro, 개발 PC)"
echo "5. 'Add key' 버튼 클릭"
echo ""

# SSH 연결 테스트
echo "===================="
echo -e "${BLUE}🧪 SSH 연결 테스트${NC}"
echo "===================="
echo ""

read -p "GitLab에 키를 등록하셨나요? (y/n): " KEY_ADDED

if [ "$KEY_ADDED" = "y" ]; then
    echo "SSH 연결을 테스트합니다..."
    echo ""
    
    if ssh -T git@gitlab.com 2>&1 | grep -q "Welcome to GitLab"; then
        echo -e "${GREEN}✅ SSH 연결 성공!${NC}"
        echo ""
        echo "이제 GitLab에 코드를 푸시할 수 있습니다!"
    else
        echo -e "${YELLOW}⚠️  SSH 연결 테스트 실패${NC}"
        echo ""
        echo "다음을 확인하세요:"
        echo "1. GitLab에 키가 등록되었는지 확인"
        echo "2. 키 권한 확인: chmod 600 ~/.ssh/id_ed25519"
        echo "3. 수동 테스트: ssh -T git@gitlab.com"
    fi
else
    echo -e "${YELLOW}⚠️  키를 등록한 후 다음 명령어로 테스트하세요:${NC}"
    echo "  ssh -T git@gitlab.com"
fi

echo ""
echo "===================="
echo -e "${GREEN}✅ SSH 키 설정 완료!${NC}"
echo ""
echo "다음 단계:"
echo "1. GitLab에 SSH 키 등록 (위의 단계 참조)"
echo "2. Git 원격 저장소 URL을 SSH로 변경:"
echo "   git remote set-url origin git@gitlab.com:username/project-name.git"
echo "3. 코드 푸시 테스트:"
echo "   git push origin main"
echo ""

