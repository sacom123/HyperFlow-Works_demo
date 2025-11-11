#!/bin/bash

# GitHub 저장소 설정 스크립트

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 GitHub 저장소 설정${NC}"
echo "===================="
echo ""

# Git 저장소 초기화 확인
if [ ! -d ".git" ]; then
    echo "Git 저장소를 초기화합니다..."
    git init
    echo -e "${GREEN}✅ Git 저장소 초기화 완료${NC}"
else
    echo -e "${GREEN}✅ Git 저장소가 이미 있습니다${NC}"
fi

echo ""

# 사용자 정보 확인
echo "Git 사용자 정보 확인..."
GIT_USER=$(git config user.name 2>/dev/null || echo "")
GIT_EMAIL=$(git config user.email 2>/dev/null || echo "")

if [ -z "$GIT_USER" ] || [ -z "$GIT_EMAIL" ]; then
    echo -e "${YELLOW}⚠️  Git 사용자 정보가 설정되지 않았습니다${NC}"
    read -p "Git 사용자 이름을 입력하세요: " GIT_USER
    read -p "Git 이메일을 입력하세요: " GIT_EMAIL
    
    git config user.name "$GIT_USER"
    git config user.email "$GIT_EMAIL"
    echo -e "${GREEN}✅ Git 사용자 정보 설정 완료${NC}"
else
    echo -e "${GREEN}✅ Git 사용자: $GIT_USER <$GIT_EMAIL>${NC}"
fi

echo ""

# .gitignore 확인
if [ ! -f ".gitignore" ]; then
    echo -e "${YELLOW}⚠️  .gitignore 파일이 없습니다${NC}"
    echo "기본 .gitignore를 생성합니다..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
.nyc_output

# Production
dist/
build/
*.log

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# GCP
gcp-key.json
gcp-key-base64.txt
*.json.key
.gcloud/

# Temporary files
*.tmp
.cache/
EOF
    echo -e "${GREEN}✅ .gitignore 생성 완료${NC}"
else
    echo -e "${GREEN}✅ .gitignore 파일이 있습니다${NC}"
fi

echo ""

# GitHub 저장소 URL 입력
echo "GitHub 저장소 정보를 입력하세요:"
read -p "GitHub 사용자 이름: " GITHUB_USERNAME
read -p "저장소 이름 (예: hyperflow-works): " REPO_NAME

if [ -z "$GITHUB_USERNAME" ] || [ -z "$REPO_NAME" ]; then
    echo -e "${RED}❌ 사용자 이름과 저장소 이름을 입력해야 합니다${NC}"
    exit 1
fi

GITHUB_URL="git@github.com:${GITHUB_USERNAME}/${REPO_NAME}.git"

echo ""
echo -e "${GREEN}✅ GitHub URL: $GITHUB_URL${NC}"
echo ""

# 원격 저장소 설정
echo "원격 저장소를 설정합니다..."
if git remote get-url origin &> /dev/null; then
    echo -e "${YELLOW}⚠️  기존 origin이 있습니다${NC}"
    read -p "기존 origin을 GitHub로 변경하시겠습니까? (y/n): " CHANGE_ORIGIN
    if [ "$CHANGE_ORIGIN" = "y" ]; then
        git remote set-url origin "$GITHUB_URL"
        echo -e "${GREEN}✅ origin을 GitHub로 변경했습니다${NC}"
    else
        git remote add github "$GITHUB_URL"
        echo -e "${GREEN}✅ github 원격 저장소를 추가했습니다${NC}"
    fi
else
    git remote add origin "$GITHUB_URL"
    echo -e "${GREEN}✅ origin 원격 저장소를 추가했습니다${NC}"
fi

echo ""

# 원격 저장소 확인
echo "원격 저장소 확인:"
git remote -v

echo ""
echo "===================="
echo -e "${BLUE}📝 다음 단계${NC}"
echo "===================="
echo ""
echo "1. GitHub에서 저장소를 생성하세요:"
echo "   https://github.com/new"
echo "   - Repository name: $REPO_NAME"
echo "   - Public 또는 Private 선택"
echo "   - README, .gitignore, license는 추가하지 마세요 (이미 있음)"
echo ""
echo "2. 코드를 커밋하고 푸시하세요:"
echo "   git add ."
echo "   git commit -m 'Initial commit: Setup project with GCP Cloud Run deployment'"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. GitHub Secrets 설정:"
echo "   - 저장소 → Settings → Secrets and variables → Actions"
echo "   - 다음 Secrets 추가:"
echo "     * GCP_SERVICE_ACCOUNT_KEY"
echo "     * GCP_PROJECT_ID: hyperflow-works-hong"
echo "     * GCP_SERVICE_NAME: hyperflow-works"
echo "     * GCP_REGION: asia-northeast3"
echo ""
echo "4. GitHub Actions 확인:"
echo "   - 저장소 → Actions 탭"
echo "   - 워크플로우가 자동으로 실행됩니다"
echo ""

