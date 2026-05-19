"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import CategoryTagPicker from "@/components/CategoryTagPicker";
import FunRatingPicker from "@/components/FunRatingPicker";
import { FormField, FormInput, FormTextarea } from "@/components/FormField";
import { Shimmer } from "@/components/Shimmer";
import { createClient } from "@/lib/supabase/client";
import { parseBudget } from "@/lib/budget";
import { parseCategoryTags } from "@/lib/categories";
import { formatCurrency, totalCost } from "@/lib/calculations";
import { friendlyDbError } from "@/lib/userMessages";
import type { Concert, ConcertCosts } from "@/lib/types";

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
  budget: "",
  category_tags: [] as string[],
  fun_rating: 7,
  ...emptyCosts,
};

function formFromConcert(concert: Concert) {
  return {
    concert_name: concert.concert_name,
    artist: concert.artist,
    venue: concert.venue,
    city: concert.city,
    state: concert.state,
    concert_date: concert.concert_date,
    distance_from_home: String(concert.distance_from_home),
    hours_at_event: String(concert.hours_at_event),
    notes: concert.notes ?? "",
    budget: concert.budget != null ? String(concert.budget) : "",
    category_tags: [...concert.category_tags],
    fun_rating: concert.fun_rating,
    ticket_cost: concert.ticket_cost,
    ticket_fees: concert.ticket_fees,
    parking_cost: concert.parking_cost,
    food_drink_cost: concert.food_drink_cost,
    merchandise_cost: concert.merchandise_cost,
    lodging_cost: concert.lodging_cost,
    travel_cost: concert.travel_cost,
    other_cost: concert.other_cost,
  };
}

function buildConcertPayload(form: typeof initialForm, userId: string) {
  const hours = Number(form.hours_at_event);
  return {
    user_id: userId,
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
    budget: parseBudget(form.budget),
    category_tags: parseCategoryTags(form.category_tags),
    fun_rating: form.fun_rating,
    notes: form.notes.trim() || null,
  };
}

export default function ConcertForm({ concert }: { concert?: Concert }) {
  const isEditing = Boolean(concert);
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState(() =>
    concert ? formFromConcert(concert) : { ...initialForm }
  );
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

    const payload = buildConcertPayload(form, user.id);

    const { error: saveError } = isEditing
      ? await supabase
          .from("concerts")
          .update({
            concert_name: payload.concert_name,
            artist: payload.artist,
            venue: payload.venue,
            city: payload.city,
            state: payload.state,
            concert_date: payload.concert_date,
            distance_from_home: payload.distance_from_home,
            hours_at_event: payload.hours_at_event,
            ticket_cost: payload.ticket_cost,
            ticket_fees: payload.ticket_fees,
            parking_cost: payload.parking_cost,
            food_drink_cost: payload.food_drink_cost,
            merchandise_cost: payload.merchandise_cost,
            lodging_cost: payload.lodging_cost,
            travel_cost: payload.travel_cost,
            other_cost: payload.other_cost,
            budget: payload.budget,
            category_tags: payload.category_tags,
            fun_rating: payload.fun_rating,
            notes: payload.notes,
          })
          .eq("id", concert!.id)
      : await supabase.from("concerts").insert(payload);

    setLoading(false);

    if (saveError) {
      toast.error(friendlyDbError(saveError.message));
      return;
    }

    if (isEditing) {
      toast.success("Concert updated!");
      router.push("/concerts");
    } else {
      toast.success("Concert saved! Check your dashboard and My Concerts.");
      setForm({ ...initialForm });
    }
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
          <FormField
            label="Planned budget (optional)"
            hint="Leave blank if you did not set a budget. Used to compare against your total cost."
            className="mb-6"
          >
            <label className="form-input-modern flex items-center gap-2 !py-2 max-w-xs">
              <span className="text-base-content/50">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                className="grow min-w-0 bg-transparent outline-none"
                placeholder="e.g. 150"
                value={form.budget}
                onChange={(e) => updateField("budget", e.target.value)}
              />
            </label>
          </FormField>

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
          <h2 className="card-title [font-family:var(--font-jakarta)]">Category tags</h2>
          <p className="text-sm text-base-content/70 -mt-2 mb-4">
            Optional. Pick one or more — used for dashboard analytics.
          </p>
          <CategoryTagPicker
            value={form.category_tags}
            onChange={(tags) => updateField("category_tags", tags)}
          />
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
        {loading ? "Saving..." : isEditing ? "Save changes" : "Save concert"}
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
