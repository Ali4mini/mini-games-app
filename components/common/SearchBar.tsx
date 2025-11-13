import React, { useMemo } from "react";
import { View, TextInput, TextInputProps } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { createStyles } from "./SearchBar.styles";

export const SearchBar: React.FC<TextInputProps> = (props) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Feather
        name="search"
        size={20}
        color={theme.textSecondary}
        style={styles.icon}
      />
      <TextInput
        placeholderTextColor={theme.textSecondary}
        style={styles.input}
        {...props} // Pass all TextInput props (value, onChangeText, etc.)
      />
    </View>
  );
};
