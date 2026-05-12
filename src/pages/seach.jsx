import { useState, useRef, useEffect } from "react";
import useSearch from "../hooks/useSearch";
import ReactMarkdown from "react-markdown";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const [history, setHistory] = useState([]);
  const [pendingQuestion, setPendingQuestion] = useState(""); // 답변 대기 중인 질문
  const inputRef = useRef(null);

  const { data, isFetching } = useSearch(submittedQuery);

  // data가 바뀌면 history에 추가
  useEffect(() => {
    if (!isFetching && data && pendingQuestion) {
      setHistory((prev) => [
        ...prev,
        { question: pendingQuestion, answer: data },
      ]);
      setPendingQuestion("");
    }
  }, [data, isFetching]);

  const handleSearch = () => {
    if (!query.trim()) return;
    const q = query.trim();
    setPendingQuestion(q);
    setSubmittedQuery(q);
    setIsSearched(true);
    setQuery("");
  };

  const handleClear = () => {
    setQuery("");
    setIsSearched(false);
    setHistory([]);
    setSubmittedQuery("");
    setPendingQuestion("");
    inputRef.current.focus();
  };

  return (
    <div className="min-h-screen px-4 flex flex-col">
      {/* 대화 영역 */}
      <div
        className={`flex-1 overflow-y-auto transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isSearched ? "pt-6 pb-32" : "hidden"}`}
      >
        <div className="max-w-md mx-auto flex flex-col gap-6">
          {history.map((item, i) => (
            <div key={i} className="flex flex-col gap-3">
              {/* 질문 */}
              <div className="flex justify-end">
                <div className="bg-[#03C75A] text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-sm max-w-[80%]">
                  {item.question}
                </div>
              </div>

              {/* 답변 */}
              <div className="flex justify-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 stroke-gray-500" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <div className="bg-gray-50 border border-gray-100 text-sm text-gray-800 px-4 py-2.5 rounded-2xl rounded-bl-sm max-w-[80%] prose prose-sm">
                  <ReactMarkdown>
                    {item.answer?.response ?? "검색 결과가 없습니다."}
                  </ReactMarkdown>
                </div>
              </div>

            </div>
          ))}

          {/* 로딩 */}
          {isFetching && (
            <div className="flex justify-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 stroke-gray-500" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <div className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#03C75A] animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 검색창 — 중앙 or 하단 고정 */}
      <div
        className={`transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isSearched
            ? "fixed bottom-0 left-0 right-0 px-4 py-3 bg-white border-t border-gray-100"
            : "flex-1 flex items-center justify-center"}`}
      >
        <div className="w-full max-w-md mx-auto">
          <div
            className={`flex items-center gap-2 bg-white border-2 px-3 py-2 rounded-xl transition-all
              ${focused
                ? "border-[#03C75A] shadow-[0_0_0_3px_rgba(3,199,90,0.15)]"
                : "border-gray-200"}`}
          >
            <svg
              className={`w-4 h-4 shrink-0 transition-colors ${focused ? "stroke-[#03C75A]" : "stroke-gray-400"}`}
              viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              placeholder={isSearched ? "이어서 검색하세요..." : "검색어를 입력하세요..."}
              className="flex-1 outline-none text-sm text-gray-800 bg-transparent"
            />

            {query && (
              <button
                onClick={handleClear}
                className="w-5 h-5 flex items-center justify-center bg-gray-200 rounded-full shrink-0"
              >
                <svg className="w-2.5 h-2.5 stroke-gray-500" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}

            <button
              onClick={handleSearch}
              className="px-3 py-1.5 bg-[#03C75A] hover:bg-[#02b350] text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
            >
              검색
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}