import {
  useEffect,
  useState,
} from "react";

import { z } from "zod";

import {
  useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
  LockKeyhole,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  FieldGroup,
  FieldSet,
} from "@/components/ui/field";

import {
  useChangePasswordMutation,
} from "@/lib/features/auth/authApi";

import {
  CustomInputField,
} from "@/components/form/FormFields";

// ─────────────────────────────────────
// SCHEMA
// ─────────────────────────────────────

export const passwordSchema =
  z.object({

    old_pass:
      z.string()
        .min(
          1,
          "Current password is required"
        ),

    new_pass:
      z.string()
        .min(
          8,
          "Minimum 8 characters"
        )
        .regex(
          /[A-Z]/,
          "At least one uppercase letter"
        )
        .regex(
          /[0-9]/,
          "At least one number"
        )
        .regex(
          /[^A-Za-z0-9]/,
          "At least one special character"
        ),

    confirm_pass:
      z.string(),

  })

    .refine(
      (data) =>
        data.new_pass ===
        data.confirm_pass,

      {
        message:
          "Passwords do not match",

        path: [
          "confirm_pass",
        ],
      }
    );

// ─────────────────────────────────────
// TYPES
// ─────────────────────────────────────

type PasswordFormValues =
  z.infer<
    typeof passwordSchema
  >;

// ─────────────────────────────────────
// PAGE
// ─────────────────────────────────────

export default function ChangePassword() {

  const [
    showOld,
    setShowOld,
  ] = useState(false);

  const [
    showNew,
    setShowNew,
  ] = useState(false);

  const [
    showConfirm,
    setShowConfirm,
  ] = useState(false);

  const [
    changePassword,
    {
      isLoading,
    },
  ] =
    useChangePasswordMutation();

  const {
    control,
    handleSubmit,
    reset,

    formState: {
      isSubmitSuccessful,
    },

  } = useForm<PasswordFormValues>({
    resolver:
      zodResolver(
        passwordSchema
      ),

    defaultValues: {
      old_pass: "",
      new_pass: "",
      confirm_pass: "",
    },
  });

  useEffect(() => {

    if (
      isSubmitSuccessful
    ) {

      reset();
    }

  }, [
    isSubmitSuccessful,
    reset,
  ]);

  // ─────────────────────────────────────
  // SUBMIT
  // ─────────────────────────────────────

  const onSubmit =
    async (
      data:
        PasswordFormValues
    ) => {

      try {

        await changePassword({
          old_pass:
            data.old_pass,

          new_pass:
            data.new_pass,
        }).unwrap();

      } catch (
        err: any
      ) {

        console.error(
          err?.data?.message ||
          "Something went wrong"
        );
      }
    };

  return (

    <div className="min-h-screen flex items-start justify-center p-4">

      <Card className="w-full max-w-lg shadow-sm border-0 gap-2">

        <CardHeader>

          <CardTitle>
            Change Password
          </CardTitle>

          <CardDescription>
            Keep your account secure with a strong password
          </CardDescription>

        </CardHeader>

        <CardContent>

          {/* REQUIREMENTS */}

          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-5">

            <div className="flex items-center gap-2 mb-2">

              <ShieldCheck
                size={15}
                className="text-maroon"
              />

              <p className="text-xs font-semibold text-gray-600">
                Password requirements
              </p>

            </div>

            <ul className="space-y-1">

              {[
                "Minimum 8 characters",
                "At least one uppercase letter",
                "At least one number",
                "At least one special character",
              ].map(
                (item) => (

                  <li
                    key={item}
                    className="text-xs text-gray-500 flex items-center gap-2"
                  >

                    <span className="w-1 h-1 rounded-full bg-gray-400" />

                    {item}

                  </li>
                )
              )}

            </ul>

          </div>

          {/* FORM */}

          <form
            onSubmit={
              handleSubmit(
                onSubmit
              )
            }
          >

            <FieldGroup>

              <FieldSet>

                <FieldGroup>

                  {/* CURRENT PASSWORD */}

                  <CustomInputField<PasswordFormValues>
                    name="old_pass"
                    label="Current Password"
                    placeholder="Enter current password"
                    control={control}
                    type={
                      showOld
                        ? "text"
                        : "password"
                    }
                    icon={LockKeyhole}
                    rightElement={
                      <button
                        type="button"
                        onClick={() =>
                          setShowOld(
                            !showOld
                          )
                        }
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {showOld ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    }
                  />

                  {/* NEW PASSWORD */}

                  <CustomInputField<PasswordFormValues>
                    name="new_pass"
                    label="New Password"
                    placeholder="Enter new password"
                    control={control}
                    type={
                      showNew
                        ? "text"
                        : "password"
                    }
                    icon={LockKeyhole}
                    rightElement={
                      <button
                        type="button"
                        onClick={() =>
                          setShowNew(
                            !showNew
                          )
                        }
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {showNew ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    }
                  />

                  {/* CONFIRM PASSWORD */}

                  <CustomInputField<PasswordFormValues>
                    name="confirm_pass"
                    label="Confirm Password"
                    placeholder="Re-enter new password"
                    control={control}
                    type={
                      showConfirm
                        ? "text"
                        : "password"
                    }
                    icon={LockKeyhole}
                    rightElement={
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirm(
                            !showConfirm
                          )
                        }
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {showConfirm ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    }
                  />

                </FieldGroup>

              </FieldSet>

            </FieldGroup>

            <div className="mt-6">

              <Button
                type="submit"
                disabled={
                  isLoading
                }
                className="w-full bg-maroon hover:bg-maroon-dark"
              >

                {isLoading ? (
                  <>

                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />

                    Updating...

                  </>
                ) : (
                  "Update Password"
                )}

              </Button>

            </div>

          </form>

        </CardContent>

      </Card>

    </div>
  );
}