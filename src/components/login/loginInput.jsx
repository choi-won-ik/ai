import { useState } from "react";

export default function LoginInput({ tabs }) {
    // const [tab, setTab] = useState("id");
    const [id, setId] = useState("");
    const [pw, setPw] = useState("");
    const [keepLogin, setKeepLogin] = useState(true);
    const [ipProtect, setIpProtect] = useState(true);

    const [tab, setTab] = useState(tabs[0].key);

    return (
        <div className="p-5">
            <div className="flex border-b border-gray-200">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors
                    ${tab === t.key
                                ? "text-gray-800 border-b-2 border-gray-800 -mb-px"
                                : "text-gray-400 hover:text-gray-600"
                            }`}
                    >
                        <span className="text-xs">{t.icon}</span>
                        {t.label}
                    </button>
                ))}
            </div>


            {tab === "id" && (
                <>
                    {/* Input Group */}
                    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#03C75A] transition-colors">
                        <input
                            type="text"
                            placeholder="아이디 또는 전화번호"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="w-full px-4 py-3.5 text-sm outline-none border-b border-gray-200 placeholder-gray-400"
                        />
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={pw}
                            onChange={(e) => setPw(e.target.value)}
                            className="w-full px-4 py-3.5 text-sm outline-none placeholder-gray-400"
                        />
                    </div>

                    {/* Options Row */}
                    <div className="flex items-center justify-between mt-3">
                        <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={keepLogin}
                                onChange={(e) => setKeepLogin(e.target.checked)}
                                className="accent-[#03C75A] w-4 h-4"
                            />
                            로그인 상태 유지
                        </label>

                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <span>IP보안</span>
                            <button
                                onClick={() => setIpProtect(!ipProtect)}
                                className={`relative inline-flex w-10 h-5 rounded-full transition-colors ${ipProtect ? "bg-[#03C75A]" : "bg-gray-300"
                                    }`}
                            >
                                <span
                                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${ipProtect ? "translate-x-5" : "translate-x-0"
                                        }`}
                                />
                            </button>
                            <span className={`font-bold ${ipProtect ? "text-[#03C75A]" : "text-gray-400"}`}>
                                {ipProtect ? "ON" : "OFF"}
                            </span>
                        </div>
                    </div>

                    {/* Login Button */}
                    <button className="mt-4 w-full py-3.5 rounded-lg bg-gray-400 hover:bg-gray-500 text-white font-semibold text-base transition-colors">
                        로그인
                    </button>

                    {/* Passkey */}
                    <div className="mt-4">
                        <p className="text-center text-xs text-gray-400 mb-2">
                            지문·얼굴 인증을 설정했다면
                        </p>
                        <button className="w-full py-3.5 rounded-lg border-2 border-[#03C75A] text-[#03C75A] font-bold text-base hover:bg-green-50 transition-colors">
                            패스키 로그인
                        </button>
                    </div>
                </>
            )}

            {tab === "otp" && (
                <div className="py-10 text-center text-gray-400 text-sm">일회용 번호 로그인</div>
            )}
            {tab === "qr" && (
                <div className="py-10 text-center text-gray-400 text-sm">QR코드 로그인</div>
            )}
        </div>
    )
}