import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createIncidentSchema = z.object({
  carId: z.number(),
  reportedById: z.number(),
  title: z.string().min(1),
  description: z.string().min(1),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  type: z.enum(['ACCIDENT', 'BREAKDOWN', 'THEFT', 'VANDALISM', 'MAINTENANCE_ISSUE', 'TRAFFIC_VIOLATION', 'FUEL_ISSUE', 'OTHER']),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  occurredAt: z.string(),
  images: z.array(z.string()).optional(),
  estimatedCost: z.number().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const severity = searchParams.get('severity')
    const carId = searchParams.get('carId')
    const assignedToId = searchParams.get('assignedToId')
    const query = searchParams.get('query')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const skip = (page - 1) * limit

    const where: any = {}

    if (status) where.status = status
    if (severity) where.severity = severity
    if (carId) where.carId = parseInt(carId)
    if (assignedToId) where.assignedToId = parseInt(assignedToId)
    
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } },
      ]
    }

    if (startDate || endDate) {
      where.occurredAt = {}
      if (startDate) where.occurredAt.gte = new Date(startDate)
      if (endDate) where.occurredAt.lte = new Date(endDate)
    }

    const [incidents, total] = await Promise.all([
      prisma.incident.findMany({
        where,
        include: {
          car: true,
          reportedBy: { select: { id: true, name: true, email: true } },
          assignedTo: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.incident.count({ where }),
    ])

    return NextResponse.json({
      incidents,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching incidents:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createIncidentSchema.parse(body)

    const incident = await prisma.incident.create({
      data: {
        ...validatedData,
        occurredAt: new Date(validatedData.occurredAt),
        images: validatedData.images || [],
      },
      include: {
        car: true,
        reportedBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json(incident, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 })
    }
    console.error('Error creating incident:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
