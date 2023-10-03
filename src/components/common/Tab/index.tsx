'use client';

import { useRouter } from 'next/navigation';

export interface TabProps {
  options: {
    title: string;
    url?: string;
    active?: boolean;
    onClick?: () => void;
  }[];
}

export function Tab({ options }: TabProps) {
  const router = useRouter();

  const handleClick = (option: TabProps['options'][0]) => {
    if (option.url) {
      router.push(option.url);
    }
    if (option.onClick) {
      option.onClick();
    }
  };

  return (
    <div className="flex gap-6 pb-10 border-b">
      {options.map((option) => (
        <p
          key={option.title}
          className={`cursor-pointer font-medium text-sm leading-5 ${
            option.active
              ? 'text-gray-700 border-b-2 border-primary-500 mb-[-20px]'
              : 'text-gray-500'
          }`}
          onClick={() => handleClick(option)}
        >
          {option.title}
        </p>
      ))}
    </div>
  );
}
