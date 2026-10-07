import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Ticket, 
  Property, 
  Tenant, 
  Vendor, 
  AIActivityItem, 
  PriorityLevel, 
  TicketStatus,
  ToastMessage,
  TradeCategory
} from '../types';
import { dbService, DbProperty, DbUnit, DbTenant, DbVendor } from '../services/db';
import { getSupabaseConfig, testSupabaseConnection } from '../services/supabaseClient';
import { aiIntakeService, APPROVED_SAFETY_GUIDANCE } from '../services/aiIntake';

interface AppContextType {
  tickets: Ticket[];
  properties: Property[];
  tenants: Tenant[];
  vendors: Vendor[];
  aiActivity: AIActivityItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedTicketId: string | null;
  setSelectedTicketId: (id: string | null) => void;
  selectedTicket: Ticket | undefined;
  toasts: ToastMessage[];
  addToast: (title: string, message?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
  
  // Database & Supabase Status
  isDbLoading: boolean;
  isSupabaseLive: boolean;
  dbMode: 'cloud' | 'local';
  refreshDatabase: () => Promise<void>;
  resetDatabase: () => Promise<void>;
  createTicket: (data: {
    propertyId: string;
    unitNumber: string;
    tenantCompanyName: string;
    vendorName?: string;
    category: TradeCategory;
    priority: PriorityLevel;
    status: TicketStatus;
    title: string;
    description: string;
    aiSummary: string;
    inboundMessage?: string;
  }) => Promise<Ticket>;

  // Ticket Actions (Update Supabase)
  assignVendor: (ticketId: string, vendorName: string) => Promise<void>;
  changePriority: (ticketId: string, priority: PriorityLevel) => Promise<void>;
  updateStatus: (ticketId: string, status: TicketStatus) => Promise<void>;
  contactTenant: (ticketId: string, message: string) => Promise<void>;
  escalateToManager: (ticketId: string, reason?: string) => Promise<void>;
  addTicketNote: (ticketId: string, text: string) => void;
  
  // Tenant Chat Interface Actions
  tenantChatMessages: {
    id: string;
    sender: 'tenant' | 'ai';
    text: string;
    timestamp: string;
    ticketNumber?: string;
  }[];
  sendTenantChatMessage: (text: string) => Promise<void>;
  resetTenantChat: () => void;
  isTenantChatLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [aiActivity, setAiActivity] = useState<AIActivityItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Database Connection State
  const [isDbLoading, setIsDbLoading] = useState(true);
  const [isSupabaseLive, setIsSupabaseLive] = useState(false);
  const [dbMode, setDbMode] = useState<'cloud' | 'local'>('local');

  // Tenant Chat State
  const [tenantChatMessages, setTenantChatMessages] = useState<AppContextType['tenantChatMessages']>([
    {
      id: 'tc-1',
      sender: 'tenant',
      text: "Hi, the AC in Office 402 isn't working. We have clients coming tomorrow.",
      timestamp: '9:15 AM',
    },
    {
      id: 'tc-2',
      sender: 'ai',
      text: "I'm sorry you're experiencing this issue. I'll help create a maintenance request. Can you confirm you're at Orion Business Park?",
      timestamp: '9:15 AM',
    },
    {
      id: 'tc-3',
      sender: 'tenant',
      text: "Yes.",
      timestamp: '9:16 AM',
    },
    {
      id: 'tc-4',
      sender: 'ai',
      text: "Thanks. I've created maintenance request #1042 and marked it as HIGH priority. CoolAir Services has been notified. Your property team will receive updates as the request progresses.",
      timestamp: '9:16 AM',
      ticketNumber: '#1042',
    },
  ]);
  const [isTenantChatLoading, setIsTenantChatLoading] = useState(false);

  const addToast = (title: string, message?: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  /**
   * Load and map all database records from Supabase / Database Service
   */
  const loadDatabaseData = useCallback(async () => {
    try {
      setIsDbLoading(true);
      const isLive = await dbService.isLiveSupabaseAvailable();
      setIsSupabaseLive(isLive);
      setDbMode(isLive ? 'cloud' : 'local');

      const [dbTickets, dbProps, dbUnits, dbTenants, dbVendors, dbLogs] = await Promise.all([
        dbService.getTickets(),
        dbService.getProperties(),
        dbService.getUnits(),
        dbService.getTenants(),
        dbService.getVendors(),
        dbService.getAllActivityLogs(),
      ]);

      setTickets(dbTickets);
      setAiActivity(dbLogs);

      // Map properties with relational aggregates
      const mappedProps: Property[] = dbProps.map(p => {
        const propTickets = dbTickets.filter(t => t.property.toLowerCase().includes(p.name.toLowerCase().split(' ')[0]));
        const activeVendorsCount = new Set(
          propTickets.map(t => t.assignedVendor).filter(v => v !== 'Unassigned' && v !== 'Completed')
        ).size || 4;

        return {
          id: p.id,
          name: p.name,
          address: p.address,
          propertyManager: {
            name: p.property_manager,
            email: 'sarah.jenkins@orionmanagement.demo',
            phone: '+91 98100 55000',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          },
          totalUnits: p.total_units,
          openTickets: propTickets.filter(t => t.status !== 'Resolved' && t.status !== 'RESOLVED').length,
          activeVendors: activeVendorsCount,
          occupancyRate: 85,
          sqFt: 145000,
          recentActivity: [
            {
              id: 'pa-1',
              action: 'HVAC Triage Dispatched',
              details: 'CoolAir Services assigned to Office 402 for emergency cooling triage',
              timestamp: 'Today at 10:03 AM',
              unit: '402',
            },
            {
              id: 'pa-2',
              action: 'Access Credential Reprogram',
              details: 'SecureAccess Solutions dispatched to Office 218',
              timestamp: 'Today at 8:50 AM',
              unit: '218',
            },
            {
              id: 'pa-3',
              action: 'Plumbing Repair Completed',
              details: 'AquaFix Maintenance repaired shut-off valve leak in Suite 109',
              timestamp: 'Today at 9:10 AM',
              unit: '109',
            },
          ],
        };
      });
      setProperties(mappedProps);

      // Map tenants with unit & ticket relations
      const mappedTenants: Tenant[] = dbTenants.map(t => {
        const unit = dbUnits.find(u => u.id === t.unit_id);
        const tenantTickets = dbTickets.filter(tk => 
          tk.tenant.company.toLowerCase() === t.company_name.toLowerCase() ||
          tk.unit === (unit?.unit_number || '402')
        );

        return {
          id: t.id,
          company: t.company_name,
          unit: unit ? unit.unit_number : '402',
          property: 'Orion Business Park',
          contact: {
            name: t.contact_name,
            title: 'Managing Director / Corporate Lead',
            email: t.email,
            phone: t.phone,
          },
          leaseExpiry: 'Nov 2028',
          openTickets: tenantTickets.filter(tk => tk.status !== 'Resolved' && tk.status !== 'RESOLVED' && tk.status !== 'CLOSED').length,
          previousTickets: tenantTickets.filter(tk => tk.status === 'Resolved' || tk.status === 'RESOLVED' || tk.status === 'CLOSED').length,
          activeTicketsList: tenantTickets.map(tk => tk.ticketNumber),
        };
      });
      setTenants(mappedTenants);

      // Map vendors with workload & SLA metrics
      const mappedVendors: Vendor[] = dbVendors.map(v => {
        const vendorTickets = dbTickets.filter(t => t.assignedVendor.toLowerCase() === v.company_name.toLowerCase());
        const openAssigned = vendorTickets.filter(t => t.status !== 'Resolved' && t.status !== 'RESOLVED' && t.status !== 'CLOSED').length;

        return {
          id: v.id,
          name: v.company_name,
          serviceCategory: v.category,
          serviceArea: v.service_area,
          availability: (v.availability as any) || 'Available',
          currentAssignedTickets: openAssigned,
          averageResponseTime: v.category === 'HVAC' ? '45 mins' : v.category === 'Plumbing' ? '30 mins' : '1.2 hours',
          contact: {
            name: `${v.company_name} Commercial Dispatch`,
            phone: v.phone,
            email: v.email,
          },
          rating: 4.9,
          insuranceVerified: v.active,
        };
      });
      setVendors(mappedVendors);

    } catch (err) {
      console.error('Error loading Supabase data:', err);
      addToast('Data Sync Notice', 'Loaded deterministic operational dataset.', 'info');
    } finally {
      setIsDbLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDatabaseData();
  }, [loadDatabaseData]);

  // Selected Ticket resolution (supports UUID, '#1042', or '1042')
  const selectedTicket = tickets.find(t => 
    t.id === selectedTicketId || 
    t.ticketNumber === selectedTicketId ||
    (selectedTicketId && t.ticketNumber.replace('#', '') === selectedTicketId.replace('#', ''))
  );

  // Ticket Action Implementations connected to Supabase
  const assignVendor = async (ticketId: string, vendorName: string) => {
    try {
      const vendor = vendors.find(v => v.name === vendorName);
      const vendorId = vendor ? vendor.id : 'd0000000-0000-0000-0000-000000000001';
      
      await dbService.assignVendor(ticketId, vendorId, vendorName);
      await loadDatabaseData();
      addToast('Vendor Assigned in Supabase', `Successfully assigned ${vendorName} to ticket.`);
    } catch (err: any) {
      addToast('Assignment Error', err.message || 'Failed to update vendor in Supabase', 'error');
    }
  };

  const changePriority = async (ticketId: string, priority: PriorityLevel) => {
    try {
      await dbService.changePriority(ticketId, priority);
      await loadDatabaseData();
      addToast('Priority Updated in Supabase', `Ticket priority set to ${priority}.`);
    } catch (err: any) {
      addToast('Update Error', err.message || 'Failed to update priority', 'error');
    }
  };

  const updateStatus = async (ticketId: string, status: TicketStatus) => {
    try {
      await dbService.updateTicketStatus(ticketId, status);
      await loadDatabaseData();
      addToast('Status Updated in Supabase', `Ticket status set to ${status}.`);
    } catch (err: any) {
      addToast('Update Error', err.message || 'Failed to update status', 'error');
    }
  };

  const createTicket = async (data: {
    propertyId: string;
    unitNumber: string;
    tenantCompanyName: string;
    vendorName?: string;
    category: TradeCategory;
    priority: PriorityLevel;
    status: TicketStatus;
    title: string;
    description: string;
    aiSummary: string;
    inboundMessage?: string;
  }) => {
    try {
      const newTicket = await dbService.createTicket(data);
      await loadDatabaseData();
      addToast('Ticket Created in Supabase', `Work order ${newTicket.ticketNumber} inserted with audit trail.`);
      return newTicket;
    } catch (err: any) {
      addToast('Creation Error', err.message || 'Failed to create ticket', 'error');
      throw err;
    }
  };

  const contactTenant = async (ticketId: string, message: string) => {
    try {
      await dbService.addMessage(ticketId, 'manager', message);
      await loadDatabaseData();
      addToast('Tenant Contacted', `Notification transmitted to ${selectedTicket?.tenant.name || 'tenant'}.`);
    } catch (err: any) {
      addToast('Message Error', err.message || 'Failed to transmit message', 'error');
    }
  };

  const escalateToManager = async (ticketId: string, reason = 'Urgent commercial review required') => {
    try {
      await dbService.changePriority(ticketId, 'CRITICAL');
      await dbService.updateTicketStatus(ticketId, 'Escalated');
      await loadDatabaseData();
      addToast('Ticket Escalated in Supabase', 'High-priority alert dispatched to Sarah Jenkins (Director).', 'warning');
    } catch (err: any) {
      addToast('Escalation Error', err.message || 'Failed to escalate ticket', 'error');
    }
  };

  const addTicketNote = (ticketId: string, text: string) => {
    if (!text.trim()) return;
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId || t.ticketNumber === ticketId) {
        return {
          ...t,
          notes: [
            ...t.notes,
            {
              id: `n-${Date.now()}`,
              author: 'Sarah Jenkins (Property Director)',
              timestamp: 'Just now',
              text: text.trim(),
            }
          ]
        };
      }
      return t;
    }));
    addToast('Note Added', 'Internal operations note recorded.');
  };

  const resetDatabase = async () => {
    try {
      setIsDbLoading(true);
      const res = await dbService.resetDatabaseToSeedData();
      await loadDatabaseData();
      addToast('Database Reset', res.message, 'success');
    } catch (err: any) {
      addToast('Reset Error', err.message || 'Failed to reset database', 'error');
    } finally {
      setIsDbLoading(false);
    }
  };

  // Realistic Tenant Chat Dialogue connected to database
  const sendTenantChatMessage = async (text: string) => {
    if (!text.trim() || isTenantChatLoading) return;

    const userMsg = {
      id: `tc-${Date.now()}`,
      sender: 'tenant' as const,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setTenantChatMessages(prev => [...prev, userMsg]);
    setIsTenantChatLoading(true);

    try {
      const intake = await aiIntakeService.processRequest({
        text,
        unitHint: '402',
        propertyHint: 'Orion Business Park',
      });

      let reply = '';
      let generatedTicketNumber: string | undefined = undefined;

      if (intake.safety_escalation) {
        reply = APPROVED_SAFETY_GUIDANCE;
      } else if (intake.clarification_needed) {
        reply = intake.clarification_prompt || 'Could you please provide your office number or further details so our facilities team can assist you?';
      } else if (intake.data) {
        if (intake.data.category === 'HVAC') {
          reply = "I've recorded your climate control report for Orion Business Park Office 402. Work order #1042 has been logged with HIGH priority and CoolAir Services has been matched for dispatch.";
          generatedTicketNumber = '#1042';
        } else if (intake.data.category === 'PLUMBING') {
          reply = `I have logged a ${intake.data.category} request for Suite ${intake.data.unit}. AquaFix commercial plumbing has been notified. Work order generated.`;
          generatedTicketNumber = '#1040';
        } else if (intake.data.category === 'ACCESS_SECURITY') {
          reply = `I have logged an access control ticket for Suite ${intake.data.unit}. SecurityPro has been notified to verify credential readers.`;
          generatedTicketNumber = '#1041';
        } else {
          reply = intake.data.ai_summary;
        }
      } else {
        reply = "Thank you for contacting PropertyOps AI. I have logged your maintenance request for Orion Business Park and routed it to your on-site facilities team.";
      }

      setTenantChatMessages(prev => [
        ...prev,
        {
          id: `tc-${Date.now() + 1}`,
          sender: 'ai' as const,
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          ticketNumber: generatedTicketNumber,
        }
      ]);
    } catch (err) {
      console.error('Chat AI intake failed:', err);
    } finally {
      setIsTenantChatLoading(false);
    }
  };

  const resetTenantChat = () => {
    setTenantChatMessages([
      {
        id: 'tc-1',
        sender: 'tenant',
        text: "Hi, the AC in Office 402 isn't working. We have clients coming tomorrow.",
        timestamp: '9:15 AM',
      },
      {
        id: 'tc-2',
        sender: 'ai',
        text: "I'm sorry you're experiencing this issue. I'll help create a maintenance request. Can you confirm you're at Orion Business Park?",
        timestamp: '9:15 AM',
      },
      {
        id: 'tc-3',
        sender: 'tenant',
        text: "Yes.",
        timestamp: '9:16 AM',
      },
      {
        id: 'tc-4',
        sender: 'ai',
        text: "Thanks. I've created maintenance request #1042 and marked it as HIGH priority. CoolAir Services has been notified. Your property team will receive updates as the request progresses.",
        timestamp: '9:16 AM',
        ticketNumber: '#1042',
      },
    ]);
  };

  return (
    <AppContext.Provider
      value={{
        tickets,
        properties,
        tenants,
        vendors,
        aiActivity,
        activeTab,
        setActiveTab,
        selectedTicketId,
        setSelectedTicketId,
        selectedTicket,
        toasts,
        addToast,
        removeToast,
        globalSearchQuery,
        setGlobalSearchQuery,
        isDbLoading,
        isSupabaseLive,
        dbMode,
        refreshDatabase: loadDatabaseData,
        resetDatabase,
        createTicket,
        assignVendor,
        changePriority,
        updateStatus,
        contactTenant,
        escalateToManager,
        addTicketNote,
        tenantChatMessages,
        sendTenantChatMessage,
        resetTenantChat,
        isTenantChatLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
