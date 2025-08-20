import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  className, 
  type = "text",
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm text-secondary-900 placeholder:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;