import { useState } from 'react'

import './App.css'

function App() {
  const[text,setText] = useState(false);
  function handleCick(){
    setText(!text);
  }
  return (
    <>
     <h1>Hello Madaa</h1>
     <button onClick={handleCick}>Click Here</button>
     {
      text && <h2>Ooombikko....</h2>
     }
    </>
  )
}

export default App
