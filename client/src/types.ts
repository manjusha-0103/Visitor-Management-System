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
    showBack: boolean;
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


//Appointment table
export interface AppointmentRow {
  // ── Appointment ─────────────────────────────
  appointment_id: string;
  appointment_created_at: string;

  check_in: string | null;
  check_out: string | null;

  date_time: string;

  is_preschedule: boolean;
  is_approve: boolean;
  is_rejected: boolean;

  pass_id: string | null;

  // ── Employee ───────────────────────────────
  employee_id: string;
  employee_position: string | null;
  department: string | null;

  // ── Employee User ──────────────────────────
  employee_first_name: string;
  employee_last_name: string;

  employee_email: string;
  employee_phone: string;

  // ── Visitor ────────────────────────────────
  visitor_id: string;
  visitor_position: string | null;

  company: string | null;

  is_laptop: boolean;
  laptop_make: string | null;
  laptop_model: string | null;
  laptop_serial_no: string | null;

  is_vehicle: boolean;
  vehicle_no: string | null;

  // ── Visitor User ───────────────────────────
  visitor_first_name: string;
  visitor_last_name: string;

  visitor_email: string;
  visitor_phone: string;
}

