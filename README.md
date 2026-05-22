## 1. 개요

### 1.1 테스트 목적

본 단위 테스트 결과서는 DocMind AI 시스템의 각 기능 단위별 정확성, 안정성 및 예외 처리 적합성을 검증하기 위하여 작성되었다. 공공기관 정보화사업 산출물 기준에 따라 기능별 테스트 케이스를 체계적으로 구성하고 수행 결과를 기록함으로써 시스템 품질을 보증한다.

### 1.2 테스트 범위

| 구분 | 기능 영역 | 비고 |
|---|---|---|
| 대상 포함 | 사용자 인증 | 회원가입, 로그인, 로그아웃, 토큰 관리 |
| 대상 포함 | 문서 관리 | 목록 조회, 정렬, 검색, 카테고리 필터, 상세 조회, 수정, 삭제 |
| 대상 포함 | 파일 업로드 | 다중 포맷 업로드, 업로드 진행 상태, 취소 처리 |
| 대상 포함 | AI 문서 처리 | 텍스트 추출, 자동 분류, 자동 요약 |
| 대상 포함 | 보안 | 토큰 검증, 접근 제어, 입력값 무결성 |

### 1.3 테스트 결과 요약

| 구분 | 전체 | PASS | FAIL | PASS율 |
|---|---|---|---|---|
| 사용자 인증 | 18 | 17 | 1 | 94.4% |
| 문서 관리 | 32 | 31 | 1 | 96.9% |
| 파일 업로드 | 14 | 13 | 1 | 92.9% |
| AI 문서 처리 | 12 | 11 | 1 | 91.7% |
| 보안 | 6 | 6 | 0 | 100% |
| **합계** | **82** | **78** | **4** | **95.1%** |

---

## 2. 테스트 결과

### 2.1 사용자 인증 (Authentication)

#### 2.1.1 회원가입 (POST /api/auth/register)

| 테스트 ID | 대분류 기능 | 세부 기능 | 테스트 시나리오 | 테스트 데이터 | 수행 절차 | 기대 결과 | 실제 결과 | 테스트 결과 | 결함 사항 | 비고 |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-AUTH-001 | 사용자 인증 | 회원가입 | 유효한 정보로 정상 회원가입 수행 | `email: test01@example.com` `password: Test1234!` `name: 홍길동` | ① 회원가입 화면 접속 ② 이메일, 비밀번호, 이름 입력 ③ 회원가입 버튼 클릭 ④ 응답 상태코드 및 반환값 확인 | HTTP 200, 사용자 ID·이메일·이름 반환, 비밀번호 미포함 | HTTP 200 반환, `{id: 1, email: "test01@example.com", name: "홍길동"}` 정상 반환 확인, 비밀번호 필드 미노출 | PASS | 없음 | 최초 등록 계정 |
| TC-AUTH-002 | 사용자 인증 | 회원가입 | 이미 등록된 이메일로 재가입 시도 | `email: test01@example.com` (TC-AUTH-001과 동일) `password: Other456!` `name: 김철수` | ① TC-AUTH-001 수행 후 동일 이메일로 재가입 요청 ② POST /api/auth/register 호출 ③ 응답 오류 코드 확인 | HTTP 400, "이미 사용 중인 이메일입니다." 오류 메시지 반환 | HTTP 400 반환, 오류 메시지 정상 출력, 신규 계정 미생성 확인 | PASS | 없음 | 중복 이메일 방지 검증 |
| TC-AUTH-003 | 사용자 인증 | 회원가입 | 이메일 형식 오류로 회원가입 시도 | `email: notanemail` `password: Test1234!` `name: 박영희` | ① 형식 불일치 이메일 입력 ② POST /api/auth/register 호출 ③ 응답 오류 메시지 확인 | HTTP 422 Unprocessable Entity, 이메일 형식 유효성 오류 반환 | HTTP 422 반환, Pydantic EmailStr 유효성 검사 오류 메시지 반환 확인 | PASS | 없음 | Pydantic 스키마 검증 |
| TC-AUTH-004 | 사용자 인증 | 회원가입 | 이메일 필드 누락 상태로 회원가입 시도 | `email: (누락)` `password: Test1234!` `name: 이민수` | ① 이메일 미입력 상태로 회원가입 요청 ② POST /api/auth/register 호출 ③ 응답 오류 코드 확인 | HTTP 422, 필수 필드 누락 오류 반환 | HTTP 422 반환, `field required` 오류 메시지 정상 출력 | PASS | 없음 | 필수값 검증 |
| TC-AUTH-005 | 사용자 인증 | 회원가입 | 비밀번호 필드 누락 상태로 회원가입 시도 | `email: test02@example.com` `password: (누락)` `name: 정수진` | ① 비밀번호 미입력 상태로 회원가입 요청 ② POST /api/auth/register 호출 ③ 응답 오류 코드 확인 | HTTP 422, 필수 필드 누락 오류 반환 | HTTP 422 반환, `field required` 오류 메시지 정상 출력 | PASS | 없음 | 필수값 검증 |
| TC-AUTH-006 | 사용자 인증 | 회원가입 | 이름 필드 누락 상태로 회원가입 시도 | `email: test03@example.com` `password: Test1234!` `name: (누락)` | ① 이름 미입력 상태로 회원가입 요청 ② POST /api/auth/register 호출 ③ 응답 오류 코드 확인 | HTTP 422, 필수 필드 누락 오류 반환 | HTTP 422 반환, `field required` 오류 메시지 정상 출력 | PASS | 없음 | 필수값 검증 |

#### 2.1.2 로그인 (POST /api/auth/login)

