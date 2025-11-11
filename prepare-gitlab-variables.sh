#!/bin/bash

# GitLab CI/CD 변수 준비 스크립트
# 이 스크립트는 GitLab에 설정할 변수들을 준비하고 표시합니다

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔧 GitLab CI/CD 변수 준비${NC}"
echo "===================="
echo ""

# 현재 프로젝트 확인
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ 프로젝트가 설정되어 있지 않습니다${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 현재 프로젝트: $PROJECT_ID${NC}"
echo ""

# 키 파일 확인
KEY_FILE="gcp-key.json"
if [ ! -f "$KEY_FILE" ]; then
    echo -e "${RED}❌ 키 파일이 없습니다: $KEY_FILE${NC}"
    echo ""
    echo "키 파일을 생성하세요:"
    echo "  gcloud iam service-accounts keys create gcp-key.json \\"
    echo "    --iam-account=hyperflow-works-sa@$PROJECT_ID.iam.gserviceaccount.com"
    exit 1
fi

echo -e "${GREEN}✅ 키 파일 확인: $KEY_FILE${NC}"
echo ""

# 리전 확인
REGION=$(gcloud config get-value run/region 2>/dev/null)
REGION=${REGION:-asia-northeast3}

echo -e "${BLUE}📋 GitLab CI/CD 변수 설정 정보${NC}"
echo "===================="
echo ""
echo "다음 변수들을 GitLab에 추가하세요:"
echo ""
echo "1. GCP_SERVICE_ACCOUNT_KEY"
echo "   - Key: GCP_SERVICE_ACCOUNT_KEY"
echo "   - Value: (아래 Base64 인코딩된 키)"
echo "   - Protect variable: ✅"
echo "   - Mask variable: ✅"
echo ""
echo "2. GCP_PROJECT_ID"
echo "   - Key: GCP_PROJECT_ID"
echo "   - Value: $PROJECT_ID"
echo "   - Protect variable: ✅"
echo ""
echo "3. GCP_SERVICE_NAME"
echo "   - Key: GCP_SERVICE_NAME"
echo "   - Value: hyperflow-works"
echo "   - Protect variable: ✅"
echo ""
echo "4. GCP_REGION"
echo "   - Key: GCP_REGION"
echo "   - Value: $REGION"
echo "   - Protect variable: ✅"
echo ""
echo "5. GCP_PROJECT_HASH (선택사항)"
echo "   - Key: GCP_PROJECT_HASH"
echo "   - Value: (비워둬도 됨)"
echo "   - Protect variable: ✅"
echo ""

# Base64 인코딩
echo -e "${BLUE}🔑 Base64 인코딩된 키${NC}"
echo "===================="
echo ""

if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS - 클립보드에 복사
    base64 -i "$KEY_FILE" | pbcopy
    echo -e "${GREEN}✅ 키가 Base64로 인코딩되어 클립보드에 복사되었습니다!${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  GitLab에 GCP_SERVICE_ACCOUNT_KEY 변수를 추가할 때${NC}"
    echo -e "${YELLOW}   클립보드의 내용을 붙여넣으세요 (Cmd+V)${NC}"
    echo ""
    echo "키를 다시 보려면:"
    echo "  base64 -i gcp-key.json"
else
    # Linux - 파일로 저장
    base64 -i "$KEY_FILE" > gcp-key-base64.txt
    echo -e "${GREEN}✅ 키가 Base64로 인코딩되어 gcp-key-base64.txt에 저장되었습니다!${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  GitLab에 GCP_SERVICE_ACCOUNT_KEY 변수를 추가할 때${NC}"
    echo -e "${YELLOW}   gcp-key-base64.txt 파일의 내용을 복사해서 붙여넣으세요${NC}"
    echo ""
    echo "키 내용 보기:"
    echo "  cat gcp-key-base64.txt"
fi

echo ""
echo "===================="
echo -e "${BLUE}📝 GitLab 설정 단계${NC}"
echo "===================="
echo ""
echo "1. GitLab 프로젝트로 이동"
echo "2. Settings → CI/CD → Variables"
echo "3. Add variable 클릭"
echo "4. 위의 변수들을 하나씩 추가"
echo ""
echo "자세한 가이드는 GITLAB_SETUP_GUIDE.md를 참조하세요."
echo ""

