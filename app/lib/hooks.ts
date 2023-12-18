import type { RefObject } from 'react'
import { useEffect } from 'react'

export function useClickAway<T extends HTMLElement>(
  ref: RefObject<T>,
  callback: VoidFunction
) {
  useEffect(() => {
    function handler(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, callback])
}
