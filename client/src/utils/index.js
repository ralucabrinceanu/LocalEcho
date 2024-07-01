import axios from 'axios'

const customFetch = axios.create({
  baseURL: 'http://localhost:5000/project',
  withCredentials: true,
})

export default customFetch

export const formatPrice = (price) => {
  const roni = new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'RON',
  }).format((price / 100).toFixed(2))
  return roni
}
