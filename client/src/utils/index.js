import axios from 'axios'

const customFetch = axios.create({
  baseURL: 'http://localhost:5000/project',
  withCredentials: true,
})

export default customFetch
