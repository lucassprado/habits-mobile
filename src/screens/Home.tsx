import { useCallback, useState } from 'react'
import { Alert, ScrollView, Text, View } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import dayjs from 'dayjs'

import { api } from '../lib/axios'
import { generateDatesFromYearBeginning } from '../utils/generate-dates-from-year-beginning'

import { Header } from '../components/Header'
import { Loading } from '../components/Loading'
import { HabitDay, daySize } from '../components/HabitDay'

type SummaryProps = Array<{
  id: string
  date: string
  amount: number
  completed: number
}>

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const datesFromYearStart = generateDatesFromYearBeginning()
const minimumSummaryDatesSize = 18 * 7
const amountOfDaysToFill = minimumSummaryDatesSize - datesFromYearStart.length

export function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [summary, setSummary] = useState<SummaryProps | null>(null)
  const { navigate } = useNavigation()

  async function fetchData() {
    try {
      setIsLoading(true)
      const response = await api.get('/summary')
      setSummary(response.data)
    } catch (error) {
      Alert.alert('Ops', 'Não foi possível carregar o sumário de hábitos.')
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [])
  )

  if (isLoading) {
    return <Loading />
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      <View
        className="flex-row mt-6 mb-2"
      >
        {weekDays.map((weekDay, index) => {
          return (
            <Text
              key={`${weekDay}-${index}`}
              className="text-zinc-400 text-xl font-bold text-center mx-1"
              style={{ width: daySize }}
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
        {summary && (
          <View className="flex-row flex-wrap">
            {datesFromYearStart.map((date) => {
              const dayHabits = summary.find(day => {
                return dayjs(date).isSame(day.date, 'day')
              })
              
              return (
                <HabitDay
                  key={date.toString()}
                  date={date}
                  amount={dayHabits?.amount}
                  completed={dayHabits?.completed}
                  onPress={() => navigate('habit', { date: date.toISOString() })}  
                />
              )
            })}

            {amountOfDaysToFill > 0 && Array
              .from({ length: amountOfDaysToFill })
              .map((_, index) => {
                return (
                  <View
                    key={index}
                    className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                    style={{ width: daySize, height: daySize }}  
                  />
                )
              })
            }
          </View>
        )}
      </ScrollView>
    </View>
  )
}
