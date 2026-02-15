# GitHub Desktop로 코드 올리기 (이 저장소 기준)

이 프로젝트는 현재 로컬 Git 저장소로만 존재하고, remote(`origin`)가 연결되어 있지 않으면 GitHub에서 보이지 않습니다.

## 1) GitHub Desktop에서 로컬 저장소 열기

1. GitHub Desktop 실행
2. **File → Add local repository...**
3. 경로로 `/workspace/derby` 선택

## 2) GitHub 원격 저장소 만들기/연결

### 방법 A: 새 저장소 생성 (처음부터 올릴 때)
1. 상단 메뉴에서 **Repository → Create GitHub repository...**
2. 이름 입력 (예: `derby`)
3. Public/Private 선택
4. **Publish repository** 클릭

### 방법 B: 기존 GitHub 저장소에 연결
1. GitHub에서 빈 repo 생성
2. GitHub Desktop의 **Repository settings... → Remote** 이동
3. `origin` URL을 기존 repo 주소로 설정

## 3) 브랜치 push

1. 현재 브랜치가 `work`인지 확인
2. 우상단 **Push origin** 클릭
3. push 완료 후 GitHub 웹에서 브랜치 확인

## 4) Pull Request 만들기

1. GitHub Desktop에서 **Create Pull Request** 클릭
2. base/main ← compare/work 확인
3. 제목/설명 입력 후 PR 생성

## 5) 추가로 필요한 것 (체크리스트)

- GitHub 로그인 상태 확인
- 저장소 권한(조직 repo면 Write 권한) 확인
- 기본 브랜치(`main`/`master`) 확인
- branch 보호 규칙(리뷰 필수 여부) 확인
- 2FA 사용 시 GitHub Desktop 재인증 필요 가능

## 6) 문제 해결

- `Push origin` 버튼이 비활성화됨
  - 변경사항이 commit되지 않았는지 확인
- push가 실패함
  - 권한 부족 또는 remote URL 오타 확인
  - 회사/학교망에서 HTTPS 또는 기본 SSH(22)가 막히면, SSH 443 우회 설정 적용
    ```bash
    mkdir -p ~/.ssh
    cat >> ~/.ssh/config <<'EOF'
    Host github.com
      HostName ssh.github.com
      Port 443
      User git
    EOF

    git remote set-url origin git@github.com:tannhauser826-ai/derby.git
    git remote -v
    ```
- 브랜치는 올라갔는데 PR 버튼이 안 뜸
  - base/compare 브랜치가 동일한지 확인
