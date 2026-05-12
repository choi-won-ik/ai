from fastapi import APIRouter, UploadFile, File, Query
from fastapi.responses import StreamingResponse
from typing import List
from pathlib import Path
import pdfplumber
import io

router = APIRouter()

# 저장 경로 설정
SAVE_DIR = Path("C:/upload")
SAVE_DIR.mkdir(parents=True, exist_ok=True)  # 폴더 없으면 자동 생성

@router.post("/fileUpdate")
async def fileUpdate(
    files: List[UploadFile] = File(...),
    start_page: int = Query(1, ge=1),
    end_page: int = Query(None)
):
    saved_files = []

    for file in files:
        contents = await file.read()
        all_text = ""

        with pdfplumber.open(io.BytesIO(contents)) as pdf:
            total = len(pdf.pages)
            end = min(end_page or total, total)

            all_text += f"=== {file.filename} ===\n\n"

            for i in range(start_page - 1, end):
                text = pdf.pages[i].extract_text() or ""
                all_text += f"[{i + 1}페이지]\n{text}\n\n"

        # 파일명: 원본 PDF명 그대로 .txt로 저장
        stem = Path(file.filename).stem  # 확장자 제거
        save_path = SAVE_DIR / f"{stem}.txt"

        # 동일 파일명 있으면 숫자 붙이기
        counter = 1
        while save_path.exists():
            save_path = SAVE_DIR / f"{stem}_{counter}.txt"
            counter += 1

        save_path.write_text(all_text, encoding="utf-8")
        saved_files.append(str(save_path))

    return {
        "message": f"{len(saved_files)}개 파일 저장 완료",
        "saved_paths": saved_files
    }