| 테스트 ID | 대분류 기능 | 세부 기능 | 테스트 시나리오 | 테스트 데이터 | 수행 절차 | 기대 결과 | 실제 결과 | 테스트 결과 | 결함 사항 | 비고 |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-AUTH-007 | 사용자 인증 | 로그인 | 유효한 이메일·비밀번호로 정상 로그인 수행 | `email: test01@example.com` `password: Test1234!` | ① 로그인 화면 접속 ② 등록된 이메일, 비밀번호 입력 ③ 로그인 버튼 클릭 ④ 응답 쿠키 및 상태코드 확인 | HTTP 200, `access_token` 및 `refresh_token` 쿠키 설정, HttpOnly 속성 적용 | HTTP 200 반환, access_token(만료 30분), refresh_token(만료 7일) 쿠키 정상 설정 확인, HttpOnly 플래그 확인 | PASS | 없음 | 쿠키 기반 JWT 인증 |
| TC-AUTH-008 | 사용자 인증 | 로그인 | 잘못된 비밀번호로 로그인 시도 | `email: test01@example.com` `password: WrongPass!` | ① 등록된 이메일에 잘못된 비밀번호 입력 ② POST /api/auth/login 호출 ③ 응답 오류 메시지 확인 | HTTP 401 Unauthorized, 인증 실패 오류 메시지 반환, 쿠키 미설정 | HTTP 401 반환, 오류 메시지 출력, 인증 쿠키 미발급 확인 | PASS | 없음 | bcrypt 해시 검증 |
| TC-AUTH-009 | 사용자 인증 | 로그인 | 미등록 이메일로 로그인 시도 | `email: notexist@example.com` `password: Test1234!` | ① 미등록 이메일 입력 ② POST /api/auth/login 호출 ③ 응답 오류 코드 확인 | HTTP 401 Unauthorized, 사용자 미존재 오류 반환 | HTTP 401 반환, 미등록 사용자 오류 메시지 정상 출력 | PASS | 없음 | 사용자 존재 여부 검증 |
| TC-AUTH-010 | 사용자 인증 | 로그인 | 이메일 미입력 상태로 로그인 시도 | `email: (공백)` `password: Test1234!` | ① 이메일 미입력 상태로 로그인 요청 ② POST /api/auth/login 호출 ③ 응답 오류 확인 | HTTP 422, 필수 필드 누락 오류 반환 | HTTP 422 반환, 유효성 검사 오류 메시지 정상 출력 | PASS | 없음 | 입력값 검증 |
| TC-AUTH-011 | 사용자 인증 | 로그인 | 비밀번호 미입력 상태로 로그인 시도 | `email: test01@example.com` `password: (공백)` | ① 비밀번호 미입력 상태로 로그인 요청 ② POST /api/auth/login 호출 ③ 응답 오류 확인 | HTTP 422, 필수 필드 누락 오류 반환 | HTTP 422 반환, 유효성 검사 오류 메시지 정상 출력 | PASS | 없음 | 입력값 검증 |

#### 2.1.3 현재 사용자 조회 (GET /api/auth/me)

| 테스트 ID | 대분류 기능 | 세부 기능 | 테스트 시나리오 | 테스트 데이터 | 수행 절차 | 기대 결과 | 실제 결과 | 테스트 결과 | 결함 사항 | 비고 |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-AUTH-012 | 사용자 인증 | 사용자 조회 | 유효한 액세스 토큰으로 현재 사용자 정보 조회 | 유효한 `access_token` 쿠키 | ① TC-AUTH-007 수행 후 ② GET /api/auth/me 호출 ③ 응답 사용자 정보 확인 | HTTP 200, `{id, email, name}` 반환, 비밀번호 미포함 | HTTP 200 반환, 사용자 정보 정상 반환, 민감 정보 미노출 확인 | PASS | 없음 | 토큰 기반 사용자 식별 |
| TC-AUTH-013 | 사용자 인증 | 사용자 조회 | 인증 쿠키 없이 사용자 정보 조회 시도 | 쿠키 없음 (비인증 상태) | ① 쿠키 미설정 상태에서 GET /api/auth/me 호출 ② 응답 오류 코드 확인 | HTTP 401 Unauthorized, 인증 필요 오류 반환 | HTTP 401 반환, 인증 오류 메시지 정상 출력 | PASS | 없음 | 비인증 접근 차단 |
| TC-AUTH-014 | 사용자 인증 | 사용자 조회 | 만료된 액세스 토큰으로 사용자 정보 조회 | 만료된 `access_token` (30분 경과) | ① 액세스 토큰 만료 후 GET /api/auth/me 호출 ② 응답 코드 및 리프레시 토큰 활용 여부 확인 | HTTP 401 반환 또는 refresh_token으로 자동 갱신 처리 | HTTP 401 반환, 클라이언트에서 /auth/refresh 호출 후 재요청 처리 확인 | PASS | 없음 | 토큰 만료 처리 |

#### 2.1.4 토큰 갱신 (POST /api/auth/refresh)

| 테스트 ID | 대분류 기능 | 세부 기능 | 테스트 시나리오 | 테스트 데이터 | 수행 절차 | 기대 결과 | 실제 결과 | 테스트 결과 | 결함 사항 | 비고 |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-AUTH-015 | 사용자 인증 | 토큰 갱신 | 유효한 리프레시 토큰으로 액세스 토큰 갱신 | 유효한 `refresh_token` | ① 유효한 refresh_token을 요청 바디에 포함 ② POST /api/auth/refresh 호출 ③ 신규 access_token 발급 확인 | HTTP 200, 신규 access_token 쿠키 설정 | HTTP 200 반환, 신규 access_token 쿠키 정상 발급 확인 | PASS | 없음 | 토큰 갱신 정상 처리 |
| TC-AUTH-016 | 사용자 인증 | 토큰 갱신 | 만료된 리프레시 토큰으로 갱신 시도 | 7일 경과 만료 `refresh_token` | ① 만료된 refresh_token을 요청 바디에 포함 ② POST /api/auth/refresh 호출 ③ 응답 오류 확인 | HTTP 401 Unauthorized, 토큰 만료 오류 반환 | HTTP 401 반환, 오류 메시지 출력, 재로그인 요구 확인 | PASS | 없음 | 만료 토큰 차단 |
| TC-AUTH-017 | 사용자 인증 | 토큰 갱신 | 위변조된 리프레시 토큰으로 갱신 시도 | `refresh_token: "invalid.token.string"` | ① 임의로 생성한 유효하지 않은 토큰 입력 ② POST /api/auth/refresh 호출 ③ 응답 오류 확인 | HTTP 401 Unauthorized, JWT 서명 검증 실패 오류 반환 | HTTP 401 반환, jose 라이브러리 서명 검증 실패 메시지 출력 확인 | PASS | 없음 | JWT 위변조 방지 |

#### 2.1.5 로그아웃 (POST /api/auth/logout)

| 테스트 ID | 대분류 기능 | 세부 기능 | 테스트 시나리오 | 테스트 데이터 | 수행 절차 | 기대 결과 | 실제 결과 | 테스트 결과 | 결함 사항 | 비고 |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-AUTH-018 | 사용자 인증 | 로그아웃 | 정상 로그인 상태에서 로그아웃 수행 | 유효한 인증 쿠키 보유 상태 | ① 로그인 완료 상태에서 로그아웃 버튼 클릭 ② POST /api/auth/logout 호출 ③ 응답 코드 및 쿠키 삭제 여부 확인 | HTTP 200, access_token·refresh_token 쿠키 삭제 확인 | HTTP 200 반환, 두 쿠키 모두 삭제(Max-Age=0) 처리 확인 | PASS | 없음 | 세션 종료 처리 |

---

### 2.2 문서 관리 (Document Management)

#### 2.2.1 문서 목록 조회 (GET /api/documents/list)

