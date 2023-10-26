"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CaptionProps, DayPicker } from "react-day-picker";

import { cn } from "@/src/lib/utils";
import { buttonVariants } from "@/src/components/common/ui/button";

const calendarClassNames = {
  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
  month: "space-y-4",
  caption: "flex justify-center pt-1 relative items-center",
  caption_label: "text-sm font-medium",
  nav: "space-x-1 flex items-center",
  nav_button: cn(
    buttonVariants({ variant: "outline" }),
    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
  ),
  nav_button_previous: "absolute left-1",
  nav_button_next: "absolute right-1",
  table: "w-full border-collapse space-y-1",
  head_row: "flex",
  head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
  row: "flex w-full mt-2",
  cell: "text-center text-sm p-0 relative",
  day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 p-0 font-normal"),
  day_selected: "bg-primary text-primary-foreground",
  day_today: "bg-accent text-accent-foreground",
  day_outside: "text-muted-foreground opacity-50",
  day_disabled: "text-muted-foreground opacity-50",
  day_range_middle:
    "aria-selected:bg-accent aria-selected:text-accent-foreground",
  day_hidden: "invisible",
};

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function CustomCaption({ displayMonth }: CaptionProps) {
  const [selectedMonth, setSelectedMonth] = useState(displayMonth.getMonth());
  const [selectedYear, setSelectedYear] = useState(displayMonth.getFullYear());

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(Number(event.target.value));
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(event.target.value));
  };

  return (
    <div className="flex justify-center pt-1 relative items-center">
      <span className="text-sm font-medium">Mês:</span>
      <select value={selectedMonth} onChange={handleMonthChange}>
        {months.map((monthName, idx) => (
          <option key={idx} value={idx}>
            {monthName}
          </option>
        ))}
      </select>
      <span className="text-sm font-medium">Ano:</span>
      <select value={selectedYear} onChange={handleYearChange}>
        {Array.from({ length: 96 }).map((_, idx) => {
          const currentYear = 1930 + idx;
          return (
            <option key={idx} value={currentYear}>
              {currentYear}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const selectedDate =
    props.selected instanceof Date ? props.selected : new Date();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{ ...calendarClassNames, ...classNames }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
        Caption: CustomCaption,
      }}
      captionLayout="dropdown-buttons"
      fromYear={1930}
      toYear={2025}
      month={new Date(selectedDate.getFullYear(), selectedDate.getMonth())}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
