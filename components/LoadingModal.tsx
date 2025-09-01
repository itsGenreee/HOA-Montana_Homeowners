import React from 'react';
import { ActivityIndicator, Modal, Portal, Text } from 'react-native-paper';

interface LoadingModalProps {
  visible: boolean;
  message?: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ visible, message }) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        dismissable={false}
        contentContainerStyle={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          margin: 20,
        }}
      >
        <ActivityIndicator animating={true} size="large" />
        {message && (
          <Text style={{ marginTop: 10, textAlign: 'center' }}>
            {message}
          </Text>
        )}
      </Modal>
    </Portal>
  );
};

export default LoadingModal;
