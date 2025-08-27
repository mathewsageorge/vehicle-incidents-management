import { IncidentsTable } from '@/components/incidents/incidents-table'
import { IncidentStats } from '@/components/incidents/incident-stats'

export default function IncidentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Incidents Dashboard</h2>
        <p className="text-muted-foreground">
          Monitor and manage vehicle incidents across your fleet.
        </p>
      </div>

      <IncidentStats />
      <IncidentsTable />
    </div>
  )
}
