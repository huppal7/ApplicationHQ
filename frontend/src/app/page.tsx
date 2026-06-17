export default function Home() {
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
        <p className="text-sm text-zinc-500 dark:text-zinc-500">
          Edit{" "}
          <code className="rounded bg-black/[.06] px-1.5 py-0.5 font-mono text-xs dark:bg-white/[.08]">
            src/app/page.tsx
          </code>{" "}
          to begin.
        </p>
      </main>
    </div>
  );
}
