import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './components/home'
import OperationsDashboard from './components/operationsDashboard'
import AccountsDashboard from './components/accountsDashboard'
import SalesDashboard from './components/salesDashboard'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/operations-dashboard" element={<OperationsDashboard />} />
        <Route path="/accounts-dashboard" element={<AccountsDashboard />} />
        <Route path="/sales-dashboard" element={<SalesDashboard />} />
      </Routes>
    </>
  )
}

export default App
