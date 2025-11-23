<a href="https://ibridge.framer.website/" target="_blank">
<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/f7401bb1-1081-4b63-b17e-1dc8bcb4fcc8" />
</a>

<br/>
<br/>

# 0. Getting Started (시작하기)

```bash
$ npm run build
$ npm start
```

[서비스 링크](https://ibridge.framer.website/)

<br/>
<br/>

# 1. Project Overview (프로젝트 개요)

- 프로젝트 이름: i-Bridge
- 프로젝트 설명: 부모와 아이의 소통을 돕는 AI 웹 서비스

<br/>
<br/>

# 2. Team Members (팀원 및 팀 소개)

| 남윤아 | 이해린 | 김현호 | 황지웅 |
| :----: | :----: | :----: | :----: |

| FE | FE | BE | BE |
| [GitHub](https://github.com/219yoona) | [GitHub](https://github.com/rin00000) | [GitHub](https://github.com/Aqoom01) | [GitHub](https://github.com/woongjee) |

<br/>
<br/>

# 3. Key Features (주요 기능)

- **회원가입&로그인**:
  - SNS 계정을 통해 로그인합니다.

- **가족 정보 등록**:
  - 자신의 가족 구성원 정보를 등록합니다.

- **AI 캐릭터와의 대화**:
  - 매일 매일 주어진 질문에 대해 AI캐릭터와 대화를 진행합니다
  - 아이가 원하는 주제로 대화를 진행할 수도 있습니다.

- **대화 리워드 시스템**:
  - 6번의 문답으로 이루어진 대화를 완료하면 포도알 하나를 받습니다.

- **아이 대화 통계**:
  1. 전체 대화 기록 (텍스트, 영상)
  2. GPT-5가 동적으로 생성한 개인화된 대화 군집화 결과
  3. 카테고리별 긍정적/부정적 비율 시각화
  4. 아이의 최대 관심, 긍정비율 1위, 부정비율 1위 카테고리
  5. 특정 카테고리 또는 날짜별 대화 기록을 필터링하여 확인하는 기능

<br/>
<br/>

# 4. Tasks & Responsibilities (작업 및 역할 분담)

| 김현호 | <ul><li>프로젝트 계획 및 관리</li><li>팀 리딩 및 커뮤니케이션</li><li>커스텀훅 개발</li></ul> |
| 남윤아 | <ul><li>메인 페이지 개발</li><li>동아리 만들기 페이지 개발</li><li>커스텀훅 개발</li></ul> |
| 이해린 | <ul><li>아이용 서비스 개발</li><li>로그인 로직 개발</li>
| 황지웅 | <ul><li>회원가입 페이지 개발</li><li>마이 프로필 페이지 개발</li><li>커스텀훅 개발</li></ul> |

<br/>
<br/>

# 5. Technology Stack (기술 스택)

## 5.1 Language

|            |                                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| HTML5      | <img src="https://github.com/user-attachments/assets/2e122e74-a28b-4ce7-aff6-382959216d31" alt="HTML5" width="100">      |
| CSS3       | <img src="https://github.com/user-attachments/assets/c531b03d-55a3-40bf-9195-9ff8c4688f13" alt="CSS3" width="100">       |
| Javascript | <img src="https://github.com/user-attachments/assets/4a7d7074-8c71-48b4-8652-7431477669d1" alt="Javascript" width="100"> |

<br/>

## 5.2 Frotend

|                  |                                                                                                                                |         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------- |
| React            | <img src="https://github.com/user-attachments/assets/e3b49dbb-981b-4804-acf9-012c854a2fd2" alt="React" width="100">            | 18.3.1  |
| StyledComponents | <img src="https://github.com/user-attachments/assets/c9b26078-5d79-40cc-b120-69d9b3882786" alt="StyledComponents" width="100"> | 6.1.12  |
| MaterialUI       | <img src="https://github.com/user-attachments/assets/75a46fa7-ebc0-4a9d-b648-c589f87c4b55" alt="MUI" width="100">              | 5.0.0   |
| DayJs            | <img src="https://github.com/user-attachments/assets/3632d7d6-8d43-4dd5-ba7a-501a2bc3a3e4" alt="DayJs" width="100">            | 1.11.12 |

<br/>

## 5.3 Backend

|          |                                                                                                                        |         |
| -------- | ---------------------------------------------------------------------------------------------------------------------- | ------- |
| Firebase | <img src="https://github.com/user-attachments/assets/1694e458-9bb0-4a0b-8fe6-8efc6e675fa1" alt="Firebase" width="100"> | 10.12.5 |

<br/>

## 5.4 Cooperation

|            |                                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| Git        | <img src="https://github.com/user-attachments/assets/483abc38-ed4d-487c-b43a-3963b33430e6" alt="git" width="100">        |
| Git Kraken | <img src="https://github.com/user-attachments/assets/32c615cb-7bc0-45cd-91ea-0d1450bfc8a9" alt="git kraken" width="100"> |
| Notion     | <img src="https://github.com/user-attachments/assets/34141eb9-deca-416a-a83f-ff9543cc2f9a" alt="Notion" width="100">     |

<br/>

# 6. Project Structure (프로젝트 구조)

```plaintext
project/
├── public/
│   ├── index.html           # HTML 템플릿 파일
│   └── favicon.ico          # 아이콘 파일
├── src/
│   ├── assets/              # 이미지, 폰트 등 정적 파일
│   ├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── hooks/               # 커스텀 훅 모음
│   ├── pages/               # 각 페이지별 컴포넌트
│   ├── App.js               # 메인 애플리케이션 컴포넌트
│   ├── index.js             # 엔트리 포인트 파일
│   ├── index.css            # 전역 css 파일
│   ├── firebaseConfig.js    # firebase 인스턴스 초기화 파일
│   package-lock.json    # 정확한 종속성 버전이 기록된 파일로, 일관된 빌드를 보장
│   package.json         # 프로젝트 종속성 및 스크립트 정의
├── .gitignore               # Git 무시 파일 목록
└── README.md                # 프로젝트 개요 및 사용법
```

<br/>
<br/>

# 7. 커밋 컨벤션

## 기본 구조

```
type : subject

body
```

<br/>

## type 종류

```
feat : 새로운 기능 추가
fix : 버그 수정
docs : 문서 수정
style : 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우
refactor : 코드 리펙토링
test : 테스트 코드, 리펙토링 테스트 코드 추가
chore : 빌드 업무 수정, 패키지 매니저 수정
```

<br/>
