import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { forwardRef } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

interface NavLinkCompatProps {
  to: string;
  children?: React.ReactNode;
  style?: any;
  activeStyle?: any;
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  onPress?: () => void;
}

const NavLink = forwardRef<any, NavLinkCompatProps>(
  ({ children, to, style, activeStyle, onPress, ...props }, ref) => {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const isActive = route.name.toLowerCase() === (to || '').replace(/^\//, '').toLowerCase();

    const handlePress = () => {
      if (onPress) onPress();
      if (to) {
        const screenName = to.replace(/^\//, '');
        const formattedScreen = screenName ? screenName.charAt(0).toUpperCase() + screenName.slice(1) : 'Home';
        navigation.navigate(formattedScreen);
      }
    };

    return (
      <TouchableOpacity
        ref={ref}
        onPress={handlePress}
        style={[style, isActive && activeStyle]}
        activeOpacity={0.7}
      >
        {typeof children === 'string' ? <Text>{children}</Text> : children}
      </TouchableOpacity>
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };

