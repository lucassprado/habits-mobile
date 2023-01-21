import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Home } from '../screens/Home'
import { DayHabit } from '../screens/DayHabit'
import { NewHabit } from '../screens/NewHabit'

const { Navigator, Screen } = createNativeStackNavigator()

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen
        name="home"
        component={Home}
      />

      <Screen
        name="new"
        component={NewHabit}
      />

      <Screen
        name="habit"
        component={DayHabit}
      />

    </Navigator>
  )
}
