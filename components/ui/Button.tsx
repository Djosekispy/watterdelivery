import React from "react";
import { Pressable, Text, View } from "react-native";
import { Slot } from "expo-router"; // ou mantenha se estiver usando radix Slot
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { styled  } from "nativewind";

const buttonVariants = cva(
  "flex flex-row items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-red-600 text-white",
        outline: "border border-gray-300 bg-white text-gray-800",
        secondary: "bg-gray-200 text-gray-800",
        ghost: "bg-transparent text-gray-700",
        link: "text-blue-500 underline",
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

export interface ButtonProps
  extends VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const StyledPressable = styled(Pressable);
const StyledText = styled(Text);

export const Button = React.forwardRef<typeof Pressable, ButtonProps>(
  ({ className, variant, size, asChild = false, children, onPress, disabled, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }));

    if (asChild) {
      return (
        <Slot
          className={classes}
          {...props}
        />
      );
    }

    return (
      <StyledPressable
        className={classes}
        onPress={onPress}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        {typeof children === "string" ? (
          <StyledText className="text-center">{children}</StyledText>
        ) : (
          children
        )}
      </StyledPressable>
    );
  }
);
Button.displayName = "Button";
