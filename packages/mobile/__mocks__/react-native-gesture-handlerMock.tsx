import { TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

jest.mock('react-native-gesture-handler', () => ({
  ScrollView: View,
  Orientation: {},
  TouchableWithoutFeedback: TouchableWithoutFeedback,
  TouchableOpacity: TouchableOpacity,
  Direction: {},
}));
