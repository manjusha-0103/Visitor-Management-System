import { toast } from "sonner";
import { type FetchBaseQueryError } from "@reduxjs/toolkit/query"

interface SuccessToastOptions {
    message: string;
    description?: string;
}


type ToastError =
    | string
    | FetchBaseQueryError
    | Error
    | {
        message?: string;
        description?: string;
        data?: {
            message?: string;
            description?: string;
        };
    };

export function showErrorToast(
    error: ToastError
) {
    console.log(error);
    
    let message = "Something went wrong";
    let description = "";

    if (typeof error === "string") {
        message = error;
    }

    else if ("data" in error && error.data) {
        const data = error.data as {
            message?: string;
            description?: string;
        };

        if (data.message) {
            message = data.message;
        }

        if (data.description) {
            description = data.description;
        }
    }

    else if ("message" in error && error.message) {
        message = error.message;
    }

    toast.error(message, {
        description,

        className:
            "!border-red-200 !bg-red-50",

        style: {
            color: "#dc2626",
        },
    });
}

export function showSuccessToast({ message, description = "" }: SuccessToastOptions) {
    toast.success(message, {
        description,

        className:
            "!border-green-200 !bg-green-50",

        style: {
            color: "#16a34a",
        },
    });
}