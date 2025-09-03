// utils/qrCodeGenerator.tsx
import React from "react";
import { View } from "react-native";
import { QrCodeSvg } from "react-native-qr-svg";

type QRCodeProps = {
  reservation: {
    id: number;
    user_name: string;
    facility: string;
    date: string;
    start_time: string;
    end_time: string;
    reservation_token: string;
    digital_signature: string;
  };
  size?: number;
};

export function ReservationQRCode({ reservation, size = 250 }: QRCodeProps) {
  // Prepare JSON string with all reservation details
  const qrData = JSON.stringify({
    id: reservation.id,
    name: reservation.user_name,
    facility: reservation.facility,
    date: reservation.date,
    start_time: reservation.start_time,
    end_time: reservation.end_time,
    reservation_token: reservation.reservation_token,
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
