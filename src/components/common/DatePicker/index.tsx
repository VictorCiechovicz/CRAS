'use client';

import { ReactElement, ReactNode, useState } from 'react';
import ReactDatePicker, {
  ReactDatePickerProps,
  registerLocale,
} from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';

registerLocale('ptBR', ptBR);

import { DatePickerHeader } from './DatePickerHeader';

import 'react-datepicker/dist/react-datepicker.css';
import './date-picker.css';

export interface DatePickerProps extends ReactDatePickerProps {
  label?: string;
  required?: boolean;
  placeholder?: string;
  handleChangeDate?: (value: Date) => void;
  disabled?: boolean;
  showTimeSelect?: boolean;
  showTimeSelectOnly?: boolean;
  icon?: ReactElement;
}

export function DatePicker({
  selected,
  dateFormat = 'dd/MM/yyyy',
  customInput,
  label,
  placeholder,
  handleChangeDate,
  required = true,
  disabled = false,
  showTimeSelect,
  showTimeSelectOnly,
  icon,
}: DatePickerProps) {
  const [getSelected, setSelected] = useState(selected);

  const handleSelect = (date: Date) => {
    setSelected(date);
    handleChangeDate && handleChangeDate(date);
  };

  return (
    <>
      {label && (
        <label className="label">
          {label}
          {required && '*'}
        </label>
      )}

      <div className="mt-2">
        <div className="relative">
          <ReactDatePicker
            locale="ptBR"
            portalId="root-portal"
            selected={getSelected}
            className={`${icon ? 'input-icon' : 'datepicker-input'} `}
            withPortal={showTimeSelectOnly !== true}
            showTimeSelect={showTimeSelect}
            showTimeSelectOnly={showTimeSelectOnly}
            timeIntervals={15}
            timeCaption="Time"
            dateFormat={dateFormat}
            customInput={customInput}
            required={required}
            disabled={disabled}
            readOnly={disabled}
            placeholderText={placeholder}
            onChange={handleSelect}
            renderCustomHeader={({
              date,
              changeMonth,
              decreaseMonth,
              changeYear,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <DatePickerHeader
                date={date}
                changeMonth={changeMonth}
                changeYear={changeYear}
                decreaseMonth={decreaseMonth}
                increaseMonth={increaseMonth}
                prevMonthButtonDisabled={prevMonthButtonDisabled}
                nextMonthButtonDisabled={nextMonthButtonDisabled}
              />
            )}
          />

          {icon && <div className="input-icon-container">{icon}</div>}
        </div>
      </div>
    </>
  );
}
