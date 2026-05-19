"use client";

import { motion, useReducedMotion } from "motion/react";
import { DEFAULT_CONCERT_TAGS } from "@/lib/categories";

export default function CategoryTagPicker({
  value,
  onChange,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
}) {
  const reduceMotion = useReducedMotion();

  function toggleTag(tag: string) {
    if (value.includes(tag)) {
      onChange(value.filter((t) => t !== tag));
    } else {
      onChange([...value, tag]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {DEFAULT_CONCERT_TAGS.map((tag) => {
        const selected = value.includes(tag);
        const Button = reduceMotion ? "button" : motion.button;
        return (
          <Button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={`btn btn-sm rounded-full ${
              selected ? "btn-primary" : "btn-outline"
            }`}
            {...(!reduceMotion && {
              whileTap: { scale: 0.95 },
              whileHover: { scale: 1.02 },
            })}
            aria-pressed={selected}
          >
            {tag}
          </Button>
        );
      })}
    </div>
  );
}
