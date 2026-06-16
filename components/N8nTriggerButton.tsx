"use client";

import { useState } from "react";

type TriggerStatus = "idle" | "loading" | "success" | "error";

type N8nTriggerButtonProps = {
  userId: string;
  className?: string;
  buttonClassName?: string;
  showMessage?: boolean;
};

const buttonText = "Collect Now";
const loadingText = "Collecting...";
const successText = "Collection request sent.";
const fallbackErrorText =
  "\ub274\uc2a4 \uc218\uc9d1 \uc694\uccad \uc911 \ubb38\uc81c\uac00 \ubc1c\uc0dd\ud588\uc5b4\uc694.";

export function N8nTriggerButton({
  userId,
  className = "",
  buttonClassName = "",
  showMessage = true
}: N8nTriggerButtonProps) {
  const [status, setStatus] = useState<TriggerStatus>("idle");
  const [message, setMessage] = useState<string>("");

  const isLoading = status === "loading";

  const handleTrigger = async () => {
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/n8n/trigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId })
      });

      const result = (await response.json().catch(() => null)) as
        | { success?: boolean; error?: string }
        | null;

      if (!response.ok || !result?.success) {
        throw new Error(result?.error ?? "News collection failed.");
      }

      setStatus("success");
      setMessage(successText);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : fallbackErrorText);
    }
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={handleTrigger}
        disabled={isLoading}
        className={`soft-ring w-fit rounded-full bg-ink px-8 py-3 text-sm font-semibold text-paper shadow-[0_16px_35px_rgba(23,23,23,0.16)] transition hover:-translate-y-0.5 hover:bg-moss disabled:cursor-not-allowed disabled:opacity-65 ${buttonClassName}`}
      >
        {isLoading ? loadingText : buttonText}
      </button>
      {showMessage && message ? (
        <p
          className={`text-sm ${
            status === "error" ? "text-red-700" : "text-clay"
          }`}
          role={status === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
