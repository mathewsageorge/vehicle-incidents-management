import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get total incidents
    const total = await prisma.incident.count()

    // Get incidents by status
    const statusCounts = await prisma.incident.groupBy({
      by: ['status'],
      _count: { status: true },
    })

    const byStatus = statusCounts.reduce((acc, item) => {
      acc[item.status] = item._count.status
      return acc
    }, {} as Record<string, number>)

    // Get incidents by severity
    const severityCounts = await prisma.incident.groupBy({
      by: ['severity'],
      _count: { severity: true },
    })

    const bySeverity = severityCounts.reduce((acc, item) => {
      acc[item.severity] = item._count.severity
      return acc
    }, {} as Record<string, number>)

    // Get open incidents count
    const openIncidents = await prisma.incident.count({
      where: {
        status: {
          in: ['PENDING', 'IN_PROGRESS'],
        },
      },
    })

    // Calculate average resolution time (for resolved incidents)
    const resolvedIncidents = await prisma.incident.findMany({
      where: {
        status: 'RESOLVED',
        resolvedAt: { not: null },
      },
      select: {
        reportedAt: true,
        resolvedAt: true,
      },
    })

    let avgResolutionTime = 0
    if (resolvedIncidents.length > 0) {
      const totalTime = resolvedIncidents.reduce((sum, incident) => {
        const reported = new Date(incident.reportedAt)
        const resolved = new Date(incident.resolvedAt!)
        return sum + (resolved.getTime() - reported.getTime())
      }, 0)
      
      avgResolutionTime = Math.round(totalTime / resolvedIncidents.length / (1000 * 60 * 60)) // in hours
    }

    const stats = {
      total,
      byStatus,
      bySeverity,
      avgResolutionTime,
      openIncidents,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching incident stats:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
