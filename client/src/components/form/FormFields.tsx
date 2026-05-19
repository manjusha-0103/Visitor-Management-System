import { FieldLabel } from "../ui/field";
import { Controller, type FieldValues } from "react-hook-form";
import type { FieldLabelProp, InputFieldProps, SelectFieldProps } from "@/types";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";


export function FormLabel({ htmlFor, label, required }: FieldLabelProp) {
  return (
    <FieldLabel htmlFor={htmlFor} className="text-xs">
      {label}
      {required && <span className="text-red-500">*</span>}
    </FieldLabel>
  )
}

export function CustomInputField<T extends FieldValues>({
  name,
  control,
  label,
  required = true,
  placeholder,
  type = "text",
  icon: Icon,
  disabled = false,
  rules = {},
  className = "",
  inputClassName = "",
  rightElement,
}: InputFieldProps<T>) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && <FormLabel htmlFor={name} label={label} required={required}/>}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <>
            <div className="relative">
              {/* Left Icon */}
              {Icon && (
                <div className="absolute left-3 top-1/2 z-10 -translate-y-1/2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
              )}

              <Input
                {...field}
                id={name}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                className={`
                  border
                  ${Icon ? "pl-10" : ""}
                  ${rightElement ? "pr-10" : ""}
                  ${fieldState.error ? "border-red-500" : "border-[#e8e8f0]"}
                  rounded-md text-sm text-[#1a1a2e] bg-[#fafafa] transition-all duration-200
                  ${inputClassName}
                `}
              />

              {/* Right Element */}
              {rightElement && (
                <div className="absolute right-3 top-1/2 z-10 -translate-y-1/2">
                  {rightElement}
                </div>
              )}
            </div>

            {fieldState.error && (
              <p className=" text-red-500 text-xs ml-1 mt-0.5">
                {fieldState.error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
}

export function SelectField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "Select option",
  options = [],
  rules = {},
  disabled = false,
  required = true
}: SelectFieldProps<T>) {
  return (
    <div className="space-y-2">
      {label && <FormLabel htmlFor={name} label={label} required={required}/>}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <SelectTrigger
                id={name}
                className={`
                  h-11 rounded-md mb-0 w-full border border-[#e8e8f0] text-sm text-[#1a1a2e] bg-[#fafafa] transition-all duration-200
                  ${
                    fieldState.error
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }
                `}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>
                    {label}
                  </SelectLabel>
                   {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="rounded-lg"
                  >
                    {option.label}
                  </SelectItem>
                ))}
                </SelectGroup>
               
              </SelectContent>
            </Select>

            {fieldState.error && (
              <p className="text-xs text-red-500">
                {fieldState.error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
}


export function FormError({msg}:{msg:string | undefined}){
  return(
    <span className="text-red-500 text-xs mt-0.5 ml-1">{msg}</span>
  )
}