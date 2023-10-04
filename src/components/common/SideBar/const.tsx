import {
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,

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


const userId='123'
export const LinksAdmin: ILinks[] = [
  {
    text: 'Início',
    link: '/home',
    icon: <UserGroupIcon />
  },
  {
    text: 'Cadastros',
    link: `/managementFamily/${userId}`,
    icon: <ClipboardDocumentListIcon />
  },
  {
    text: 'Aprovações',
    link: '/approved',
    icon: <ClipboardDocumentCheckIcon />
  },
  
]

export const LinksAgent: ILinks[] = [
  {
    text: 'Início',
    link: '/home',
    icon: <UserGroupIcon />
  },
  {
    text: 'Cadastros',
    link: `/managementFamily/${userId}`,
    icon: <ClipboardDocumentListIcon />
  }
]
