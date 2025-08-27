export const queryKeys = {
  incidents: {
    all: ['incidents'] as const,
    lists: () => [...queryKeys.incidents.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.incidents.lists(), filters] as const,
    details: () => [...queryKeys.incidents.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.incidents.details(), id] as const,
    stats: () => [...queryKeys.incidents.all, 'stats'] as const,
  },
  cars: {
    all: ['cars'] as const,
    lists: () => [...queryKeys.cars.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.cars.lists(), filters] as const,
  },
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.users.lists(), filters] as const,
  },
}
