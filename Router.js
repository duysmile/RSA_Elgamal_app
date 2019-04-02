import { createStackNavigator } from 'react-navigation';
import HomeScreen from './HomeScreen';
import RSAScreen from './RSAScreen';
import ElgamalScreen from './ElgamalScreen';

const MainNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  RSA: { screen: RSAScreen },
  Elgamal: { screen: ElgamalScreen }
});

// const Router = createAppContainer(MainNavigator);

export default MainNavigator;
