import { useQuery } from 'react-query'
import client from 'utils'
import { Task } from '../types/types'

const getTasks = async () => {
  const { data } = await client.get('api/tasks/')
  return data
}

export const useQueryTasks = () => {
  return useQuery({
    queryKey: 'tasks',
    queryFn: getTasks,
    cacheTime: 10000,
    staleTime: 0,
  })
}
