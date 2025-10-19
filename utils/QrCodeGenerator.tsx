// utils/qrCodeGenerator.tsx
import React from "react";
import { Text, View } from "react-native";
import { QrCodeSvg } from "react-native-qr-svg";

type QRCodeProps = {
  reservation: {
    id?: number;
    facility?: string;
    date?: string;
    start_time?: string;
    end_time?: string;
    reservation_token: string;
    digital_signature: string;
  };
  size?: number;
};

export function ReservationQRCode({ reservation, size = 280 }: QRCodeProps) {
  const qrData = JSON.stringify({
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
      {/* Display info for humans reading the QR code */}
      <View style={{ marginTop: 10, alignItems: 'center' }}>
        <Text style={{ fontSize: 14, color: '#999', marginTop: 4 }}>
          Scan for check-in
        </Text>
      </View>
    </View>
  );
}