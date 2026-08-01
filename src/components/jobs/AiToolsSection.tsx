"use client";

import { useState } from "react";
import { Sparkles, Upload, FileText, MessageSquareText, Copy, Check, RotateCw } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { reviewResume, generateCoverLetter, generateInterviewQuestions } from "@/lib/ai-service";

type Tool = "resume" | "cover-letter" | "questions" | null;

export function AiToolsSection({ jobId }: { jobId: string }) {
    const { t } = useLocale();
    const [activeTool, setActiveTool] = useState<Tool>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleCopy = () => {
        if (!result) return;
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const runResumeReview = async () => {
        if (!file) return;
        setLoading(true);
        setResult(null);
        try {
            const res = await reviewResume(jobId, file);
            setResult(res.result);
        } finally {
            setLoading(false);
        }
    };

    const runCoverLetter = async () => {
        setLoading(true);
        setResult(null);
        try {
            const res = await generateCoverLetter(jobId, "professional");
            setResult(res.result);
        } finally {
            setLoading(false);
        }
    };

    const runInterviewQuestions = async () => {
        setLoading(true);
        setResult(null);
        try {
            const res = await generateInterviewQuestions(jobId);
            setResult(res.result);
        } finally {
            setLoading(false);
        }
    };

    const openTool = (tool: Tool) => {
        setActiveTool(tool);
        setResult(null);
        setFile(null);
    };

    return (
        <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-5">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-on-surface">{t("aiTools.title")}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <button
                    onClick={() => openTool("resume")}
                    className={`flex flex-col items-start gap-2 rounded-lg border p-4 text-start transition ${
                        activeTool === "resume"
                            ? "border-primary bg-primary-container/10"
                            : "border-outline-variant hover:border-primary"
                    }`}
                >
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                        <p className="text-sm font-medium text-on-surface">{t("aiTools.resumeReview")}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">{t("aiTools.resumeReviewDesc")}</p>
                    </div>
                </button>

                <button
                    onClick={() => openTool("cover-letter")}
                    className={`flex flex-col items-start gap-2 rounded-lg border p-4 text-start transition ${
                        activeTool === "cover-letter"
                            ? "border-primary bg-primary-container/10"
                            : "border-outline-variant hover:border-primary"
                    }`}
                >
                    <Sparkles className="h-5 w-5 text-primary" />
                    <div>
                        <p className="text-sm font-medium text-on-surface">{t("aiTools.coverLetter")}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">{t("aiTools.coverLetterDesc")}</p>
                    </div>
                </button>

                <button
                    onClick={() => openTool("questions")}
                    className={`flex flex-col items-start gap-2 rounded-lg border p-4 text-start transition ${
                        activeTool === "questions"
                            ? "border-primary bg-primary-container/10"
                            : "border-outline-variant hover:border-primary"
                    }`}
                >
                    <MessageSquareText className="h-5 w-5 text-primary" />
                    <div>
                        <p className="text-sm font-medium text-on-surface">{t("aiTools.interviewQuestions")}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">{t("aiTools.interviewQuestionsDesc")}</p>
                    </div>
                </button>
            </div>

            {activeTool === "resume" && (
                <div className="border-t border-outline-variant pt-4 space-y-3">
                    <label className="flex items-center justify-center gap-2 rounded-md border-2 border-dashed border-outline-variant p-4 cursor-pointer hover:border-primary transition">
                        <Upload className="h-4 w-4 text-on-surface-variant" />
                        <span className="text-sm text-on-surface-variant">
              {file ? file.name : t("aiTools.uploadResume")}
            </span>
                        <input
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                    </label>
                    <button
                        onClick={runResumeReview}
                        disabled={!file || loading}
                        className="rounded-md bg-primary text-on-primary font-medium px-4 py-2 text-sm hover:opacity-90 transition disabled:opacity-50"
                    >
                        {loading ? t("aiTools.generating") : t("aiTools.analyze")}
                    </button>
                </div>
            )}

            {activeTool === "cover-letter" && (
                <div className="border-t border-outline-variant pt-4">
                    <button
                        onClick={runCoverLetter}
                        disabled={loading}
                        className="rounded-md bg-primary text-on-primary font-medium px-4 py-2 text-sm hover:opacity-90 transition disabled:opacity-50"
                    >
                        {loading ? t("aiTools.generating") : t("aiTools.generate")}
                    </button>
                </div>
            )}

            {activeTool === "questions" && (
                <div className="border-t border-outline-variant pt-4">
                    <button
                        onClick={runInterviewQuestions}
                        disabled={loading}
                        className="rounded-md bg-primary text-on-primary font-medium px-4 py-2 text-sm hover:opacity-90 transition disabled:opacity-50"
                    >
                        {loading ? t("aiTools.generating") : t("aiTools.generate")}
                    </button>
                </div>
            )}

            {loading && (
                <div className="mt-4 h-32 rounded-lg bg-surface-container animate-pulse" />
            )}

            {result && !loading && (
                <div className="mt-4 rounded-lg bg-surface-container p-4 relative">
                    <button
                        onClick={handleCopy}
                        className="absolute top-3 end-3 flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary transition"
                    >
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? t("aiTools.copied") : t("aiTools.copy")}
                    </button>
                    <pre className="text-sm text-on-surface whitespace-pre-wrap font-body pe-16">{result}</pre>

                    {activeTool === "cover-letter" && (
                        <button
                            onClick={runCoverLetter}
                            className="flex items-center gap-1.5 text-xs text-primary hover:underline mt-3"
                        >
                            <RotateCw className="h-3 w-3" />
                            {t("aiTools.regenerate")}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}