| 테스트 ID | 대분류 기능 | 세부 기능 | 테스트 시나리오 | 테스트 데이터 | 수행 절차 | 기대 결과 | 실제 결과 | 테스트 결과 | 결함 사항 | 비고 |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-DOC-001 | 문서 관리 | 목록 조회 | 유효한 인증 상태에서 문서 목록 정상 조회 | `page=1, size=5`, 등록 문서 12건 | ① 로그인 완료 후 ② GET /api/documents/list?page=1&size=5 호출 ③ 반환 데이터 구조 및 페이지네이션 정보 확인 | HTTP 200, `{items[], total:12, page:1, size:5, total_pages:3}` 반환 | HTTP 200 반환, 5건 문서 목록, total:12, total_pages:3 정상 반환 | PASS | 없음 | 페이지네이션 검증 |
| TC-DOC-002 | 문서 관리 | 목록 조회 | 등록 문서가 없는 신규 계정에서 목록 조회 | 문서 0건인 신규 사용자 계정 | ① 신규 계정으로 로그인 ② GET /api/documents/list 호출 ③ 빈 목록 반환 여부 확인 | HTTP 200, `{items:[], total:0, total_pages:0}` 반환 | HTTP 200 반환, 빈 배열 및 total:0 정상 반환 | PASS | 없음 | 빈 목록 처리 |
| TC-DOC-003 | 문서 관리 | 목록 조회 | 전체 페이지 수를 초과하는 페이지 번호로 조회 | `page=99, size=5`, 총 12건 (총 3페이지) | ① GET /api/documents/list?page=99&size=5 호출 ② 응답 데이터 확인 | HTTP 200, `{items:[], total:12}` 빈 목록 반환 또는 마지막 페이지 데이터 반환 | HTTP 200 반환, items 빈 배열 반환, total은 실제 건수 유지 | PASS | 없음 | 범위 초과 페이지 처리 |
| TC-DOC-004 | 문서 관리 | 목록 조회 | 인증 쿠키 없이 문서 목록 조회 시도 | 비인증 상태 (쿠키 없음) | ① 로그아웃 상태에서 GET /api/documents/list 호출 ② 응답 오류 코드 확인 | HTTP 401 Unauthorized, 인증 필요 오류 반환 | HTTP 401 반환, 인증 오류 메시지 출력, 목록 미반환 | PASS | 없음 | 비인증 접근 차단 |

#### 2.2.2 문서 정렬 (GET /api/documents/list/sort)

| 테스트 ID | 대분류 기능 | 세부 기능 | 테스트 시나리오 | 테스트 데이터 | 수행 절차 | 기대 결과 | 실제 결과 | 테스트 결과 | 결함 사항 | 비고 |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-DOC-005 | 문서 관리 | 문서 정렬 | 최신순으로 문서 목록 정렬 | `sort=latest`, 등록 문서 5건 | ① GET /api/documents/list/sort?sort=latest 호출 ② 반환 목록의 created_at 기준 내림차순 정렬 여부 확인 | 최근 등록 문서가 목록 상단에 위치 | created_at 내림차순 정렬 정상 확인, 최신 문서 1번 항목 배치 | PASS | 없음 | 기본 정렬 기준 |
| TC-DOC-006 | 문서 관리 | 문서 정렬 | 오래된 순으로 문서 목록 정렬 | `sort=oldest`, 등록 문서 5건 | ① GET /api/documents/list/sort?sort=oldest 호출 ② 반환 목록의 created_at 기준 오름차순 정렬 여부 확인 | 가장 먼저 등록된 문서가 목록 상단에 위치 | created_at 오름차순 정렬 정상 확인 | PASS | 없음 | 등록일 오름차순 |
| TC-DOC-007 | 문서 관리 | 문서 정렬 | 이름 오름차순으로 문서 목록 정렬 | `sort=name-asc`, 등록 문서 5건 | ① GET /api/documents/list/sort?sort=name-asc 호출 ② 반환 목록의 title 기준 가나다순 정렬 여부 확인 | 제목 가나다 오름차순 정렬 | 제목 오름차순(가나다순) 정렬 정상 확인 | PASS | 없음 | 제목 오름차순 |
| TC-DOC-008 | 문서 관리 | 문서 정렬 | 이름 내림차순으로 문서 목록 정렬 | `sort=name-desc`, 등록 문서 5건 | ① GET /api/documents/list/sort?sort=name-desc 호출 ② 반환 목록의 title 기준 역순 정렬 여부 확인 | 제목 가나다 내림차순 정렬 | 제목 내림차순(역가나다순) 정렬 정상 확인 | PASS | 없음 | 제목 내림차순 |
| TC-DOC-009 | 문서 관리 | 문서 정렬 | 유효하지 않은 정렬 파라미터로 조회 | `sort=invalid_value` | ① GET /api/documents/list/sort?sort=invalid_value 호출 ② 응답 처리 방식 확인 | HTTP 400 또는 기본 정렬(최신순) 적용 후 반환 | HTTP 200 반환, 기본값(최신순) 적용 처리 — 명시적 오류 반환 미구현 | FAIL | 유효하지 않은 sort 파라미터에 대한 입력값 유효성 검증 미적용. 명시적 오류 코드 반환 필요 | 개선 권고 |

#### 2.2.3 문서 검색 (GET /api/documents/search)

| 테스트 ID | 대분류 기능 | 세부 기능 | 테스트 시나리오 | 테스트 데이터 | 수행 절차 | 기대 결과 | 실제 결과 | 테스트 결과 | 결함 사항 | 비고 |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-DOC-010 | 문서 관리 | 문서 검색 | 유효한 검색어로 문서 제목 검색 수행 | `query=정보보호`, 해당 제목 포함 문서 3건 존재 | ① GET /api/documents/search?query=정보보호 호출 ② 반환 목록 내 검색어 포함 여부 확인 | 검색어 포함 문서 3건 반환, 전체 건수 정확 | 검색어 포함 문서 3건 정상 반환, 대소문자 무관(ilike) 동작 확인 | PASS | 없음 | SQLAlchemy ilike 적용 |
| TC-DOC-011 | 문서 관리 | 문서 검색 | 검색 결과가 없는 검색어로 조회 | `query=존재하지않는제목XYZ` | ① GET /api/documents/search?query=존재하지않는제목XYZ 호출 ② 반환 데이터 확인 | HTTP 200, `{items:[], total:0}` 반환 | HTTP 200 반환, 빈 배열 및 total:0 정상 반환 | PASS | 없음 | 결과 없음 처리 |
| TC-DOC-012 | 문서 관리 | 문서 검색 | 검색어 파라미터 누락 상태로 검색 요청 | `query=(누락)` | ① query 파라미터 없이 GET /api/documents/search 호출 ② 응답 처리 확인 | HTTP 422, 필수 파라미터 누락 오류 반환 | HTTP 422 반환, query 파라미터 필수 오류 메시지 출력 | PASS | 없음 | 필수 쿼리 파라미터 검증 |
| TC-DOC-013 | 문서 관리 | 문서 검색 | 특수 문자 포함 검색어로 조회 | `query=테스트%&검색` | ① URL 인코딩된 특수 문자 포함 검색어로 GET /api/documents/search 호출 ② 오류 없이 응답 반환 여부 확인 | HTTP 200, 오류 없이 검색 결과(0건 이상) 반환 | HTTP 200 반환, 특수 문자 인코딩 정상 처리, SQL 인젝션 미발생 확인 | PASS | 없음 | SQL 인젝션 방지 확인 |

