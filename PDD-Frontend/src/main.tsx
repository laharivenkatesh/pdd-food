import * as RN from 'react-native';

if (typeof window !== 'undefined') {
  if (typeof (window as any).CustomEvent !== 'function') {
    (window as any).CustomEvent = function CustomEvent(event: string, params: any) {
      params = params || { bubbles: false, cancelable: false, detail: null };
      return { type: event, detail: params?.detail, bubbles: !!params?.bubbles, cancelable: !!params?.cancelable };
    };
  }
  if (!(RN as any).NativeEventEmitter) {
    (RN as any).NativeEventEmitter = class NativeEventEmitter {
      addListener() { return { remove: () => {} }; }
      removeSubscription() {}
      removeAllListeners() {}
      emit() {}
    };
  }
  if (!(window as any).ExpoModules) {
    (window as any).ExpoModules = (window as any).ExpoModules || {};
  }
}

import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
