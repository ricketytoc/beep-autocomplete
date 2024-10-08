import React, { forwardRef } from 'react' 
import searchIcon from "../assets/search.svg" 

interface InputFieldProps {
  value: string 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void 
  placeholder?: string 
  disabled?: boolean 
  loading: boolean 
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({ value, onChange, placeholder, disabled, loading, onKeyDown }, ref) => (
  <div className='input-container'>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      ref={ref}
      onKeyDown={onKeyDown}
    />
    <img src={searchIcon} alt="Search Icon"/>
    {loading && <div className="spinner"></div>}
  </div>
)) 

export default InputField 
