import { cn } from "@/lib/cn";

type ButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "solid" | "ghost";
};

export default function Button({
  className,
  variant = "solid",
  children,
  ...props
}: ButtonProps) {
  return (
    <a
      className={cn(
        "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm tracking-[0.16em] uppercase transition-colors duration-300",
        variant === "solid" && "bg-paper text-ink hover:bg-accent",
        variant === "ghost" &&
          "border border-line text-paper hover:border-accent hover:text-accent",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
