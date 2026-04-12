import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import { HowItWorks } from './pages/HowItWorks';
import { ReportForm } from './pages/ReportForm';
import { Track } from './pages/Track';
import { Privacy } from './pages/Privacy';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Dashboard as AdminDashboard } from './pages/admin/Dashboard';
import { Login } from './pages/admin/Login';

function App() {
  return (
    <Router>
        <Routes>
          {/* Public Routes with public layout */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/how-it-works" element={<Layout><HowItWorks /></Layout>} />
          <Route path="/report/submit" element={<Layout><ReportForm /></Layout>} />
          <Route path="/track" element={<Layout><Track /></Layout>} />
          <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/*" element={
            <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="*" element={<div className="text-gray-400">Admin Page Under Construction</div>} />
              </Routes>
            </AdminLayout>
          } />

          <Route path="*" element={<Layout><div className="flex h-[60vh] items-center justify-center text-gray-400">Page not found</div></Layout>} />
        </Routes>
    </Router>
  );
}

export default App;
