'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Car, AlertTriangle, BarChart3, Plus } from 'lucide-react'
import { Providers } from '../providers'

const navigation = [
  {
    name: 'Incidents',
    href: '/fleetmanager/incidents',
    icon: AlertTriangle,
  },
  {
    name: 'Analytics',
    href: '/fleetmanager/incidents/stats',
    icon: BarChart3,
  },
]

export default function FleetManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <Providers>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Car className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">Fleet Manager</h1>
              </div>
              <Button asChild>
                <Link href="/fleetmanager/incidents/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Incident
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Sidebar */}
            <aside className="w-64 space-y-2">
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </div>
    </Providers>
  )
}
