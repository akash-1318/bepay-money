import { BrowserRouter } from "react-router-dom"
import { Routes } from "react-router-dom"
import { Route } from "react-router-dom"
import RootLayout from "./layouts/RootLayout"
import Dashboard from "./pages/Dashboard"

export function App() {
  return (
    <BrowserRouter>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </RootLayout>
    </BrowserRouter>
  )
}