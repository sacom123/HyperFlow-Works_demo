# 🚀 지금 바로 해야 할 것

## 1단계: 변경사항 커밋 및 푸시

```bash
git add .
git commit -m "Clean up: Remove unnecessary scripts and update GitLab CI/CD"
git push origin main
```

## 2단계: GitLab CI/CD 변수 설정 (가장 중요!)

### GitLab 저장소 접속
https://gitlab.com/seonhohong/hyperflow-works-demohong/-/settings/ci_cd

### Base64 키 준비
```bash
base64 -i gcp-key.json | pbcopy  # macOS
# 또는
base64 -i gcp-key.json > gcp-key-base64.txt
cat gcp-key-base64.txt
```

### 변수 추가 (Settings → CI/CD → Variables → Add variable)

1. **GCP_SERVICE_ACCOUNT_KEY**
   - Value: 위에서 복사한 Base64 키 전체
   - ✅ Mask variable 체크

2. **GCP_PROJECT_ID**
   - Value: `hyperflow-works-hong`

3. **GCP_SERVICE_NAME**
   - Value: `hyperflow-works`

4. **GCP_REGION**
   - Value: `asia-northeast3`

5. **GCP_PROJECT_HASH** (선택사항)
   - Value: (비워둬도 됨)

## 3단계: GitHub Secrets 확인

https://github.com/sacom123/HyperFlow-Works_demo/settings/secrets/actions

- **GITLAB_TOKEN** 확인 (GitHub → GitLab 동기화용)

## 4단계: 배포 테스트

```bash
git push origin main
```

그러면 자동으로:
- GitHub → GitLab 동기화
- GitLab CI/CD 실행
- GCP Cloud Run 배포

## ✅ 확인

- GitLab 파이프라인: https://gitlab.com/seonhohong/hyperflow-works-demohong/-/pipelines
- GCP Cloud Run: https://console.cloud.google.com/run
