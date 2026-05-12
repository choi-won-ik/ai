import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function loginFooter() {
    const navigate = useNavigate();
    return (
        <div className="flex items-center gap-3 mt-5 text-xs text-gray-500">
            <div className="cursor-pointer hover:underline" onClick={() => navigate("/findPassword")}>비밀번호 찾기</div>
            <span className="text-gray-300">|</span>
            <div className="cursor-pointer hover:underline" onClick={() => navigate("/findId")}>아이디 찾기</div>
            <span className="text-gray-300">|</span>
            <div className="cursor-pointer hover:underline" onClick={() => navigate("/signUp")}>회원가입</div>
        </div>
    )
}
