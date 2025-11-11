#!/bin/bash

# GCP 빌링 계정 연결 스크립트

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}💰 GCP 빌링 계정 설정${NC}"
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

# 빌링 계정 목록 확인
echo "빌링 계정 목록 확인 중..."
BILLING_ACCOUNTS=$(gcloud billing accounts list --format="value(name,displayName)" 2>&1)

if echo "$BILLING_ACCOUNTS" | grep -q "ERROR"; then
    echo -e "${RED}❌ 빌링 계정을 확인할 수 없습니다${NC}"
    echo ""
    echo "빌링 계정이 없거나 권한이 없습니다."
    echo ""
    echo "다음 단계를 수행하세요:"
    echo "1. GCP Console 접속: https://console.cloud.google.com/billing"
    echo "2. 빌링 계정 생성 또는 선택"
    echo "3. 프로젝트에 빌링 계정 연결"
    echo ""
    echo "또는 다음 링크에서 직접 설정:"
    echo "https://console.cloud.google.com/billing/linkedaccount?project=$PROJECT_ID"
    exit 1
fi

if [ -z "$BILLING_ACCOUNTS" ]; then
    echo -e "${YELLOW}⚠️  빌링 계정이 없습니다${NC}"
    echo ""
    echo "빌링 계정을 생성해야 합니다:"
    echo "1. GCP Console 접속: https://console.cloud.google.com/billing"
    echo "2. '빌링 계정 만들기' 클릭"
    echo "3. 결제 정보 입력 (무료 크레딧 $300 받기)"
    echo "4. 이 스크립트를 다시 실행하세요"
    exit 1
fi

echo -e "${GREEN}✅ 사용 가능한 빌링 계정:${NC}"
echo "$BILLING_ACCOUNTS" | while IFS=$'\t' read -r account_id account_name; do
    echo "  - $account_name ($account_id)"
done
echo ""

# 빌링 계정 선택
echo "빌링 계정을 선택하세요:"
BILLING_ACCOUNT_LIST=$(gcloud billing accounts list --format="table(name,displayName)" 2>/dev/null)
echo "$BILLING_ACCOUNT_LIST"
echo ""

read -p "빌링 계정 ID를 입력하세요 (위 목록에서 name 열의 값): " BILLING_ACCOUNT_ID

if [ -z "$BILLING_ACCOUNT_ID" ]; then
    echo -e "${RED}❌ 빌링 계정 ID가 입력되지 않았습니다${NC}"
    exit 1
fi

# 프로젝트에 빌링 계정 연결
echo ""
echo "프로젝트에 빌링 계정을 연결합니다..."
if gcloud billing projects link "$PROJECT_ID" --billing-account="$BILLING_ACCOUNT_ID" 2>&1; then
    echo -e "${GREEN}✅ 빌링 계정이 연결되었습니다${NC}"
else
    echo -e "${RED}❌ 빌링 계정 연결 실패${NC}"
    echo ""
    echo "수동으로 연결하세요:"
    echo "1. GCP Console 접속: https://console.cloud.google.com/billing/linkedaccount?project=$PROJECT_ID"
    echo "2. 빌링 계정 선택"
    echo "3. '설정' 클릭"
    exit 1
fi

echo ""
echo "===================="
echo -e "${GREEN}✅ 빌링 설정 완료!${NC}"
echo ""
echo "다음 단계:"
echo "1. API 활성화를 다시 시도하세요:"
echo "   ./setup-gcp-next-steps.sh"
echo ""
echo "2. 또는 수동으로 API 활성화:"
echo "   gcloud services enable run.googleapis.com"
echo "   gcloud services enable containerregistry.googleapis.com"
echo "   gcloud services enable cloudbuild.googleapis.com"
echo ""

