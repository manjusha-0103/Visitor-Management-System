import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
  BadgeCheck,
  Loader2,
} from "lucide-react";

import type { AppointmentRow } from "@/types";

import { useSetPassIdMutation } from "@/lib/features/appointment/appointmentApi";

import { CustomInputField } from "@/components/form/FormFields";

type FormValues = {
  pass_id: string;
};

interface SetPassIdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: AppointmentRow | null;
}

export default function SetPassIdDialog({
  open,
  onOpenChange,
  appointment,
}: SetPassIdDialogProps) {

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      pass_id: "",
    },
  });

  const [
    setPassIdMutation,
    { isLoading },
  ] = useSetPassIdMutation();

  useEffect(() => {
    if (!open) {
      reset({
        pass_id: "",
      });
    }
  }, [open, reset]);

  const onSubmit = async (
    data: FormValues
  ) => {
    if (!appointment) return;

    try {
      await setPassIdMutation({
        appointment_id:
          appointment.appointment_id,
        pass_id: data.pass_id,
      }).unwrap();

      reset();

      onOpenChange(false);
    } catch (error) {
      console.error(
        "Failed to set pass id",
        error
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md gap-2">
        <DialogHeader>
          <DialogTitle>
            Set Visitor Pass ID
          </DialogTitle>

          <DialogDescription>
            Assign a pass ID for{" "}
            <span className="font-medium text-black">
              {
                appointment?.visitor_first_name
              }{" "}
              {
                appointment?.visitor_last_name
              }
            </span>
            . This pass will be used
            during visitor entry and
            checkout.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
          className="space-y-4"
        >
          <div className="flex gap-3 items-center flex-wrap">
            <p className="text-xs text-gray-500 mt-0.5">
              <span className="font-bold">
                Host:
              </span>{" "}
              {
                appointment?.employee_first_name
              }{" "}
              {
                appointment?.employee_last_name
              }
            </p>

            <p className="text-xs text-gray-500">
              <span className="font-bold">
                Visitor Phone no:
              </span>{" "}
              {
                appointment?.visitor_phone
              }
            </p>
          </div>

          <CustomInputField
            name="pass_id"
            control={control}
            label="Pass ID"
            placeholder="P-0011"
            required
            rules={{
              required:
                "Pass ID is required",
              pattern: {
                value: /^P-\d{4}$/,
                message:
                  "Pass ID must be like P-0011, starts with P-, and 4 digit number.",
              },
            }}
            inputClassName="bg-white"
            rightElement={
              <BadgeCheck
                size={16}
                className="text-blue-600"
              />
            }
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-maroon hover:bg-maroon-dark"
              disabled={isLoading}
            >
              {isLoading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}

              Set Pass ID
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}