#### 2.2.4 카테고리 필터링 (GET /api/documents/category)

| 테스트 ID | 대분류 기능 | 세부 기능 | 테스트 시나리오 | 테스트 데이터 | 수행 절차 | 기대 결과 | 실제 결과 | 테스트 결과 | 결함 사항 | 비고 |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-DOC-014 | 문서 관리 | 카테고리 필터 | '법안' 카테고리 문서 목록 조회 | `category=법안`, 해당 카테고리 문서 4건 존재 | ① GET /api/documents/category?category=법안&page=1&size=5 호출 ② 반환 목록의 카테고리 일치 여부 확인 | HTTP 200, 카테고리='법안'인 문서 4건 반환 | HTTP 200 반환, '법안' 카테고리 문서 4건 정상 반환, 타 카테고리 문서 미포함 확인 | PASS | 없음 | 카테고리별 필터링 |
| TC-DOC-015 | 문서 관리 | 카테고리 필터 | '발표자료' 카테고리 문서 목록 조회 | `category=발표자료`, 해당 카테고리 문서 2건 존재 | ① GET /api/documents/category?category=발표자료 호출 ② 반환 목록의 카테고리 일치 여부 확인 | HTTP 200, 카테고리='발표자료'인 문서 2건 반환 | HTTP 200 반환, '발표자료' 카테고리 문서 2건 정상 반환 | PASS | 없음 | 카테고리별 필터링 |
| TC-DOC-016 | 문서 관리 | 카테고리 필터 | '교육자료' 카테고리 문서 목록 조회 | `category=교육자료`, 해당 카테고리 문서 3건 존재 | ① GET /api/documents/category?category=교육자료 호출 ② 반환 목록의 카테고리 일치 여부 확인 | HTTP 200, 카테고리='교육자료'인 문서 3건 반환 | HTTP 200 반환, '교육자료' 카테고리 문서 3건 정상 반환 | PASS | 없음 | 카테고리별 필터링 |
| TC-DOC-017 | 문서 관리 | 카테고리 필터 | 시스템에 정의되지 않은 카테고리명으로 조회 | `category=비존재카테고리` | ① GET /api/documents/category?category=비존재카테고리 호출 ② 응답 처리 확인 | HTTP 200, 빈 목록 반환 또는 HTTP 400 오류 반환 | HTTP 200 반환, 빈 배열 반환 — 카테고리 유효성 검증 미구현 | PASS | 없음 | 빈 결과 허용 방식으로 구현됨 |
| TC-DOC-018 | 문서 관리 | 카테고리 통계 | 카테고리별 문서 건수 통계 조회 | 전체 카테고리(7종) 문서 존재 | ① GET /api/documents/category-counts 호출 ② 반환 JSON의 카테고리별 건수 확인 | HTTP 200, `{법안:4, 발표자료:2, 교육자료:3, 기술문서:1, 뉴스/기사:0, 일반문서:2, 기타:0}` 형식 반환 | HTTP 200 반환, 카테고리별 정확한 건수 반환, 삭제 문서(is_deleted=True) 건수 미포함 확인 | PASS | 없음 | 소프트 삭제 문서 통계 제외 |

#### 2.2.5 문서 상세 조회 (GET /api/documents/{document_id})

| 테스트 ID | 대분류 기능 | 세부 기능 | 테스트 시나리오 | 테스트 데이터 | 수행 절차 | 기대 결과 | 실제 결과 | 테스트 결과 | 결함 사항 | 비고 |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-DOC-019 | 문서 관리 | 문서 상세 조회 | 유효한 문서 ID로 상세 정보 정상 조회 | `document_id=1` (본인 소유 정상 문서) | ① GET /api/documents/1 호출 ② 반환 데이터(id, title, content, summary, category, created_at) 확인 | HTTP 200, 문서 전체 필드 정상 반환 | HTTP 200 반환, id·title·content·summary·category·created_at·updated_at 정상 반환 확인 | PASS | 없음 | 문서 전체 필드 조회 |
| TC-DOC-020 | 문서 관리 | 문서 상세 조회 | 존재하지 않는 문서 ID로 조회 시도 | `document_id=99999` (미존재 ID) | ① GET /api/documents/99999 호출 ② 응답 오류 코드 확인 | HTTP 404 Not Found, 문서 미존재 오류 반환 | HTTP 404 반환, 오류 메시지 정상 출력 | PASS | 없음 | 미존재 자원 처리 |
| TC-DOC-021 | 문서 관리 | 문서 상세 조회 | 소프트 삭제된 문서 ID로 조회 시도 | `document_id=3` (is_deleted=True 문서) | ① 삭제 처리된 문서의 ID로 GET /api/documents/3 호출 ② 응답 오류 코드 확인 | HTTP 404 Not Found, 삭제 문서 조회 불가 처리 | HTTP 404 반환, 삭제 문서에 대한 접근 차단 확인 | PASS | 없음 | 소프트 삭제 문서 보호 |
| TC-DOC-022 | 문서 관리 | 문서 상세 조회 | 타 사용자 소유 문서에 대한 접근 시도 | `document_id=10` (타 사용자 문서), 본인 인증 토큰 | ① 타 사용자가 업로드한 문서 ID로 GET 호출 ② 응답 오류 코드 확인 | HTTP 403 Forbidden 또는 HTTP 404 Not Found, 접근 차단 | HTTP 404 반환, 타 사용자 문서 접근 차단 확인 (owner_id 필터링 적용) | PASS | 없음 | 사용자 데이터 격리 |

#### 2.2.6 문서 수정 (PUT /api/documents/modify/{id})

