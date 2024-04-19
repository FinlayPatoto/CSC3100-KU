import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/sweetalert2/dist/sweetalert2.min.css'
import SweetAlert2 from 'react-sweetalert2'


function App() {
  const [count, setCount] = useState(0)
  const [strTaskName, setTaskName] = useState('')
  const [swalProps, setSwalProps] = useState({})

  return (
    <>
      <form>
        <label for='txtTaskName' className='form-label'>Task Name</label>
        <input id='txtTaskName' type='text' className='form-control' value={strTaskName} onChange={(e) => {
          setTaskName(e.target.value)
        }}/>

        <label for='txtTaskLocation' className='form-label'>Task Location</label>
        <input id='txtTaskLocation' type='text' className='form-control'/>

        <label for='txtTaskDueDate' className='form-label'>Task Due Date</label>
        <input id='txtTaskDueDate' type='date' className='form-control'/>

        <button className='btn btn-primary mt-3' type='button' onClick={() => {setSwalProps({show: true, title: 'Success', icon: 'success', text: `${strTaskName}`})}}>Add Task</button>

      </form>
      <SweetAlert2 {...swalProps}/>

    </>
  )
}

export default App
