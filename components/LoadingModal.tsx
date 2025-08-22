import { StyleSheet, View, Text, Modal, ActivityIndicator } from "react-native";

type LoadingModalProps = {
  visible: boolean;
  message?: string;
};

export default function LoadingModal({ visible, message }: LoadingModalProps) {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#fff" />
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 20,
    backgroundColor: "#333",
    borderRadius: 8,
    alignItems: "center",
  },
  message: {
    marginTop: 10,
    color: "#fff",
    fontSize: 16,
  },
});