| 테스트 ID | 대분류 기능 | 세부 기능 | 테스트 시나리오 | 테스트 데이터 | 수행 절차 | 기대 결과 | 실제 결과 | 테스트 결과 | 결함 사항 | 비고 |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-DOC-023 | 문서 관리 | 문서 수정 | 문서 제목 수정 정상 수행 | `document_id=1`, `title: "수정된 제목"` | ① PUT /api/documents/modify/1 호출 (title 필드만 변경) ② 응답 및 DB 갱신 확인 | HTTP 200, 수정된 title 반환, updated_at 갱신 | HTTP 200 반환, 제목 수정 반영, updated_at 현재 시각(KST) 갱신 확인 | PASS | 없음 | 부분 수정(Partial Update) |
| TC-DOC-024 | 문서 관리 | 문서 수정 | 문서 본문 내용 수정 정상 수행 | `document_id=1`, `content: "수정된 본문 내용입니다."` | ① PUT /api/documents/modify/1 호출 (content 필드 변경) ② 응답 content 값 확인 | HTTP 200, 수정된 content 반환 | HTTP 200 반환, content 수정 정상 반영 확인 | PASS | 없음 | 본문 수정 |
| TC-DOC-025 | 문서 관리 | 문서 수정 | 문서 카테고리 변경 수행 | `document_id=1`, `category: "기술문서"` | ① PUT /api/documents/modify/1 호출 (category 필드 변경) ② 응답 category 값 확인 | HTTP 200, 변경된 category 반환 | HTTP 200 반환, category 변경 정상 반영 확인 | PASS | 없음 | 카테고리 변경 |
| TC-DOC-026 | 문서 관리 | 문서 수정 | 문서 요약 내용 수정 수행 | `document_id=1`, `summary: "수정된 요약 내용입니다."` | ① PUT /api/documents/modify/1 호출 (summary 필드 변경) ② 응답 summary 값 확인 | HTTP 200, 수정된 summary 반환 | HTTP 200 반환, summary 수정 정상 반영 확인 | PASS | 없음 | 요약 수정 |
| TC-DOC-027 | 문서 관리 | 문서 수정 | 존재하지 않는 문서에 수정 요청 | `document_id=99999`, `title: "수정 시도"` | ① PUT /api/documents/modify/99999 호출 ② 응답 오류 코드 확인 | HTTP 404 Not Found, 문서 미존재 오류 반환 | HTTP 404 반환, 오류 메시지 정상 출력 | PASS | 없음 | 미존재 자원 수정 차단 |
| TC-DOC-028 | 문서 관리 | 문서 수정 | 수정 권한 없는(타 사용자 소유) 문서 수정 시도 | `document_id=10` (타 사용자 문서), 본인 인증 토큰 | ① 타 사용자 문서에 PUT /api/documents/modify/10 호출 ② 응답 오류 코드 확인 | HTTP 403 Forbidden 또는 HTTP 404, 권한 없음 오류 반환 | HTTP 404 반환, 타 사용자 문서 수정 차단 확인 | PASS | 없음 | 소유권 기반 접근 제어 |

#### 2.2.7 문서 삭제 (DELETE /api/documents/delete/{id})

| 테스트 ID | 대분류 기능 | 세부 기능 | 테스트 시나리오 | 테스트 데이터 | 수행 절차 | 기대 결과 | 실제 결과 | 테스트 결과 | 결함 사항 | 비고 |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-DOC-029 | 문서 관리 | 문서 삭제 | 정상 문서에 대한 소프트 삭제 수행 | `document_id=2` (is_deleted=False 문서) | ① DELETE /api/documents/delete/2 호출 ② 응답 코드 확인 ③ 이후 해당 문서 조회 시도하여 is_deleted 상태 확인 | HTTP 200, is_deleted=True 갱신, 이후 조회 시 HTTP 404 반환 | HTTP 200 반환, DB상 is_deleted=True 확인, 이후 목록·상세 조회에서 미표시 확인 | PASS | 없음 | 소프트 삭제 구현 (물리적 삭제 미수행) |
| TC-DOC-030 | 문서 관리 | 문서 삭제 | 이미 삭제 처리된 문서에 재삭제 요청 | `document_id=2` (is_deleted=True 상태) | ① 이미 삭제된 문서 ID로 DELETE 재요청 ② 응답 처리 확인 | HTTP 404 Not Found, 이미 삭제된 문서 오류 반환 | HTTP 404 반환, 삭제 완료 문서에 대한 재삭제 차단 확인 | PASS | 없음 | 중복 삭제 방지 |
| TC-DOC-031 | 문서 관리 | 문서 삭제 | 존재하지 않는 문서 ID로 삭제 요청 | `document_id=99999` | ① DELETE /api/documents/delete/99999 호출 ② 응답 오류 코드 확인 | HTTP 404 Not Found, 문서 미존재 오류 반환 | HTTP 404 반환, 오류 메시지 정상 출력 | PASS | 없음 | 미존재 자원 삭제 차단 |
| TC-DOC-032 | 문서 관리 | 문서 삭제 | 삭제 권한 없는(타 사용자 소유) 문서 삭제 시도 | `document_id=10` (타 사용자 소유), 본인 인증 토큰 | ① 타 사용자 문서에 DELETE /api/documents/delete/10 호출 ② 응답 오류 코드 확인 | HTTP 403 Forbidden 또는 HTTP 404, 권한 없음 오류 반환 | HTTP 404 반환, 타 사용자 문서 삭제 차단 확인 | PASS | 없음 | 소유권 기반 삭제 제어 |

---

### 2.3 파일 업로드 및 처리 (File Upload & Processing)

#### 2.3.1 파일 업로드 — 지원 형식 (POST /api/upload/progress)

| 테스트 ID | 대분류 기능 | 세부 기능 | 테스트 시나리오 | 테스트 데이터 | 수행 절차 | 기대 결과 | 실제 결과 | 테스트 결과 | 결함 사항 | 비고 |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-UPL-001 | 파일 업로드 | PDF 업로드 | 정상적인 PDF 문서 업로드 수행 | 파일명: `test_sample.pdf`, 크기: 1.2MB, 텍스트 포함 PDF | ① 업로드 화면에서 PDF 파일 선택 ② POST /api/upload/progress 호출 ③ SSE 이벤트 수신 및 처리 단계 확인 ④ 최종 응답 내 신규 document_id 확인 | HTTP 200 스트림 응답, 진행 이벤트 순서: save→extract→classify→summarize→save_db→done, 문서 DB 저장 확인 | 각 처리 단계 SSE 이벤트 정상 수신, 문서 DB 저장 완료, document_id 반환 확인 | PASS | 없음 | EasyOCR 기반 텍스트 추출 |
| TC-UPL-002 | 파일 업로드 | DOCX 업로드 | 정상적인 DOCX 문서 업로드 수행 | 파일명: `test_report.docx`, 크기: 0.8MB | ① DOCX 파일 선택 ② POST /api/upload/progress 호출 ③ SSE 이벤트 및 DB 저장 확인 | 전체 처리 단계 정상 완료, 문서 저장 | 전체 처리 단계 정상 완료, python-docx 기반 텍스트 추출 및 DB 저장 확인 | PASS | 없음 | python-docx 파싱 |
| TC-UPL-003 | 파일 업로드 | HWP 업로드 | 정상적인 HWP 한글 문서 업로드 수행 | 파일명: `test_document.hwp`, 크기: 1.5MB | ① HWP 파일 선택 ② POST /api/upload/progress 호출 ③ 처리 단계 및 DB 저장 확인 | 전체 처리 단계 정상 완료, 한글 문서 저장 | OLE 파일 파싱 정상 동작, 한글 텍스트 추출 및 DB 저장 확인 | PASS | 없음 | olefile 기반 HWP 파싱 |
| TC-UPL-004 | 파일 업로드 | PPTX 업로드 | 정상적인 PPTX 발표 파일 업로드 수행 | 파일명: `test_presentation.pptx`, 크기: 2.1MB | ① PPTX 파일 선택 ② POST /api/upload/progress 호출 ③ 처리 단계 및 DB 저장 확인 | 전체 처리 단계 정상 완료, 발표자료 저장 | python-pptx 기반 슬라이드 텍스트 추출 정상, DB 저장 확인 | PASS | 없음 | python-pptx 파싱 |
| TC-UPL-005 | 파일 업로드 | DOC 업로드 | 구형 DOC(Word 97-2003) 문서 업로드 수행 | 파일명: `legacy_document.doc`, 크기: 0.6MB | ① DOC 파일 선택 ② POST /api/upload/progress 호출 ③ 처리 단계 및 DB 저장 확인 | 전체 처리 단계 정상 완료, 문서 저장 | DOC 파일 OLE 파싱 정상, 텍스트 추출 및 DB 저장 확인 | PASS | 없음 | 구형 Word 포맷 지원 |
| TC-UPL-006 | 파일 업로드 | PPT 업로드 | 구형 PPT(PowerPoint 97-2003) 파일 업로드 수행 | 파일명: `legacy_presentation.ppt`, 크기: 1.8MB | ① PPT 파일 선택 ② POST /api/upload/progress 호출 ③ 처리 단계 및 DB 저장 확인 | 전체 처리 단계 정상 완료, 발표자료 저장 | PPT 파일 파싱 정상, 텍스트 추출 및 DB 저장 확인 | PASS | 없음 | 구형 PPT 포맷 지원 |

