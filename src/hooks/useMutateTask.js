import client from 'utils'
import { useAppDispatch } from '../app/hooks'
import { resetEditedTask } from '../slices/todoSlice'
import { useQueryClient, useMutation } from 'react-query'
import { Task, EditTask } from '../types/types'

export const useMutateTask = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  const createTaskMutation = useMutation(task => client.post('/api/tasks/', task), {
    onSuccess: res => {
      const previousTodos = queryClient.getQueryData('tasks')
      if (previousTodos) {
        queryClient.setQueryData('tasks', [...previousTodos, res.data])
      }
      dispatch(resetEditedTask())
    },
  })
  const updateTaskMutation = useMutation(task => client.put(`/api/tasks/${task.id}/`, task), {
    onSuccess: (res, variables) => {
      const previousTodos = queryClient.getQueryData('tasks')
      if (previousTodos) {
        queryClient.setQueryData(
          'tasks',
          previousTodos.map(task => (task.id === variables.id ? res.data : task))
        )
      }
      dispatch(resetEditedTask())
    },
  })
  const deleteTaskMutation = useMutation(id => client.delete(`api/tasks/${id}/`), {
    onSuccess: (res, variables) => {
      const previousTodos = queryClient.getQueryData('tasks')
      if (previousTodos) {
        queryClient.setQueryData(
          'tasks',
          previousTodos.filter(task => task.id !== variables)
        )
      }
      dispatch(resetEditedTask())
    },
  })
  return { deleteTaskMutation, createTaskMutation, updateTaskMutation }
}
