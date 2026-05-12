import { useState } from "react";

export default function FindPassword() {
    const [userId, setUserId] = useState("");

    const handleSubmit = () => {
        if (userId.trim()) {
            // 다음 단계 로직
            console.log("아이디:", userId);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f6f7] flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col min-h-[380px]">
                {/* Title */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">비밀번호 찾기</h2>
                    <p className="text-sm text-gray-500">아이디를 입력해 주세요.</p>
                </div>

                {/* Input */}
                <input
                    type="text"
                    placeholder="아이디"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#03C75A] transition-colors placeholder-gray-400"
                />

                {/* 다음 Button */}
                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-3 bg-[#03C75A] hover:bg-[#02b350] text-white font-semibold text-sm rounded-lg transition-colors"
                    >
                        다음
                    </button>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Footer */}
                <div className="border-t border-gray-100 pt-4">
                    <a href="#" className="text-xs text-gray-500 underline underline-offset-2 hover:text-gray-700">
                        아이디가 기억나지 않나요?
                    </a>
                </div>
            </div>
        </div>
    );
}