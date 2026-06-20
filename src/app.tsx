import { BrowserRouter } from "react-router-dom"
import { Routes } from "react-router-dom"
import { Route } from "react-router-dom"
import RootLayout from "./layouts/RootLayout"
import Dashboard from "./pages/Dashboard"
import PaymentLink from "./pages/PaymentLink"
import CreatePaymentLink from "./pages/CreatePaymentLink"
import PaymentLinkDetail from "./pages/PaymentLinkDetail"
import PaymentHistory from "./pages/PaymentHistory"
import { ErrorBoundary } from "./components/shared/ErrorBoundary"

export function App() {
  return (
    <BrowserRouter>
      <RootLayout>
        <Routes>
          <Route path="/" element={<ErrorBoundary fallbackMessage="Failed to load dashboard overview."><Dashboard /></ErrorBoundary>} />
          <Route path="/payment-history" element={<ErrorBoundary fallbackMessage="Failed to load payments history."><PaymentHistory /></ErrorBoundary>} />
          <Route path="/payment-links" element={<ErrorBoundary fallbackMessage="Failed to load payment links."><PaymentLink /></ErrorBoundary>} />
          <Route path="/payment-links/create" element={<ErrorBoundary fallbackMessage="Failed to load payment link creation form."><CreatePaymentLink /></ErrorBoundary>} />
          <Route path="/payment-links/:id" element={<ErrorBoundary fallbackMessage="Failed to load payment link detail."><PaymentLinkDetail /></ErrorBoundary>} />
        </Routes>
      </RootLayout>
    </BrowserRouter>
  )
}