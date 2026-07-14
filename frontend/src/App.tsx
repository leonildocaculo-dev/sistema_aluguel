import * as React from "react"
import { Routes, Route } from "react-router-dom"
import { MainLayout } from "./components/layout/MainLayout"
import { Home } from "./pages/Home"
import { SearchResults } from "./pages/SearchResults"
import { PropertyDetails } from "./pages/PropertyDetails"
import { Checkout } from "./pages/Checkout"
import { Login } from "./pages/auth/Login"
import { Register } from "./pages/auth/Register"
import { ForgotPassword } from "./pages/auth/ForgotPassword"
import { DashboardLayout } from "./components/layout/dashboard/DashboardLayout"
import { ClientDashboard } from "./pages/dashboard/ClientDashboard"
import { OwnerDashboard } from "./pages/dashboard/OwnerDashboard"
import { DashboardAdmin } from "./pages/DashboardAdmin"

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="pesquisa" element={<SearchResults />} />
        <Route path="propriedade/:id" element={<PropertyDetails />} />
        <Route path="checkout/:id" element={<Checkout />} />
        <Route path="auth/login" element={<Login />} />
        <Route path="auth/registo" element={<Register />} />
        <Route path="auth/recuperar-senha" element={<ForgotPassword />} />
        
        {/* Client Dashboard Routes */}
        <Route path="dashboard" element={<DashboardLayout userType="client" />}>
          <Route index element={<ClientDashboard />} />
        </Route>

        {/* Owner Dashboard Routes */}
        <Route path="owner" element={<DashboardLayout userType="owner" />}>
          <Route index element={<OwnerDashboard />} />
        </Route>
        
        {/* Admin Dashboard Routes */}
        <Route path="admin" element={<DashboardLayout userType="admin" />}>
          <Route index element={<DashboardAdmin />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App

