
import { useCallback, useEffect, useState } from 'react';
import {
  approveFaculty,
  getPendingFaculty,
  type AuthUser,
} from '../../services/authApi';

interface FacultyApprovalViewProps {
  accessToken: string;
}

export default function FacultyApprovalView({
  accessToken,
}: FacultyApprovalViewProps) {
  const [faculty, setFaculty] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadFaculty = useCallback(async () => {
    if (!accessToken) {
      setError('Admin authentication is missing. Please log in again.');
      setFaculty([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const pendingFaculty = await getPendingFaculty(accessToken);
      setFaculty(pendingFaculty);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load pending faculty accounts.',
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void loadFaculty();
  }, [loadFaculty]);

  async function handleApprove(userId: number) {
    if (!accessToken || busyId !== null) return;

    setBusyId(userId);
    setError('');
    setSuccess('');

    try {
      const approvedUser = await approveFaculty(userId, accessToken);

      setFaculty((currentFaculty) =>
        currentFaculty.filter((person) => person.id !== approvedUser.id),
      );

      setSuccess(
        `${approvedUser.full_name} has been approved successfully.`,
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to approve this faculty account.',
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Faculty Approvals
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Review verified faculty accounts and approve access to ResolveX.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadFaculty()}
          disabled={loading || busyId !== null}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
        >
          {success}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h3 className="font-semibold text-gray-900">
            Pending requests
          </h3>

          <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
            {faculty.length} pending
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading faculty requests...
          </div>
        ) : faculty.length === 0 && !error ? (
          <div className="p-8 text-center">
            <div className="mb-3 text-3xl" aria-hidden="true">
              ✓
            </div>
            <h4 className="font-semibold text-gray-900">
              All caught up!
            </h4>
            <p className="mt-1 text-sm text-gray-500">
              There are no verified faculty accounts waiting for approval.
            </p>
          </div>
        ) : faculty.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {faculty.map((person) => (
              <article
                key={person.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h4 className="break-words font-semibold text-gray-900">
                    {person.full_name}
                  </h4>

                  <p className="break-all text-sm text-gray-500">
                    {person.email}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                      Email verified
                    </span>

                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                      Awaiting approval
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => void handleApprove(person.id)}
                  disabled={busyId !== null}
                  className="shrink-0 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busyId === person.id
                    ? 'Approving...'
                    : busyId !== null
                      ? 'Please wait...'
                      : 'Approve faculty'}
                </button>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
