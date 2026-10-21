"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import * as Yup from "yup";

const validationSchema = Yup.object({
  username: Yup.string().trim().required("Enter your username."),
  password: Yup.string()
    .required("Enter your password.")
    .min(6, "Password must be at least 6 characters long."),
});

export default function LoginPage() {
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  async function submitPage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const values = {
      username: String(formData.get("username") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    try {
      await validationSchema.validate(values, { abortEarly: false });
      setErrors({});

      const result = await signIn("credentials", {
        username: values.username,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setMessage("Invalid username or password.");
        return;
      }

      window.location.href = "/";
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const nextErrors: { username?: string; password?: string } = {};
        error.inner.forEach((item) => {
          if (item.path && !nextErrors[item.path as keyof typeof nextErrors]) {
            nextErrors[item.path as keyof typeof nextErrors] = item.message;
          }
        });
        setErrors(nextErrors);
        setMessage("");
      }
    }
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[var(--background)] px-6 py-12 font-sans">
      <section className="w-full max-w-md rounded-lg border border-emerald-950/10 bg-white p-8 shadow-xl shadow-emerald-950/5 sm:p-10">
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-800">
            Notebook
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-emerald-950">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to continue to your workspace.
          </p>
        </div>

        <form className="space-y-5" onSubmit={submitPage} noValidate>
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-800">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
            />
            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-800">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-slate-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
          >
            Continue
          </button>
          {message && (
            <p className="text-sm text-amber-800" role="status" aria-live="polite">
              {message}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}
