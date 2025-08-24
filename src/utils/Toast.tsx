
import { useState, useEffect } from 'react';

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// Toast store (simple state management)
let toastListeners: ((toasts: Toast[]) => void)[] = [];
let toasts: Toast[] = [];

const notifyListeners = () => {
  toastListeners.forEach(listener => listener([...toasts]));
};

export const addToast = (message: string, type: ToastType = 'info', duration: number = 5000) => {
  const id = Date.now().toString();
  const newToast: Toast = { id, message, type, duration };
  
  toasts.push(newToast);
  notifyListeners();
  
  // Auto remove toast after duration
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }
  
  return id;
};

export const removeToast = (id: string) => {
  toasts = toasts.filter(toast => toast.id !== id);
  notifyListeners();
};

export const useToasts = () => {
  const [toastList, setToastList] = useState<Toast[]>([]);
  
  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setToastList(newToasts);
    };
    
    toastListeners.push(listener);
    
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  }, []);
  
  return toastList;
};

// Toast Component
const ToastItem = ({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger enter animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);
  
  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(toast.id), 200);
  };
  
  const getToastStyles = () => {
    const baseStyles = "border-l-4 rounded-r-lg shadow-lg backdrop-blur-sm";
    
    switch (toast.type) {
      case 'success':
        return `${baseStyles} bg-green-50 border-green-400 text-green-800`;
      case 'error':
        return `${baseStyles} bg-red-50 border-red-400 text-red-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-400 text-yellow-800`;
      default:
        return `${baseStyles} bg-blue-50 border-blue-400 text-blue-800`;
    }
  };
  
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };
  
  return (
    <div
      className={`transform transition-all duration-200 ease-in-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`p-4 mb-3 ${getToastStyles()}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <span className="text-lg flex-shrink-0 mt-0.5">{getIcon()}</span>
            <p className="text-sm font-medium leading-5 pr-2">
              {toast.message}
            </p>
          </div>
          <button
            onClick={handleRemove}
            className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast Container Component
export const ToastContainer = () => {
  const toasts = useToasts();
  
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-sm pointer-events-none">
      <div className="pointer-events-auto">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
          />
        ))}
      </div>
    </div>
  );
};