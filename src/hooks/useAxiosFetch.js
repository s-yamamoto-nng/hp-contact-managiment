import { useState, useEffect } from 'react'
import { client } from 'utils'

const useAxiosFetch = (url, timeout) => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unmounted = false
    let source = client.CancelToken.source()
    client
      .get(url, {
        cancelToken: source.token,
        timeout: timeout,
      })
      .then(a => {
        if (!unmounted) {
          setData(a.data)
          setLoading(false)
        }
      })
      .catch(function(e) {
        if (!unmounted) {
          setError(true)
          setErrorMessage(e.message)
          setLoading(false)
          if (client.isCancel(e)) {
            console.log(`request cancelled:${e.message}`)
          } else {
            console.log('another error happened:' + e.message)
          }
        }
      })
    return function() {
      unmounted = true
      source.cancel('Cancelling in cleanup')
    }
  }, [url, timeout])

  return { data, loading, error, errorMessage }
}

export default useAxiosFetch
