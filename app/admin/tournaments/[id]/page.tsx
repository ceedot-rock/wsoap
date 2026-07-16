import { notFound } from 'next/navigation';
import { createServiceRoleClient } from '@/lib/supabase/server';
import StartTournamentButton from '@/components/admin/StartTournamentButton';

export default async function AdminTournamentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceRoleClient();

  const { data: tournament } = await supabase.from('tournaments').select('*').eq('id', id).maybeSingle();
  if (!tournament) notFound();

  const { count: entryCount } = await supabase
    .from('tournament_entries')
    .select('id', { count: 'exact', head: true })
    .eq('tournament_id', id);

  const { data: payout } = await supabase.from('payouts').select('*').eq('tournament_id', id).maybeSingle();

  return (
    <div>
      <h1>Admin · Tournament</h1>
      <div className="panel" style={{ marginBottom: 24 }}>
        <p>Status: {tournament.status}</p>
        <p>Entrants: {entryCount ?? 0} / {tournament.max_entrants}</p>
        <p>Pot snapshot: ${((tournament.pot_snapshot_cents ?? 0) / 100).toFixed(2)}</p>
        {tournament.workflow_run_id && <p>Workflow run: {tournament.workflow_run_id}</p>}
      </div>

      {(tournament.status === 'scheduled' || tournament.status === 'registration_open') && (
        <div className="panel" style={{ marginBottom: 24 }}>
          <StartTournamentButton tournamentId={id} />
        </div>
      )}

      {tournament.status === 'completed' && !payout && (
        <div className="panel" style={{ borderColor: 'var(--danger)' }}>
          <p>
            Completed with no payout recorded yet — the winner&apos;s owner hasn&apos;t selected a charity. Follow up
            manually if this persists.
          </p>
        </div>
      )}

      {payout && (
        <div className="panel">
          <p>
            Payout: ${(payout.amount_cents / 100).toFixed(2)} to charity {payout.charity_id} · status {payout.status}
          </p>
        </div>
      )}
    </div>
  );
}
