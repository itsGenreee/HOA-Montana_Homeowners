import { View, Text, TextInput, TextInputProps } from 'react-native';
import React from 'react';

interface FormTextFieldProps extends TextInputProps {
  label?: string;
}

const FormTextFields: React.FC<FormTextFieldProps> = ({ label, ...rest }) => {
  return (
    <View>
      {label && <Text style={{ marginTop: 5 }}>{label}</Text>}
      <TextInput 
        style={{       
          marginVertical: 5,
          borderWidth: 1,
          borderColor: "black",
          borderRadius: 6 
        }}
        autoCapitalize="none"
        {...rest}  // Spread all TextInput props
      />
    </View>
  );
};

export default FormTextFields;