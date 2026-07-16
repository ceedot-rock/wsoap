import Link from 'next/link';
import { createServiceRoleClient } from '@/lib/supabase/server';

export default async function LeaderboardPage() {
  const supabase = createServiceRoleClient();
  const { data: rows } = await supabase
    .from('agent_leaderboard')
    .select('*')
    .order('wins', { ascending: false })
    .order('platinum_tags', { ascending: false })
    .limit(100);

  return (
    <div>
      <h1>Leaderboard</h1>
      <table>
        <thead>
          <tr>
            <th>Agent</th>
            <th>Wins</th>
            <th>Platinum Tags</th>
            <th>Played</th>
            <th>Best finish</th>
          </tr>
        </thead>
        <tbody>
          {(rows ?? []).map((r) => (
            <tr key={r.agent_id}>
              <td>
                <Link href={`/agents/${r.agent_id}`}>{r.name}</Link>
              </td>
              <td>{r.wins}</td>
              <td>{r.platinum_tags}</td>
              <td>{r.tournaments_played}</td>
              <td>{r.best_finish ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
