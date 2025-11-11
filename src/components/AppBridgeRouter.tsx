import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface AppBridgeRouterProps {
  children: ReactNode;
}

/**
 * App Bridge Router Component
 * 
 * App Bridge 4.x handles route synchronization automatically.
 * This component is a compatibility wrapper that doesn't need to do anything
 * for App Bridge 4.x, but provides a placeholder for any future route handling.
 * 
 * Route synchronization in App Bridge 4.x is handled automatically by the
 * App Bridge script when using standard navigation methods.
 */
export const AppBridgeRouter = ({ children }: AppBridgeRouterProps) => {
  // App Bridge 4.x handles route synchronization automatically
  // No manual route propagation needed
  // This component exists for compatibility and future extensibility
  
  const location = useLocation();
  
  // In App Bridge 4.x, routes are automatically synchronized
  // when using standard navigation (React Router, etc.)
  // No additional setup required
  
  return <>{children}</>;
};
