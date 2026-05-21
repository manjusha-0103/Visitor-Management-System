import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Ban,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type DeleteModalProps = {
    m1active: string;
    who: string;
    onConfirm: () => void | Promise<void>;
    isLoading: boolean;
    isCancel?: boolean;
};

export default function DeleteModal({
    m1active,
    who,
    onConfirm,
    isLoading,
    isCancel = false,
}: DeleteModalProps) {

    return (

        <Dialog>

            <DialogTrigger
                className="
                    h-6 gap-1
                    rounded-[min(var(--radius-md),10px)]
                    px-2 text-xs
                    in-data-[slot=button-group]:rounded-lg
                    has-data-[icon=inline-end]:pr-1.5
                    has-data-[icon=inline-start]:pl-1.5
                    [&_svg:not([class*='size-'])]:size-3
                    border border-gray-200
                    bg-background
                    aria-expanded:bg-muted
                    aria-expanded:text-foreground
                    dark:border-input
                    dark:bg-input/30
                    dark:hover:bg-input/50
                    hover:bg-maroon
                    cursor-pointer
                    text-red-600
                    hover:text-white
                "
            >

                {isCancel ? (
                    <Ban size={12} />
                ) : (
                    <Trash2 size={12} />
                )}

            </DialogTrigger>

            <DialogContent>

                <DialogHeader>

                    <DialogTitle>
                        Are you absolutely sure?
                    </DialogTitle>

                    <DialogDescription>
                        This action cannot be undone.
                        This will permanently remove
                        your data from our servers.
                    </DialogDescription>

                    <div className="pt-2">

                        <p
                            className="
                                text-xs font-semibold
                                text-gray-400 uppercase
                                tracking-wider mb-3
                            "
                        >
                            Danger zone
                        </p>

                        <div
                            className="
                                flex items-start
                                justify-between
                                gap-4 p-3
                                rounded-lg
                                border border-red-200
                                bg-red-50
                            "
                        >

                            <div className="flex items-start gap-2">

                                <Ban
                                    size={14}
                                    className="
                                        mt-0.5 shrink-0
                                        text-red-500
                                    "
                                />

                                <div>

                                    <p
                                        className="
                                            text-sm font-medium
                                            text-red-700
                                        "
                                    >
                                        {isCancel
                                            ? `Cancel ${who}`
                                            : `Delete ${who}`}
                                    </p>

                                    <p
                                        className="
                                            text-xs text-gray-500
                                            mt-0.5
                                        "
                                    >
                                        {m1active}
                                    </p>

                                </div>

                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                className="
                                    shrink-0
                                    text-xs
                                    text-red-600
                                    border-red-300
                                    hover:bg-red-100
                                "
                                onClick={onConfirm}
                                disabled={isLoading}
                            >

                                {isLoading
                                    ? (
                                        isCancel
                                            ? "Cancelling..."
                                            : "Deleting..."
                                    )
                                    : (
                                        isCancel
                                            ? "Cancel"
                                            : "Delete"
                                    )
                                }

                            </Button>

                        </div>

                    </div>

                </DialogHeader>

            </DialogContent>

        </Dialog>
    );
}