// utils/qrCodeGenerator.tsx
import React from "react";
import { View } from "react-native";
import { QrCodeSvg } from "react-native-qr-svg";

type QRCodeProps = {
  reservation: {
    id: number;
    user_id: number;          // must exist for signature
    first_name?: string;      // UI only
    last_name?: string;       // UI only
    facility: string;         // UI only (name)
    facility_id: number;      // must exist for signature
    date: string;
    start_time: string;
    end_time: string;
    reservation_token: string;
    digital_signature: string;
  };
  size?: number;
};

export function ReservationQRCode({ reservation, size = 280 }: QRCodeProps) {
  // Signed payload: must match backend signing exactly
  const signedPayload = {
    user_id: reservation.user_id,
    facility_id: reservation.facility_id,
    date: reservation.date,
    start_time: reservation.start_time,
    end_time: reservation.end_time,
    reservation_token: reservation.reservation_token,
  };

  // QR data includes the signed payload + digital signature
  const qrData = JSON.stringify({
    ...signedPayload,
    digital_signature: reservation.digital_signature,
  });

  return (
    <View style={{ alignItems: "center" }}>
      <QrCodeSvg
        value={qrData}
        frameSize={size}
        dotColor="black"
        backgroundColor="white"
      />
    </View>
  );
}
