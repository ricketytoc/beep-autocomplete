import React, { useState, useEffect, useCallback, useRef } from 'react'
import { computePosition } from "@floating-ui/dom"
import InputField from "./InputField"
import OptionList from "./OptionList"

// Props interface for the Autocomplete component
interface AutocompleteProps<T> {
  description: string
  disabled?: boolean
  filterOptions?: (inputValue: string, options: T[]) => T[]
  label: string
  loading?: boolean
  multiple?: boolean
  onChange: (value: T[]) => void
  onInputChange: (inputValue: string) => void
  options: T[]
  placeholder?: string
  renderOption: (option: T) => React.ReactNode
  value: T[]
  inputValue: string
}


const Autocomplete = <T extends string | { label: string, value: any }>({
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
    const [filteredOptions, setFilteredOptions] = useState<T[]>([])
    const [showOptions, setShowOptions] = useState<boolean>(false)

    const referenceRef = useRef<HTMLInputElement | null>(null)
    const floatingRef = useRef<HTMLUListElement | null>(null)

    // Update position of dropdown menu relative to the search input.
    useEffect(() => {
        const updatePosition = async () => {
          if (referenceRef.current && floatingRef.current) {
            const { x, y } = await computePosition(referenceRef.current, floatingRef.current, {
              placement: 'bottom', 
            })
    
            Object.assign(floatingRef.current.style, {
              top: `${y}px`,
              left: `${x}px`,
              position: 'absolute', 
              visibility: 'visible', 
            })
          }
        }
    
        updatePosition()
    
        window.addEventListener('resize', updatePosition)
        return () => {
          window.removeEventListener('resize', updatePosition)
        }
      }, [showOptions, inputValue])
    

    // Compare values and options 
    const compareValues = (val: string | { value: any }, option: string | { value: any }) => {
        if (typeof val === 'string' && typeof option === 'string') {
          return val === option
        } else if (typeof val !== 'string' && typeof option !== 'string') {
          return val.value === option.value
        }
        return false
      }
  
    // Handle input change
    const handleInputChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value
        onInputChange(newValue)
        setShowOptions(true)
      },
      [onInputChange]
    )
  
    // Handle option select
    const handleOptionSelect = (option: T) => {
      if (multiple) {
        if (value.some(val => compareValues(val, option))) {
            const newSelectedValues = value.filter(val => !compareValues(val, option))
            onChange(newSelectedValues)
        } else {
            const newSelectedValues = [...value, option]
            onChange(newSelectedValues)
        }
      } else {
        if (value.some(val => compareValues(val, option))) {
            onChange([])
        } else {
            onChange([option])
        }
      }
    }
  
    // Filter options based on input value
    useEffect(() => {
      if (filterOptions) {
        setFilteredOptions(filterOptions(inputValue, options))
      } else {
        setFilteredOptions(
          options.filter((option) => {
            if (typeof option === 'string') {
              return option.toLowerCase().includes(inputValue.toLowerCase())
            } else {
              return option.label.toLowerCase().includes(inputValue.toLowerCase())
            }
          })
        )
      }
    }, [inputValue, options, filterOptions])
  
    // Handle clicking outside the component
    const handleClickOutside = useCallback(
      (event: MouseEvent) => {
        if (!(event.target as HTMLElement).closest('.autocomplete')) {
          setShowOptions(false)
        }
      },
      []
    )
  
    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [handleClickOutside])
  
    return (
      <div className={`autocomplete ${disabled ? 'disabled' : ''}`}>
        <label className='label'>{label}</label>
        <InputField
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          ref={referenceRef}
          loading={loading}
        />
        <p className='description'>{description}</p>
        {showOptions && !disabled && 
        <OptionList
          ref={floatingRef}
          inputValue={inputValue}
          options={filteredOptions}
          onSelect={handleOptionSelect}
          renderOption={renderOption}
          value={value}
          compareValues={compareValues}
        />}
      </div>
    )
  }
  
  export default Autocomplete
  