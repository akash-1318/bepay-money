import { BrowserRouter } from "react-router-dom"
import { Routes } from "react-router-dom"
import { Route } from "react-router-dom"
import RootLayout from "./layouts/RootLayout"
import Dashboard from "./pages/Dashboard"
import PaymentLink from "./pages/PaymentLink"
import PaymentHistory from "./pages/PaymentHistory"

export function App() {
  return (
    <BrowserRouter>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/payment-history" element={<PaymentHistory />} />
          <Route path="/payment-links" element={<PaymentLink />} />
        </Routes>
      </RootLayout>
    </BrowserRouter>
  )
}