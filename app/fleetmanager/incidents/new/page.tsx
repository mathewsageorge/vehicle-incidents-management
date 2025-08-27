import { IncidentForm } from '@/components/incidents/incident-form'

export default function NewIncidentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Create New Incident</h2>
        <p className="text-muted-foreground">
          Report a new vehicle incident with all relevant details.
        </p>
      </div>

      <IncidentForm />
    </div>
  )
}
