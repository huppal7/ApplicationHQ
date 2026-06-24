export interface Application {
  id: number;
  company: string;
  role: string;
  status: string;
  dateApplied: string | null;
  source: string;
  notes: string;
}

export type NewApplication = Omit<Application, "id">;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

const APPLICATIONS_URL = `${API_BASE_URL}/api/applications`;

export async function getApplications(): Promise<Application[]> {
  const res = await fetch(APPLICATIONS_URL, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to load applications (HTTP ${res.status})`);
  }
  return res.json();
}

export async function createApplication(
  application: NewApplication,
): Promise<Application> {
  const res = await fetch(APPLICATIONS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(application),
  });
  if (!res.ok) {
    throw new Error(`Failed to create application (HTTP ${res.status})`);
  }
  return res.json();
}
