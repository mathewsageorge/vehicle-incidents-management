import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createUpdateSchema = z.object({
  message: z.string().min(1),
  updateType: z.enum(['STATUS_CHANGE', 'ASSIGNMENT', 'COMMENT', 'COST_UPDATE', 'RESOLUTION']),
  userId: z.number().optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  try {
    const body = await request.json()
    const validatedData = createUpdateSchema.parse(body)

    // Check if incident exists
    const incident = await prisma.incident.findUnique({
      where: { id: parseInt(resolvedParams.id) },
    })

    if (!incident) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 })
    }

    // Create update
    const update = await prisma.incidentUpdate.create({
      data: {
        incidentId: parseInt(resolvedParams.id),
        userId: validatedData.userId || 1, // TODO: Get from session
        message: validatedData.message,
        updateType: validatedData.updateType,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json(update, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 })
    }
    console.error('Error creating incident update:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
