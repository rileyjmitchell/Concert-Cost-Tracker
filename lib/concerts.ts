import { createClient } from "@/lib/supabase/server";
import { parseBudget } from "@/lib/budget";
import type { Concert } from "@/lib/types";

export async function getUserConcerts(): Promise<Concert[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("concerts")
    .select("*")
    .order("concert_date", { ascending: false });

  if (error) {
    console.error("Failed to load concerts:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    ...row,
    distance_from_home: Number(row.distance_from_home),
    hours_at_event: Number(row.hours_at_event),
    ticket_cost: Number(row.ticket_cost),
    ticket_fees: Number(row.ticket_fees),
    parking_cost: Number(row.parking_cost),
    food_drink_cost: Number(row.food_drink_cost),
    merchandise_cost: Number(row.merchandise_cost),
    lodging_cost: Number(row.lodging_cost),
    travel_cost: Number(row.travel_cost),
    other_cost: Number(row.other_cost),
    fun_rating: Number(row.fun_rating),
    budget: parseBudget(row.budget),
  }));
}

export async function getConcertById(id: string): Promise<Concert | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("concerts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("Failed to load concert:", error.message);
    return null;
  }

  return {
    ...data,
    distance_from_home: Number(data.distance_from_home),
    hours_at_event: Number(data.hours_at_event),
    ticket_cost: Number(data.ticket_cost),
    ticket_fees: Number(data.ticket_fees),
    parking_cost: Number(data.parking_cost),
    food_drink_cost: Number(data.food_drink_cost),
    merchandise_cost: Number(data.merchandise_cost),
    lodging_cost: Number(data.lodging_cost),
    travel_cost: Number(data.travel_cost),
    other_cost: Number(data.other_cost),
    fun_rating: Number(data.fun_rating),
    budget: parseBudget(data.budget),
  };
}
