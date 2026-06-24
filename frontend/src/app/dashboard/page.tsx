"use client";

import { UserButton } from "@clerk/nextjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Application,
  NewApplication,
  createApplication,
  deleteApplication,
  getApplications,
  updateApplication,
} from "@/lib/api";

const EMPTY_FORM: NewApplication = {
  company: "",
  role: "",
  status: "APPLIED",
  dateApplied: "",
  source: "",
  notes: "",
};

const STATUS_OPTIONS = ["APPLIED", "OA", "INTERVIEW", "OFFER", "REJECTED"];
const STATUS_FILTER_OPTIONS = ["ALL", ...STATUS_OPTIONS];

export default function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<NewApplication>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<NewApplication>(EMPTY_FORM);
  const [rowActionId, setRowActionId] = useState<number | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const metrics = useMemo(() => {
    const counts = applications.reduce(
      (acc, application) => {
        const status = application.status.trim().toUpperCase();
        if (status === "APPLIED") {
          acc.applied += 1;
        } else if (status === "OA") {
          acc.oa += 1;
        } else if (status === "INTERVIEW") {
          acc.interview += 1;
        } else if (status === "OFFER") {
          acc.offer += 1;
        } else if (status === "REJECTED") {
          acc.rejected += 1;
        }
        return acc;
      },
      {
        total: applications.length,
        applied: 0,
        oa: 0,
        interview: 0,
        offer: 0,
        rejected: 0,
      },
    );

    return [
      { label: "Total Applications", value: counts.total },
      { label: "Applied", value: counts.applied },
      { label: "OA", value: counts.oa },
      { label: "Interview", value: counts.interview },
      { label: "Offer", value: counts.offer },
      { label: "Rejected", value: counts.rejected },
    ];
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return applications.filter((application) => {
      const normalizedStatus = application.status.trim().toUpperCase();
      const matchesStatus =
        statusFilter === "ALL" || normalizedStatus === statusFilter;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        [application.company, application.role, application.notes].some(
          (value) => value.toLowerCase().includes(normalizedQuery),
        );

      return matchesStatus && matchesSearch;
    });
  }, [applications, searchQuery, statusFilter]);

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
    let ignore = false;

    getApplications()
      .then((data) => {
        if (!ignore) {
          setApplications(data);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Something went wrong.");
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  function updateField<K extends keyof NewApplication>(
    field: K,
    value: NewApplication[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateEditField<K extends keyof NewApplication>(
    field: K,
    value: NewApplication[K],
  ) {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  }

  function startEditing(application: Application) {
    setRowError(null);
    setEditingId(application.id);
    setEditForm({
      company: application.company,
      role: application.role,
      status: application.status,
      dateApplied: application.dateApplied ?? "",
      source: application.source,
      notes: application.notes,
    });
  }

  function cancelEditing() {
    setEditingId(null);
    setEditForm(EMPTY_FORM);
  }

  async function handleSave(id: number) {
    setRowActionId(id);
    setRowError(null);
    try {
      await updateApplication(id, {
        ...editForm,
        dateApplied: editForm.dateApplied ? editForm.dateApplied : null,
      });
      cancelEditing();
      await loadApplications();
    } catch (err) {
      setRowError(
        err instanceof Error ? err.message : "Failed to update application.",
      );
    } finally {
      setRowActionId(null);
    }
  }

  async function handleDelete(application: Application) {
    const confirmed = window.confirm(
      `Delete the application for ${application.role} at ${application.company}?`,
    );
    if (!confirmed) {
      return;
    }

    setRowActionId(application.id);
    setRowError(null);
    try {
      await deleteApplication(application.id);
      if (editingId === application.id) {
        cancelEditing();
      }
      await loadApplications();
    } catch (err) {
      setRowError(
        err instanceof Error ? err.message : "Failed to delete application.",
      );
    } finally {
      setRowActionId(null);
    }
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
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Application Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Track your job applications.
          </p>
        </div>
        <UserButton />
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

      <section className="mb-10">
        <div className="mb-3">
          <h2 className="text-lg font-medium">Summary</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Current pipeline totals from your application list.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
            />
          ))}
        </div>
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
        <div className="mb-4 grid grid-cols-1 gap-3 rounded-lg border border-black/[.08] p-4 dark:border-white/[.145] sm:grid-cols-[1fr_220px]">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Search</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company, role, or notes..."
              className="input"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              {STATUS_FILTER_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {formatStatus(option)}
                </option>
              ))}
            </select>
          </label>
        </div>
        {rowError && (
          <div className="mb-3 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30">
            {rowError}
          </div>
        )}

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
        ) : filteredApplications.length === 0 ? (
          <div className="rounded-lg border border-dashed border-black/[.15] p-8 text-center dark:border-white/[.2]">
            <p className="font-medium">No matching applications found.</p>
            <p className="mt-1 text-sm text-zinc-500">
              Try a different search term or status filter.
            </p>
          </div>
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
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => {
                  const isEditing = editingId === app.id;
                  const isWorking = rowActionId === app.id;

                  return (
                    <tr
                      key={app.id}
                      className="border-b border-black/[.05] last:border-0 dark:border-white/[.08]"
                    >
                      {isEditing ? (
                        <>
                          <Td>
                            <input
                              type="text"
                              required
                              value={editForm.company}
                              onChange={(e) =>
                                updateEditField("company", e.target.value)
                              }
                              className="input"
                            />
                          </Td>
                          <Td>
                            <input
                              type="text"
                              required
                              value={editForm.role}
                              onChange={(e) =>
                                updateEditField("role", e.target.value)
                              }
                              className="input"
                            />
                          </Td>
                          <Td>
                            <select
                              value={editForm.status}
                              onChange={(e) =>
                                updateEditField("status", e.target.value)
                              }
                              className="input"
                            >
                              {STATUS_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </Td>
                          <Td>
                            <input
                              type="date"
                              value={editForm.dateApplied ?? ""}
                              onChange={(e) =>
                                updateEditField("dateApplied", e.target.value)
                              }
                              className="input"
                            />
                          </Td>
                          <Td>
                            <input
                              type="text"
                              value={editForm.source}
                              onChange={(e) =>
                                updateEditField("source", e.target.value)
                              }
                              className="input"
                            />
                          </Td>
                          <Td>
                            <input
                              type="text"
                              value={editForm.notes}
                              onChange={(e) =>
                                updateEditField("notes", e.target.value)
                              }
                              className="input"
                            />
                          </Td>
                          <Td>
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => handleSave(app.id)}
                                disabled={
                                  isWorking ||
                                  !editForm.company.trim() ||
                                  !editForm.role.trim()
                                }
                                className="rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-colors hover:opacity-90 disabled:opacity-50"
                              >
                                {isWorking ? "Saving..." : "Save"}
                              </button>
                              <button
                                type="button"
                                onClick={cancelEditing}
                                disabled={isWorking}
                                className="rounded-md border border-black/[.15] px-3 py-1.5 text-xs font-medium hover:bg-black/[.04] disabled:opacity-50 dark:border-white/[.2] dark:hover:bg-white/[.08]"
                              >
                                Cancel
                              </button>
                            </div>
                          </Td>
                        </>
                      ) : (
                        <>
                          <Td>{app.company}</Td>
                          <Td>{app.role}</Td>
                          <Td>{app.status}</Td>
                          <Td>{app.dateApplied ?? "-"}</Td>
                          <Td>{app.source || "-"}</Td>
                          <Td>{app.notes || "-"}</Td>
                          <Td>
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => startEditing(app)}
                                disabled={isWorking}
                                className="rounded-md border border-black/[.15] px-3 py-1.5 text-xs font-medium hover:bg-black/[.04] disabled:opacity-50 dark:border-white/[.2] dark:hover:bg-white/[.08]"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(app)}
                                disabled={isWorking}
                                className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950/30"
                              >
                                {isWorking ? "Deleting..." : "Delete"}
                              </button>
                            </div>
                          </Td>
                        </>
                      )}
                    </tr>
                  );
                })}
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

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-black/[.08] bg-black/[.02] p-4 dark:border-white/[.145] dark:bg-white/[.04]">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function formatStatus(status: string) {
  if (status === "ALL") {
    return "All";
  }
  if (status === "OA") {
    return "OA";
  }
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-medium text-zinc-600 dark:text-zinc-300">{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 align-top">{children}</td>;
}
