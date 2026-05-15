import { type Control,type Path, type FieldValues, type RegisterOptions } from "react-hook-form";
import {type LucideIcon} from "lucide-react"


//input field props
type BaseFieldProps<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    rules?: RegisterOptions<T>;
    className?: string; 
}

export type InputFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
    type?: string;
    icon?: LucideIcon;
    inputClassName?: string;
    rightElement?: React.ReactNode;
}

type SelectOption = {
    label: string;
    value: string;
}

export type SelectFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
     name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  rules?: RegisterOptions<T>;
}

//input label
export type FieldLabelProp = {
    htmlFor?: string;
    label: string;
    required?: boolean 
}


//auth allowedRoles
export type AllowedRoles = string[];

//admin sub heading
export type AdminSubHeadingProp = {
    to: string;
    heading: string;
    subh: string;
}

//auth slice Users
export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password?: string;
    role: "super_admin" | "receptionist";
    last_login: Date | string | null
}

export interface AuthInitialState {
    user: User | null,
    isAuthenticated: boolean,
    isAuthChecked: boolean,
    loading: boolean,
}