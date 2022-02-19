import { useQuery } from 'react-query'
import client from 'utils'

const getProjects = async () => {
  const { data } = await client.get('api/projects/')
  return data
}

export const useQueryTasks = () => {
  return useQuery({
    queryKey: 'projects',
    queryFn: getProjects,
    cacheTime: 10000,
    staleTime: 0,
  })
}