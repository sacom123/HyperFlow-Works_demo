#!/bin/bash

# GCP Setup Script for Hyperflow Works
# This script helps you set up GCP project and service account for deployment

set -e

echo "🚀 Hyperflow Works - GCP Setup Script"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Google Cloud SDK is not installed.${NC}"
    echo "Please install it first:"
    echo "  macOS: brew install google-cloud-sdk"
    echo "  Linux: curl https://sdk.cloud.google.com | bash"
    echo "  Or visit: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo -e "${GREEN}✅ Google Cloud SDK is installed${NC}"
gcloud --version | head -n 1
echo ""

# Check if user is logged in
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo -e "${YELLOW}⚠️  You are not logged in to GCP${NC}"
    echo "Please log in:"
    echo "  gcloud auth login"
    echo "  gcloud auth application-default login"
    exit 1
fi

echo -e "${GREEN}✅ You are logged in to GCP${NC}"
gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n 1
echo ""

# Get project ID
read -p "Enter your GCP project ID (e.g., hyperflow-works-yourname): " PROJECT_ID
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ Project ID cannot be empty${NC}"
    exit 1
fi

# Check if project exists
if ! gcloud projects describe "$PROJECT_ID" &> /dev/null; then
    echo -e "${YELLOW}⚠️  Project '$PROJECT_ID' does not exist${NC}"
    read -p "Do you want to create it? (y/n): " CREATE_PROJECT
    if [ "$CREATE_PROJECT" = "y" ]; then
        echo "Creating project..."
        gcloud projects create "$PROJECT_ID" --name="Hyperflow Works"
        echo -e "${GREEN}✅ Project created${NC}"
    else
        echo -e "${RED}❌ Project creation cancelled${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Project '$PROJECT_ID' exists${NC}"
fi

# Set project as default
gcloud config set project "$PROJECT_ID"
echo -e "${GREEN}✅ Project set as default${NC}"
echo ""

# Enable required APIs
echo "Enabling required APIs..."
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
echo -e "${GREEN}✅ APIs enabled${NC}"
echo ""

# Set default region
read -p "Enter your preferred region (default: asia-northeast3): " REGION
REGION=${REGION:-asia-northeast3}
gcloud config set run/region "$REGION"
gcloud config set compute/region "$REGION"
echo -e "${GREEN}✅ Region set to $REGION${NC}"
echo ""

# Create service account
SERVICE_ACCOUNT_NAME="hyperflow-works-sa"
SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

if gcloud iam service-accounts describe "$SERVICE_ACCOUNT_EMAIL" &> /dev/null; then
    echo -e "${YELLOW}⚠️  Service account '$SERVICE_ACCOUNT_NAME' already exists${NC}"
    read -p "Do you want to use the existing one? (y/n): " USE_EXISTING
    if [ "$USE_EXISTING" != "y" ]; then
        echo -e "${RED}❌ Setup cancelled${NC}"
        exit 1
    fi
else
    echo "Creating service account..."
    gcloud iam service-accounts create "$SERVICE_ACCOUNT_NAME" \
        --display-name="Hyperflow Works Service Account" \
        --description="Service account for Hyperflow Works deployment"
    echo -e "${GREEN}✅ Service account created${NC}"
fi

# Grant permissions
echo "Granting permissions..."
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/run.admin" \
    --quiet

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/storage.admin" \
    --quiet

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/iam.serviceAccountUser" \
    --quiet

echo -e "${GREEN}✅ Permissions granted${NC}"
echo ""

# Create service account key
KEY_FILE="gcp-key.json"
if [ -f "$KEY_FILE" ]; then
    echo -e "${YELLOW}⚠️  Key file '$KEY_FILE' already exists${NC}"
    read -p "Do you want to overwrite it? (y/n): " OVERWRITE
    if [ "$OVERWRITE" != "y" ]; then
        echo -e "${YELLOW}⚠️  Using existing key file${NC}"
    else
        echo "Creating service account key..."
        gcloud iam service-accounts keys create "$KEY_FILE" \
            --iam-account="$SERVICE_ACCOUNT_EMAIL"
        echo -e "${GREEN}✅ Key file created${NC}"
    fi
else
    echo "Creating service account key..."
    gcloud iam service-accounts keys create "$KEY_FILE" \
        --iam-account="$SERVICE_ACCOUNT_EMAIL"
    echo -e "${GREEN}✅ Key file created${NC}"
fi

# Encode key to Base64
echo "Encoding key to Base64..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    base64 -i "$KEY_FILE" | pbcopy
    echo -e "${GREEN}✅ Key encoded and copied to clipboard${NC}"
    echo -e "${YELLOW}⚠️  Don't forget to save it to GitLab CI/CD variables!${NC}"
else
    # Linux
    base64 -i "$KEY_FILE" > gcp-key-base64.txt
    echo -e "${GREEN}✅ Key encoded and saved to gcp-key-base64.txt${NC}"
    echo -e "${YELLOW}⚠️  Copy the contents and save it to GitLab CI/CD variables!${NC}"
fi

echo ""
echo "======================================"
echo -e "${GREEN}✅ GCP Setup Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Add the following variables to GitLab CI/CD:"
echo "   - GCP_SERVICE_ACCOUNT_KEY: (Base64 encoded key)"
echo "   - GCP_PROJECT_ID: $PROJECT_ID"
echo "   - GCP_SERVICE_NAME: hyperflow-works"
echo "   - GCP_REGION: $REGION"
echo ""
echo "2. Push your code to GitLab:"
echo "   git add ."
echo "   git commit -m 'Setup GCP deployment'"
echo "   git push origin main"
echo ""
echo "3. Monitor the deployment in GitLab CI/CD pipelines"
echo ""

