import {
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-24 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col items-center gap-6 text-center">
        <span className="rounded-full border border-black/[.08] px-4 py-1 text-sm font-medium text-zinc-600 dark:border-white/[.145] dark:text-zinc-400">
          Project scaffold
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-5xl">
          ApplicationHQ
        </h1>
        <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Track your job applications in one place. This is the starting point
          for the frontend &mdash; built with Next.js, TypeScript, and Tailwind
          CSS.
        </p>
        {!userId ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <SignInButton mode="modal">
              <button className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:opacity-90">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="rounded-md border border-black/[.15] px-5 py-2.5 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.2] dark:hover:bg-white/[.08]">
                Sign up
              </button>
            </SignUpButton>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <a
              href="/dashboard"
              className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:opacity-90"
            >
              Go to dashboard
            </a>
            <UserButton />
          </div>
        )}
      </main>
    </div>
  );
}
