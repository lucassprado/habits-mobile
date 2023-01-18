import { ScrollView, Text, View } from 'react-native'

import { generateDatesFromYearBeginning } from '../utils/generate-dates-from-year-beginning'

import { Header } from '../components/Header'
import { HabitDay, DAY_SIZE } from '../components/HabitDay'

const WEEK_DAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const DATES_FROM_YEAR_START = generateDatesFromYearBeginning()
const MININUM_SUMMARY_DATES_SIZE = 18 * 7
const AMOUNT_OF_DAYS_TO_FILL = MININUM_SUMMARY_DATES_SIZE - DATES_FROM_YEAR_START.length

export function Home() {
  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      <View
        className="flex-row mt-6 mb-2"
      >
        {WEEK_DAYS.map((weekDay, index) => {
          return (
            <Text
              key={`${weekDay}-${index}`}
              className="text-zinc-400 text-xl font-bold text-center mx-1"
              style={{ width: DAY_SIZE }}
            >
              {weekDay}
            </Text>
          )
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View className="flex-row flex-wrap">
          {DATES_FROM_YEAR_START.map((date) => {
            return (
              <HabitDay key={date.toString()} />
            )
          })}

          {AMOUNT_OF_DAYS_TO_FILL > 0 && Array
            .from({ length: AMOUNT_OF_DAYS_TO_FILL })
            .map((_, index) => {
              return (
                <View
                  key={index}
                  className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                  style={{ width: DAY_SIZE, height: DAY_SIZE }}  
                />
              )
            })
          }
        </View>
      </ScrollView>
    </View>
  )
}
