import Entypo from '@expo/vector-icons/Entypo';
import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';

interface FormTextFieldProps extends TextInputProps {
  label?: string;
}

const FormTextFields: React.FC<FormTextFieldProps> = ({ 
  label, 
  secureTextEntry = false,
  ...rest 
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  // If it's a password field, add the eye icon
  if (secureTextEntry) {
    return (
      <View style={{ marginVertical: 5 }}>
        <TextInput
          label={label}
          mode="outlined"
          autoCapitalize="none"
          style={{ marginVertical: 5 }}
          secureTextEntry={!isPasswordVisible}
          right={
            <TextInput.Icon
              icon={({ size, color }) => (
                <Entypo 
                  name={isPasswordVisible ? "eye" : "eye-with-line"} 
                  size={size} 
                  color={color} 
                />
              )}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              forceTextInputFocus={false}
            />
          }
          {...rest}
        />
      </View>
    );
  }

  // Regular text input (no password toggle)
  return (
    <View style={{ marginVertical: 5 }}>
      <TextInput
        label={label}
        mode="outlined"
        autoCapitalize="none"
        style={{ marginVertical: 5 }}
        {...rest}
      />
    </View>
  );
};

export default FormTextFields;