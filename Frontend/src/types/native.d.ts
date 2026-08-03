declare module 'react' {
  export const useState: any;
  export const useEffect: any;
  export const useContext: any;
  export const createContext: any;
  export const useMemo: any;
  export const useCallback: any;
  export const useRef: any;
  export const forwardRef: any;
  export type ReactNode = any;
  export type FC<P = {}> = any;
  export default any;
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module '@tanstack/react-query' {
  export const QueryClient: any;
  export const QueryClientProvider: any;
  export const useQuery: any;
  export const useMutation: any;
  export const useQueryClient: any;
}

declare module 'react-native' {
  export const View: any;
  export const Text: any;
  export const StyleSheet: any;
  export const TouchableOpacity: any;
  export const TextInput: any;
  export const ScrollView: any;
  export const Image: any;
  export const Linking: any;
  export const Platform: any;
  export const Dimensions: any;
  export const Animated: any;
}

declare module '@react-navigation/native' {
  export const NavigationContainer: any;
  export const useNavigation: any;
  export const useRoute: any;
}

declare module '@react-navigation/native-stack' {
  export const createNativeStackNavigator: any;
}

declare module 'react-native-maps' {
  const MapView: any;
  export const Marker: any;
  export const Callout: any;
  export default MapView;
}

declare module '@expo/vector-icons' {
  export const Ionicons: any;
  export const Feather: any;
  export const MaterialIcons: any;
  export const MaterialCommunityIcons: any;
  export const FontAwesome: any;
  export const Lucide: any;
}
