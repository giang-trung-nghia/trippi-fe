import { httpClient } from "@/configs/axios"
import type { CreateTripPayload, Trip } from "@/types/trip"


export async function createTrip(payload: CreateTripPayload): Promise<Trip> {
  const response = await httpClient.post("trips", payload)
  const data = response.data?.trip ?? response.data

  return data as Trip
}


