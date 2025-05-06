import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatNumber } from "@/lib/misc";
import { useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
type FormValues = {
  id: string;
  amount: string;
  narration: string;
};

interface TransferFormProps {
  setAmount: any;
  setNarration: any;
}
const TransferForm = ({ setAmount, setNarration }: TransferFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      id: "",
      amount: "",
      narration: "",
    },
  });

  useEffect(() => {
    setAmount(watch("amount"));

    setNarration(watch("narration"));
  }, [watch("amount"), watch("narration")]);
  return (
    <>
      <Label htmlFor="amount" className="flex flex-col gap-4">
        <span className="font-inter font-normal text-base text-label-100">
          Amount
        </span>
        <Input
          {...register("amount", {
            required: "Amount is required",
            validate: (value) => {
              const numValue = parseFloat(value.replace(/,/g, ""));
              if (isNaN(numValue)) return "Please enter a valid number";
              if (numValue <= 0) return "Amount must be greater than 0";
              return true;
            },
          })}
          name="amount"
          id="amount"
          type="text"
          inputMode="decimal"
          placeholder="Enter amount (e.g., 1,000,000)"
          className="h-[60px] mt-4 py-[15] px-[16px] rounded-[10px] border border-[#faf7ff] outline-0 bg-[#FAF7FF] placeholder:text-base placeholder:font-normal placeholder:text-placeholder-100 focus-visible:ring-[#faf7ff] focus-visible:ring-offset-0 placeholder:font-inter font-inter text-base font-normal"
          onChange={(e) => {
            const { value, selectionStart } = e.target;

            // Remove all non-digit characters (keep numbers & decimal)
            const rawValue = value.replace(/[^0-9.]/g, "");

            // Split into parts (for decimal handling)
            const parts = rawValue.split(".");
            const integerPart = parts[0];
            const decimalPart = parts[1] ? `.${parts[1]}` : "";

            // Format integer part with commas
            const formattedInteger = integerPart.replace(
              /\B(?=(\d{3})+(?!\d))/g,
              ","
            );

            // Combine formatted integer + decimal (if any)
            const formattedValue = formattedInteger + decimalPart;

            // Update input value
            e.target.value = formattedValue;

            // Only adjust cursor if selectionStart is not null
            if (selectionStart !== null) {
              const commaCount = (formattedValue.match(/,/g) || []).length;
              const originalCommaCount = (
                value.substring(0, selectionStart).match(/,/g) || []
              ).length;
              const cursorOffset = commaCount - originalCommaCount;
              const newCursorPosition = selectionStart + cursorOffset;

              // Use setTimeout to ensure the cursor update happens after React's state update
              setTimeout(() => {
                e.target.setSelectionRange(
                  newCursorPosition,
                  newCursorPosition
                );
              }, 0);
            }
          }}
        />
        {errors.amount && (
          <p className="text-xs text-red-500 mt-3">{errors.amount.message}</p>
        )}
      </Label>

      <Label htmlFor="Email" className="flex flex-col gap-4 ">
        <span className="font-inter font-normal text-base text-label-100">
          Narration
        </span>
        <Input
          {...register("narration")}
          name="id"
          id="id"
          type="text"
          //   inputMode="numeric"
          //   maxLength={10}
          placeholder="Enter narration"
          className="h-[60px] mt-4 py-[15] px-[16px] rounded-[10px] border border-[#faf7ff] outline-0  bg-[#FAF7FF] placeholder:text-base  placeholder:font-normal placeholder:text-placeholder-100  focus-visible:ring-[#faf7ff] focus-visible:ring-offset-0 placeholder:font-inter font-inter  text-base font-normal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        {errors.id && (
          <p className="text-xs text-red-500 mt-3">{errors.id.message}</p>
        )}
      </Label>
    </>
  );
};

export default TransferForm;
