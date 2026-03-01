import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/wavesurfer')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(public)/wavesurfer"!</div>
}
