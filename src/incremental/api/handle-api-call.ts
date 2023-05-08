export default function handleApiCall(apiCall: Promise<Response>, onError: (error: any) => void): Promise<Response> {
  return new Promise((resolve, reject) => {
    apiCall
      .then(async response => {
        if (response.status !== 200) {
          const result = await (response.json() || response.text())
          onError(result)
          reject(result)
        } else {
          resolve(response)
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          const lo = document.getElementById("logout")
          lo?.click()
        } else {
          onError(error)
        }
        
        reject(error)
      })
  })
}