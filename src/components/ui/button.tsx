import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold tracking-wide transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md",
        destructive:
          "bg-destructive text-white shadow-sm hover:bg-destructive/90 hover:shadow-md focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:shadow-md dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline hover:scale-100",
        // SCPH brand variants
        scph:
          "bg-scph-blue text-white shadow-md hover:bg-scph-blue-dark hover:shadow-scph-blue/25 hover:shadow-lg",
        scphSecondary:
          "bg-scph-green text-white shadow-md hover:bg-scph-green-dark hover:shadow-scph-green/25 hover:shadow-lg",
        scphOutline:
          "border-2 border-scph-blue text-scph-blue bg-transparent hover:bg-scph-blue hover:text-white hover:shadow-md",
        // GTP 2026 brand variants
        gtp:
          "bg-gtp-dark-teal text-white shadow-md hover:bg-gtp-dark-teal-dark hover:shadow-gtp-dark-teal/25 hover:shadow-lg",
        gtpSecondary:
          "bg-gtp-teal text-white shadow-md hover:bg-gtp-teal-dark hover:shadow-gtp-teal/25 hover:shadow-lg",
        gtpCta:
          "bg-gtp-orange text-white shadow-md hover:bg-gtp-orange-dark hover:shadow-gtp-orange/30 hover:shadow-lg",
        gtpOutline:
          "border-2 border-gtp-teal text-gtp-teal bg-transparent hover:bg-gtp-teal hover:text-white hover:shadow-md",
      },
      size: {
        default: "h-11 px-6 py-2",
        xs: "h-7 px-3 text-xs",
        sm: "h-9 px-4 text-sm",
        lg: "h-13 px-8 text-base",
        icon: "size-11",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9",
        "icon-lg": "size-13",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
