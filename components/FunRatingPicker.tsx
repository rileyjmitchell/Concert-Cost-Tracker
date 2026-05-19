"use client";

import { motion, useReducedMotion } from "motion/react";

export default function FunRatingPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-xs text-base-content/60">
        <span>Terrible Time (1)</span>
        <span className="font-semibold text-primary text-lg">{value}/10</span>
        <span>Best Time Ever (10)</span>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((rating) => {
          const selected = value === rating;
          const Button = reduceMotion ? "button" : motion.button;
          return (
            <Button
              key={rating}
              type="button"
              onClick={() => onChange(rating)}
              className={`btn btn-sm w-10 rounded-xl ${
                selected ? "btn-primary scale-105 shadow-md" : "btn-outline"
              }`}
              {...(!reduceMotion && {
                whileTap: { scale: 0.92 },
                whileHover: { scale: selected ? 1.05 : 1.03 },
              })}
              aria-label={`Rate ${rating} out of 10`}
              aria-pressed={selected}
            >
              {rating}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
