import React from "react";
import { Pressable, Text } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
// Removed styled import as it is not exported by nativewind

const buttonVariants = cva(
  "flex flex-row items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary",
        destructive: "bg-destructive",
        outline: "border border-input bg-background",
        secondary: "bg-secondary",
        ghost: "bg-transparent",
        link: "underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const textVariants = cva("text-center", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      destructive: "text-destructive-foreground",
      outline: "text-foreground",
      secondary: "text-secondary-foreground",
      ghost: "text-foreground",
      link: "text-primary underline",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<typeof Pressable>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  className?: string;
  textClassName?: string;
}

// Directly use Pressable and Text without wrapping
const StyledPressable = Pressable;
const StyledText = Text;

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  (
    {
      className = "",
      variant,
      size,
      asChild = false,
      children,
      textClassName = "",
      ...props
    },
    ref
  ) => {
    const pressableClasses = cn(
      buttonVariants({ variant, size }),
      className // Merge user-provided className
    );
    const textClasses = cn(
      textVariants({ variant }),
      textClassName // Merge user-provided textClassName
    );

    if (asChild) {
      return (
        <StyledPressable
          ref={ref}
          className={pressableClasses}
          {...props}
        >
          {children}
        </StyledPressable>
      );
    }

    return (
      <StyledPressable
        ref={ref}
        className={pressableClasses}
        {...props}
      >
        {typeof children === "string" ? (
          <StyledText className={textClasses}>{children}</StyledText>
        ) : (
          children
        )}
      </StyledPressable>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };