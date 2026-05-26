import {
    useEffect,
} from "react";

import { z } from "zod";

import {
    useForm,
    Controller,
} from "react-hook-form";

import {
    zodResolver,
} from "@hookform/resolvers/zod";

import {
    User,
    Phone,
    Building2,
    Briefcase,
    Calendar,
    Save,
    Loader2,
    Mail,
    Shield,
} from "lucide-react";

import { format } from "date-fns";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Button,
} from "@/components/ui/button";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import {
    Calendar as CalendarUI,
} from "@/components/ui/calendar";

import {
    FieldGroup,
    FieldSet,
} from "@/components/ui/field";
import {
    CustomInputField,
    FormLabel,
    SelectField,
} from "@/components/form/FormFields";

import {
    useUpdateMeMutation,
} from "@/lib/features/auth/authApi";

import {
    useGetDepartmentsQuery,
} from "@/lib/features/visitor-check-in/visitorApi";

import {
    useSelector,
} from "react-redux";

import {
    selectUser,
} from "@/lib/features/auth/authSlice";

// ─────────────────────────────────────
// SCHEMA
// ─────────────────────────────────────

const profileSchema = z
  .object({
    first_name: z
      .string()
      .min(2, "First name is required"),

    last_name: z
      .string()
      .min(2, "Last name is required"),

    phone: z
      .string()
      .min(10, "Phone number is required"),

    birth_date: z
      .string()
      .min(1, "Birth date is required"),

    company: z.string().optional(),

    position: z.string().optional(),

    department: z.string().optional(),

    role: z.string(),
  })

  .superRefine((data, ctx) => {

    // only validate for non-super-admin
    if (data.role !== "super_admin") {

      if (!data.company?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["company"],
          message: "Company is required",
        });
      }

      if (!data.department?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["department"],
          message: "Department is required",
        });
      }
    }
  });

type ProfileFormValues =
    z.infer<typeof profileSchema>;

export default function Profile() {

    const user =
        useSelector(selectUser);
    const isSuperAdmin = user?.role === "super_admin";

    const [
        updateMe,
        {
            isLoading,
        },
    ] = useUpdateMeMutation();

    const {
        data: departmentsData,
    } = useGetDepartmentsQuery();

    console.log(departmentsData);
    

    const departments =
        departmentsData || [];

    const {
        control,
        handleSubmit,
        reset,
    } = useForm<ProfileFormValues>({
        resolver:
            zodResolver(profileSchema),

        defaultValues: {
            first_name: "",
            last_name: "",
            phone: "",
            birth_date: "",
            company: "",
            position: "",
            department: "",
            role: user?.role || "",
        },
    });

    // ─────────────────────────────────────
    // PREFILL
    // ─────────────────────────────────────

    useEffect(() => {

        if (user) {

            //   const names =
            //     user?.name?.split(" ") || [];

            reset({
                first_name:
                    user.first_name || "",

                last_name:
                    user.last_name || "",

                phone:
                    user.phone || "",

                birth_date:
                    user.birth_date
                        ? format(
                            new Date(
                                user.birth_date
                            ),
                            "yyyy-MM-dd"
                        )
                        : "",

                company:
                    user.company || "",

                position:
                    user.position || "",

                department:
                    user.department_id || "",
                role: user.role || ""
            });
        }

    }, [user, reset]);

    // ─────────────────────────────────────
    // SUBMIT
    // ─────────────────────────────────────

    const onSubmit = async (
        values: ProfileFormValues
    ) => {

        try {

            await updateMe(
                values
            ).unwrap();

        } catch (err) {

            console.log(err);
        }
    };


    const onError = (err: any) => {
        console.log(err);
        
    }

    const initials = `${user?.first_name?.charAt(0) || ""}${user?.last_name?.charAt(0) || ""}`;

    return (

        <div className="min-h-screen bg-muted/30 p-4 lg:p-8">

            <div className="max-w-6xl mx-auto space-y-6">

                {/* HEADER */}

                <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

                    <div>
                        <p className="text-lg text-muted-foreground mt-1">
                            Manage your personal information and account details
                        </p>

                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                    {/* FORM */}

                    <div className="xl:col-span-2">

                        <Card className="border-0 shadow-sm">

                            <CardHeader>

                                <CardTitle>
                                    Update Profile
                                </CardTitle>

                                <CardDescription>
                                    Edit and save your latest information
                                </CardDescription>

                            </CardHeader>

                            <CardContent>

                                <form
                                    onSubmit={handleSubmit(
                                        onSubmit, onError
                                    )}
                                >

                                    <FieldGroup>

                                        <FieldSet>

                                            {/* NAME */}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                                <CustomInputField<ProfileFormValues>
                                                    name="first_name"
                                                    label="First Name"
                                                    placeholder="John"
                                                    control={control}
                                                    icon={User}
                                                />

                                                <CustomInputField<ProfileFormValues>
                                                    name="last_name"
                                                    label="Last Name"
                                                    placeholder="Doe"
                                                    control={control}
                                                    icon={User}
                                                />

                                            </div>

                                            {/* EMAIL + PHONE */}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                                <div className="space-y-2">

                                                    <FormLabel
                                                        htmlFor="email"
                                                        label="Email"
                                                    />

                                                    <div className="relative">

                                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                                                        <input
                                                            value={
                                                                user?.email || ""
                                                            }
                                                            disabled
                                                            className="w-full h-10 rounded-md border border-[#e8e8f0] bg-muted pl-10 pr-3 text-sm text-muted-foreground"
                                                        />

                                                    </div>

                                                </div>

                                                <CustomInputField<ProfileFormValues>
                                                    name="phone"
                                                    label="Phone"
                                                    placeholder="9876543210"
                                                    control={control}
                                                    icon={Phone}
                                                />

                                            </div>

                                            {/* DOB */}

                                            <div className="space-y-2">

                                                <FormLabel
                                                    htmlFor="birth_date"
                                                    label="Date of Birth"
                                                />

                                                <Controller
                                                    control={control}
                                                    name="birth_date"
                                                    render={({
                                                        field,
                                                    }) => (

                                                        <Popover>

                                                            <PopoverTrigger
                                                                asChild
                                                            >

                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    className="w-full justify-start font-normal"
                                                                >

                                                                    <Calendar className="mr-2 w-4 h-4" />

                                                                    {field.value ? (
                                                                        format(
                                                                            new Date(
                                                                                field.value
                                                                            ),
                                                                            "dd MMM yyyy"
                                                                        )
                                                                    ) : (
                                                                        <span>
                                                                            Select birth date
                                                                        </span>
                                                                    )}

                                                                </Button>

                                                            </PopoverTrigger>

                                                            <PopoverContent
                                                                className="w-auto p-0"
                                                                align="start"
                                                            >

                                                                <CalendarUI
                                                                    mode="single"

                                                                    selected={
                                                                        field.value
                                                                            ? new Date(
                                                                                field.value
                                                                            )
                                                                            : undefined
                                                                    }

                                                                    onSelect={(
                                                                        date
                                                                    ) => {

                                                                        field.onChange(
                                                                            date
                                                                                ? format(
                                                                                    date,
                                                                                    "yyyy-MM-dd"
                                                                                )
                                                                                : ""
                                                                        );
                                                                    }}
                                                                    captionLayout="dropdown"

                                                                    disabled={(
                                                                        date
                                                                    ) =>
                                                                        date >
                                                                        new Date()
                                                                    }
                                                                />

                                                            </PopoverContent>

                                                        </Popover>
                                                    )}
                                                />

                                            </div>

                                            {
                                                !isSuperAdmin && (
                                                    <>
                                                        {/* COMPANY + POSITION */}

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                                            <CustomInputField<ProfileFormValues>
                                                                name="company"
                                                                label="Company"
                                                                placeholder="VisitMi"
                                                                control={control}
                                                                icon={Building2}
                                                            />

                                                            <CustomInputField<ProfileFormValues>
                                                                name="position"
                                                                label="Position"
                                                                placeholder="Software Engineer"
                                                                control={control}
                                                                icon={Briefcase}
                                                                required={false}
                                                            />

                                                        </div>

                                                        {/* DEPARTMENT */}

                                                        <SelectField<ProfileFormValues>
                                                            name="department"
                                                            label="Department"
                                                            control={control}
                                                            placeholder="Select department"
                                                            options={departments.map(
                                                                (d: any) => ({
                                                                    label:
                                                                        d.name,
                                                                    value:
                                                                        d.id,
                                                                })
                                                            )}
                                                        />
                                                    </>
                                                )
                                            }



                                        </FieldSet>

                                    </FieldGroup>

                                    {/* BUTTON */}

                                    <div className="mt-6">

                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="bg-maroon hover:bg-maroon-dark"
                                        >

                                            {isLoading ? (
                                                <>

                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />

                                                    Updating...

                                                </>
                                            ) : (
                                                <>

                                                    <Save className="w-4 h-4 mr-2" />

                                                    Save Changes

                                                </>
                                            )}

                                        </Button>

                                    </div>

                                </form>

                            </CardContent>

                        </Card>

                    </div>

                    {/* PROFILE DETAILS */}

                    <div>

                        <Card className="border-0 shadow-sm sticky top-6 gap-3">

                            <CardHeader>

                                <CardTitle>
                                    Account Details
                                </CardTitle>

                                <CardDescription>
                                    Current profile information
                                </CardDescription>

                            </CardHeader>

                            <CardContent className="space-y-4">

                                <div className="flex items-center gap-4 pb-4 border-b">

                                    <div className="w-12 h-12 rounded-full bg-maroon text-white flex items-center justify-center font-bold text-xl">
                                        {initials || "U"}
                                    </div>

                                    <div>

                                        <p className="font-semibold">
                                            {user?.first_name || ""} {user?.last_name || ""}
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            {user?.email}
                                        </p>

                                    </div>

                                </div>

                                <div className="space-y-4 text-sm">

                                    <div className="flex items-start gap-3">

                                        <Phone className="w-4 h-4 mt-0.5 text-muted-foreground" />

                                        <div>

                                            <p className="text-muted-foreground">
                                                Phone
                                            </p>

                                            <p className="font-medium">
                                                {user?.phone || "-"}
                                            </p>

                                        </div>

                                    </div>

                                    <div className="flex items-start gap-3">

                                        <Shield className="w-4 h-4 mt-0.5 text-muted-foreground" />

                                        <div>

                                            <p className="text-muted-foreground">
                                                Role
                                            </p>

                                            <p className="font-medium capitalize">
                                                {user?.role || "-"}
                                            </p>

                                        </div>

                                    </div>

                                    {
                                        !isSuperAdmin && (
                                            <>
                                                <div className="flex items-start gap-3">

                                                    <Building2 className="w-4 h-4 mt-0.5 text-muted-foreground" />

                                                    <div>

                                                        <p className="text-muted-foreground">
                                                            Company
                                                        </p>

                                                        <p className="font-medium">
                                                            {user?.company || "-"}
                                                        </p>

                                                    </div>

                                                </div>

                                                <div className="flex items-start gap-3">

                                                    <Briefcase className="w-4 h-4 mt-0.5 text-muted-foreground" />

                                                    <div>

                                                        <p className="text-muted-foreground">
                                                            Position
                                                        </p>

                                                        <p className="font-medium">
                                                            {user?.position || "-"}
                                                        </p>

                                                    </div>

                                                </div>

                                                <div className="flex items-start gap-3">

                                                    <User className="w-4 h-4 mt-0.5 text-muted-foreground" />

                                                    <div>

                                                        <p className="text-muted-foreground">
                                                            Department
                                                        </p>

                                                        <p className="font-medium">
                                                            {user?.department || "-"}
                                                        </p>

                                                    </div>

                                                </div>
                                            </>
                                        )
                                    }

                                    <div className="flex items-start gap-3">

                                        <Calendar className="w-4 h-4 mt-0.5 text-muted-foreground" />

                                        <div>

                                            <p className="text-muted-foreground">
                                                Birth Date
                                            </p>

                                            <p className="font-medium">

                                                {user?.birth_date
                                                    ? format(
                                                        new Date(
                                                            user.birth_date
                                                        ),
                                                        "dd MMM yyyy"
                                                    )
                                                    : "-"}

                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </CardContent>

                        </Card>

                    </div>

                </div>

            </div>

        </div>
    );
}