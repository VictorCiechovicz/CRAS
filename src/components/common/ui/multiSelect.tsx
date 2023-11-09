'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/src/lib/utils'

type MultiSelectOption = {
  value: string
  label: string
}


type MultiSelectProps = {
  options: MultiSelectOption[]
  selectedValues: string[]
  onChange: (values: string[]) => void;
}

const MultiSelect = ({
  options,
  selectedValues,
  onChange
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => {

    setIsOpen(prevIsOpen => !prevIsOpen);
  };

   const handleOptionClick = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  const isOptionSelected = (value: string) => selectedValues.includes(value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Element &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
         type="button"
        className="flex h-10 w-[308px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        onClick={toggleDropdown}
      >
        {selectedValues.length > 0
          ? selectedValues
              .map(val => options.find(option => option.value === val)?.label)
              .join(', ')
          :<p className='text-gray-500'>Selecione</p>}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md overflow-y-auto">
          {options.map(option => (
            <div
              key={option.value}
              className={cn(
                'flex w-full cursor-default select-none items-center py-1.5 px-8 text-sm',
                isOptionSelected(option.value) &&
                  'bg-accent text-accent-foreground'
              )}
              onClick={() => handleOptionClick(option.value)}
            >
              {isOptionSelected(option.value) && (
                <span className="absolute left-2">
                  <Check className="h-4 w-4" />
                </span>
              )}
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MultiSelect
