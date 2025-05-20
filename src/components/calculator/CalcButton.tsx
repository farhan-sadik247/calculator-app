import React from 'react';
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalcButtonProps extends ButtonProps {
  buttonType?: 'number' | 'operator' | 'function' | 'special' | 'equals' | 'clear';
}

const CalcButton = React.forwardRef<HTMLButtonElement, CalcButtonProps>(
  ({ className, buttonType = 'number', children, ...props }, ref) => {
    const baseStyle = "h-14 md:h-16 text-xl md:text-2xl rounded-lg shadow-md active:scale-95 transition-transform focus:ring-2 focus:ring-ring focus:ring-offset-1";
    
    let typeStyle = '';
    switch (buttonType) {
      case 'number':
        typeStyle = 'bg-card hover:bg-muted text-card-foreground border border-border'; 
        break;
      case 'operator':
        typeStyle = 'bg-accent hover:bg-accent/90 text-accent-foreground'; 
        break;
      case 'function':
        typeStyle = 'bg-primary hover:bg-primary/90 text-primary-foreground'; 
        break;
      case 'special': // For ( ), Rad/Deg, +/-
        typeStyle = 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'; 
        break;
      case 'clear': // For AC, DEL
        typeStyle = 'bg-destructive hover:bg-destructive/90 text-destructive-foreground';
        break;
      case 'equals':
        typeStyle = 'bg-accent hover:bg-accent/90 text-accent-foreground';
        break;
      default: // Fallback, similar to number
        typeStyle = 'bg-card hover:bg-muted text-card-foreground border';
    }

    return (
      <Button
        ref={ref}
        variant="default" // Using default variant and overriding styles for full control
        className={cn(baseStyle, typeStyle, className)}
        {...props}
      >
        {children}
      </Button>
    );
  }
);
CalcButton.displayName = "CalcButton";

export { CalcButton };
