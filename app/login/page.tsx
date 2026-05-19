"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Loader2, Music2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import ThemeSelector from "@/components/ThemeSelector";
import { FormInput } from "@/components/FormField";
import { createClient } from "@/lib/supabase/client";
import { friendlyAuthError } from "@/lib/userMessages";

export default function LoginPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    const supabase = createClient();

    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (signUpError) {
        toast.error(friendlyAuthError(signUpError.message));
        return;
      }
      toast.success(
        "Account created! If email confirmation is on, check your inbox, then sign in."
      );
      setMode("signin");
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      toast.error(friendlyAuthError(signInError.message));
      return;
    }

    toast.success("Welcome back!");
    router.push("/dashboard");
    router.refresh();
  }

  const HeroWrap = reduceMotion ? "div" : motion.div;

  return (
    <main className="min-h-screen hero-gradient flex flex-col">
      <header className="flex items-center justify-between p-4 md:p-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2 text-primary">
          <Music2 className="h-8 w-8 animate-float-gentle" />
          <span className="font-bold text-lg hidden sm:inline [font-family:var(--font-jakarta)]">
            Concert Cost Tracker
          </span>
        </div>
        <ThemeSelector />
      </header>

      <section className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          <HeroWrap
            {...(!reduceMotion && {
              initial: { opacity: 0, x: -16 },
              animate: { opacity: 1, x: 0 },
              transition: { duration: 0.4 },
            })}
            className="text-center lg:text-left space-y-4"
          >
            <div className="badge badge-primary badge-outline gap-1">
              <Sparkles className="h-3 w-3" />
              Your concert memories, organized
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight [font-family:var(--font-jakarta)]">
              Concert Cost Tracker
            </h1>
            <p className="text-base sm:text-lg text-base-content/80 max-w-md mx-auto lg:mx-0">
              Log the shows you loved, track what you spent, and see which concerts gave you the
              best bang for your buck.
            </p>
          </HeroWrap>

          <motion.div
            {...(!reduceMotion && {
              initial: { opacity: 0, y: 16 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.4, delay: 0.1 },
            })}
            className="card card-elevated bg-base-100/95 backdrop-blur"
          >
            <div className="card-body">
              <h2 className="card-title text-2xl [font-family:var(--font-jakarta)]">
                {mode === "signin" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="text-sm text-base-content/70 -mt-2">
                {mode === "signin"
                  ? "Sign in to view your dashboard and concerts."
                  : "Sign up to start tracking your concert adventures."}
              </p>

              <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-[5.5rem_1fr] sm:grid-cols-[6rem_1fr] gap-x-4 gap-y-5 items-center">
                  <label htmlFor="email" className="text-sm font-medium text-right">
                    Email
                  </label>
                  <FormInput
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    autoFocus
                  />

                  <label htmlFor="password" className="text-sm font-medium text-right">
                    Password
                  </label>
                  <FormInput
                    id="password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-modern btn-lg w-full gap-2"
                  disabled={loading}
                >
                  {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                  {loading
                    ? "Please wait..."
                    : mode === "signin"
                      ? "Sign in"
                      : "Create account"}
                </button>
              </form>

              <p className="text-center text-sm mt-2">
                {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  className="link link-primary font-medium"
                  onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                >
                  {mode === "signin" ? "Create an account" : "Sign in instead"}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
