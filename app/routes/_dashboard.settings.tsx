import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from '@remix-run/react'
import { useRef } from 'react'

import { userPrefs } from '~/cookies.server'
import { useClickAway } from '~/lib/hooks'

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const apiKey = String(formData.get('api-key') || '').trim()

  if (apiKey.length !== 24) {
    return json({ message: 'Invalid API key' })
  }

  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await userPrefs.parse(cookieHeader)) || {}
  cookie.apiKey = apiKey

  return redirect('/', {
    headers: {
      'Set-Cookie': await userPrefs.serialize(cookie),
    },
  })
}

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await userPrefs.parse(cookieHeader)) || {}

  return json({ canClose: Boolean(cookie.apiKey) })
}

function Anchor({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-slate-800 underline"
    >
      {label}
    </a>
  )
}

export default function DashboardSettings() {
  const actionData = useActionData<typeof action>()
  const loaderData = useLoaderData<typeof loader>()
  const navigate = useNavigate()
  const ref = useRef(null)

  useClickAway(ref, () => {
    if (loaderData.canClose) {
      navigate(-1)
    }
  })

  return (
    <dialog
      open
      className="fixed left-0 top-0 grid h-full w-full place-items-center bg-white/50 p-5 backdrop-blur-lg"
    >
      <div
        ref={ref}
        className="max-w-xl rounded-lg border border-slate-100 bg-white p-5 shadow-md"
      >
        <h2 className="text-xl font-bold text-slate-800">Settings</h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          In order to see your analytics data, you need to provide your API key.
          Although you probably shouldn&apos;t do that, this is, unfortunately,
          the only way to authenticate you. It will be stored in a secure,
          http-only cookie on your browser. This project is open source, so you
          can always check the{' '}
          <Anchor
            href="https://github.com/rago4/dev-analytics"
            label="source code"
          />{' '}
          if you have any concerns.
        </p>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          <Anchor
            href="https://dev.to/settings/extensions#api"
            label="Click here"
          />{' '}
          to generate your API key.
        </p>
        <Form method="POST">
          <label
            htmlFor="api-key"
            className="mt-3 block text-sm font-medium text-slate-800"
          >
            API key
          </label>
          <input
            id="api-key"
            name="api-key"
            type="password"
            className="mt-0.5 block w-full rounded-md border border-slate-100 p-2 text-sm shadow"
            placeholder="Type..."
            autoComplete="off"
            required
          />
          {actionData?.message && (
            <p className="mt-1 text-sm text-red-500">{actionData.message}</p>
          )}
          <div className="mt-1.5 flex space-x-1">
            <button
              type="submit"
              className="block rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              Save
            </button>
          </div>
        </Form>
      </div>
    </dialog>
  )
}
