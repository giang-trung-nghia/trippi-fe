"use client";

import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signInWithGoogle } from "@/services/auth";

type GoogleSignInButtonProps = {
  className?: string;
};

const resolveRedirectUrl = (payload: unknown): string | undefined => {
  if (!payload) {
    return undefined;
  }

  if (typeof payload === "string") {
    return payload;
  }

  if (typeof payload === "object") {
    const data = payload as {
      redirectUrl?: string;
      url?: string;
      href?: string;
    };

    return data.redirectUrl ?? data.url ?? data.href;
  }

  return undefined;
};

export function GoogleSignInButton({ className }: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      window.location.href = "http://localhost:8000/api/v1/auth/google/sign-in";
      return;
    } catch (error) {
      console.error("Failed to start Google sign-in", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className={cn("w-full justify-center gap-2", className)}
      type="button"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
    >
      <Image
        src="/icons/google.svg"
        alt="Google logo"
        width={20}
        height={20}
        aria-hidden="true"
        className="size-5"
      />
      <span>{isLoading ? "Connecting..." : "Sign in with Google"}</span>
    </Button>
  );
}
