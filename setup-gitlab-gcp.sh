#!/bin/bash

# GitLab → GCP Cloud Run 배포 설정 스크립트
# 사용법: ./setup-gitlab-gcp.sh

set -e

echo "🚀 GitLab → GCP Cloud Run 배포 설정 시작..."

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. GCP 프로젝트 확인
echo -e "\n${BLUE}1단계: GCP 프로젝트 확인${NC}"
PROJECT_ID=$(gcloud config get-value project 2>/dev/null || echo "")

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ GCP 프로젝트가 설정되지 않았습니다.${NC}"
    echo -e "${YELLOW}다음 명령어로 프로젝트를 설정하세요:${NC}"
    echo "  gcloud config set project PROJECT_ID"
    exit 1
fi

echo -e "${GREEN}✅ 현재 GCP 프로젝트: $PROJECT_ID${NC}"

# 2. 서비스 계정 확인/생성
echo -e "\n${BLUE}2단계: 서비스 계정 확인${NC}"
SERVICE_ACCOUNT_NAME="hyperflow-works-sa"
SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

if gcloud iam service-accounts describe ${SERVICE_ACCOUNT_EMAIL} &>/dev/null; then
    echo -e "${GREEN}✅ 서비스 계정이 이미 존재합니다: ${SERVICE_ACCOUNT_EMAIL}${NC}"
    read -p "새로 생성하시겠습니까? (기존 키는 유지됩니다) (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        SKIP_SA_CREATE=true
    fi
else
    SKIP_SA_CREATE=false
fi

if [ "$SKIP_SA_CREATE" != "true" ]; then
    echo -e "${YELLOW}서비스 계정 생성 중...${NC}"
    gcloud iam service-accounts create ${SERVICE_ACCOUNT_NAME} \
      --display-name="Hyperflow Works Service Account" \
      --description="Service account for GitLab CI/CD deployment" \
      || echo -e "${YELLOW}서비스 계정 생성 실패 (이미 존재할 수 있음)${NC}"
    
    echo -e "${GREEN}✅ 서비스 계정 생성 완료${NC}"
fi

# 3. 권한 부여
echo -e "\n${BLUE}3단계: 서비스 계정 권한 부여${NC}"
echo -e "${YELLOW}필요한 권한을 부여합니다...${NC}"

# Cloud Run 관리 권한
echo -e "${YELLOW}- Cloud Run 관리 권한 부여...${NC}"
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
  --role="roles/run.admin" \
  --condition=None \
  --quiet || echo -e "${YELLOW}권한이 이미 부여되어 있습니다${NC}"

# Container Registry 권한
echo -e "${YELLOW}- Container Registry 권한 부여...${NC}"
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
  --role="roles/storage.admin" \
  --condition=None \
  --quiet || echo -e "${YELLOW}권한이 이미 부여되어 있습니다${NC}"

# 서비스 계정 사용 권한
echo -e "${YELLOW}- 서비스 계정 사용 권한 부여...${NC}"
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
  --role="roles/iam.serviceAccountUser" \
  --condition=None \
  --quiet || echo -e "${YELLOW}권한이 이미 부여되어 있습니다${NC}"

echo -e "${GREEN}✅ 권한 부여 완료${NC}"

# 4. API 활성화 확인
echo -e "\n${BLUE}4단계: 필요한 API 활성화 확인${NC}"
echo -e "${YELLOW}필요한 API를 활성화합니다...${NC}"

gcloud services enable run.googleapis.com --quiet || true
gcloud services enable containerregistry.googleapis.com --quiet || true
gcloud services enable artifactregistry.googleapis.com --quiet || true

echo -e "${GREEN}✅ API 활성화 완료${NC}"

# 5. 서비스 계정 키 생성
echo -e "\n${BLUE}5단계: 서비스 계정 키 생성${NC}"

