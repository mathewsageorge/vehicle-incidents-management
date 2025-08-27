'use client'

import { useState } from 'react'
import { useIncidents, useUpdateIncident } from '@/lib/queries/incidents'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { formatDateTime, getSeverityColor, getStatusColor } from '@/lib/utils'
import { Search, Filter, Eye, Edit } from 'lucide-react'
import Link from 'next/link'

interface IncidentsTableProps {
  showFilters?: boolean
}

export function IncidentsTable({ showFilters = true }: IncidentsTableProps) {
  const [filters, setFilters] = useState({
    query: '',
    status: '',
    severity: '',
    page: 1,
    limit: 10,
  })

  const { data, isLoading } = useIncidents(filters)
  const updateMutation = useUpdateIncident()

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const handleStatusChange = async (incidentId: string, newStatus: string) => {
    try {
      await updateMutation.mutateAsync({
        id: incidentId,
        data: { status: newStatus as any }
      })
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading incidents...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  const incidents = data?.incidents || []
  const pagination = data?.pagination

  return (
    <div className="space-y-4">
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search incidents..."
                  value={filters.query}
                  onChange={(e) => handleFilterChange('query', e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
                <option value="CANCELLED">Cancelled</option>
              </Select>
              <Select
                value={filters.severity}
                onChange={(e) => handleFilterChange('severity', e.target.value)}
              >
                <option value="">All Severities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </Select>
              <Button
                variant="outline"
                onClick={() => setFilters({ query: '', status: '', severity: '', page: 1, limit: 10 })}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="border-b">
                    <th className="text-left p-4">Incident</th>
                    <th className="text-left p-4">Vehicle</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Severity</th>
                    <th className="text-left p-4">Reported</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((incident: any) => (
                    <tr key={incident.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{incident.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {incident.description.length > 50
                              ? `${incident.description.substring(0, 50)}...`
                              : incident.description}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{incident.car?.make} {incident.car?.model}</div>
                          <div className="text-sm text-muted-foreground">{incident.car?.licensePlate}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Select
                          value={incident.status}
                          onChange={(e) => handleStatusChange(incident.id.toString(), e.target.value)}
                          className="w-32"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="RESOLVED">Resolved</option>
                          <option value="CLOSED">Closed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </Select>
                      </td>
                      <td className="p-4">
                        <Badge className={getSeverityColor(incident.severity)}>
                          {incident.severity}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="text-sm">{formatDateTime(incident.reportedAt)}</div>
                          <div className="text-xs text-muted-foreground">
                            by {incident.reportedBy?.name}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/fleetmanager/incidents/${incident.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/fleetmanager/incidents/${incident.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {incidents.map((incident: any) => (
          <Card key={incident.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{incident.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {incident.car?.make} {incident.car?.model} ({incident.car?.licensePlate})
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getSeverityColor(incident.severity)}>
                    {incident.severity}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm mb-3">{incident.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {formatDateTime(incident.reportedAt)} by {incident.reportedBy?.name}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/fleetmanager/incidents/${incident.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/fleetmanager/incidents/${incident.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} incidents
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
