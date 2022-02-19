import client from 'utils'
import { useAppDispatch } from '../app/hooks'
import { resetEditedProject } from '../slices/projectSlice'
import { useQueryClient, useMutation } from 'react-query'

export const useMutateProject = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  const createProjectMutation = useMutation(project => client.post('/api/project', project), {
    onSuccess: res => {
      const previousProjects = queryClient.getQueryData('projects')
      if (previousProjects) {
        queryClient.setQueryData('projects', [...previousProjects, res.data])
      }
      dispatch(resetEditedProject())
    },
  })
  const updateProjectMutation = useMutation(project => client.put(`/api/projects/${project.id}/`, project), {
    onSuccess: (res, variables) => {
      const previousProjects = queryClient.getQueryData('projects')
      if (previousProjects) {
        queryClient.setQueryData(
          'projects',
          previousProjects.map(project => (project.id === variables.id ? res.data : project))
        )
      }
      dispatch(resetEditedProject())
    },
  })
  const deleteProjectMutation = useMutation(id => client.delete(`api/projects/${id}/`), {
    onSuccess: (res, variables) => {
      const previousProjects = queryClient.getQueryData('projects')
      if (previousProjects) {
        queryClient.setQueryData(
          'projects',
          previousProjects.filter(project => project.id !== variables)
        )
      }
      dispatch(resetEditedProject())
    },
  })
  return { deleteProjectMutation, createProjectMutation, updateProjectMutation }
}
