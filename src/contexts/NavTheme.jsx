import { createContext, useContext, useState } from 'react'

const NavThemeContext = createContext({ isDark: false, setIsDark: () => {} })

export function NavThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false)
  return (
    <NavThemeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </NavThemeContext.Provider>
  )
}

export function useNavTheme() {
  return useContext(NavThemeContext)
}
