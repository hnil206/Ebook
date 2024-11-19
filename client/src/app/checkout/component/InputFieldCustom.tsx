import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { CheckoutFormType } from "@/hooks/shop/use-cart-store";
import {
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FormFieldCustomProps {
  name: keyof CheckoutFormType;
  label: string;
  placeholder: string;
  form: UseFormReturn<CheckoutFormType>;
}

export const InputFieldCustom = ({ name, label, placeholder, form }: FormFieldCustomProps) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-bl">{label}</FormLabel>
        <TooltipProvider>
          <Tooltip open={!!form.formState.errors[name]}>
            <TooltipTrigger asChild>
              <div className="relative">
                <Input
                  placeholder={placeholder}
                  {...field}
                  name={name as string} // Fixed by casting name to string
                  className={cn(
                    " focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-secondary-400",
                    form.formState.errors[name] &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                />
                {form.formState.errors[name] && (
                  <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 h-5 w-5" />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="top"          
              align="end"
              sideOffset={10}
              className="bg-red-400 text-white rounded-md text-xs shadow-lg p-1" // Adjusted classes for smaller size
              >
              {form.formState.errors[name]?.message}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </FormItem>
    )}
  />
);