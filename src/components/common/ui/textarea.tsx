import * as React from 'react'

import { cn } from '@/src/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, maxLength, value, ...props }, ref) => {
    const valueLength = value?.toString()
    return (
      <>
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          maxLength={maxLength}
          ref={ref}
          {...props}
        />
        <p className="text-sm text-gray-500">
          {valueLength?.length || 0}/{maxLength}
        </p>
      </>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
