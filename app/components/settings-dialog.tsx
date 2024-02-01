import { Form } from '@remix-run/react'
import { useEffect, useState } from 'react'

import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'

export function SettingsDialog({
  error,
  initialOpen,
}: {
  error: string
  initialOpen: boolean
}) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    setOpen(initialOpen)
  }, [initialOpen])
  return (
    <Dialog open={open} onOpenChange={initialOpen ? undefined : setOpen}>
      <DialogTrigger asChild>
        <button className="hover:underline">Settings</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Please provide your API key in order to see analytics data for your
            profile. Although it's discouraged to share your key anywhere, it's
            unfortunately the only way you can be authenticated. Your key will
            be stored in a secure cookie in your browser. If you have any
            concerns, you can always check out the{' '}
            <Link href="https://github.com/rago4/dev-analytics">
              source code
            </Link>
            . To generate key for your profile, visit the{' '}
            <Link href="https://dev.to/settings/extensions#api">
              Settings &gt; Extensions
            </Link>{' '}
            page.
          </DialogDescription>
          <Form action="?index" method="POST">
            <Label id="api-key">API key</Label>
            <Input
              id="api-key"
              name="api-key"
              type="password"
              placeholder="Type here..."
              required
            />
            {error ? (
              <p className="mt-1 text-xs text-red-600">{error}</p>
            ) : null}
            <Button type="submit" className="mt-1">
              Save
            </Button>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

function Link(props: JSX.IntrinsicElements['a']) {
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      {...props}
      target="_blank"
      rel="noreferrer"
      className="text-slate-800 underline"
    />
  )
}
