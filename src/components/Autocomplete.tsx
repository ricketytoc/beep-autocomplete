import React, { useState, useEffect, useCallback, useRef } from 'react';
import { computePosition } from "@floating-ui/dom";

// Props interface for the Autocomplete component
interface AutocompleteProps<T> {
  description: string;
  disabled?: boolean;
  filterOptions?: (inputValue: string, options: T[]) => T[];
  label: string;
  loading?: boolean;
  multiple?: boolean;
  onChange: (value: T[]) => void;
  onInputChange: (inputValue: string) => void;
  options: T[];
  placeholder?: string;
  renderOption: (option: T) => React.ReactNode;
  value: T[];
  inputValue: string;
}


const Autocomplete = <T extends string | { label: string; value: any }>({
    description,
    disabled = false,
    filterOptions,
    label,
    loading = false,
    multiple = false,
    onChange,
    onInputChange,
    options,
    placeholder = 'Search...',
    renderOption,
    value,
    inputValue,
  }: AutocompleteProps<T>) => {
    const [filteredOptions, setFilteredOptions] = useState<T[]>([]);
    const [showOptions, setShowOptions] = useState<boolean>(false);

    const referenceRef = useRef<HTMLInputElement | null>(null);
    const floatingRef = useRef<HTMLUListElement | null>(null);

    // Update position of dropdown menu relative to the search input.
    useEffect(() => {
        const updatePosition = async () => {
          if (referenceRef.current && floatingRef.current) {
            const { x, y } = await computePosition(referenceRef.current, floatingRef.current, {
              placement: 'bottom', // You can change this to 'bottom', 'left', etc.
            });
    
            Object.assign(floatingRef.current.style, {
              top: `${y}px`,
              left: `${x}px`,
              position: 'absolute', // Ensure position is set to absolute
              visibility: 'visible', // Show tooltip after positioning
            });
          }
        };
    
        updatePosition();
    
        window.addEventListener('resize', updatePosition);
        return () => {
          window.removeEventListener('resize', updatePosition);
        };
      }, [showOptions, inputValue]);
    

    // Compare values and options 
    const compareValues = (val: string | { value: any }, option: string | { value: any }) => {
        if (typeof val === 'string' && typeof option === 'string') {
          return val === option;
        } else if (typeof val !== 'string' && typeof option !== 'string') {
          return val.value === option.value;
        }
        return false; 
      };
  
    // Handle input change
    const handleInputChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        onInputChange(newValue);
        setShowOptions(true);
      },
      [onInputChange]
    );
  
    // Handle option select
    const handleOptionSelect = (option: T) => {
      if (multiple) {
        if (value.some(val => compareValues(val, option))) {
            const newSelectedValues = value.filter(val => !compareValues(val, option))
            onChange(newSelectedValues)
        } else {
            const newSelectedValues = [...value, option];
            onChange(newSelectedValues);
        }
      } else {
        if (value.some(val => compareValues(val, option))) {
            onChange([])
        } else {
            onChange([option]);
        }
      }
    };
  
    // Filter options based on input value
    useEffect(() => {
      if (filterOptions) {
        setFilteredOptions(filterOptions(inputValue, options));
      } else {
        setFilteredOptions(
          options.filter((option) => {
            if (typeof option === 'string') {
              return option.toLowerCase().includes(inputValue.toLowerCase());
            } else {
              return option.label.toLowerCase().includes(inputValue.toLowerCase());
            }
          })
        );
      }
    }, [inputValue, options, filterOptions]);
  
    // Handle clicking outside the component
    const handleClickOutside = useCallback(
      (event: MouseEvent) => {
        if (!(event.target as HTMLElement).closest('.autocomplete')) {
          setShowOptions(false);
        }
      },
      []
    );
  
    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [handleClickOutside]);
  
    return (
      <div className={`autocomplete ${disabled ? 'disabled' : ''}`}>
        <label className='label'>{label}</label>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          ref={referenceRef}
        />
        <p className='description'>{description}</p>
        {loading && <div className="spinner">Loading...</div>}
        {showOptions && !disabled && (
          <ul ref={floatingRef}>
            {inputValue !== '' ? filteredOptions.map((option, index) => (
              <li key={index} onClick={() => handleOptionSelect(option)}>
                {renderOption(option)}
                <input 
                    type='checkbox'
                    checked={value.some(val => 
                        compareValues(val, option)
                      )}
                />
              </li>
            )): <li>No results found</li>}
          </ul>
        )}
        {description && <p>{description}</p>}
      </div>
    );
  };
  
  export default Autocomplete;
  