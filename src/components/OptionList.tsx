import React, { forwardRef } from 'react'

interface OptionListProps<T> {
  inputValue: string
  options: T[]
  onSelect: (option: T) => void 
  renderOption: (option: T) => React.ReactNode 
  value: T[] 
  compareValues: (val: T, option: T) => boolean 
}
const OptionList = forwardRef<HTMLUListElement, OptionListProps<any>>(
  ({ options, onSelect, renderOption, value, compareValues, inputValue }, ref) => (
    <ul ref={ref}>
      {inputValue !== '' && options.length > 0 ? (
        options.map((option, index) => (
          <li key={index} onClick={() => onSelect(option)}>
            {renderOption(option)}
            <input 
              type="checkbox"
              checked={value.some(val => compareValues(val, option))}
              readOnly
            />
          </li>
        ))
      ) : (
        <li>No results found</li>
      )}
    </ul>
  )
) 

export default OptionList 

