#!/bin/bash

# GitHub 저장소 설정 스크립트
# 사용법: ./setup-github-repo.sh

set -e

echo "🚀 GitHub 저장소 설정 시작..."

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# GitHub 저장소 정보
GITHUB_REPO="git@github.com:sacom123/HyperFlow-Works_demo.git"
GITLAB_REPO="https://gitlab.com/sacom123/hyperflow-works-hong.git"

# 1. Git 저장소 초기화 확인
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Git 저장소가 없습니다. 초기화합니다...${NC}"
    git init
    echo -e "${GREEN}✅ Git 저장소 초기화 완료${NC}"
else
    echo -e "${GREEN}✅ Git 저장소가 이미 있습니다${NC}"
fi

# 2. Git 사용자 정보 확인
echo -e "\n${YELLOW}Git 사용자 정보 확인...${NC}"
GIT_USER_NAME=$(git config user.name || echo "")
GIT_USER_EMAIL=$(git config user.email || echo "")

if [ -z "$GIT_USER_NAME" ] || [ -z "$GIT_USER_EMAIL" ]; then
    echo -e "${RED}Git 사용자 정보가 설정되지 않았습니다.${NC}"
    echo -e "${YELLOW}다음 명령어로 설정하세요:${NC}"
    echo "  git config user.name \"Your Name\""
    echo "  git config user.email \"your_email@example.com\""
    echo ""
    read -p "계속하시겠습니까? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✅ Git 사용자: $GIT_USER_NAME <$GIT_USER_EMAIL>${NC}"
fi

# 3. 원격 저장소 확인
echo -e "\n${YELLOW}원격 저장소 확인...${NC}"
if git remote | grep -q "^origin$"; then
    CURRENT_ORIGIN=$(git remote get-url origin)
    echo -e "${YELLOW}현재 origin: $CURRENT_ORIGIN${NC}"
    if [ "$CURRENT_ORIGIN" != "$GITHUB_REPO" ]; then
        echo -e "${YELLOW}origin을 GitHub 저장소로 변경합니다...${NC}"
        git remote set-url origin "$GITHUB_REPO"
        echo -e "${GREEN}✅ origin 업데이트 완료${NC}"
    else
        echo -e "${GREEN}✅ origin이 이미 올바른 GitHub 저장소를 가리키고 있습니다${NC}"
    fi
else
    echo -e "${YELLOW}origin 원격 저장소를 추가합니다...${NC}"
    git remote add origin "$GITHUB_REPO"
    echo -e "${GREEN}✅ origin 추가 완료${NC}"
fi

# 4. 파일 추가
echo -e "\n${YELLOW}파일 추가 중...${NC}"
git add .
echo -e "${GREEN}✅ 파일 추가 완료${NC}"

# 5. 변경사항 확인
CHANGES=$(git status --short | wc -l | tr -d ' ')
if [ "$CHANGES" -eq 0 ]; then
    echo -e "${YELLOW}커밋할 변경사항이 없습니다.${NC}"
    
    # 최신 커밋 확인
    if git rev-parse --verify HEAD >/dev/null 2>&1; then
        echo -e "${GREEN}✅ 이미 커밋된 내용이 있습니다${NC}"
    else
        echo -e "${RED}커밋된 내용이 없습니다. 초기 커밋을 생성합니다...${NC}"
        git commit -m "Initial commit: Setup GitHub to GitLab sync"
        echo -e "${GREEN}✅ 초기 커밋 완료${NC}"
    fi
else
    echo -e "${YELLOW}변경사항이 있습니다 ($CHANGES files). 커밋합니다...${NC}"
    git commit -m "Update: Setup GitHub to GitLab sync"
    echo -e "${GREEN}✅ 커밋 완료${NC}"
fi

# 6. 브랜치 확인 및 설정
echo -e "\n${YELLOW}브랜치 확인...${NC}"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo -e "${GREEN}현재 브랜치: $CURRENT_BRANCH${NC}"

if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    echo -e "${YELLOW}브랜치를 main으로 변경합니다...${NC}"
    git branch -M main
    echo -e "${GREEN}✅ 브랜치 변경 완료${NC}"
fi

# 7. GitHub에 푸시
echo -e "\n${YELLOW}GitHub에 푸시합니다...${NC}"
echo -e "${YELLOW}⚠️  SSH 키가 설정되어 있어야 합니다!${NC}"
echo -e "${YELLOW}⚠️  GitHub에 푸시 권한이 있어야 합니다!${NC}"
echo ""

read -p "GitHub에 푸시하시겠습니까? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}푸시 중...${NC}"
    if git push -u origin main 2>&1 || git push -u origin master 2>&1; then
        echo -e "${GREEN}✅ GitHub에 푸시 완료!${NC}"
        echo ""
        echo -e "${GREEN}🎉 설정 완료!${NC}"
        echo ""
        echo -e "${YELLOW}다음 단계:${NC}"
        echo "1. GitHub Actions 확인: https://github.com/sacom123/HyperFlow-Works_demo/actions"
        echo "2. GitLab 동기화 확인: https://gitlab.com/sacom123/hyperflow-works-hong"
        echo "3. GitLab CI/CD 확인: https://gitlab.com/sacom123/hyperflow-works-hong/-/pipelines"
    else
        echo -e "${RED}❌ 푸시 실패${NC}"
        echo -e "${YELLOW}다음을 확인하세요:${NC}"
        echo "1. SSH 키가 GitHub에 등록되어 있는지"
        echo "2. GitHub 저장소가 존재하는지"
        echo "3. 푸시 권한이 있는지"
        exit 1
    fi
else
    echo -e "${YELLOW}푸시를 건너뜁니다.${NC}"
    echo -e "${YELLOW}나중에 다음 명령어로 푸시할 수 있습니다:${NC}"
    echo "  git push -u origin main"
fi

echo ""
echo -e "${GREEN}✅ 스크립트 실행 완료!${NC}"
