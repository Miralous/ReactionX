import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CollectionTab, MobileView } from './types';
import { useAdminToast } from './hooks/useAdminToast';
import { useAdminAuth } from './hooks/useAdminAuth';
import { useAdminEditor } from './hooks/useAdminEditor';
import { useAdminFileSystem } from './hooks/useAdminFileSystem';

export interface AdminContextType extends ReturnType<typeof useAdminAuth>, ReturnType<typeof useAdminEditor>, ReturnType<typeof useAdminFileSystem> {
  mobileView: MobileView;
  setMobileView: (v: MobileView) => void;
  showLeftPanel: boolean;
  setShowLeftPanel: (v: boolean) => void;
  showRightPanel: boolean;
  setShowRightPanel: (v: boolean) => void;
  showToast: ReturnType<typeof useAdminToast>['showToast'];
  currentCollection: CollectionTab;
  setCurrentCollection: (v: CollectionTab) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileView, setMobileView] = useState<MobileView>('editor');
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [currentCollection, setCurrentCollection] = useState<CollectionTab>('post');

  const { toasts, showToast } = useAdminToast();
  const auth = useAdminAuth(showToast);
  const editor = useAdminEditor(showToast);
  const fileSystem = useAdminFileSystem(showToast, auth.getAuthHeaders, auth.handleLogout, editor, setMobileView, currentCollection, setCurrentCollection);

  useEffect(() => {
    if (auth.isLoggedIn) {
      fileSystem.fetchRemoteFiles();
    }
  }, [auth.isLoggedIn, fileSystem.fetchRemoteFiles]);

  // Reset editor mode when switching collections
  useEffect(() => {
    if (!auth.isLoggedIn) return;
    editor.setCurrentMode(currentCollection === 'friend' ? 'friend' : currentCollection === 'dynamic' ? 'dynamic' : 'post');
  }, [currentCollection]);

  const value = {
    ...auth, ...editor, ...fileSystem,
    mobileView, setMobileView,
    showLeftPanel, setShowLeftPanel,
    showRightPanel, setShowRightPanel,
    showToast,
    currentCollection, setCurrentCollection,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
      <style>{`
        @keyframes geist-toast-slide {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="bg-background border border-border/40 px-4 py-3 rounded-lg text-sm font-medium shadow-xl flex items-center gap-3 pointer-events-auto"
            style={{ animation: 'geist-toast-slide 0.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards' }}
          >
            <span className={`flex size-2 rounded-full shrink-0 ${
              toast.type === 'error' ? 'bg-red-500' :
              toast.type === 'success' ? 'bg-emerald-500' :
              'bg-muted-foreground'
            }`}></span>
            <span className="text-foreground">{toast.msg}</span>
          </div>
        ))}
      </div>
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
};

export default AdminProvider;
