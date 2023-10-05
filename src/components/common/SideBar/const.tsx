'use client'
import {
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,

} from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'

export interface ILinks {
  text: string;
  link: string;
  icon: JSX.Element;
}

export const useNavigationLinks = () => {
  const  session = useSession();
  const userId = (session?.data?.user as any)?.id ?? 'default';

  const LinksAdmin: ILinks[] = [
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
  ];

  const LinksAgent: ILinks[] = [
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
  ];

  return { LinksAdmin, LinksAgent };
};