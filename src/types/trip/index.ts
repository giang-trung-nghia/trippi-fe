export type CreateTripPayload = {
  name: string
  startDate: string
  endDate: string
  partnerEmail?: string
}

export type Trip = {
  id: string
  name: string
  startDate: string
  endDate: string
  partnerEmail?: string
  createdAt?: string
  updatedAt?: string
}

