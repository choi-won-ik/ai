import { useNavigate } from "react-router-dom";



export default function Main() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f5f6f7] flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col min-h-[380px] relative">
                <div className="mb-6 absolute">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">메인</h2>
                </div>

                <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-3 bg-[#03C75A] hover:bg-[#02b350] text-white font-semibold text-sm rounded-lg transition-colors my-auto"
                >
                    로그인
                </button>

                <button
                    onClick={() => navigate("/fileUpdate")}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm rounded-lg transition-colors my-auto"
                >
                    파일 업로드
                </button>
            </div>
        </div>
    );
}
