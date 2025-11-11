# GitLab 변수 설정 빠른 참조

## 🔑 키 복사 (터미널에서 실행)

```bash
# 키 파일이 있는지 확인
ls -la gcp-key.json

# Base64 인코딩하여 클립보드에 복사
base64 -i gcp-key.json | pbcopy

echo "✅ 키가 클립보드에 복사되었습니다!"
```

## 📋 GitLab 변수 설정 (모달 창에서)

### 변수 1: GCP_SERVICE_ACCOUNT_KEY
- **유형**: 변수(기본값)
- **환경**: 모두(기본값)
- **시계**: ✅ **가면을 쓰고 숨김** (중요!)
- **깃발**: ✅ 변수 보호 체크, ❌ 변수 참조 확장 해제
- **열쇠**: `GCP_SERVICE_ACCOUNT_KEY`
- **값**: 클립보드의 Base64 키 (Cmd+V)

### 변수 2: GCP_PROJECT_ID
- **유형**: 변수(기본값)
- **환경**: 모두(기본값)
- **시계**: 보이는
- **깃발**: ✅ 변수 보호 체크
- **열쇠**: `GCP_PROJECT_ID`
- **값**: `hyperflow-works-hong`

### 변수 3: GCP_SERVICE_NAME
- **유형**: 변수(기본값)
- **환경**: 모두(기본값)
- **시계**: 보이는
- **깃발**: ✅ 변수 보호 체크
- **열쇠**: `GCP_SERVICE_NAME`
- **값**: `hyperflow-works`

### 변수 4: GCP_REGION
- **유형**: 변수(기본값)
- **환경**: 모두(기본값)
- **시계**: 보이는
- **깃발**: ✅ 변수 보호 체크
- **열쇠**: `GCP_REGION`
- **값**: `asia-northeast3`

### 변수 5: GCP_PROJECT_HASH (선택사항)
- **유형**: 변수(기본값)
- **환경**: 모두(기본값)
- **시계**: 보이는
- **깃발**: ✅ 변수 보호 체크
- **열쇠**: `GCP_PROJECT_HASH`
- **값**: (비워둬도 됨)

## ⚠️ 중요!

1. **GCP_SERVICE_ACCOUNT_KEY**는 반드시 **"가면을 쓰고 숨김"**으로 설정
2. 모든 변수에 **"변수 보호"** 체크
3. **"변수 참조 확장"**은 모두 해제
4. 키는 Base64 인코딩된 전체 내용을 한 줄로 붙여넣기

## ✅ 확인 방법

변수 추가 후 "프로젝트 변수" 섹션에서:
- GCP_SERVICE_ACCOUNT_KEY: [가면을 쓰고 숨김] [변수 보호]
- GCP_PROJECT_ID: [보이는] [변수 보호] hyperflow-works-hong
- GCP_SERVICE_NAME: [보이는] [변수 보호] hyperflow-works
- GCP_REGION: [보이는] [변수 보호] asia-northeast3
