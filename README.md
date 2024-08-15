# 🏃‍♂️ Run-Us

<img src="./resource/Logo.png" width=200px>

## 📋 목차
- [🏃‍♂️ Run-Us](#️-run-us)
  - [📋 목차](#-목차)
  - [💡 프로젝트 소개](#-프로젝트-소개)
  - [🌟 프로젝트 주요 기능](#-프로젝트-주요-기능)
  - [🚀 프로젝트의 차별점 및 독창성](#-프로젝트의-차별점-및-독창성)
  - [📱 서비스 화면](#-서비스-화면)
  - [🛠 주요 기술 스택](#-주요-기술-스택)
      - [**Frontend**](#frontend)
      - [**Backend**](#backend)
      - [**DB**](#db)
      - [**Infra**](#infra)
  - [📦 프로젝트 구조](#-프로젝트-구조)
  - [📄 요구사항 명세서](#-요구사항-명세서)
  - [🌐 외부 API](#-외부-api)
  - [🛠 배포 자동화](#-배포-자동화)
  - [👥 역할 별 담당자](#-역할-별-담당자)

## 💡 프로젝트 소개

**📆 진행 기간**
2024.07.05 ~ 2024.08.16 (6주)

**🏃‍♂️ 배경**
달리기를 좋아하시는 데, 혼자 달리시긴 싫나요?
Run-Us는 사용자가 지역 기반 커뮤니티에서 러닝 메이트를 모집하고, 오프라인에서 함께 달리는 경험을 공유할 수 있는 러닝 전용 플랫폼입니다!
실시간 위치 추적 및 팀 기반의 러닝 데이터 관리 기능을 제공하여 사용자들이 더욱 효율적이고 재미있게 운동할 수 있도록 돕습니다.

<br />

## 🌟 프로젝트 주요 기능
1. **지역 기반 커뮤니티 및 간편한 번개 모임 모집**
   - 가입 시 선택한 지역 사람들만 입장 가능한 커뮤니티
   - 커뮤니티를 통한 간편한 번개 모임 모집

2. **오프라인에서 간편한 방 생성**
   - 오프라인에서 방 생성 후 qr 코드 스캔을 통한 입장
   - 팀원이 아닌 사람이 방에 들어올 수 없기 때문에, 원활한 러닝 모임 관리가 가능

3. **실시간 위치 추적 및 러닝 관리**
   - 러닝이 시작되면 지도에 각 팀원의 위치가 표시
   - 러닝 종료 시 각자의 리포트에 거리, 시간, 소모 칼로리가 자동으로 기록 
   - 리포트 페이지에서 월별 및 각 러닝 기록을 관리

   <br />

## 🚀 프로젝트의 차별점 및 독창성
1. **실시간 위치 갱신**
   - Geolocation API를 활용하여 각 팀원의 위치를 5초마다 자동으로 갱신하고, 지도에 실시간으로 반영되도록 구현하였습니다.

2. **WebSocket 기반 실시간 통신**
   - WebSocket 기술을 적용하여 팀 생성, 팀원들의 달리기 위치 추적, 러닝 종료 등의 정보를 실시간으로 반영할 수 있도록 설계되었습니다.

<br />

## 📱 서비스 화면
<table>
<tr><img src="./resource/project.gif"></tr>
</table>
<br /><br /><br />

## 🛠 주요 기술 스택

|                                                일정관리                                                 |                                               형상관리                                                |                                                커뮤니케이션                                                |                                                  디자인                                                   |
| :-----------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------: |
| ![JIRA](https://img.shields.io/badge/jira-0052CC?style=for-the-badge&logo=jirasoftware&logoColor=white) | ![GITLAB](https://img.shields.io/badge/gitlab-FC6D26?style=for-the-badge&logo=gitlab&logoColor=white) | ![Notion](https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white) | ![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white) |

<br />

#### **Frontend**

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

<br />

#### **Backend**

![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)

#### **DB**

![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)

#### **Infra**

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Jenkins](https://img.shields.io/badge/jenkins-%232C5263.svg?style=for-the-badge&logo=jenkins&logoColor=white)
![Grafana](https://img.shields.io/badge/grafana-%23F46800.svg?style=for-the-badge&logo=grafana&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=Prometheus&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)


## 📦 프로젝트 구조

<details>
<summary><b>RunUs-Front</b></summary>

```
📦 RunUs-Front
┣ 📂src
┃ ┣ 📂assets             # 이미지, 아이콘 등 정적 파일
┃ ┣ 📂components         # 컴포넌트 디렉토리
┃ ┃ ┣ 📂Auth
┃ ┃ ┃ ┣ 📜FindEmailModalContent.jsx
┃ ┃ ┃ ┣ 📜FindPhoneNumberModalContent.jsx
┃ ┃ ┃ ┣ 📜Modal.jsx
┃ ┃ ┃ ┗ 📜SearchBar.jsx
┃ ┃ ┣ 📂common
┃ ┃ ┃ ┣ 📜Button.jsx
┃ ┃ ┃ ┣ 📜Button2.jsx
┃ ┃ ┃ ┣ 📜Header.jsx
┃ ┃ ┃ ┣ 📜ProtectedRoute.jsx
┃ ┃ ┃ ┣ 📜RedirectRoute.jsx
┃ ┃ ┃ ┣ 📜TabBar.jsx
┃ ┃ ┃ ┣ 📜TopButton.jsx
┃ ┃ ┃ ┣ 📜Weather.jsx
┃ ┃ ┃ ┗ 📜WeatherForecast.jsx
┃ ┃ ┣ 📂community
┃ ┃ ┃ ┣ 📜ArticleItem.jsx
┃ ┃ ┃ ┣ 📜ArticleList.jsx
┃ ┃ ┃ ┣ 📜CommentSection.jsx
┃ ┃ ┃ ┣ 📜CreateArticleButton.jsx
┃ ┃ ┃ ┣ 📜NewArticle.jsx
┃ ┃ ┃ ┣ 📜Pagination.jsx
┃ ┃ ┃ ┗ 📜Search.jsx
┃ ┃ ┣ 📂Home
┃ ┃ ┃ ┣ 📜Login.jsx
┃ ┃ ┃ ┣ 📜LoginHomeMapView.jsx
┃ ┃ ┃ ┣ 📜Logout.jsx
┃ ┃ ┃ ┗ 📜LogOutHeader.jsx
┃ ┃ ┣ 📂MyPage
┃ ┃ ┃ ┣ 📜MyPageProfile.jsx
┃ ┃ ┃ ┗ 📜MyPageTier.jsx
┃ ┃ ┣ 📂Report
┃ ┃ ┃ ┣ 📜ReportGraph.jsx
┃ ┃ ┃ ┣ 📜ReportHeadAnimation.jsx
┃ ┃ ┃ ┣ 📜ReportItem.jsx
┃ ┃ ┃ ┗ 📜ReportItemAll.jsx
┃ ┃ ┗ 📂Running
┃ ┃   ┣ 📂common
┃ ┃   ┃ ┗ 📜Measure.jsx
┃ ┃   ┗ 📂Team
┃ ┃     ┣ 📜GeolocationComponent.jsx
┃ ┃     ┣ 📜MapComponent.jsx
┃ ┃     ┣ 📜TeamSaying.jsx
┃ ┃     ┗ 📜TeamUserList.jsx
┃ ┣ 📂hooks              # 커스텀 훅 디렉토리
┃ ┃ ┣ 📜fcm.jsx
┃ ┃ ┗ 📜UserContext.jsx
┃ ┣ 📂pages              # 페이지 디렉토리
┃ ┃ ┣ 📂Auth
┃ ┃ ┃ ┣ 📜SearchIdPassword.jsx
┃ ┃ ┃ ┣ 📜SignIn.jsx
┃ ┃ ┃ ┗ 📜SignUp.jsx
┃ ┃ ┣ 📂community
┃ ┃ ┃ ┣ 📜ArticleCreate.jsx
┃ ┃ ┃ ┣ 📜ArticleDetail.jsx
┃ ┃ ┃ ┣ 📜ArticleEdit.jsx
┃ ┃ ┃ ┗ 📜ArticleHome.jsx
┃ ┃ ┣ 📂Home
┃ ┃ ┃ ┣ 📜CheckGeo.jsx
┃ ┃ ┃ ┣ 📜LogInHome.jsx
┃ ┃ ┃ ┗ 📜LogOutHome.jsx
┃ ┃ ┣ 📂MyPage
┃ ┃ ┃ ┣ 📜MyPageEdit.jsx
┃ ┃ ┃ ┣ 📜MyPageHome.jsx
┃ ┃ ┃ ┗ 📜MyPageLocation.jsx
┃ ┃ ┣ 📂Report
┃ ┃ ┃ ┗ 📜ReportHome.jsx
┃ ┃ ┗ 📂Running
┃ ┃   ┣ 📂Solo
┃ ┃   ┃ ┣ 📜SoloModeCountDown.jsx
┃ ┃   ┃ ┗ 📜SoloModeStart.jsx
┃ ┃   ┣ 📂Team
┃ ┃   ┃ ┣ 📜CountDown.jsx
┃ ┃   ┃ ┣ 📜TeamCheck.jsx
┃ ┃   ┃ ┣ 📜TeamCreate.jsx
┃ ┃   ┃ ┣ 📜TeamQR.jsx
┃ ┃   ┃ ┗ 📜WebSocketManager.js
┃ ┃   ┗ 📜Running.jsx
┃ ┣ 📂styles             # 스타일링 (CSS/SCSS)
┃ ┣ 📂utils
┃ ┃ ┗ 📜auth.js
┃ ┣ 📜App.css
┃ ┣ 📜App.jsx 
┃ ┣ 📜firebase.js 
┃ ┣ 📜index.css
┃ ┗ 📜main.jsx
┗ 📜package.json         # 프로젝트 설정 파일
```
</details>

<details>
<summary><b>RunUs-BackEnd</b></summary>

```
📦 RunUs-Front
┣ 📂src
┃ ┣ 📂main
┃ ┃ ┣ 📂java
┃ ┃ ┃ ┗ 📂runus
┃ ┃ ┃   ┣ 📂api
┃ ┃ ┃   ┃ ┣ 📜ApiResponse.java
┃ ┃ ┃   ┃ ┣ 📜DuplicateException.java
┃ ┃ ┃   ┃ ┣ 📜GlobalRestExceptionHandler.java
┃ ┃ ┃   ┃ ┣ 📜InvalidDataException.java
┃ ┃ ┃   ┃ ┗ 📜NotFoundElementException.java
┃ ┃ ┃   ┣ 📂auth
┃ ┃ ┃   ┃ ┣ 📂controller
┃ ┃ ┃   ┃ ┃ ┗ 📜AuthController.java
┃ ┃ ┃   ┃ ┗ 📂service
┃ ┃ ┃   ┃   ┣ 📜AuthService.java
┃ ┃ ┃   ┃   ┗ 📜AuthServiceImpl.java
┃ ┃ ┃   ┣ 📂board
┃ ┃ ┃   ┃ ┣ 📂common
┃ ┃ ┃   ┃ ┃ ┣ 📜ApiBoardResponse.java
┃ ┃ ┃   ┃ ┃ ┣ 📜ApiCommentResponse.java
┃ ┃ ┃   ┃ ┃ ┗ 📜ResponseMessage.java
┃ ┃ ┃   ┃ ┣ 📂controller
┃ ┃ ┃   ┃ ┃ ┣ 📜BoardController.java
┃ ┃ ┃   ┃ ┃ ┣ 📜CommentController.java
┃ ┃ ┃   ┃ ┃ ┗ 📜RegionController.java
┃ ┃ ┃   ┃ ┣ 📂dto
┃ ┃ ┃   ┃ ┃ ┣ 📜BoardDTO.java
┃ ┃ ┃   ┃ ┃ ┣ 📜BoardRequestDTO.java
┃ ┃ ┃   ┃ ┃ ┣ 📜BoardResponseDTO.java
┃ ┃ ┃   ┃ ┃ ┣ 📜CommentRequestDTO.java
┃ ┃ ┃   ┃ ┃ ┣ 📜CommentResponseDTO.java
┃ ┃ ┃   ┃ ┃ ┣ 📜RegionMajorDTO.java
┃ ┃ ┃   ┃ ┃ ┗ 📜RegionMinorDTO.java
┃ ┃ ┃   ┃ ┣ 📂entity
┃ ┃ ┃   ┃ ┃ ┣ 📜BoardEntity.java
┃ ┃ ┃   ┃ ┃ ┣ 📜CommentEntity.java
┃ ┃ ┃   ┃ ┃ ┣ 📜RegionMajor.java
┃ ┃ ┃   ┃ ┃ ┗ 📜RegionMinor.java
┃ ┃ ┃   ┃ ┣ 📂repository
┃ ┃ ┃   ┃ ┃ ┣ 📜BoardRepository.java
┃ ┃ ┃   ┃ ┃ ┣ 📜CommentRepository.java
┃ ┃ ┃   ┃ ┃ ┣ 📜RegionMajorRepository.java
┃ ┃ ┃   ┃ ┃ ┗ 📜RegionMinorRepository.java
┃ ┃ ┃   ┃ ┗ 📂service
┃ ┃ ┃   ┃   ┣ 📜BoardService.java
┃ ┃ ┃   ┃   ┣ 📜BoardServiceImpl.java
┃ ┃ ┃   ┃   ┣ 📜CommentService.java
┃ ┃ ┃   ┃   ┣ 📜CommentServiceImpl.java
┃ ┃ ┃   ┃   ┗ 📜RegionService.java
┃ ┃ ┃   ┣ 📂config
┃ ┃ ┃   ┃ ┗ 📜WebConfig.java
┃ ┃ ┃   ┣ 📂fcm
┃ ┃ ┃   ┃ ┣ 📂config
┃ ┃ ┃   ┃ ┃ ┗ 📜FirebaseConfig.java
┃ ┃ ┃   ┃ ┣ 📂controller
┃ ┃ ┃   ┃ ┃ ┗ 📜FCMController.java
┃ ┃ ┃   ┃ ┣ 📂dao
┃ ┃ ┃   ┃ ┃ ┣ 📜FCMTokenDAO.java
┃ ┃ ┃   ┃ ┃ ┗ 📜FCMTokenDAOImpl.java
┃ ┃ ┃   ┃ ┣ 📂dto
┃ ┃ ┃   ┃ ┃ ┣ 📜FCMTokenDTO.java
┃ ┃ ┃   ┃ ┃ ┗ 📜NotificationDTO.java
┃ ┃ ┃   ┃ ┣ 📂service
┃ ┃ ┃   ┃ ┃ ┣ 📜FCMService.java
┃ ┃ ┃   ┃ ┃ ┗ 📜FCMServiceImpl.java
┃ ┃ ┃   ┣ 📂location
┃ ┃ ┃   ┃ ┗ 📜RedisConfig.java
┃ ┃ ┃   ┣ 📂record
┃ ┃ ┃   ┃ ┣ 📂common
┃ ┃ ┃   ┃ ┃ ┗ 📜ApiRecordResponse.java
┃ ┃ ┃   ┃ ┣ 📂controller
┃ ┃ ┃   ┃ ┃ ┗ 📜RecordController.java
┃ ┃ ┃   ┃ ┣ 📂dto
┃ ┃ ┃   ┃ ┃ ┣ 📜RecordDTO.java
┃ ┃ ┃   ┃ ┃ ┗ 📜RecordSaveRequestDTO.java
┃ ┃ ┃   ┃ ┣ 📂entity
┃ ┃ ┃   ┃ ┃ ┗ 📜RecordEntity.java
┃ ┃ ┃   ┃ ┣ 📂repository
┃ ┃ ┃   ┃ ┃ ┗ 📜RecordRepository.java
┃ ┃ ┃   ┃ ┗ 📂service
┃ ┃ ┃   ┃   ┗ 📜RecordService.java
┃ ┃ ┃   ┣ 📂user
┃ ┃ ┃   ┃ ┣ 📂controller
┃ ┃ ┃   ┃ ┃ ┗ 📜UserController.java
┃ ┃ ┃   ┃ ┣ 📂dto
┃ ┃ ┃   ┃ ┃ ┗ 📜UserDto.java
┃ ┃ ┃   ┃ ┣ 📂entity
┃ ┃ ┃   ┃ ┃ ┗ 📜User.java
┃ ┃ ┃   ┃ ┣ 📂repository
┃ ┃ ┃   ┃ ┃ ┗ 📜UserRepository.java
┃ ┃ ┃   ┃ ┗ 📂service
┃ ┃ ┃   ┃   ┣ 📜UserService.java
┃ ┃ ┃   ┃   ┗ 📜UserServiceImpl.java
┃ ┃ ┃   ┣ 📂webSocket
┃ ┃ ┃   ┃ ┣ 📂config
┃ ┃ ┃   ┃ ┃ ┗ 📜WebSockConfig.java
┃ ┃ ┃   ┃ ┣ 📂controller
┃ ┃ ┃   ┃ ┃ ┗ 📜RoomController.java
┃ ┃ ┃   ┃ ┣ 📂dto
┃ ┃ ┃   ┃ ┃ ┣ 📜ApiResponse.java
┃ ┃ ┃   ┃ ┃ ┣ 📜ChatMessage.java
┃ ┃ ┃   ┃ ┃ ┣ 📜ChatRoom.java
┃ ┃ ┃   ┃ ┃ ┣ 📜PartyDto.java
┃ ┃ ┃   ┃ ┃ ┣ 📜PartyMemberDto.java
┃ ┃ ┃   ┃ ┃ ┗ 📜PartyRequestDto.java
┃ ┃ ┃   ┃ ┣ 📂Entity
┃ ┃ ┃   ┃ ┃ ┣ 📜PartyEntity.java
┃ ┃ ┃   ┃ ┃ ┗ 📜PartyMemberEntity.java
┃ ┃ ┃   ┃ ┣ 📂handler
┃ ┃ ┃   ┃ ┃ ┗ 📜WebSockChatHandler.java
┃ ┃ ┃   ┃ ┣ 📂repository
┃ ┃ ┃   ┃ ┃ ┣ 📜PartyMemberRepository.java
┃ ┃ ┃   ┃ ┃ ┣ 📜PartyRepository.java
┃ ┃ ┃   ┃ ┃ ┗ 📜QuotesRepository.java
┃ ┃ ┃   ┃ ┗ 📂service
┃ ┃ ┃   ┃   ┣ 📜ChatService.java
┃ ┃ ┃   ┃   ┗ 📜ChatServiceImpl.java
┃ ┃ ┃   ┗ 📜RunUsApplication.java
┃ ┃ ┗ 📂resources      
┃ ┃   ┣ 📜application.properties
┃ ┃   ┣ 📜application.yml
┃ ┃   ┣ 📜firebase-adminsdk.json
┃ ┃   ┗ 📜keystore.jks
┃ ┗ 📂test
┃   ┗ 📂java
┃     ┗ 📂runus
┃       ┗ 📜RunUsApplicationTests.java
┗ 📜package-lock.json         # 프로젝트 설정 파일
```
</details>

<br />

## 📄 요구사항 명세서

- [아키텍처](./resource/RunUsArchitecture.png)
- [ER Diagram](./resource/RunUsERD.png)
- [포팅메뉴얼](./resource/portingMenual.md)

<br />

## 🌐 외부 API
- **KAKAOMAP API**: 지도 서비스와 관련된 다양한 기능을 활용하기 위해 KAKAOMAP API를 사용합니다.
- **OpenWeatherMap API**: 실시간 날씨 및 예보 정보를 활용하기 위해 OpenWeatherMap API를 사용합니다.

## 🛠 배포 자동화
- **Jenkins**: CI/CD 파이프라인을 통해 코드 빌드, 테스트, 배포 자동화를 관리합니다.
- **Docker**: 애플리케이션의 환경 설정을 컨테이너화하여 일관성 있는 배포 환경을 제공합니다.
### 모니터링
- **Prometheus**: 프로메테우스 설명.
- **Grafana**: 그라파나 설명.

## 👥 역할 별 담당자
|                             FE/BE                              |                             BE/FE                              |                               BE/FE                               |                               FE                               |                               BE                               |                               BE                               |                               FE                               |
| :------------------------------------------------------------: | :------------------------------------------------------------: | :------------------------------------------------------------: | :------------------------------------------------------------: | :------------------------------------------------------------: | :------------------------------------------------------------: | :------------------------------------------------------------: |
|                           **김구태**                           |                           **박재현**                           |                           **최민**                             |                           **구현우**                           |                           **이형준**                           |                           **윤지호**                           |                           **박지원**                           |
| <img src="./resource/김구태.png" style="height: 70px"> | <img src="./resource/박재현.png" style="height: 70px"> | <img src="./resource/최민.png" style="height: 70px"> | <img src="./resource/구현우.png" style="height: 70px"> | <img src="./resource/이형준.png" style="height: 70px"> | <img src="./resource/윤지호.png" style="height: 70px"> | <img src="./resource/박지원.png" style="height: 70px"> |
|               BackEnd/FrontEnd                |                            BackEnd/FrontEnd                             |                            BackEnd/FrontEnd                             |                            FrontEnd                            |                            BackEnd                             |                            Infra                             |                            FrontEnd                            |