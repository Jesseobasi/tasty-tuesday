'use client';

import { useMemo, useState } from 'react';
import { AdminRoute } from '../../../components/layout/AdminRoute';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useFormResponses } from '../../../hooks/useFormResponses';

type FilterFn = (row: Record<string, string>) => boolean;

export default function AdminFormsPage() {
  const { data, isLoading, error, refetch, isRefetching } = useFormResponses();
  const [query, setQuery] = useState('');

  const filter: FilterFn = useMemo(() => {
    if (!query.trim()) return () => true;
    const q = query.toLowerCase();
    return (row) => Object.values(row).some((v) => v.toLowerCase().includes(q));
  }, [query]);

  const filtered = (data ?? []).filter(filter);
  const headers = data && data[0] ? Object.keys(data[0]) : [];

  return (
    <AdminRoute>
      <div className="container-responsive space-y-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Forms</p>
            <h1 className="text-3xl font-bold text-offwhite">Google Form responses</h1>
            <p className="text-sm text-neutral-400">Live data from your Google Sheet.</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              className="w-56 rounded-full border border-neutral-800 bg-[#0f1626] px-4 py-2 text-sm text-offwhite placeholder:text-neutral-500 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Search responses"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="secondary" onClick={() => refetch()} loading={isRefetching}>
              Refresh
            </Button>
          </div>
        </div>

        {isLoading && (
          <Card className="space-y-3 p-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
          </Card>
        )}

        {error && (
          <Card className="space-y-2 p-6">
            <p className="text-sm text-red-400">Failed to load responses: {(error as Error).message}</p>
          </Card>
        )}

        {!isLoading && !error && (
          <Card className="overflow-auto p-0">
            <div className="min-w-full overflow-auto">
              <table className="min-w-full text-sm text-offwhite">
                <thead className="sticky top-0 bg-[#0f1626]">
                  <tr>
                    {headers.map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-neutral-300">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, idx) => (
                    <tr key={idx} className="odd:bg-transparent even:bg-[#0d121f]">
                      {headers.map((h) => (
                        <td key={h} className="px-4 py-2 text-neutral-200 align-top">
                          {row[h]}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td className="px-4 py-4 text-neutral-400" colSpan={headers.length || 1}>
                        No responses match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </AdminRoute>
  );
}
