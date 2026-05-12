import { useState, useRef, useCallback } from "react";
import useFileUpdate from "../hooks/useFileUpdate";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";


const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getStatusStyle = (status) => {
    if (status === "done") return { className: "bg-green-100 text-green-800", label: "완료" };
    if (status === "uploading") return { className: "bg-blue-100 text-blue-800", label: "업로드 중" };
    return { className: "bg-gray-100 text-gray-600", label: "대기 중" };
};

const getFileIcon = (name) => {
    if (name.endsWith(".pdf")) return "📄";
    if (name.match(/\.(png|jpg|jpeg)$/)) return "🖼️";
    return "📁";
};

export default function FileUpload() {
    const [files, setFiles] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [extractedTexts, setExtractedTexts] = useState([]); // { filename, text }[]
    const inputRef = useRef(null);
    const { mutateAsync } = useFileUpdate();

    const addFiles = useCallback((newFiles) => {
        const incoming = Array.from(newFiles).map((f) => ({
            id: `${f.name}-${f.size}-${Date.now()}`,
            name: f.name,
            size: f.size,
            raw: f,
            status: "pending",
            progress: 0,
        }));
        setFiles((prev) => {
            const names = new Set(prev.map((f) => f.name + f.size));
            return [...prev, ...incoming.filter((f) => !names.has(f.name + f.size))];
        });
    }, []);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        addFiles(e.dataTransfer.files);
    };

    const removeFile = (id) => setFiles((prev) => prev.filter((f) => f.id !== id));

    const handleUpload = async () => {
        const pendingFiles = files.filter((f) => f.status === "pending");
        if (pendingFiles.length === 0) return;

        setFiles((prev) =>
            prev.map((f) => (f.status === "pending" ? { ...f, status: "uploading" } : f))
        );

        pendingFiles.forEach((f) => {
            let prog = 0;
            const iv = setInterval(() => {
                prog += Math.random() * 18 + 5;
                if (prog >= 100) {
                    prog = 100;
                    clearInterval(iv);
                    setFiles((prev) =>
                        prev.map((p) => (p.id === f.id ? { ...p, status: "done", progress: 100 } : p))
                    );
                } else {
                    setFiles((prev) =>
                        prev.map((p) => (p.id === f.id ? { ...p, progress: Math.round(prog) } : p))
                    );
                }
            }, 120);
        });

        const formData = new FormData();
        pendingFiles.forEach((f) => formData.append("files", f.raw));

        try {
            const result = await mutateAsync(formData);
            // result = { message: "1개 파일 저장 완료", saved_paths: ["C:/upload/sample.txt"] }

            alert(result.message);
            console.log("저장 경로:", result.saved_paths);
        } catch (err) {
            console.error("업로드 실패:", err);
        }
    };

    const canUpload = files.some((f) => f.status === "pending");

    return (
        <div className="max-w-2xl mx-auto px-6 py-10 font-sans">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">파일 업로드</h1>
            <p className="text-sm text-gray-500 mb-7">PDF, 이미지, 문서 등을 업로드하세요.</p>

            {/* Drop Zone */}
            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`
                    relative border-2 border-dashed rounded-xl px-8 py-12
                    text-center cursor-pointer transition-colors duration-150
                    ${dragging
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
                    }
                `}
            >
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.docx,.txt"
                    onChange={(e) => addFiles(e.target.files)}
                />
                <div className="text-4xl mb-3">☁️</div>
                <p className="text-sm font-semibold text-gray-800 mb-1">
                    파일을 드래그하거나 클릭하여 선택
                </p>
                <p className="text-xs text-gray-400">PDF, 이미지, 문서 · 최대 50MB</p>
            </div>

            {/* File List */}
            <div className="mt-4 flex flex-col gap-2.5">
                {files.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-4">
                        업로드할 파일을 선택해주세요.
                    </p>
                )}
                {files.map((f) => {
                    const { className: badgeClass, label } = getStatusStyle(f.status);
                    return (
                        <div
                            key={f.id}
                            className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3"
                        >
                            <span className="text-2xl shrink-0">{getFileIcon(f.name)}</span>

                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-800 truncate">{f.name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{formatSize(f.size)}</p>
                                <div className="h-0.5 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
                                    <div
                                        className="h-full bg-blue-400 rounded-full transition-all duration-300"
                                        style={{ width: `${f.progress}%` }}
                                    />
                                </div>
                            </div>

                            <span className={`text-xs px-2.5 py-0.5 rounded-md shrink-0 font-medium ${badgeClass}`}>
                                {label}
                            </span>

                            <button
                                onClick={() => removeFile(f.id)}
                                className="text-gray-300 hover:text-red-400 transition-colors text-base px-1 shrink-0"
                                aria-label="파일 삭제"
                            >
                                ✕
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2.5 mt-5">
                <button
                    onClick={handleUpload}
                    disabled={!canUpload}
                    className={`
                        flex-1 py-2.5 rounded-lg text-sm font-medium text-white
                        transition-colors duration-150
                        ${canUpload
                            ? "bg-gray-900 hover:bg-gray-700 cursor-pointer"
                            : "bg-gray-300 cursor-not-allowed"
                        }
                    `}
                >
                    ↑ 업로드 시작
                </button>
                <button
                    onClick={() => setFiles([])}
                    className="px-4 py-2.5 rounded-lg text-sm text-gray-500 border border-gray-300 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                >
                    초기화
                </button>
            </div>

            {/* Extracted Text Section */}
            {extractedTexts.length > 0 && (
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold text-gray-700">📋 추출된 텍스트</h2>
                        <button
                            onClick={() => setExtractedTexts([])}
                            className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                        >
                            전체 삭제
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">
                        {extractedTexts.map((item, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                                {/* 파일명 헤더 */}
                                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                                    <span className="text-xs font-medium text-gray-600 truncate">
                                        📄 {item.filename ?? `파일 ${idx + 1}`}
                                    </span>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(item.text);
                                        }}
                                        className="text-xs text-blue-400 hover:text-blue-600 transition-colors shrink-0 ml-2"
                                    >
                                        복사
                                    </button>
                                </div>
                                {/* 텍스트 내용 */}
                                <textarea
                                    value={item.text}
                                    onChange={(e) =>
                                        setExtractedTexts((prev) =>
                                            prev.map((p, i) => (i === idx ? { ...p, text: e.target.value } : p))
                                        )
                                    }
                                    className="w-full px-4 py-3 text-xs text-gray-700 leading-relaxed resize-y bg-white outline-none min-h-40"
                                    placeholder="추출된 텍스트가 여기에 표시됩니다."
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}