import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const cars = await prisma.car.findMany({
      where: {
        status: 'ACTIVE',
      },
      orderBy: { licensePlate: 'asc' },
    })

    return NextResponse.json(cars)
  } catch (error) {
    console.error('Error fetching cars:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
