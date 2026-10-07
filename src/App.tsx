import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TicketsView } from './components/TicketsView';
import { TicketDetailPage } from './components/TicketDetailPage';
import { PropertiesView } from './components/PropertiesView';
import { TenantsView } from './components/TenantsView';
import { VendorsView } from './components/VendorsView';
import { AIActivityView } from './components/AIActivityView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { TenantRequestPortal } from './components/TenantRequestPortal';
import { TenantRequestStatus } from './components/TenantRequestStatus';
import { TenantChatView } from './components/TenantChatView';
import { LandingPage } from './components/LandingPage';
import { ToastContainer } from './components/ToastContainer';

export const App: React.FC = () => {
  const { activeTab, setActiveTab, setSelectedTicketId } = useApp();

  const [currentRoute, setCurrentRoute] = useState<{
    type: 'dashboard' | 'tenant-portal' | 'tenant-status' | 'tenant-success' | 'landing';
    ticketId?: string;
  }>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const match = path.match(/^\/request\/([^\/?#]+)/);
      if (match) {
        if (match[1] === 'success') {
          return { type: 'tenant-success' };
        }
        return { type: 'tenant-status', ticketId: match[1] };
      }
      if (path.startsWith('/request')) {
        return { type: 'tenant-portal' };
      }
      if (path === '/landing' || path === '/') {
        return { type: 'landing' };
      }
      const ticketMatch = path.match(/^\/tickets\/([^\/?#]+)/);
      if (ticketMatch) {
        return { type: 'dashboard' };
      }
      if (path.startsWith('/dashboard') || path.startsWith('/tickets') || path.startsWith('/properties') || path.startsWith('/tenants') || path.startsWith('/vendors') || path.startsWith('/activity')) {
        return { type: 'dashboard' };
      }
    }
    return { type: 'landing' };
  });

  // Listen to browser location path for direct /request, /request/:ticketId, /request/success, /tickets/:ticketId, or /landing access
  useEffect(() => {
    const handleUrlChange = () => {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const match = path.match(/^\/request\/([^\/?#]+)/);
        if (match) {
          if (match[1] === 'success') {
            setCurrentRoute({ type: 'tenant-success' });
            setActiveTab('tenant-portal');
          } else {
            setCurrentRoute({ type: 'tenant-status', ticketId: match[1] });
            setActiveTab('tenant-status');
          }
          return;
        } else if (path.startsWith('/request')) {
          setCurrentRoute({ type: 'tenant-portal' });
          setActiveTab('tenant-portal');
          return;
        } else if (path === '/landing' || path === '/') {
          setCurrentRoute({ type: 'landing' });
          setActiveTab('landing');
          return;
        }

        const ticketMatch = path.match(/^\/tickets\/([^\/?#]+)/);
        if (ticketMatch) {
          setSelectedTicketId(ticketMatch[1]);
          setActiveTab('ticket-detail');
          setCurrentRoute({ type: 'dashboard' });
          return;
        } else if (path === '/tickets' || path === '/tickets/' || path.startsWith('/dashboard')) {
          setActiveTab('tickets');
          setCurrentRoute({ type: 'dashboard' });
          return;
        } else {
          setCurrentRoute({ type: 'dashboard' });
        }
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, [setActiveTab, setSelectedTicketId]);

  // Public Landing Page (/ or /landing)
  if (activeTab === 'landing' || currentRoute.type === 'landing') {
    return (
      <div className="min-h-screen bg-[#090A0D] font-sans antialiased text-[#F4F4F6] selection:bg-[#C9A96E]/20 selection:text-[#DFCCA3]">
        <LandingPage />
        <ToastContainer />
      </div>
    );
  }

  // Dedicated Tenant Request Status Page (/request/:ticketId)
  if (activeTab === 'tenant-status' || currentRoute.type === 'tenant-status') {
    return (
      <div className="min-h-screen bg-[#090A0D] font-sans antialiased text-[#F4F4F6] selection:bg-[#C9A96E]/20 selection:text-[#DFCCA3]">
        <TenantRequestStatus ticketId={currentRoute.ticketId} />
        <ToastContainer />
      </div>
    );
  }

  // Dedicated Tenant Request Portal (Clean Maintenance Request Form & Success Screen)
  if (activeTab === 'tenant-portal' || activeTab === 'tenant-request' || currentRoute.type === 'tenant-portal' || currentRoute.type === 'tenant-success') {
    return (
      <div className="min-h-screen bg-[#090A0D] font-sans antialiased text-[#F4F4F6] selection:bg-[#C9A96E]/20 selection:text-[#DFCCA3]">
        <TenantRequestPortal />
        <ToastContainer />
      </div>
    );
  }

  // Tenant Chat View (Secondary test interface)
  if (activeTab === 'tenant-chat') {
    return (
      <div className="min-h-screen bg-[#090A0D] font-sans antialiased text-[#F4F4F6] selection:bg-[#C9A96E]/20 selection:text-[#DFCCA3]">
        <Header />
        <TenantChatView />
        <ToastContainer />
      </div>
    );
  }

  // Internal Property Manager Operations Dashboard Layout
  return (
    <div className="min-h-screen bg-[#090A0D] font-sans antialiased text-[#F4F4F6] flex flex-col selection:bg-[#C9A96E]/20 selection:text-[#DFCCA3]">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar Navigation */}
        <Sidebar />

        {/* Main Operational Views */}
        <main className="flex-1 overflow-y-auto bg-[#090A0D]">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'tickets' && <TicketsView />}
          {activeTab === 'ticket-detail' && <TicketDetailPage />}
          {activeTab === 'properties' && <PropertiesView />}
          {activeTab === 'tenants' && <TenantsView />}
          {activeTab === 'vendors' && <VendorsView />}
          {activeTab === 'activity' && <AIActivityView />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};

export default App;
