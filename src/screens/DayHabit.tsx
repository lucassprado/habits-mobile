import { useEffect, useState } from 'react'
import { Alert, ScrollView, Text, View } from 'react-native'
import { useRoute } from '@react-navigation/native'
import dayjs from 'dayjs'
import clsx from 'clsx'

import { api } from '../lib/axios'
import { generateProgressPercentage } from '../utils/generate-progress-percentage'

import { BackButton } from '../components/BackButton'
import { ProgressBar } from '../components/ProgressBar'
import { Checkbox } from '../components/Checkbox'
import { Loading } from '../components/Loading'
import { EmptyHabits } from '../components/EmptyHabits'

interface DayHabitParams {
  date: string
}

interface DayInfoProps {
  completed: string[]
  possibleHabits: {
    id: string
    title: string
  }[]
}

export function DayHabit() {
  const [isLoading, setIsLoading] = useState(true)
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null)
  const [completedHabits, setCompletedHabits] = useState<string[]>([])

  const route = useRoute()
  const { date } = route.params as DayHabitParams

  const parsedDate = dayjs(date)
  const isDatePassed = parsedDate.endOf('day').isBefore(new Date())
  const dayOfWeek = parsedDate.format('dddd')
  const dayAndMonth = parsedDate.format('DD/MM')

  const habitsProgress = dayInfo?.possibleHabits.length
    ? generateProgressPercentage(dayInfo.possibleHabits.length , completedHabits.length)
    : 0

  async function fetchHabits() {
    try {
      setIsLoading(true)
      const response = await api.get('/day', { params: { date } })
      setDayInfo(response.data)
      setCompletedHabits(response.data.completedHabits)
    } catch (err) {
      console.log(err)
      Alert.alert('Ops', 'Não foi possível carregar as informações dos hábitos.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleToggleHabit(habitId: string) {
    try {
      await api.patch(`/habits/${habitId}/toggle`)

      if (completedHabits.includes(habitId)) {
        setCompletedHabits(previous => previous.filter(habit => habit !== habitId))
      } else {
        setCompletedHabits(previous => [...previous, habitId])
      }
    } catch (err) {
      console.log(err)
      Alert.alert('Ops', 'Não foi possível atualizar o status do hábito.')
    }
  }

  useEffect(() => {
    fetchHabits()
  }, [])

  if (isLoading) {
    return <Loading />
  }
  
  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>

        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View className={clsx("mt-6", {
          ["opacity-50"]: isDatePassed
        })}>
          {dayInfo?.possibleHabits ? (
            dayInfo.possibleHabits.map(habit => {
              return (
                <Checkbox
                  key={habit.id}
                  title={habit.title}
                  checked={completedHabits.includes(habit.id)}
                  disabled={isDatePassed}
                  onPress={() => handleToggleHabit(habit.id)}
                />
              )
            })
          ) : <EmptyHabits />}
        </View>

        {isDatePassed && (
          <Text className="text-white mt-10 text-center">
            Você não pode editar hábitos em uma data passada.
          </Text>
        )}
      </ScrollView>
    </View>
  )
}
