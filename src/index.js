import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import TaskApp from './task-app'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(<TaskApp />, document.getElementById('root'))
registerServiceWorker()
