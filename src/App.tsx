import { useState } from 'react'
import Autocomplete from "./components/Autocomplete"
import './App.css'

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Acorn', value: 'acorn'},
  { label: 'Apricot', value: 'apricot'},
  { label: 'Green apple', value: 'green apple'},
  { label: 'Guava', value: 'guava'}
];

function App() {
  const [selected, setSelected] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  return (
    <div className="page-container">
      <div className="search-container">
        <Autocomplete
          label="Search Fruit"
          description="Find your favourtite fruits available here"
          options={options}
          multiple={true}
          value={selected}
          inputValue={inputValue}
          onChange={(value) => setSelected(value)}
          onInputChange={(value) => setInputValue(value)}
          placeholder="Select a fruit"
          renderOption={(option) => <span>{option.label}</span>}
        />
        {/* <div>
          <strong>Selected:</strong>
          <ul>
            {selected.map((item, index) => (
              <li key={index}>{item.label}</li>
            ))}
          </ul>
        </div> */}
      </div>
    </div>
  )
}

export default App
