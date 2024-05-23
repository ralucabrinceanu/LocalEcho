import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
// import Cookies from 'js-cookie'

const themes = {
  cupcake: 'cupcake',
  sunset: 'sunset',
}

const getUserFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem('user')) || null
}

const getThemeFromLocalStorage = () => {
  const theme = localStorage.getItem('theme') || themes.cupcake
  document.documentElement.setAttribute('data-theme', theme)
  return theme
}

const initialState = {
  user: getUserFromLocalStorage(),
  theme: getThemeFromLocalStorage(),
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      console.log(action.payload)
      const { user, token } = action.payload
      const updatedUser = { ...user, token }
      state.user = updatedUser
      localStorage.setItem('user', JSON.stringify(updatedUser))
    },
    logoutUser: (state) => {
      // console.log(JSON.parse(JSON.stringify(state.user)))
      // console.log(Cookies.get('tokenName'))
      state.user = null
      localStorage.removeItem('user')
      // Cookies.remove('tokenName')
      toast.success('Logged out successfully')
    },
    toggleTheme: (state) => {
      const { cupcake, sunset } = themes
      state.theme = state.theme === cupcake ? sunset : cupcake
      document.documentElement.setAttribute('data-theme', state.theme)
      localStorage.setItem('theme', state.theme)
    },
  },
})

export const { loginUser, logoutUser, toggleTheme } = userSlice.actions
export default userSlice.reducer
