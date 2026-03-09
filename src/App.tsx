import { BrowserRouter as Router, Routes, Route } from "react-router";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Ventas from "./pages/Ventas";
import Productos from "./pages/Productos";
import MetodosPago from "./pages/MetodosPago";
import Insumos from "./pages/Insumos";
import CrearMetodoDePago from "./pages/Formularios/MetodoDePagoForm";
import CrearProducto from "./pages/Formularios/ProductoForm";
import CrearVenta from "./pages/Formularios/VentaForm";
import BalancePage from "./pages/Dashboard/Balances";
import Finanzas from "./pages/Finanzas";
import ExpenseForm from "./pages/Formularios/GastosForm";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
            />

            <Route index path="/balances" element={
              <ProtectedRoute>
                <BalancePage />
              </ProtectedRoute>
            } 
            />

            {/* Others Page */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfiles />
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            } />
            <Route path="/blank" element={
              <ProtectedRoute>
                <Blank />
              </ProtectedRoute>
            } />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />

            {/* Admin Layout */}
            <Route path="/ventas" element={
              <ProtectedRoute>
                <Ventas />
              </ProtectedRoute>
            } />
            <Route path="/ventas/nuevo" element={
              <ProtectedRoute>
                <CrearVenta />
              </ProtectedRoute>
            } />
            <Route path="/ventas/:id/editar" element={
              <ProtectedRoute>
                <CrearVenta />
              </ProtectedRoute>
            } />
            <Route path="/productos" element={
              <ProtectedRoute>
                <Productos />
              </ProtectedRoute>
            } />
            <Route path="/productos/nuevo" element={
              <ProtectedRoute>
                <CrearProducto />
              </ProtectedRoute>
            } />
            <Route path="/productos/:id/editar" element={
              <ProtectedRoute>
                <CrearProducto />
              </ProtectedRoute>
            } />
            <Route path="/insumos" element={
              <ProtectedRoute>
                <Insumos />
              </ProtectedRoute>
            } />
            <Route path="/insumos/nuevo" element={
              <ProtectedRoute>
                <CrearProducto />
              </ProtectedRoute>
            } />
            <Route path="/insumos/:id/editar" element={
              <ProtectedRoute>
                <CrearProducto />
              </ProtectedRoute>
            } />
            <Route path="/metodos-pago-comisiones" element={
              <ProtectedRoute>
                <MetodosPago />
              </ProtectedRoute>
            } />
            <Route path="/metodos-pago-comisiones/nuevo" element={
              <ProtectedRoute>
                <CrearMetodoDePago />
              </ProtectedRoute>
            } />
            <Route path="/metodos-pago-comisiones/crear-metodo-pago" element={
              <ProtectedRoute>
                <CrearMetodoDePago />
              </ProtectedRoute>
            } />
            <Route path="/metodos-pago-comisiones/:id/editar" element={
              <ProtectedRoute>
                <CrearMetodoDePago />
              </ProtectedRoute>
            } />
            <Route path="/finanzas" element={
              <ProtectedRoute>
                <Finanzas />
              </ProtectedRoute>
            } />
            <Route path="/finanzas/nuevo" element={
              <ProtectedRoute>
                <ExpenseForm />
              </ProtectedRoute>
            } />
            </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
