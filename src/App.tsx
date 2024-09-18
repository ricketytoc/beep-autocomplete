import { useState } from 'react'
import Autocomplete from "./components/Autocomplete"
import './App.css'

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Green apple', value: 'green apple'},
  { label: 'Guava', value: 'guava'}
]

function App() {
  const [selected, setSelected] = useState<any[]>([])
  const [inputValue, setInputValue] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  return (
    <div className="page-container">
      <div className="search-container">
        <Autocomplete
          label="Search Fruit"
          description="Find your favourtite fruits available here"
          loading={loading}
          options={options}
          multiple={true}
          value={selected}
          inputValue={inputValue}
          onChange={(value) => setSelected(value)}
          onInputChange={(value) => setInputValue(value)}
          placeholder="Select a fruit"
          renderOption={(option) => <span>{option.label}</span>}
        />
      </div>
    </div>
  )
}

export default App
