import type { LoaderFunctionArgs } from '@remix-run/node'

import { userPrefs } from '~/cookies.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookie = (await userPrefs.parse(request.headers.get('Cookie'))) || {}
  return { auth: Boolean(cookie.apiKey) }
}
