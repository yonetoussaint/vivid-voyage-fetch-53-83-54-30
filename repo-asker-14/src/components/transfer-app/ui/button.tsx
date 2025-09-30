
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Capacitor } from "@capacitor/core"
import { Haptics, ImpactStyle } from "@capacitor/haptics"

import { cn } from "@/components/transfer-app/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-native hover:bg-primary-hover active:bg-primary-active active:scale-[0.98] rounded-lg",
        destructive:
          "bg-destructive text-destructive-foreground shadow-native hover:bg-destructive/90 active:scale-[0.98] rounded-lg",
        outline:
          "border border-input-border bg-background-elevated text-foreground shadow-native hover:bg-secondary hover:border-border active:scale-[0.98] rounded-lg",
        secondary:
          "bg-secondary text-secondary-foreground shadow-native hover:bg-secondary-hover active:scale-[0.98] rounded-lg",
        ghost: "text-foreground hover:bg-secondary/60 active:scale-[0.98] rounded-lg",
        link: "text-primary underline-offset-4 hover:underline active:scale-[0.98]",
        native: "bg-primary text-primary-foreground shadow-native-md hover:shadow-native-lg hover:bg-primary-hover active:bg-primary-active active:scale-[0.97] rounded-xl",
        soft: "bg-primary/10 text-primary shadow-native hover:bg-primary/20 active:scale-[0.98] rounded-lg",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 px-4 py-2 text-xs",
        lg: "h-14 px-8 py-4",
        xl: "h-16 px-10 py-5 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      // Add haptic feedback for native platforms
      if (Capacitor.isNativePlatform()) {
        await Haptics.impact({ style: ImpactStyle.Light });
      }
      
      onClick?.(e);
    };
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
