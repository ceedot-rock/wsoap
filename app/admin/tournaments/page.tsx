import Link from 'next/link';
import { createServiceRoleClient } from '@/lib/supabase/server';
import CreateTournamentButton from '@/components/admin/CreateTournamentButton';

export default async function AdminTournamentsPage() {
  const supabase = createServiceRoleClient();
  const { data: tournaments } = await supabase
    .from('tournaments')
    .select('id, status, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div>
      <h1>Admin · Tournaments</h1>
      <div className="panel" style={{ marginBottom: 24 }}>
        <CreateTournamentButton />
      </div>
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Created</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {(tournaments ?? []).map((t) => (
            <tr key={t.id}>
              <td>{t.status}</td>
              <td>{new Date(t.created_at).toLocaleString()}</td>
              <td>
                <Link className="button" href={`/admin/tournaments/${t.id}`}>
                  Manage
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
