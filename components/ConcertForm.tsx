"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import FunRatingPicker from "@/components/FunRatingPicker";
import { FormField, FormInput, FormTextarea } from "@/components/FormField";
import { Shimmer } from "@/components/Shimmer";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, totalCost } from "@/lib/calculations";
import { friendlyDbError } from "@/lib/userMessages";
import type { ConcertCosts } from "@/lib/types";

const emptyCosts: ConcertCosts = {
  ticket_cost: 0,
  ticket_fees: 0,
  parking_cost: 0,
  food_drink_cost: 0,
  merchandise_cost: 0,
  lodging_cost: 0,
  travel_cost: 0,
  other_cost: 0,
};

const initialForm = {
  concert_name: "",
  artist: "",
  venue: "",
  city: "",
  state: "",
  concert_date: "",
  distance_from_home: "0",
  hours_at_event: "3",
  notes: "",
  fun_rating: 7,
  ...emptyCosts,
};

export default function ConcertForm() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState({ ...initialForm });
  const [loading, setLoading] = useState(false);

  const liveTotal = useMemo(() => totalCost(form), [form]);

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    const hours = Number(form.hours_at_event);
    if (!hours || hours <= 0) {
      toast.error("Please enter hours at the event (greater than 0).");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please sign in to save a concert.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("concerts").insert({
      user_id: user.id,
      concert_name: form.concert_name.trim(),
      artist: form.artist.trim(),
      venue: form.venue.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      concert_date: form.concert_date,
      distance_from_home: Number(form.distance_from_home) || 0,
      hours_at_event: hours,
      ticket_cost: Number(form.ticket_cost) || 0,
      ticket_fees: Number(form.ticket_fees) || 0,
      parking_cost: Number(form.parking_cost) || 0,
      food_drink_cost: Number(form.food_drink_cost) || 0,
      merchandise_cost: Number(form.merchandise_cost) || 0,
      lodging_cost: Number(form.lodging_cost) || 0,
      travel_cost: Number(form.travel_cost) || 0,
      other_cost: Number(form.other_cost) || 0,
      fun_rating: form.fun_rating,
      notes: form.notes.trim() || null,
    });

    setLoading(false);

    if (insertError) {
      toast.error(friendlyDbError(insertError.message));
      return;
    }

    toast.success("Concert saved! Check your dashboard and My Concerts.");
    setForm({ ...initialForm });
    router.refresh();
  }

  const TotalDisplay = reduceMotion ? "div" : motion.div;

  return (
    <form onSubmit={handleSubmit} className="section-gap max-w-4xl mx-auto">
      <section className="card card-elevated">
        <div className="card-body">
          <h2 className="card-title [font-family:var(--font-jakarta)]">Concert details</h2>
          <p className="text-sm text-base-content/70 -mt-2">
            Tell us about the show — who, where, and when.
          </p>
          <div className="grid md:grid-cols-2 gap-5 mt-4">
            <FormField label="Concert name" required>
              <FormInput
                value={form.concert_name}
                onChange={(e) => updateField("concert_name", e.target.value)}
                required
              />
            </FormField>
            <FormField label="Artist or band" required>
              <FormInput
                value={form.artist}
                onChange={(e) => updateField("artist", e.target.value)}
                required
              />
            </FormField>
            <FormField label="Venue" required>
              <FormInput
                value={form.venue}
                onChange={(e) => updateField("venue", e.target.value)}
                required
              />
            </FormField>
            <FormField label="City" required>
              <FormInput
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                required
              />
            </FormField>
            <FormField label="State" required>
              <FormInput
                value={form.state}
                onChange={(e) => updateField("state", e.target.value)}
                required
              />
            </FormField>
            <FormField label="Concert date" required>
              <FormInput
                type="date"
                value={form.concert_date}
                onChange={(e) => updateField("concert_date", e.target.value)}
                required
              />
            </FormField>
            <FormField label="Distance from home (miles)" hint="How far you traveled.">
              <FormInput
                type="number"
                min="0"
                step="0.1"
                value={form.distance_from_home}
                onChange={(e) => updateField("distance_from_home", e.target.value)}
              />
            </FormField>
            <FormField label="Hours at the event" hint="Used for cost per hour." required>
              <FormInput
                type="number"
                min="0.5"
                step="0.5"
                value={form.hours_at_event}
                onChange={(e) => updateField("hours_at_event", e.target.value)}
                required
              />
            </FormField>
            <FormField label="Notes" className="md:col-span-2">
              <FormTextarea
                rows={3}
                placeholder="Memories, opening acts, surprises..."
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
              />
            </FormField>
          </div>
        </div>
      </section>

      <section className="card card-elevated">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="card-title [font-family:var(--font-jakarta)]">Costs</h2>
              <p className="text-sm text-base-content/70 -mt-2">
                Enter what you spent. Unused fields count as $0.
              </p>
            </div>
            <Shimmer className="stat bg-primary/10 rounded-2xl px-5 py-3 min-w-[10rem] sticky top-20 z-20 md:static shadow-md md:shadow-none">
              <div className="stat-title text-xs">Total concert cost</div>
              <TotalDisplay
                key={liveTotal}
                {...(!reduceMotion && {
                  initial: { scale: 1.05, opacity: 0.7 },
                  animate: { scale: 1, opacity: 1 },
                })}
                className="stat-value text-primary text-2xl"
              >
                {formatCurrency(liveTotal)}
              </TotalDisplay>
            </Shimmer>
          </div>

          <CostGroup title="Tickets & fees">
            <CostField label="Ticket cost" value={form.ticket_cost} onChange={(v) => updateField("ticket_cost", v)} />
            <CostField label="Ticket fees" value={form.ticket_fees} onChange={(v) => updateField("ticket_fees", v)} />
          </CostGroup>
          <CostGroup title="At the venue">
            <CostField label="Parking" value={form.parking_cost} onChange={(v) => updateField("parking_cost", v)} />
            <CostField label="Food & drink" value={form.food_drink_cost} onChange={(v) => updateField("food_drink_cost", v)} />
            <CostField label="Merchandise" value={form.merchandise_cost} onChange={(v) => updateField("merchandise_cost", v)} />
          </CostGroup>
          <CostGroup title="Travel & stay">
            <CostField label="Hotel / lodging" value={form.lodging_cost} onChange={(v) => updateField("lodging_cost", v)} />
            <CostField label="Travel / gas" value={form.travel_cost} onChange={(v) => updateField("travel_cost", v)} />
            <CostField label="Other" value={form.other_cost} onChange={(v) => updateField("other_cost", v)} />
          </CostGroup>
        </div>
      </section>

      <section className="card card-elevated">
        <div className="card-body">
          <h2 className="card-title [font-family:var(--font-jakarta)]">How fun was it?</h2>
          <FunRatingPicker value={form.fun_rating} onChange={(r) => updateField("fun_rating", r)} />
        </div>
      </section>

      <button type="submit" className="btn btn-primary btn-modern btn-lg w-full gap-2" disabled={loading}>
        {loading && <Loader2 className="h-5 w-5 animate-spin" />}
        {loading ? "Saving..." : "Save concert"}
      </button>
    </form>
  );
}

function CostGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 first:mt-4">
      <h3 className="text-sm font-semibold text-base-content/80 mb-3">{title}</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>
    </div>
  );
}

function CostField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <FormField label={label}>
      <label className="form-input-modern flex items-center gap-2 !py-2">
        <span className="text-base-content/50">$</span>
        <input
          type="number"
          min="0"
          step="0.01"
          className="grow min-w-0 bg-transparent outline-none"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
        />
      </label>
    </FormField>
  );
}
