import React from 'react';
import { View } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';

interface FormTextFieldProps extends TextInputProps {
  label?: string;
}

const FormTextFields: React.FC<FormTextFieldProps> = ({ label, ...rest }) => {
  return (
    <View style={{ marginVertical: 5 }}>
      <TextInput
        label={label} // Paper handles labels automatically
        mode="outlined" // Gives a nice outlined style
        autoCapitalize="none"
        style={{ marginVertical: 5 }}
        {...rest}
      />
    </View>
  );
};

export default FormTextFields;
