import { cn } from "@/lib/cn";

/** HyperUI-inspired labeled field (contact-form style) */
export function FormField({
  id,
  label,
  hint,
  required,
  className,
  children,
}: {
  id?: string;
  label: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-sm font-medium text-base-content">
        {label}
        {required && <span className="text-error"> *</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-base-content/60">{hint}</p>}
    </div>
  );
}

export function FormInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn("input input-bordered form-input-modern", props.className)}
    />
  );
}

export function FormTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn("textarea textarea-bordered form-textarea-modern", props.className)}
    />
  );
}
