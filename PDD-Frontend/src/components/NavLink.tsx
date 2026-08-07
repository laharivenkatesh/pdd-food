import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { forwardRef } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

interface NavLinkCompatProps {
  to: string;
  children?: React.ReactNode;
  style?: any;
  activeStyle?: any;
  onPress?: () => void;
}

const NavLink = forwardRef<any, NavLinkCompatProps>(
  ({ to, children, style, activeStyle, onPress, ...props }, ref) => {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const isActive = route.name === to;

    const handlePress = () => {
      if (onPress) onPress();
      navigation.navigate(to as never);
    };

    return (
      <TouchableOpacity
        ref={ref}
        onPress={handlePress}
        style={[style, isActive && activeStyle]}
        {...props}
      >
        {typeof children === 'string' ? <Text>{children}</Text> : children}
      </TouchableOpacity>
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };

const styles = StyleSheet.create({});