if [ -f "gcp-key.json" ]; then
    echo -e "${YELLOW}기존 키 파일이 있습니다: gcp-key.json${NC}"
    read -p "새 키를 생성하시겠습니까? (기존 키는 백업됩니다) (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        mv gcp-key.json gcp-key.json.backup.$(date +%Y%m%d_%H%M%S)
        echo -e "${YELLOW}기존 키를 백업했습니다${NC}"
    else
        echo -e "${GREEN}기존 키를 사용합니다${NC}"
        SKIP_KEY_CREATE=true
    fi
else
    SKIP_KEY_CREATE=false
fi

if [ "$SKIP_KEY_CREATE" != "true" ]; then
    echo -e "${YELLOW}서비스 계정 키 생성 중...${NC}"
    gcloud iam service-accounts keys create gcp-key.json \
      --iam-account=${SERVICE_ACCOUNT_EMAIL}
    
    echo -e "${GREEN}✅ 키 생성 완료: gcp-key.json${NC}"
    echo -e "${RED}⚠️  키 파일을 안전하게 보관하세요!${NC}"
fi

# 6. Base64 인코딩
echo -e "\n${BLUE}6단계: Base64 인코딩${NC}"
echo -e "${YELLOW}Base64로 인코딩 중...${NC}"

if [ -f "gcp-key.json" ]; then
    # Base64 인코딩
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        base64 -i gcp-key.json | pbcopy
        echo -e "${GREEN}✅ Base64 인코딩된 키가 클립보드에 복사되었습니다${NC}"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        base64 -i gcp-key.json | xclip -selection clipboard 2>/dev/null || \
        base64 -i gcp-key.json | wl-copy 2>/dev/null || \
        echo -e "${YELLOW}클립보드 복사 실패. 수동으로 복사하세요:${NC}"
        base64 -i gcp-key.json > gcp-key-base64.txt
        echo -e "${GREEN}✅ Base64 인코딩된 키가 gcp-key-base64.txt에 저장되었습니다${NC}"
    else
        base64 -i gcp-key.json > gcp-key-base64.txt
        echo -e "${GREEN}✅ Base64 인코딩된 키가 gcp-key-base64.txt에 저장되었습니다${NC}"
    fi
    
    # 파일로도 저장
    base64 -i gcp-key.json > gcp-key-base64.txt
    echo -e "${YELLOW}Base64 키 파일: gcp-key-base64.txt${NC}"
else
    echo -e "${RED}❌ gcp-key.json 파일을 찾을 수 없습니다${NC}"
    exit 1
fi

# 7. GitLab 변수 정보 출력
echo -e "\n${BLUE}7단계: GitLab CI/CD 변수 설정 정보${NC}"
echo -e "${GREEN}다음 변수들을 GitLab에 설정하세요:${NC}"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}1. GCP_SERVICE_ACCOUNT_KEY${NC}"
echo -e "   Value: (gcp-key-base64.txt 파일의 전체 내용)"
echo -e "   Type: Variable"
echo -e "   Flags: ✅ Mask variable, ✅ Protect variable (선택)"
echo ""
echo -e "${BLUE}2. GCP_PROJECT_ID${NC}"
echo -e "   Value: ${PROJECT_ID}"
echo ""
echo -e "${BLUE}3. GCP_SERVICE_NAME${NC}"
echo -e "   Value: hyperflow-works"
echo ""
echo -e "${BLUE}4. GCP_REGION${NC}"
echo -e "   Value: asia-northeast3"
echo ""
echo -e "${BLUE}5. GCP_PROJECT_HASH (선택사항)${NC}"
echo -e "   Value: (프로젝트 해시, 선택사항)"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}GitLab 설정 페이지:${NC}"
echo -e "https://gitlab.com/sacom123/hyperflow-works-hong/-/settings/ci_cd"
echo ""
echo -e "${YELLOW}Base64 키 파일 내용 확인:${NC}"
echo -e "cat gcp-key-base64.txt"
echo ""

# 8. 요약
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ 설정 완료!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}다음 단계:${NC}"
echo "1. GitLab 저장소 → Settings → CI/CD → Variables"
echo "2. 위의 변수들을 하나씩 추가"
echo "3. GitHub에 코드 푸시하여 배포 테스트"
echo ""
echo -e "${GREEN}완료! 🎉${NC}"

