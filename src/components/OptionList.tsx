import React, { forwardRef, useRef, useEffect } from 'react'

interface OptionListProps<T> {
  inputValue: string
  options: T[]
  onSelect: (option: T) => void 
  renderOption: (option: T) => React.ReactNode 
  value: T[] 
  compareValues: (val: T, option: T) => boolean 
  highlightedIndex: number;
  onMouseEnter: (index: number) => void;
}
const OptionList = forwardRef<HTMLUListElement, OptionListProps<any>>(
  ({ options, onSelect, renderOption, value, compareValues, inputValue, highlightedIndex, onMouseEnter }, ref) => {
    const ulRef = useRef<HTMLUListElement | null>(null)

    useEffect(() => {
        if (ulRef.current && highlightedIndex >= 0) { // Ensure highlightedIndex is valid
          const highlightedElement = ulRef.current.children[highlightedIndex] as HTMLElement | undefined;
          if (highlightedElement) {
            highlightedElement.scrollIntoView({
              block: 'nearest',
              behavior: 'smooth',
            });
          }
        }
      }, [highlightedIndex])
    return (
    <ul ref={(el) => {
        ulRef.current = el;
        if (typeof ref === 'function') {
          ref(el);
        } else if (ref) {
          // @ts-ignore: TypeScript will not recognize this but it's safe
          ref.current = el;
        }
      }}>
      {inputValue !== '' && options.length > 0 ? (
        options.map((option, index) => (
            <li 
                key={index} 
                onClick={() => onSelect(option)} 
                className={highlightedIndex === index ? 'highlighted' : ''}
                onMouseEnter={() => onMouseEnter(index)}
            >
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
}
) 

export default OptionList 

