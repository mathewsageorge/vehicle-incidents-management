import { IncidentStats } from '@/components/incidents/incident-stats'

export default function IncidentStatsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Incidents Analytics</h2>
        <p className="text-muted-foreground">
          Comprehensive analytics and insights for vehicle incidents.
        </p>
      </div>

      <IncidentStats />
    </div>
  )
}
