import { QRCodeSVG } from "qrcode.react";
import { Wifi } from "lucide-react";

interface CheckInQRCodeProps {
  /** The public URL visitors will land on when they scan — e.g. https://visitmi.com/check-in */
  checkInUrl?: string;
}

export default function CheckInQRCode({
  checkInUrl = window.location.href, // defaults to current page URL
}: CheckInQRCodeProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* QR frame */}
      <div
        className="
          relative flex items-center justify-center
          rounded-3xl border border-dashed border-[#8b1a30]/20
          bg-linear-to-br from-[#faf6f8] to-white
          p-4
        "
      >
        {/* Corner bracket accents */}
        {[
          "top-1 left-1 border-t-2 border-l-2 rounded-tl-xl",
          "top-1 right-1 border-t-2 border-r-2 rounded-tr-xl",
          "bottom-1 left-1 border-b-2 border-l-2 rounded-bl-xl",
          "bottom-1 right-1 border-b-2 border-r-2 rounded-br-xl",
        ].map((cls, i) => (
          <span
            key={i}
            className={`absolute h-5 w-5 ${cls}`}
            style={{ borderColor: "#8b1a30" }}
          />
        ))}

        {/* Actual QR code */}
        <QRCodeSVG
          value={checkInUrl}
          size={100}
          fgColor="#3f0b1a"
          bgColor="transparent"
          level="M"               // M = medium error correction — good balance
        //   imageSettings={{
            // Optional: embed your logo in the centre of the QR
            // src: "/logo.png",
            // height: 24,
            // width: 24,
            // excavate: true,
        //   }}
        />
      </div>

      {/* Label */}
      <div className="flex flex-col items-center gap-1 text-center">
        <div className="flex items-center gap-1.5">
          <Wifi size={12} className="text-[#8b1a30]" />
          <p className="text-xs font-semibold text-gray-700">
            Scan to check in on your phone
          </p>
        </div>
        <p className="text-[10px] text-gray-400 max-w-45 leading-relaxed">
          Point your camera at the QR code — no app needed
        </p>
      </div>
    </div>
  );
}