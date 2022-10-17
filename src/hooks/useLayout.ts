import { useLayoutEffect, useState } from 'react'

export const useLayout = (id: string) => {
  const [size, setSize] = useState(0)
  const element = document.getElementById(id)
  console.log(element, 'element', id)
  useLayoutEffect(() => {
    const updateSize = () => {
      if (!element) return
      setSize(element.clientWidth)
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [element])
  return size
}
