import Image from "next/image";
import Link from "next/link";

import { GoogleSignInButton } from "@/features/auth/google-sign-in-button";
import { SignInForm } from "@/features/auth/sign-in-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SignInParams = Record<string, string | string[] | undefined>;

type SignInPageProps = {
  searchParams?: Promise<SignInParams>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const resolvedParams = (await searchParams) ?? {};
  const rawMode = resolvedParams.mode;
  const mode = Array.isArray(rawMode) ? rawMode[0] : rawMode;
  const highlightEmail = mode === "email";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <div className="space-y-2 text-center">
          <p className="text-sm font-medium text-primary">Trippi</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Sign in or create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose the method that works best for you.
          </p>
        </div>

        <section
          id="email-option"
          className={cn(
            "space-y-4 rounded-2xl border bg-white p-6 shadow-sm transition-all",
            highlightEmail &&
              "border-primary/40 ring-2 ring-primary/60 shadow-md shadow-primary/5"
          )}
        >
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Create account by email
            </p>
            <p className="text-sm text-muted-foreground">
              Use your email address to create a new Trippi account in just a
              few minutes.
            </p>
          </div>

          <SignInForm />
        </section>

        <section className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Quick sign in
            </p>
            <p className="text-sm text-muted-foreground">
              Use a provider you already trust.
            </p>
          </div>

          <div className="space-y-3">
            <GoogleSignInButton />
            <Button
              variant="outline"
              className="w-full justify-center gap-2"
              type="button"
              disabled
            >
              <Image
                src="/icons/facebook.svg"
                alt="Facebook logo"
                width={20}
                height={20}
                aria-hidden="true"
                className="size-5"
              />
              <span>Sign in with Facebook (coming soon)</span>
            </Button>
          </div>
        </section>

        <p className="text-center text-xs text-muted-foreground">
          By continuing you agree to the Trippi Terms of Service and acknowledge
          our Privacy Policy.
        </p>

        <Button variant="link" className="mx-auto w-fit" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </main>
  );
}
