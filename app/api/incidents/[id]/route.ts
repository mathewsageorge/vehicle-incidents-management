import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateIncidentSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED']).optional(),
  assignedToId: z.number().nullable().optional(),
  resolutionNotes: z.string().optional(),
  estimatedCost: z.number().optional(),
  actualCost: z.number().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const incident = await prisma.incident.findUnique({
      where: { id: parseInt(resolvedParams.id) },
      include: {
        car: true,
        reportedBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
        carReading: true,
        updates: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!incident) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 })
    }

    return NextResponse.json(incident)
  } catch (error) {
    console.error('Error fetching incident:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const body = await request.json()
    const validatedData = updateIncidentSchema.parse(body)

    // Check if incident exists
    const existingIncident = await prisma.incident.findUnique({
      where: { id: parseInt(resolvedParams.id) },
    })

    if (!existingIncident) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 })
    }

    // Update incident
    const updatedIncident = await prisma.incident.update({
      where: { id: parseInt(resolvedParams.id) },
      data: {
        ...validatedData,
        resolvedAt: validatedData.status === 'RESOLVED' ? new Date() : undefined,
      },
      include: {
        car: true,
        reportedBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    })

    // Create update record for status changes
    if (validatedData.status && validatedData.status !== existingIncident.status) {
      await prisma.incidentUpdate.create({
        data: {
          incidentId: parseInt(resolvedParams.id),
          userId: 1, // TODO: Get from session
          message: `Status changed from ${existingIncident.status} to ${validatedData.status}`,
          updateType: 'STATUS_CHANGE',
        },
      })
    }

    return NextResponse.json(updatedIncident)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 })
    }
    console.error('Error updating incident:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
