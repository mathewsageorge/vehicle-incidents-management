import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create Users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john.doe@fleet.com' },
      update: {},
      create: {
        email: 'john.doe@fleet.com',
        name: 'John Doe',
        role: 'DRIVER',
      },
    }),
    prisma.user.upsert({
      where: { email: 'jane.smith@fleet.com' },
      update: {},
      create: {
        email: 'jane.smith@fleet.com',
        name: 'Jane Smith',
        role: 'FLEET_MANAGER',
      },
    }),
    prisma.user.upsert({
      where: { email: 'mike.wilson@fleet.com' },
      update: {},
      create: {
        email: 'mike.wilson@fleet.com',
        name: 'Mike Wilson',
        role: 'DRIVER',
      },
    }),
    prisma.user.upsert({
      where: { email: 'sarah.johnson@fleet.com' },
      update: {},
      create: {
        email: 'sarah.johnson@fleet.com',
        name: 'Sarah Johnson',
        role: 'ADMIN',
      },
    }),
  ])

  console.log('✅ Created users')

  // Create Cars
  const cars = await Promise.all([
    prisma.car.upsert({
      where: { licensePlate: 'ABC123' },
      update: {},
      create: {
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        licensePlate: 'ABC123',
        vin: '1234567890ABCDEF1',
        color: 'White',
        status: 'ACTIVE',
      },
    }),
    prisma.car.upsert({
      where: { licensePlate: 'XYZ789' },
      update: {},
      create: {
        make: 'Honda',
        model: 'Civic',
        year: 2021,
        licensePlate: 'XYZ789',
        vin: '1234567890ABCDEF2',
        color: 'Blue',
        status: 'ACTIVE',
      },
    }),
    prisma.car.upsert({
      where: { licensePlate: 'DEF456' },
      update: {},
      create: {
        make: 'Ford',
        model: 'F-150',
        year: 2023,
        licensePlate: 'DEF456',
        vin: '1234567890ABCDEF3',
        color: 'Black',
        status: 'ACTIVE',
      },
    }),
    prisma.car.upsert({
      where: { licensePlate: 'GHI789' },
      update: {},
      create: {
        make: 'Chevrolet',
        model: 'Malibu',
        year: 2020,
        licensePlate: 'GHI789',
        vin: '1234567890ABCDEF4',
        color: 'Red',
        status: 'ACTIVE',
      },
    }),
  ])

  console.log('✅ Created cars')

  // Create Sample Incidents
  const incidents = await Promise.all([
    prisma.incident.create({
      data: {
        carId: cars[0].id,
        reportedById: users[0].id,
        assignedToId: users[1].id,
        title: 'Minor Fender Bender',
        description: 'Vehicle was rear-ended while stopped at a traffic light. Minor damage to rear bumper.',
        severity: 'LOW',
        status: 'RESOLVED',
        type: 'ACCIDENT',
        location: '123 Main St, Anytown, ST 12345',
        latitude: 40.7128,
        longitude: -74.0060,
        occurredAt: new Date('2024-01-15T14:30:00Z'),
        estimatedCost: 1200.00,
        actualCost: 1150.00,
        resolutionNotes: 'Bumper replaced, vehicle returned to service.',
        resolvedAt: new Date('2024-01-18T10:00:00Z'),
      },
    }),
    prisma.incident.create({
      data: {
        carId: cars[1].id,
        reportedById: users[2].id,
        assignedToId: users[1].id,
        title: 'Engine Overheating',
        description: 'Engine temperature gauge showed red while driving on highway. Pulled over immediately.',
        severity: 'HIGH',
        status: 'IN_PROGRESS',
        type: 'BREAKDOWN',
        location: 'Highway 101, Mile Marker 45',
        occurredAt: new Date('2024-01-20T16:45:00Z'),
        estimatedCost: 2500.00,
      },
    }),
    prisma.incident.create({
      data: {
        carId: cars[2].id,
        reportedById: users[0].id,
        title: 'Flat Tire',
        description: 'Front right tire went flat during routine delivery. Possible nail puncture.',
        severity: 'MEDIUM',
        status: 'PENDING',
        type: 'BREAKDOWN',
        location: '456 Oak Ave, Somewhere, ST 67890',
        occurredAt: new Date('2024-01-22T09:15:00Z'),
        estimatedCost: 150.00,
      },
    }),
    prisma.incident.create({
      data: {
        carId: cars[3].id,
        reportedById: users[2].id,
        assignedToId: users[3].id,
        title: 'Windshield Crack',
        description: 'Large crack appeared in windshield, possibly from road debris. Affects driver visibility.',
        severity: 'MEDIUM',
        status: 'RESOLVED',
        type: 'MAINTENANCE_ISSUE',
        location: 'Company Parking Lot',
        occurredAt: new Date('2024-01-18T08:00:00Z'),
        estimatedCost: 300.00,
        actualCost: 275.00,
        resolutionNotes: 'Windshield replaced by approved vendor.',
        resolvedAt: new Date('2024-01-19T15:30:00Z'),
      },
    }),
    prisma.incident.create({
      data: {
        carId: cars[0].id,
        reportedById: users[0].id,
        title: 'Parking Lot Scratch',
        description: 'Deep scratch on passenger side door, likely from shopping cart or another vehicle.',
        severity: 'LOW',
        status: 'PENDING',
        type: 'VANDALISM',
        location: 'Walmart Parking Lot, 789 Store Blvd',
        occurredAt: new Date('2024-01-23T12:30:00Z'),
        estimatedCost: 400.00,
      },
    }),
  ])

  console.log('✅ Created incidents')

  // Create some incident updates
  await Promise.all([
    prisma.incidentUpdate.create({
      data: {
        incidentId: incidents[1].id,
        userId: users[1].id,
        message: 'Assigned to mechanic shop for diagnosis. Waiting for availability.',
        updateType: 'COMMENT',
      },
    }),
    prisma.incidentUpdate.create({
      data: {
        incidentId: incidents[1].id,
        userId: users[1].id,
        message: 'Towed to repair facility. Initial diagnosis suggests water pump failure.',
        updateType: 'COMMENT',
      },
    }),
    prisma.incidentUpdate.create({
      data: {
        incidentId: incidents[2].id,
        userId: users[1].id,
        message: 'Driver has been provided with spare vehicle. Tire replacement scheduled.',
        updateType: 'COMMENT',
      },
    }),
  ])

  console.log('✅ Created incident updates')
  console.log('🌱 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
