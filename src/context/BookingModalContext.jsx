import { createContext, useContext, useMemo, useState } from 'react'

const BookingModalContext = createContext(null)

// Единая модалка на всё приложение вместо прокидывания open/close
// пропсами через Hero → Nav → Invitation до самой формы.
export function BookingModalProvider({ children }) {
  const [isOpen, setOpen] = useState(false)

  const value = useMemo(
    () => ({
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
    }),
    [isOpen],
  )

  return <BookingModalContext.Provider value={value}>{children}</BookingModalContext.Provider>
}

export function useBookingModal() {
  const ctx = useContext(BookingModalContext)
  if (!ctx) throw new Error('useBookingModal должен вызываться внутри BookingModalProvider')
  return ctx
}
