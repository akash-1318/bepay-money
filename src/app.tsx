import { BrowserRouter } from "react-router-dom"
import { Routes } from "react-router-dom"
import { Route } from "react-router-dom"
import RootLayout from "./layouts/RootLayout"
import Dashboard from "./pages/Dashboard"
import Payment from "./pages/Payments"
import PaymentLink from "./pages/PaymentLink"

export function App() {
  return (
    <BrowserRouter>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/payments" element={<Payment />} />
          <Route path="/payment-links" element={<PaymentLink />} />
        </Routes>
      </RootLayout>
    </BrowserRouter>
  )
}