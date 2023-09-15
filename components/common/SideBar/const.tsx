import {
  UserGroupIcon,
  ArrowRightIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline'

export interface ILinks {
  text: string
  link: string
  icon: JSX.Element
  links?: {
    text: string
    link: string
  }[]
}

export const LinksAdmin: ILinks[] = [
  {
    text: 'Início',
    link: '/home',
    icon: <UserGroupIcon />
  },
  {
    text: 'Cadastros',
    link: '#',
    icon: <ClipboardDocumentListIcon />
  },
  {
    text: 'Aprovações',
    link: '#',
    icon: <ClipboardDocumentCheckIcon />
  },
  {
    text: 'Agentes',
    link: '#',
    icon: <UserPlusIcon />
  },
  {
    text: 'Sair',
    link: '#',
    icon: <ArrowRightIcon />
  }
]

export const LinksAgent: ILinks[] = [
  {
    text: 'Início',
    link: '#',
    icon: <UserGroupIcon />
  },
  {
    text: 'Cadastros',
    link: '#',
    icon: <ClipboardDocumentListIcon />
  },

  {
    text: 'Sair',
    link: '#',
    icon: <ArrowRightIcon />
  }
]
