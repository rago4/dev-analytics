import InterHref from '@fontsource/inter/latin-ext.css'
import type { LinksFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'

import TailwindHref from './tailwind.css'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: InterHref },
  { rel: 'stylesheet', href: TailwindHref },
]

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
