import { Breadcrumbs, PathProps } from './Breadcrumbs'

interface HeaderProps {
  children?: React.ReactNode
  paths?: PathProps[]
  title: string
}

export function PageHeading({ children, paths, title }: HeaderProps) {
  return (
    <div className="flex flex-wrap justify-between items-center mb-14">
      <div>
        <h1 className="mt-4 text-3xl font-semibold">{title}</h1>
        {paths ? <Breadcrumbs paths={paths} /> : null}
      </div>

      <div className="flex">{children}</div>
    </div>
  )
}
