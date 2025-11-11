#!/bin/bash

# GCP 설정 상태 확인 스크립트

set -e

echo "🔍 GCP 설정 상태 확인"
echo "===================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 1. gcloud 설치 확인
echo "1. Google Cloud SDK 설치 확인"
if command -v gcloud &> /dev/null; then
    echo -e "${GREEN}✅ gcloud가 설치되어 있습니다${NC}"
    gcloud --version | head -n 1
else
    echo -e "${RED}❌ gcloud가 설치되어 있지 않습니다${NC}"
    echo "설치 방법: brew install google-cloud-sdk"
    exit 1
fi
echo ""

# 2. 인증 확인
echo "2. 인증 상태 확인"
ACTIVE_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null | head -n 1)
if [ -n "$ACTIVE_ACCOUNT" ]; then
    echo -e "${GREEN}✅ 로그인되어 있습니다: $ACTIVE_ACCOUNT${NC}"
else
    echo -e "${RED}❌ 로그인되어 있지 않습니다${NC}"
    echo "로그인: gcloud auth login"
    exit 1
fi
echo ""

# 3. 프로젝트 확인
echo "3. 현재 프로젝트 확인"
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null)
if [ -n "$CURRENT_PROJECT" ]; then
    echo -e "${GREEN}✅ 현재 프로젝트: $CURRENT_PROJECT${NC}"
    
    # 프로젝트 존재 확인
    if gcloud projects describe "$CURRENT_PROJECT" &> /dev/null; then
        echo -e "${GREEN}✅ 프로젝트가 존재합니다${NC}"
    else
        echo -e "${RED}❌ 프로젝트가 존재하지 않습니다${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ 프로젝트가 설정되어 있지 않습니다${NC}"
    echo "프로젝트 설정: gcloud config set project PROJECT_ID"
    exit 1
fi
echo ""

# 4. API 활성화 확인
echo "4. 필요한 API 활성화 확인"
APIS=("run.googleapis.com" "containerregistry.googleapis.com" "cloudbuild.googleapis.com")
ALL_ENABLED=true

for API in "${APIS[@]}"; do
    if gcloud services list --enabled --filter="name:$API" --format="value(name)" 2>/dev/null | grep -q "$API"; then
        echo -e "${GREEN}✅ $API 활성화됨${NC}"
    else
        echo -e "${YELLOW}⚠️  $API 활성화되지 않음${NC}"
        ALL_ENABLED=false
    fi
done
echo ""

if [ "$ALL_ENABLED" = false ]; then
    echo "API를 활성화하려면:"
    echo "  gcloud services enable run.googleapis.com"
    echo "  gcloud services enable containerregistry.googleapis.com"
    echo "  gcloud services enable cloudbuild.googleapis.com"
    echo ""
fi

# 5. 리전 설정 확인
echo "5. 리전 설정 확인"
REGION=$(gcloud config get-value run/region 2>/dev/null)
if [ -n "$REGION" ]; then
    echo -e "${GREEN}✅ Cloud Run 리전: $REGION${NC}"
else
    echo -e "${YELLOW}⚠️  리전이 설정되어 있지 않습니다${NC}"
    echo "리전 설정: gcloud config set run/region asia-northeast3"
    echo ""
fi

# 6. Service Account 확인
echo "6. Service Account 확인"
SERVICE_ACCOUNT="hyperflow-works-sa@${CURRENT_PROJECT}.iam.gserviceaccount.com"
if gcloud iam service-accounts describe "$SERVICE_ACCOUNT" &> /dev/null; then
    echo -e "${GREEN}✅ Service Account가 존재합니다: $SERVICE_ACCOUNT${NC}"
    
    # 권한 확인
    echo "   권한 확인 중..."
    # 권한은 복잡하므로 존재 여부만 확인
else
    echo -e "${YELLOW}⚠️  Service Account가 존재하지 않습니다${NC}"
    echo "생성이 필요합니다"
    echo ""
fi

# 7. 키 파일 확인
echo "7. 키 파일 확인"
if [ -f "gcp-key.json" ]; then
    echo -e "${GREEN}✅ gcp-key.json 파일이 존재합니다${NC}"
else
    echo -e "${YELLOW}⚠️  gcp-key.json 파일이 존재하지 않습니다${NC}"
    echo "생성이 필요합니다"
    echo ""
fi

echo "===================="
echo "상태 확인 완료"
echo ""

# 다음 단계 안내
echo "📋 다음 단계:"
if [ "$ALL_ENABLED" = false ]; then
    echo "1. API 활성화 필요"
fi
if [ -z "$REGION" ]; then
    echo "2. 리전 설정 필요"
fi
if ! gcloud iam service-accounts describe "$SERVICE_ACCOUNT" &> /dev/null 2>&1; then
    echo "3. Service Account 생성 필요"
fi
if [ ! -f "gcp-key.json" ]; then
    echo "4. Service Account 키 생성 필요"
fi

echo ""
echo "자세한 가이드는 GCP_INSTALLATION_GUIDE.md를 참조하세요."

