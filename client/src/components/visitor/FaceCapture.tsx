import Webcam from "react-webcam";
import type * as FaceApi from "face-api.js";
// import * as faceapi from "face-api.js";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import {
    Camera,
    Check,
    RefreshCcw,
    ArrowLeft,
    Loader2,
    QrCode,
} from "lucide-react";

interface Props {
    isSuperAdmin?: boolean;
    centered?: boolean;
    onComplete: (
        file: File,
        preview: string
    ) => void;

    onBack?: () => void;
}

export default function FaceCapture({
    onComplete,
    centered = false,
    onBack,
}: Props) {
    const webcamRef = useRef<Webcam>(null);
    const faceApiRef = useRef<typeof FaceApi | null>(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);

    const [faceInside, setFaceInside] = useState(false);

    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    const [capturedFile, setCapturedFile] = useState<File | null>(null);

    const [isDetecting, setIsDetecting] = useState(false);

    // Load face-api model
    useEffect(() => {
        const loadModels = async () => {
            try {
                const faceapi = await import("face-api.js");
                faceApiRef.current = faceapi;
                await faceapi.nets.tinyFaceDetector.loadFromUri("/models");

                setModelsLoaded(true);
            } catch (error) {
                console.error("Error loading face-api models:", error);
            }
        };

        loadModels();
    }, []);

    // Face detection loop
    useEffect(() => {
        if (!modelsLoaded) return;

        let interval: NodeJS.Timeout;

        interval = setInterval(async () => {
            if (capturedImage) return;

            if (isDetecting) return;

            const video = webcamRef.current?.video;

            if (!video || video.readyState !== 4) return;

            try {
                setIsDetecting(true);

                const detection =
                    await faceApiRef.current?.detectSingleFace(
                        video,
                        new faceApiRef.current.TinyFaceDetectorOptions()
                    );

                if (!detection) {
                    setFaceInside(false);
                    return;
                }

                const box = detection.box;

                const centerX = box.x + box.width / 2;
                const centerY = box.y + box.height / 2;

                const videoWidth = video.videoWidth;
                const videoHeight = video.videoHeight;

                // Guide area
                const guideLeft = videoWidth * 0.25;
                const guideRight = videoWidth * 0.75;

                const guideTop = videoHeight * 0.18;
                const guideBottom = videoHeight * 0.82;

                const inside =
                    centerX > guideLeft &&
                    centerX < guideRight &&
                    centerY > guideTop &&
                    centerY < guideBottom;

                setFaceInside(inside);
            } catch (error) {
                console.error(error);
            } finally {
                setIsDetecting(false);
            }
        }, 500);

        return () => clearInterval(interval);
    }, [modelsLoaded, capturedImage, isDetecting]);

    const capture = async () => {
        if (!faceInside) return;

        const imageSrc =
            webcamRef.current?.getScreenshot();

        if (!imageSrc) return;

        try {
            const response = await fetch(imageSrc);

            const blob = await response.blob();

            const file = new File(
                [blob],
                `visitor-${Date.now()}.jpg`,
                {
                    type: "image/jpeg",
                }
            );

            setCapturedImage(imageSrc);

            setCapturedFile(file);

        } catch (error) {
            console.error(error);
        }
    };

    const recapture = () => {
        setCapturedImage(null);
        setFaceInside(false);
    };

    return (
        <div
            className={`
        space-y-5
        ${centered
                    ? "flex h-full flex-col items-center justify-start text-center"
                    : ""
                }
    `}
        >
            {onBack && (
    <div className={centered ? "w-full flex justify-center" : ""}>
        <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="
                rounded-full border-gray-300
                px-4 py-2 text-sm text-gray-700
                hover:bg-gray-50
                flex items-center gap-2
            "
        >
            <ArrowLeft className="h-4 w-4" />
            Scan QR
            <QrCode className="h-4 w-4" />
        </Button>
    </div>
)}

            {/* Header */}
            <div className={centered ? "text-center" : ""}>
                <h2 className="text-xl font-bold text-gray-900">
                    Capture Visitor Photo
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Position your face inside the frame
                </p>
            </div>

            {/* Camera / Preview */}
            {!capturedImage ? (
                <div
                    className={`
        space-y-4
        ${centered ? "flex flex-col items-center" : ""}
    `}
                >
                    <div
                        className={`
        relative overflow-hidden rounded-3xl bg-black shadow-xl w-full max-w-sm
    
    `}
                    >
                        <Webcam
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            mirrored
                            className="
    h-full
    w-full
    object-cover
"
                            videoConstraints={{
                                facingMode: "user",
                            }}
                        />

                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-black/30" />

                        {/* Face guide */}
                        <div
                            className={`
                                absolute left-1/2 top-1/2
                                h-80 md:h-70 w-70
                                -translate-x-1/2 -translate-y-1/2
                                rounded-[100px]
                                border-2
                                transition-all duration-300
                                ${faceInside
                                    ? "border-green-500 shadow-[0_0_25px_rgba(34,197,94,0.7)]"
                                    : "border-red-500"
                                }
                            `}
                        />

                        {/* Status badge */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                            <div
                                className={`
                                    rounded-full px-3 py-1 text-xs font-medium backdrop-blur
                                    ${faceInside
                                        ? "bg-green-500/90 text-white"
                                        : "bg-red-500/90 text-white"
                                    }
                                `}
                            >
                                {faceInside
                                    ? "Face aligned"
                                    : "Align face properly"}
                            </div>
                        </div>

                        {/* Loading */}
                        {!modelsLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                                <div className="flex items-center gap-2 text-white">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Loading camera...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div
                        className={`
        flex items-center gap-3
        ${centered ? "justify-center" : ""}
    `}
                    >
                        {/* {onBack && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onBack}
                                className="rounded-full w-10 h-10"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        )} */}

                        <Button
                            type="button"
                            disabled={!faceInside || !modelsLoaded}
                            onClick={capture}
                            className="
                                rounded-full bg-maroon
                                hover:bg-maroon-dark
                                transition-all duration-200
                                hover:scale-[1.02]
                            "
                        >
                            <Camera className="mr-0.5 h-4 w-4" />
                            Capture
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <img
                        src={capturedImage}
                        alt="Captured"
                        className="
    w-full max-w-md
    rounded-3xl border shadow-lg
"
                    />

                    <div className={`flex ${centered ? 'justify-center' : 'justify-start'} gap-3`}>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={recapture}
                            className="rounded-full w-10 h-10 bg-gray-200"
                        >
                            <RefreshCcw className="mr-0.5 h-4 w-4" />
                            {/* Re-capture */}
                        </Button>

                        <Button
                            type="button"
                            onClick={() => {
                                if (
                                    capturedFile &&
                                    capturedImage
                                ) {
                                    onComplete(
                                        capturedFile,
                                        capturedImage
                                    );
                                }
                            }}
                            className="
                                rounded-full bg-maroon
                                hover:bg-maroon-dark w-10 h-10
                            "
                        >
                            <Check className="mr-0.5 h-4 w-4" />
                            {/* Continue */}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}