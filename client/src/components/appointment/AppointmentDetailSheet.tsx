import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
    User,
    Mail,
    Phone,
    Building2,
    Briefcase,
    Laptop,
    Car,
    CalendarDays,
    Clock,
    BadgeCheck,
    CheckCircle2,
    // XCircle,
    LogOut,
    // ShieldCheck,
    IdCard,
} from "lucide-react";

import { format, parseISO } from "date-fns";
import type { AppointmentRow } from "@/types";

type Props = {
    appointment: AppointmentRow | null;
    open: boolean;
    onClose: (open: boolean) => void;
};

function DetailRow({
    icon: Icon,
    label,
    value,
}: {
    icon: any;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-3 py-3 border-b last:border-0">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <Icon size={16} className="text-gray-600" />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                    {label}
                </p>

                <div className="text-sm font-medium text-gray-800 wrap-break-words">
                    {value || "—"}
                </div>
            </div>
        </div>
    );
}

export default function AppointmentDetailSheet({
    appointment,
    open,
    onClose,
}: Props) {
    if (!appointment) return null;

    const visitorName = `${appointment.visitor_first_name} ${appointment.visitor_last_name}`;

    const employeeName = `${appointment.employee_first_name} ${appointment.employee_last_name}`;

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-xl p-0 bg-white overflow-y-auto">

                {/* HEADER */}
                <SheetHeader className="border-b p-4">
                    <div className="flex items-center gap-4">

                        <div className="min-w-0">
                            <SheetTitle className="text-xl font-bold">
                                Appointment Details
                            </SheetTitle>

                            {/* <p className="text-sm text-gray-500 mt-1 break-all">
                                ID: {appointment.appointment_id}
                            </p> */}
                        </div>

                        <Badge
                            className={
                                appointment.check_out
                                    ? "bg-gray-100 text-gray-600"
                                    : appointment.is_approve
                                        ? "bg-green-100 text-green-700"
                                        : appointment.is_rejected
                                            ? "bg-red-100 text-red-700"
                                            : "bg-amber-100 text-amber-700"
                            }
                        >
                            {appointment.check_out
                                ? "Checked out"
                                : appointment.is_approve
                                    ? "Approved"
                                    : appointment.is_rejected
                                        ? "Rejected"
                                        : "Pending"}
                        </Badge>
                    </div>

                    {/* QUICK STATS */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">

                        <div className="rounded-xl border bg-gray-50 p-3">
                            <p className="text-xs text-gray-400 mb-1">
                                Type
                            </p>

                            <p className="text-xs font-semibold">
                                {appointment.is_preschedule
                                    ? "Pre-Schedule"
                                    : "Walk-In"}
                            </p>
                        </div>

                        <div className="rounded-xl border bg-gray-50 p-3">
                            <p className="text-xs text-gray-400 mb-1">
                                Laptop
                            </p>

                            <p className="text-xs font-semibold">
                                {appointment.is_laptop ? "Yes" : "No"}
                            </p>
                        </div>

                        <div className="rounded-xl border bg-gray-50 p-3">
                            <p className="text-xs text-gray-400 mb-1">
                                Vehicle
                            </p>

                            <p className="text-xs font-semibold">
                                {appointment.is_vehicle ? "Yes" : "No"}
                            </p>
                        </div>

                        <div className="rounded-xl border bg-gray-50 p-3">
                            <p className="text-xs text-gray-400 mb-1">
                                Visitor ID
                            </p>

                            <p className="text-xs font-semibold">
                                {appointment.pass_id || "Not set"}
                            </p>
                        </div>
                    </div>
                </SheetHeader>

                <div className="p-4 space-y-8">

                    {/* VISITOR */}
                    <section>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                            Visitor Information
                        </h3>

                        <div className="rounded-2xl border bg-white px-4">

                            <DetailRow
                                icon={User}
                                label="Visitor Name"
                                value={visitorName}
                            />

                            <DetailRow
                                icon={Mail}
                                label="Visitor Email"
                                value={appointment.visitor_email}
                            />

                            <DetailRow
                                icon={Phone}
                                label="Visitor Phone"
                                value={appointment.visitor_phone}
                            />

                            <DetailRow
                                icon={Briefcase}
                                label="Position"
                                value={appointment.visitor_position}
                            />

                            <DetailRow
                                icon={Building2}
                                label="Company"
                                value={appointment.company}
                            />
                        </div>
                    </section>

                    {/* HOST */}
                    <section>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                            Host Information
                        </h3>

                        <div className="rounded-2xl border bg-white px-4">

                            <DetailRow
                                icon={User}
                                label="Employee Name"
                                value={employeeName}
                            />

                            <DetailRow
                                icon={Mail}
                                label="Employee Email"
                                value={appointment.employee_email}
                            />

                            <DetailRow
                                icon={Phone}
                                label="Employee Phone"
                                value={appointment.employee_phone}
                            />

                            <DetailRow
                                icon={Briefcase}
                                label="Employee Position"
                                value={appointment.employee_position}
                            />

                            {/* <DetailRow
                                icon={ShieldCheck}
                                label="Department ID"
                                value={appointment.department}
                            /> */}
                        </div>
                    </section>

                    {/* VISIT INFO */}
                    <section>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                            Visit Information
                        </h3>

                        <div className="rounded-2xl border bg-white px-4">

                            <DetailRow
                                icon={CalendarDays}
                                label="Scheduled Date"
                                value={
                                    appointment.date_time
                                        ? format(
                                            parseISO(appointment.date_time),
                                            "dd MMM yyyy"
                                        )
                                        : "—"
                                }
                            />

                            <DetailRow
                                icon={Clock}
                                label="Scheduled Time"
                                value={
                                    appointment.date_time
                                        ? format(
                                            parseISO(appointment.date_time),
                                            "hh:mm a"
                                        )
                                        : "—"
                                }
                            />

                            <DetailRow
                                icon={CheckCircle2}
                                label="Check In"
                                value={
                                    appointment.check_in
                                        ? `${format(
                                            parseISO(appointment.check_in),
                                            "dd MMM yyyy hh:mm a"
                                        )}`
                                        : "Not checked in"
                                }
                            />

                            <DetailRow
                                icon={LogOut}
                                label="Check Out"
                                value={
                                    appointment.check_out
                                        ? `${format(
                                            parseISO(appointment.check_out),
                                            "dd MMM yyyy hh:mm a"
                                        )}`
                                        : "Not checked out"
                                }
                            />

                            <DetailRow
                                icon={BadgeCheck}
                                label="Approval Status"
                                value={
                                    appointment.is_approve
                                        ? "Approved"
                                        : appointment.is_rejected
                                            ? "Rejected"
                                            : "Pending"
                                }
                            />
                        </div>
                    </section>

                    {/* ASSETS */}
                    {(appointment.is_laptop || appointment.is_vehicle) && (
                        <section>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                                Assets
                            </h3>

                            <div className="rounded-2xl border bg-white px-4">

                                {appointment.is_laptop && (
                                    <>
                                        <DetailRow
                                            icon={Laptop}
                                            label="Laptop Make"
                                            value={appointment.laptop_make}
                                        />

                                        <DetailRow
                                            icon={Laptop}
                                            label="Laptop Model"
                                            value={appointment.laptop_model}
                                        />

                                        <DetailRow
                                            icon={IdCard}
                                            label="Laptop Serial Number"
                                            value={appointment.laptop_serial_no}
                                        />
                                    </>
                                )}

                                {appointment.is_vehicle && (
                                    <DetailRow
                                        icon={Car}
                                        label="Vehicle Number"
                                        value={appointment.vehicle_no}
                                    />
                                )}
                            </div>
                        </section>
                    )}

                </div>

                {/* FOOTER */}
                <div className="sticky bottom-0 border-t bg-white p-4">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => onClose(false)}
                    >
                        Close
                    </Button>
                </div>

            </SheetContent>
        </Sheet>
    );
}