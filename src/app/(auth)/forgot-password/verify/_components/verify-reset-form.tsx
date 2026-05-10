"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, XCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { emailOtp } from "@/lib/auth-client";
import { FadeIn } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";

const OTP_LENGTH = 6;

export function VerifyResetForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp]       = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  function handleChange(index: number, value: string) {
    const char = value.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(-1);
    const next = [...otp];
    next[index] = char;
    setOtp(next);
    setErrorMsg(null);
    if (char && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
    if (char && next.every(Boolean)) handleVerify(next.join(""));
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const next = [...otp]; next[index] = ""; setOtp(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft"  && index > 0)              inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((c, i) => { next[i] = c; });
    setOtp(next);
    if (pasted.length === OTP_LENGTH) handleVerify(pasted);
  }

  const handleVerify = useCallback(async (code: string) => {
    if (status === "loading" || status === "success") return;
    setStatus("loading");

    const { error } = await emailOtp.verifyEmail({ email, otp: code });

    if (error) {
      setStatus("error");
      setErrorMsg("Invalid or expired code. Please try again.");
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeout(() => { setStatus("idle"); inputRefs.current[0]?.focus(); }, 700);
      return;
    }

    setStatus("success");
    setTimeout(() => {
      window.location.href = `/forgot-password/reset?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(code)}`;
    }, 800);
  }, [email, status]);

  const filledCount = otp.filter(Boolean).length;

  return (
    <FadeIn className="flex flex-col gap-5">
      <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm px-8 py-9 shadow-xl shadow-black/5">
        <FadeIn direction="down" delay={0.05} className="mb-7 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Enter reset code</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            We sent a 6-character code to <span className="font-semibold text-foreground">{email}</span>
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="mb-6">
          <div className="flex items-center justify-center gap-2" onPaste={handlePaste}>
            {otp.map((char, i) => (
              <motion.input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="text"
                maxLength={1}
                value={char}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                disabled={status === "loading" || status === "success"}
                animate={status === "error" ? { x: [0, -8, 8, -5, 5, 0] } : {}}
                transition={{ duration: 0.45 }}
                className={cn(
                  "h-12 w-11 rounded-xl border-2 text-center text-lg font-bold uppercase tracking-widest outline-none transition-all",
                  "focus:border-primary focus:ring-2 focus:ring-primary/20",
                  char && status !== "error" ? "border-primary/50 bg-primary/5" : "border-border bg-background",
                  status === "error" && "border-destructive/60 bg-destructive/5 text-destructive",
                  status === "success" && "border-primary bg-primary/10 text-primary",
                )}
              />
            ))}
          </div>
          <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-border">
            <motion.div
              className="h-full rounded-full bg-primary"
              animate={{ width: `${(filledCount / OTP_LENGTH) * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </FadeIn>

        <AnimatePresence mode="wait">
          {status === "success" && (
            <motion.div key="ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-4 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/8 px-4 py-3 text-sm font-medium text-primary">
              <ShieldCheck className="size-4" /> Code verified! Redirecting…
            </motion.div>
          )}
          {errorMsg && status !== "success" && (
            <motion.div key="err" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              <XCircle className="size-4" /> {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          className="h-11 w-full font-semibold"
          disabled={filledCount < OTP_LENGTH || status === "loading" || status === "success"}
          onClick={() => handleVerify(otp.join(""))}
        >
          {status === "loading" ? (
            <span className="flex items-center gap-2">
              <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} className="inline-block">
                <RotateCcw className="size-4" />
              </motion.span>
              Verifying…
            </span>
          ) : "Verify code"}
        </Button>
      </div>
    </FadeIn>
  );
}
