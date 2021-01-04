export default (blob, fileName) => {
  let a = document.createElement('a')
  document.body.appendChild(a)
  a.style.setProperty('style', 'none')
  let url = window.URL.createObjectURL(blob)
  a.href = url
  a.download = fileName
  a.click()
  window.URL.revokeObjectURL(url)
}