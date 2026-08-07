import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('App', () => App);
if (typeof document !== 'undefined') {
  const rootTag = document.getElementById('root');
  if (rootTag) {
    AppRegistry.runApplication('App', {
      initialProps: {},
      rootTag,
    });
  }
}
