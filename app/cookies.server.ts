import { createCookie } from '@remix-run/node'

export const userPrefs = createCookie('user-prefs', {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 2_628_000, // 1 month
})
