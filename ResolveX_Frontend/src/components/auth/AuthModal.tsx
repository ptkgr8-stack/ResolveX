import React, { useState, useEffect } from 'react';
import { CampusAuthView } from './CampusAuthView';
import { UserProfile } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialRole?: 'student' | 'admin';
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden relative my-auto">
        <CampusAuthView
          mode={mode}
          onSwitchMode={setMode}
          onLoginSuccess={onLoginSuccess}
          onClose={onClose}
        />
      </div>
    </div>
  );
};
