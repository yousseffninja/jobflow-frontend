"use client";

import { useRef } from "react";

type CodeInputProps = {
    length?: number;
    value: string[];
    onChange: (value: string[]) => void;
};

export function CodeInput({ length = 6, value, onChange }: CodeInputProps) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, digit: string) => {
        if (!/^\d*$/.test(digit)) return;

        const next = [...value];
        next[index] = digit.slice(-1);
        onChange(next);

        if (digit && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !value[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
        const next = pasted.split("");
        while (next.length < length) next.push("");
        onChange(next);
        const lastIndex = Math.min(pasted.length, length) - 1;
        if (lastIndex >= 0) inputRefs.current[lastIndex]?.focus();
    };

    return (
        <div className="flex gap-2 justify-center" dir="ltr">
            {Array.from({ length }).map((_, i) => (
                <input
                    key={i}
                    ref={(el) => {
                        inputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[i] || ""}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    className="w-11 h-12 text-center rounded-md border border-outline-variant bg-surface-container-lowest text-lg font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary-container/20 transition"
                />
            ))}
        </div>
    );
}