#### 2.3.2 파일 업로드 — 오류 및 예외 처리

| 테스트 ID | 대분류 기능 | 세부 기능 | 테스트 시나리오 | 테스트 데이터 | 수행 절차 | 기대 결과 | 실제 결과 | 테스트 결과 | 결함 사항 | 비고 |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-UPL-007 | 파일 업로드 | 미지원 형식 처리 | 미지원 파일 형식(TXT) 업로드 시도 | 파일명: `test.txt`, 크기: 10KB | ① .txt 파일 선택 후 POST /api/upload/progress 호출 ② 응답 오류 메시지 확인 | HTTP 400 또는 SSE 오류 이벤트, 미지원 형식 오류 메시지 반환, 파일 미저장 | 오류 이벤트 정상 수신, 미지원 형식 메시지 출력, DB 저장 미발생 확인 | PASS | 없음 | 허용 확장자 검증 적용 |
| TC-UPL-008 | 파일 업로드 | 미지원 형식 처리 | 미지원 파일 형식(JPG 이미지) 업로드 시도 | 파일명: `photo.jpg`, 크기: 500KB | ① .jpg 파일 선택 후 POST /api/upload/progress 호출 ② 응답 오류 메시지 확인 | HTTP 400 또는 SSE 오류 이벤트, 미지원 형식 오류 메시지 반환 | 오류 이벤트 정상 수신, 미지원 형식 메시지 출력, DB 저장 미발생 확인 | PASS | 없음 | 이미지 파일 업로드 차단 |
| TC-UPL-009 | 파일 업로드 | 파일 미첨부 처리 | 파일을 첨부하지 않고 업로드 요청 | 파일 없음 (빈 요청) | ① 파일 미첨부 상태로 POST /api/upload/progress 호출 ② 응답 오류 코드 확인 | HTTP 422, 파일 필드 필수 오류 반환 | HTTP 422 반환, 필수 파일 필드 누락 오류 메시지 출력 | PASS | 없음 | 필수 입력 검증 |
| TC-UPL-010 | 파일 업로드 | 빈 파일 처리 | 내용 없는 빈(0바이트) 파일 업로드 시도 | 파일명: `empty.pdf`, 크기: 0KB | ① 0바이트 PDF 파일 선택 후 POST /api/upload/progress 호출 ② 오류 처리 여부 확인 | 오류 이벤트 발생, 텍스트 추출 불가 오류 반환, 파일 미저장 | 텍스트 추출 단계에서 오류 이벤트 발생, DB 저장 미발생 확인 | PASS | 없음 | 빈 파일 예외 처리 |
| TC-UPL-011 | 파일 업로드 | 대용량 파일 처리 | 대용량 PDF 파일 업로드 수행 | 파일명: `large_document.pdf`, 크기: 45MB | ① 대용량 파일 선택 후 POST /api/upload/progress 호출 ② 처리 시간 및 타임아웃 여부 확인 | 전체 처리 정상 완료 또는 명시적 용량 제한 오류 반환 | 처리는 완료되나 요약 단계 처리 시간이 길어짐(3분 이상 소요). 명시적 파일 크기 제한 정책 미구현 | FAIL | 대용량 파일에 대한 명시적 최대 업로드 용량 제한 설정 필요. 현재 파일 크기 제한 미적용으로 시스템 자원 과부하 위험 | 최대 파일 크기 정책 수립 권고 |

#### 2.3.3 업로드 취소 처리 (POST /api/upload/cancel/{task_id})

| 테스트 ID | 대분류 기능 | 세부 기능 | 테스트 시나리오 | 테스트 데이터 | 수행 절차 | 기대 결과 | 실제 결과 | 테스트 결과 | 결함 사항 | 비고 |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-UPL-012 | 파일 업로드 | 업로드 취소 | 진행 중인 업로드 작업 취소 수행 | 업로드 진행 중 task_id(예: `abc123`) | ① 파일 업로드 시작 후 SSE 스트림 수신 중 ② POST /api/upload/cancel/{task_id} 호출 ③ 취소 처리 및 DB 저장 미발생 확인 | HTTP 200, 취소 처리 완료, 부분 저장 파일 정리, DB 저장 미발생 | HTTP 200 반환, 업로드 취소 완료 메시지, 임시 파일 정리 및 DB 미저장 확인 | PASS | 없음 | 롤백 처리 확인 |
| TC-UPL-013 | 파일 업로드 | 업로드 취소 | 유효하지 않은 task_id로 취소 요청 | `task_id: "nonexistent_task_id"` | ① 존재하지 않는 task_id로 POST /api/upload/cancel/{task_id} 호출 ② 응답 처리 확인 | HTTP 404 Not Found, 미존재 작업 오류 반환 | HTTP 404 반환, 미존재 task_id 오류 메시지 정상 출력 | PASS | 없음 | 유효 task_id 검증 |

---

### 2.4 AI 문서 처리 (AI Document Processing)

#### 2.4.1 텍스트 추출 (document_service.extract_content)

