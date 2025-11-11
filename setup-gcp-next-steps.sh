#!/bin/bash

# GCP 다음 단계 설정 스크립트
# 로그인 및 프로젝트 생성이 완료된 상태에서 실행

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 GCP 다음 단계 설정${NC}"
echo "===================="
echo ""

# 현재 프로젝트 확인
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ 프로젝트가 설정되어 있지 않습니다${NC}"
    echo "프로젝트 설정: gcloud config set project PROJECT_ID"
    exit 1
fi

echo -e "${GREEN}✅ 현재 프로젝트: $PROJECT_ID${NC}"
echo ""

# 1. Cloud Resource Manager API 활성화 (필수)
echo -e "${BLUE}1. Cloud Resource Manager API 활성화${NC}"
if gcloud services list --enabled --filter="name:cloudresourcemanager.googleapis.com" --format="value(name)" 2>/dev/null | grep -q "cloudresourcemanager.googleapis.com"; then
    echo -e "${GREEN}✅ Cloud Resource Manager API가 이미 활성화되어 있습니다${NC}"
else
    echo "Cloud Resource Manager API를 활성화합니다..."
    gcloud services enable cloudresourcemanager.googleapis.com
    echo -e "${GREEN}✅ Cloud Resource Manager API 활성화 완료${NC}"
    echo "잠시 대기 중... (API 전파 시간)"
    sleep 5
fi
echo ""

# 2. 필요한 API 활성화
echo -e "${BLUE}2. 필요한 API 활성화${NC}"
APIS=("run.googleapis.com" "containerregistry.googleapis.com" "cloudbuild.googleapis.com")

for API in "${APIS[@]}"; do
    if gcloud services list --enabled --filter="name:$API" --format="value(name)" 2>/dev/null | grep -q "$API"; then
        echo -e "${GREEN}✅ $API 이미 활성화됨${NC}"
    else
        echo "$API 활성화 중..."
        gcloud services enable "$API"
        echo -e "${GREEN}✅ $API 활성화 완료${NC}"
    fi
done
echo ""

# 3. 리전 설정
echo -e "${BLUE}3. 리전 설정${NC}"
read -p "리전을 입력하세요 (기본값: asia-northeast3 - 서울): " REGION
REGION=${REGION:-asia-northeast3}

gcloud config set run/region "$REGION"
gcloud config set compute/region "$REGION"
echo -e "${GREEN}✅ 리전이 $REGION으로 설정되었습니다${NC}"
echo ""

# 4. Service Account 생성
echo -e "${BLUE}4. Service Account 생성${NC}"
SERVICE_ACCOUNT_NAME="hyperflow-works-sa"
SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

if gcloud iam service-accounts describe "$SERVICE_ACCOUNT_EMAIL" &> /dev/null; then
    echo -e "${GREEN}✅ Service Account가 이미 존재합니다: $SERVICE_ACCOUNT_EMAIL${NC}"
    read -p "기존 Service Account를 사용하시겠습니까? (y/n): " USE_EXISTING
    if [ "$USE_EXISTING" != "y" ]; then
        echo -e "${YELLOW}⚠️  취소되었습니다${NC}"
        exit 1
    fi
else
    echo "Service Account를 생성합니다..."
    gcloud iam service-accounts create "$SERVICE_ACCOUNT_NAME" \
        --display-name="Hyperflow Works Service Account" \
        --description="Service account for Hyperflow Works deployment" \
        --project="$PROJECT_ID"
    echo -e "${GREEN}✅ Service Account 생성 완료${NC}"
fi
echo ""

# 5. 권한 부여
echo -e "${BLUE}5. Service Account 권한 부여${NC}"
echo "권한을 부여합니다..."

# Cloud Run Admin
echo "  - Cloud Run Admin 역할 부여 중..."
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/run.admin" \
    --quiet

# Storage Admin (Container Registry용)
echo "  - Storage Admin 역할 부여 중..."
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/storage.admin" \
    --quiet

# Service Account User
echo "  - Service Account User 역할 부여 중..."
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/iam.serviceAccountUser" \
    --quiet

echo -e "${GREEN}✅ 권한 부여 완료${NC}"
echo ""

# 6. Service Account 키 생성
echo -e "${BLUE}6. Service Account 키 생성${NC}"
KEY_FILE="gcp-key.json"

if [ -f "$KEY_FILE" ]; then
    echo -e "${YELLOW}⚠️  $KEY_FILE 파일이 이미 존재합니다${NC}"
    read -p "덮어쓰시겠습니까? (y/n): " OVERWRITE
    if [ "$OVERWRITE" != "y" ]; then
        echo -e "${YELLOW}⚠️  기존 키 파일을 사용합니다${NC}"
    else
        echo "새 키를 생성합니다..."
        gcloud iam service-accounts keys create "$KEY_FILE" \
            --iam-account="$SERVICE_ACCOUNT_EMAIL" \
            --project="$PROJECT_ID"
        echo -e "${GREEN}✅ 키 파일 생성 완료${NC}"
    fi
else
    echo "키 파일을 생성합니다..."
    gcloud iam service-accounts keys create "$KEY_FILE" \
        --iam-account="$SERVICE_ACCOUNT_EMAIL" \
        --project="$PROJECT_ID"
    echo -e "${GREEN}✅ 키 파일 생성 완료${NC}"
fi
echo ""

# 7. Base64 인코딩
echo -e "${BLUE}7. 키 파일 Base64 인코딩${NC}"
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    base64 -i "$KEY_FILE" | pbcopy
    echo -e "${GREEN}✅ 키가 Base64로 인코딩되어 클립보드에 복사되었습니다${NC}"
    echo -e "${YELLOW}⚠️  GitLab CI/CD 변수에 이 값을 붙여넣으세요!${NC}"
else
    # Linux
    base64 -i "$KEY_FILE" > gcp-key-base64.txt
    echo -e "${GREEN}✅ 키가 Base64로 인코딩되어 gcp-key-base64.txt에 저장되었습니다${NC}"
    echo -e "${YELLOW}⚠️  이 파일의 내용을 GitLab CI/CD 변수에 붙여넣으세요!${NC}"
fi
echo ""

# 완료 메시지
echo "===================="
echo -e "${GREEN}✅ GCP 설정 완료!${NC}"
echo ""
echo "📋 설정 요약:"
echo "  프로젝트 ID: $PROJECT_ID"
echo "  리전: $REGION"
echo "  Service Account: $SERVICE_ACCOUNT_EMAIL"
echo "  키 파일: $KEY_FILE"
echo ""
echo "📝 다음 단계:"
echo "1. GitLab 프로젝트로 이동"
echo "2. Settings → CI/CD → Variables로 이동"
echo "3. 다음 변수들을 추가:"
echo "   - GCP_SERVICE_ACCOUNT_KEY: (클립보드의 Base64 키)"
echo "   - GCP_PROJECT_ID: $PROJECT_ID"
echo "   - GCP_SERVICE_NAME: hyperflow-works"
echo "   - GCP_REGION: $REGION"
echo ""
echo "4. 코드를 GitLab에 푸시:"
echo "   git add ."
echo "   git commit -m 'Setup GCP deployment'"
echo "   git push origin main"
echo ""

