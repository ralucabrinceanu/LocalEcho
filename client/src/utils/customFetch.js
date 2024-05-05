import axios from 'axios'

const customFetch = axios.create({
  baseURL: '/project',
})

export default customFetch