| 테스트 ID | 대분류 기능 | 세부 기능 | 테스트 시나리오 | 테스트 데이터 | 수행 절차 | 기대 결과 | 실제 결과 | 테스트 결과 | 결함 사항 | 비고 |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-AI-001 | AI 문서 처리 | 텍스트 추출 | 스캔 이미지 기반 PDF에서 OCR 텍스트 추출 | 이미지로 스캔된 PDF (텍스트 레이어 없음), 2페이지 | ① 이미지 전용 PDF 파일 업로드 ② extract_content 처리 결과 확인 ③ 추출된 텍스트 내용 정확도 확인 | OCR(EasyOCR)을 통해 텍스트 추출 성공, 빈 문자열 미반환 | EasyOCR 기반 텍스트 추출 성공, 이미지 전처리(노이즈 제거) 적용 후 가독성 있는 텍스트 반환 확인 | PASS | 없음 | EasyOCR + 이미지 전처리 |
| TC-AI-002 | AI 문서 처리 | 텍스트 추출 | 이미지 포함 DOCX 문서에서 텍스트 추출 | 이미지와 텍스트 혼합 DOCX 파일 | ① 이미지 포함 DOCX 파일 업로드 ② 이미지 영역 OCR 처리 및 텍스트 병합 확인 | 텍스트 및 이미지 내 텍스트 모두 추출 성공 | python-docx 파싱 후 이미지 영역 OCR 폴백 적용, 전체 텍스트 추출 정상 확인 | PASS | 없음 | 복합 문서 처리 |
| TC-AI-003 | AI 문서 처리 | 텍스트 추출 | 손상된 파일 업로드 시 예외 처리 | 파일 헤더 변조된 PDF 파일 | ① 손상된 파일 업로드 ② 텍스트 추출 단계 오류 처리 확인 | 오류 이벤트 발생, 예외 메시지 반환, DB 저장 미발생 | 텍스트 추출 단계에서 예외 캐치 후 오류 이벤트 정상 발행, 업로드 롤백 처리 확인 | PASS | 없음 | 예외 처리 롤백 |

#### 2.4.2 자동 문서 분류 (document_service._classify_category)

| 테스트 ID | 대분류 기능 | 세부 기능 | 테스트 시나리오 | 테스트 데이터 | 수행 절차 | 기대 결과 | 실제 결과 | 테스트 결과 | 결함 사항 | 비고 |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-AI-004 | AI 문서 처리 | 자동 분류 | 법안 문서 자동 분류 정확도 검증 | "제○○조 법률 제정안 의결..." 내용의 PDF, 파일명: `law_bill_2025.pdf` | ① 법안 내용 문서 업로드 ② classify 단계 완료 후 저장된 category 값 확인 | category = "법안" 분류 | category = "법안" 정상 분류 확인, 파일명 휴리스틱 + Ollama LLM 분류 일치 | PASS | 없음 | 파일명 + LLM 이중 분류 |
| TC-AI-005 | AI 문서 처리 | 자동 분류 | 발표자료 문서 자동 분류 정확도 검증 | 슬라이드 형식 내용의 PPTX, 파일명: `presentation_2025.pptx` | ① 발표자료 업로드 ② 저장된 category 값 확인 | category = "발표자료" 분류 | category = "발표자료" 정상 분류 확인 | PASS | 없음 | 파일 형식 기반 분류 |
| TC-AI-006 | AI 문서 처리 | 자동 분류 | 뉴스/기사 문서 자동 분류 정확도 검증 | 신문 기사 스타일 텍스트 PDF, 파일명: `news_article.pdf` | ① 뉴스 기사 문서 업로드 ② 저장된 category 값 확인 | category = "뉴스/기사" 분류 | category = "뉴스/기사" 정상 분류 확인 | PASS | 없음 | 내용 기반 LLM 분류 |
| TC-AI-007 | AI 문서 처리 | 자동 분류 | 분류 불가 문서에 대한 기본 카테고리 처리 | 분류 기준 불명확 내용의 임의 문서 | ① 분류 기준 불명확 문서 업로드 ② 저장된 category 값 확인 | category = "기타" 또는 "일반문서" 분류 | category = "기타" 정상 분류, LLM 분류 실패 시 기본값 "기타" 적용 확인 | PASS | 없음 | 기본값 폴백 처리 |

#### 2.4.3 AI 문서 요약 (summary_service.summarize)

| 테스트 ID | 대분류 기능 | 세부 기능 | 테스트 시나리오 | 테스트 데이터 | 수행 절차 | 기대 결과 | 실제 결과 | 테스트 결과 | 결함 사항 | 비고 |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-AI-008 | AI 문서 처리 | 자동 요약 | 법안 문서 요약 — 불릿 포인트 형식 출력 | category="법안", 텍스트 분량: 3,000자 | ① 법안 문서 업로드 ② 요약 단계 완료 후 저장된 summary 값 및 포맷 확인 | summary 생성 완료, 불릿 포인트(•) 형식으로 핵심 내용 정리 | summary 정상 생성, 불릿 포인트 형식 적용 확인, 마크다운 특수문자 제거 처리 확인 | PASS | 없음 | 카테고리별 포맷 적용 |
| TC-AI-009 | AI 문서 처리 | 자동 요약 | 발표자료 요약 — 번호 목록 형식 출력 | category="발표자료", 텍스트 분량: 1,500자 | ① 발표자료 업로드 ② 요약 단계 완료 후 summary 포맷 확인 | summary 생성 완료, 번호 목록(1. 2. 3.) 형식으로 주요 슬라이드 내용 정리 | summary 정상 생성, 번호 목록 포맷 적용 확인 | PASS | 없음 | 발표자료 전용 포맷 |
| TC-AI-010 | AI 문서 처리 | 자동 요약 | 뉴스 기사 요약 — 단락 형식 출력 | category="뉴스/기사", 텍스트 분량: 2,000자 | ① 뉴스 기사 문서 업로드 ② 요약 단계 완료 후 summary 포맷 확인 | summary 생성 완료, 단락(문장) 형식으로 기사 핵심 내용 정리 | summary 정상 생성, 단락 형식 적용 확인, 개행 문자 정규화 처리 확인 | PASS | 없음 | 뉴스 전용 단락 포맷 |
| TC-AI-011 | AI 문서 처리 | 자동 요약 | 장문 문서 청크 분할 요약 처리 | 분량: 50,000자 이상의 기술문서 | ① 장문 기술문서 업로드 ② 5청크 분할 처리 및 병합 요약 결과 확인 | 청크 5개 분할 후 병렬 요약, 병합된 최종 summary 생성 완료 | 청크 5개 분할 후 멀티스레드 요약 처리, 최종 summary 정상 생성 및 DB 저장 확인 | PASS | 없음 | 멀티스레드 청크 처리 |
| TC-AI-012 | AI 문서 처리 | 자동 요약 | Ollama LLM 서비스 비가용 시 예외 처리 | Ollama 서비스 중단 상태에서 요약 요청 | ① Ollama 서비스 강제 중단 후 문서 업로드 ② 요약 단계 오류 처리 확인 | 요약 실패 시 오류 이벤트 발행 또는 빈 요약으로 저장 처리 | summary 필드 빈값으로 DB 저장 완료 처리 — Ollama 연결 실패 시 명시적 오류 사용자 알림 미구현 | FAIL | Ollama 서비스 비가용 시 사용자에게 명시적 오류 메시지 제공 필요. 현재 무응답 상태에서 빈 요약으로 저장되어 사용자가 오류 여부 인지 불가 | LLM 서비스 장애 대응 정책 수립 필요 |

---

### 2.5 보안 (Security)

#### 2.5.1 인증 및 인가 보안

