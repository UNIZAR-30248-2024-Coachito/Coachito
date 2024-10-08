import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Dashboard: undefined;
  Routine: undefined;
  Profile: undefined;
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
