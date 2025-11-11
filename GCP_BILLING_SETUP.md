# GCP 빌링 설정 가이드

## ❌ 발생한 오류

```
ERROR: Billing account for project '818668788313' is not found. 
Billing must be enabled for activation of service(s) 
'run.googleapis.com,artifactregistry.googleapis.com,containerregistry.googleapis.com' to proceed.
```

**원인**: GCP 프로젝트에 빌링 계정이 연결되지 않았습니다.

## ✅ 해결 방법

### 방법 1: GCP Console에서 빌링 활성화 (권장)

1. **GCP Console 접속**
   - https://console.cloud.google.com/billing 접속
   - 또는 프로젝트 선택 후: https://console.cloud.google.com/billing/linkedaccount?project=hyperflow-works-hong

2. **빌링 계정 선택 또는 생성**
   - 기존 빌링 계정이 있으면 선택
   - 없으면 "빌링 계정 만들기" 클릭

3. **프로젝트에 빌링 계정 연결**
   - 프로젝트 선택: `hyperflow-works-hong`
   - 빌링 계정 선택
   - "설정" 클릭

4. **결제 정보 입력** (처음인 경우)
   - 신용카드 정보 입력
   - GCP는 처음 90일간 **$300 무료 크레딧** 제공
   - Cloud Run은 **무료 티어** 제공 (월 200만 요청, 360,000 GiB-초, 180,000 vCPU-초)

### 방법 2: gcloud 명령어로 빌링 계정 연결

```bash
# 빌링 계정 목록 확인
gcloud billing accounts list

# 프로젝트에 빌링 계정 연결
gcloud billing projects link hyperflow-works-hong \
  --billing-account=BILLING_ACCOUNT_ID
```

`BILLING_ACCOUNT_ID`는 위 명령어로 확인한 빌링 계정 ID를 사용하세요.

## 💰 비용 정보

### GCP 무료 크레딧
- **$300 무료 크레딧** (90일간)
- 신용카드 등록 필요 (자동 청구되지 않음)

### Cloud Run 무료 티어
- **월 200만 요청** 무료
- **월 360,000 GiB-초** 메모리 무료
- **월 180,000 vCPU-초** CPU 무료
- 소규모 프로젝트는 무료 티어로 충분합니다!

### 예상 비용 (무료 티어 초과 시)
- Cloud Run: 요청당 $0.40/1M (월 200만 요청까지 무료)
- Container Registry: 월 0.5GB 저장소 무료
- 네트워크: 월 1GB 전송 무료

## 🔍 빌링 상태 확인

```bash
# 프로젝트의 빌링 계정 확인
gcloud billing projects describe hyperflow-works-hong

# 빌링 계정 목록 확인
gcloud billing accounts list
```

## 📝 다음 단계

빌링 계정을 연결한 후:

1. **다시 설정 스크립트 실행**
   ```bash
   ./setup-gcp-next-steps.sh
   ```

2. **또는 API 활성화 다시 시도**
   ```bash
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   ```

## ⚠️ 중요 사항

1. **무료 크레딧 사용**
   - $300 무료 크레딧이 소진되면 알림을 받습니다
   - 예산 알림을 설정하는 것을 권장합니다

2. **예산 알림 설정**
   - GCP Console → Billing → Budgets & alerts
   - 예산 한도 설정 및 알림 설정

3. **비용 모니터링**
   - GCP Console → Billing → Cost breakdown
   - 실시간 비용 확인 가능

## 🔗 유용한 링크

- GCP 빌링 설정: https://console.cloud.google.com/billing
- Cloud Run 가격: https://cloud.google.com/run/pricing
- 무료 크레딧 정보: https://cloud.google.com/free
- 예산 알림 설정: https://console.cloud.google.com/billing/budgets

## 🆘 문제 해결

### 빌링 계정이 없다면?
1. GCP Console 접속
2. Billing → 계정 관리
3. "빌링 계정 만들기" 클릭
4. 결제 정보 입력 (무료 크레딧 받기)

### 빌링 계정이 이미 있다면?
1. GCP Console → Billing
2. 프로젝트 선택
3. 빌링 계정 연결

### 여전히 오류가 발생한다면?
- 몇 분 대기 후 다시 시도 (전파 시간 필요)
- GCP Console에서 직접 API 활성화 시도
- 프로젝트 권한 확인

