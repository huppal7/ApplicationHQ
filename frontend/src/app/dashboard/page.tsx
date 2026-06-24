"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Application,
  NewApplication,
  createApplication,
  getApplications,
} from "@/lib/api";

const EMPTY_FORM: NewApplication = {
  company: "",
  role: "",
  status: "APPLIED",
  dateApplied: "",
  source: "",
  notes: "",
};

const STATUS_OPTIONS = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];

export default function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<NewApplication>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getApplications();
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  function updateField<K extends keyof NewApplication>(
    field: K,
    value: NewApplication[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      await createApplication({
        ...form,
        dateApplied: form.dateApplied ? form.dateApplied : null,
      });
      setForm(EMPTY_FORM);
      await loadApplications();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to add application.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Application Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Track your job applications.
        </p>
      </header>

      <section className="mb-10 rounded-lg border border-black/[.08] p-5 dark:border-white/[.145]">
        <h2 className="mb-4 text-lg font-medium">Add an application</h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <Field label="Company" required>
            <input
              type="text"
              required
              value={form.company}
              onChange={(e) => updateField("company", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Role" required>
            <input
              type="text"
              required
              value={form.role}
              onChange={(e) => updateField("role", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
              className="input"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Date Applied">
            <input
              type="date"
              value={form.dateApplied ?? ""}
              onChange={(e) => updateField("dateApplied", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Source">
            <input
              type="text"
              value={form.source}
              onChange={(e) => updateField("source", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Notes">
            <input
              type="text"
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              className="input"
            />
          </Field>

          <div className="sm:col-span-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? "Adding..." : "Add application"}
            </button>
            {submitError && (
              <span className="text-sm text-red-600">{submitError}</span>
            )}
          </div>
        </form>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium">Applications</h2>
          <button
            onClick={loadApplications}
            className="text-sm text-zinc-500 underline-offset-2 hover:underline"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="py-8 text-center text-sm text-zinc-500">Loading...</p>
        ) : error ? (
          <div className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/30">
            <p className="font-medium">Could not load applications.</p>
            <p className="mt-1">{error}</p>
            <button
              onClick={loadApplications}
              className="mt-3 rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/40"
            >
              Try again
            </button>
          </div>
        ) : applications.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500">
            No applications yet. Add your first one above.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-black/[.08] dark:border-white/[.145]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-black/[.08] bg-black/[.02] dark:border-white/[.145] dark:bg-white/[.04]">
                <tr>
                  <Th>Company</Th>
                  <Th>Role</Th>
                  <Th>Status</Th>
                  <Th>Date Applied</Th>
                  <Th>Source</Th>
                  <Th>Notes</Th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-black/[.05] last:border-0 dark:border-white/[.08]"
                  >
                    <Td>{app.company}</Td>
                    <Td>{app.role}</Td>
                    <Td>{app.status}</Td>
                    <Td>{app.dateApplied ?? "-"}</Td>
                    <Td>{app.source || "-"}</Td>
                    <Td>{app.notes || "-"}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 align-top">{children}</td>;
}
