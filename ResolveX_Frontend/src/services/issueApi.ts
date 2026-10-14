const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export interface CreateIssuePayload {
  title: string;
  description: string;
  category: string;
  location: string;
}

export interface ApiIssue {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  priority: string;
  status: string;
  predicted_category: string | null;
  created_at: string;
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `ResolveX API error (${response.status}): ${message}`
    );
  }

  return response.json() as Promise<T>;
}

export async function createIssue(
  payload: CreateIssuePayload
): Promise<ApiIssue> {
  const response = await fetch(`${API_BASE_URL}/api/issues`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<ApiIssue>(response);
}

export async function getIssues(): Promise<ApiIssue[]> {
  const response = await fetch(`${API_BASE_URL}/api/issues`, {
    headers: {
      Accept: "application/json",
    },
  });

  return parseResponse<ApiIssue[]>(response);
}

export async function updateIssueStatus(
  issueId: number,
  status: string
): Promise<ApiIssue> {
  const response = await fetch(
    `${API_BASE_URL}/api/issues/${issueId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  return parseResponse<ApiIssue>(response);
}
