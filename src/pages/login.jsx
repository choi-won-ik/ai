import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginInput from "../components/login/loginInput"
import LoginFooter from "../layouts/loginFooter"
import FindPassword from "../components/login/FindPassword"

const TABS = [
    { key: "id", label: "ID" },
    { key: "otp", label: "일회용 번호" },
    { key: "qr", label: "QR코드" },
];

export default function NaverLogin() {
    const navigate = useNavigate();
    const [status, setStatus] = useState("login");


    if (status === "login") {
        return (
            <div className="min-h-screen bg-[#f5f6f7] flex flex-col items-center justify-center px-4">
                {/* Logo */}
                <h1 className="text-4xl font-extrabold text-[#03C75A] tracking-tight mb-6 select-none">
                    로그인
                </h1>

                {/* Card */}
                <div className="w-full max-w-sm bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Form */}
                    <LoginInput tabs={TABS} />
                </div>

                {/* Footer Links */}
                <LoginFooter />
            </div>
        );
    } else if (status === "findPassword") {
        return (
            <>
                <FindPassword />
                <LoginFooter />
            </>
        );
    }
}