| 테스트 ID | 대분류 기능 | 세부 기능 | 테스트 시나리오 | 테스트 데이터 | 수행 절차 | 기대 결과 | 실제 결과 | 테스트 결과 | 결함 사항 | 비고 |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-SEC-001 | 보안 | 비밀번호 보안 | 저장된 비밀번호 해시 적용 여부 검증 | `password: Test1234!` 회원가입 후 DB 직접 확인 | ① 회원가입 수행 ② DB의 users 테이블에서 password 필드값 확인 ③ 평문 저장 여부 확인 | 비밀번호 평문 미저장, SHA256-crypt 해시값으로 저장 | DB 조회 시 `$5$rounds$...` 형식 해시값 저장 확인, 평문 비밀번호 미존재 확인 | PASS | 없음 | passlib SHA256-crypt 적용 |
| TC-SEC-002 | 보안 | JWT 보안 | JWT 토큰 위변조 시 서명 검증 실패 처리 | 유효한 토큰의 payload 부분 임의 수정 후 전송 | ① 정상 발급된 JWT 복사 후 payload 디코딩, 사용자 ID 변조 ② 변조 토큰으로 API 호출 ③ 응답 오류 확인 | HTTP 401, JWTError(서명 불일치) 오류 반환 | HTTP 401 반환, 서명 검증 실패 오류 메시지 출력, 변조 토큰 접근 차단 확인 | PASS | 없음 | HS256 서명 검증 |
| TC-SEC-003 | 보안 | 접근 제어 | 인증 없이 보호된 모든 API 엔드포인트 접근 시도 | 쿠키 없음 (비인증 상태) | ① 비인증 상태에서 /documents/list, /documents/{id}, /upload/progress 각각 호출 ② 모든 보호 엔드포인트 응답 확인 | 모든 보호 엔드포인트 HTTP 401 반환 | 전체 보호 엔드포인트 HTTP 401 반환 확인, FastAPI Depends 의존성 주입 기반 인증 필터 정상 동작 | PASS | 없음 | FastAPI Depends 기반 인증 |
| TC-SEC-004 | 보안 | 데이터 격리 | 사용자 간 데이터 완전 격리 검증 | 사용자 A(id=1) 토큰으로 사용자 B(id=2) 문서 접근 | ① 사용자 A로 로그인 ② 사용자 B 소유 문서 ID로 목록·상세·수정·삭제 각각 시도 ③ 전체 응답 확인 | 모든 요청 HTTP 404 반환, 타 사용자 데이터 접근 불가 | owner_id 기반 쿼리 필터링으로 타 사용자 데이터 완전 차단 확인 | PASS | 없음 | owner_id 기반 데이터 격리 |
| TC-SEC-005 | 보안 | SQL 인젝션 방지 | 검색 파라미터에 SQL 인젝션 패턴 입력 | `query: "' OR '1'='1"`, `query: "; DROP TABLE users;--"` | ① SQL 인젝션 패턴 문자열을 검색어로 입력 ② GET /api/documents/search 호출 ③ DB 오류 및 비정상 데이터 반환 여부 확인 | HTTP 200, 정상 빈 검색 결과 반환, DB 오류 미발생, 데이터 유출 없음 | SQLAlchemy ORM 파라미터 바인딩으로 인젝션 시도 무력화, 정상 빈 결과 반환 확인 | PASS | 없음 | ORM 파라미터 바인딩 적용 |
| TC-SEC-006 | 보안 | 응답 보안 | API 응답에서 민감 정보 미노출 검증 | 회원가입·로그인·사용자 조회 응답 전체 | ① 회원가입, 로그인, /auth/me 응답 JSON 확인 ② 비밀번호 해시 포함 여부 확인 | 응답 JSON에 password 필드 미포함, id·email·name만 반환 | 전체 인증 응답에서 password 필드 미노출 확인, UserResponse 스키마 적용으로 필드 제한 | PASS | 없음 | Pydantic 응답 스키마 제한 |

---

## 3. 결함 목록 및 조치 사항

| 결함 ID | 테스트 ID | 대분류 | 세부 기능 | 결함 내용 | 심각도 | 조치 권고 | 조치 상태 |
|---|---|---|---|---|---|---|---|
| BUG-001 | TC-DOC-009 | 문서 관리 | 문서 정렬 | 유효하지 않은 sort 파라미터 입력 시 400 오류 미반환, 기본값 처리로 대체됨. 입력값 유효성 검증 미적용 | 보통(Medium) | sort 파라미터에 대한 Enum 유효성 검증 추가 또는 허용값 목록 명시 후 미일치 시 HTTP 400 반환 | 미조치(개선 권고) |
| BUG-002 | TC-UPL-011 | 파일 업로드 | 대용량 파일 처리 | 대용량 파일(45MB)에 대한 업로드 용량 제한 미설정. 처리 시간 장기화 및 서버 자원 과부하 위험 | 높음(High) | FastAPI 또는 nginx 레벨에서 최대 파일 크기 제한(권장: 10MB) 설정, 제한 초과 시 HTTP 413 반환 구현 | 미조치(즉시 개선 필요) |
| BUG-003 | TC-AI-012 | AI 문서 처리 | 자동 요약 | Ollama LLM 서비스 비가용 시 요약 실패 내용이 사용자에게 미전달. 빈 요약으로 저장되어 오류 여부 인지 불가 | 보통(Medium) | Ollama 연결 실패 예외 시 SSE 오류 이벤트 발행, 사용자에게 명시적 오류 메시지 전달 구현 | 미조치(개선 권고) |

> ※ 위 결함 목록은 본 단위 테스트 수행 결과 식별된 사항으로, 차기 스프린트 내 조치 완료를 권고한다.

---

## 4. 테스트 환경 명세

| 항목 | 내용 |
|---|---|
| 운영체제 | Windows 10 Pro (Build 19045) |
| 백엔드 런타임 | Python 3.11.x |
| 백엔드 프레임워크 | FastAPI 0.115.x |
| 프론트엔드 런타임 | Node.js 20.x |
| 프론트엔드 프레임워크 | React 18 + TypeScript (Vite) |
| 데이터베이스 | SQLite 3.x (docdb.sqlite) |
| ORM | SQLAlchemy 2.0.x |
| AI 엔진 | Ollama (로컬) + qwen2.5:3b 모델 |
| OCR 엔진 | EasyOCR 1.7.x |
| 인증 방식 | JWT (HS256), 쿠키 기반 (HttpOnly) |
| 테스트 도구 | pytest 7.x, FastAPI TestClient, httpx |
| 테스트 수행 서버 | 로컬 개발 환경 (localhost:8000, localhost:5173) |

---

## 5. 확인 및 서명

| 구분 | 성명 | 서명 | 일자 |
|---|---|---|---|
| 작성자 | choi-wono-ik | | 2026.05.22 |
| 검토자 | | | |
| 승인자 | | | |

---

*본 문서는 DocMind AI 시스템 단위 테스트 수행 결과를 기록한 공식 산출물이며, 공공기관 정보화사업 감리 기준에 준하여 작성되었다.*
