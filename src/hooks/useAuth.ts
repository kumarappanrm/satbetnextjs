'use client';
import { useAuth as useAuthContext } from '@/store/authContext';

// Re-export auth hook for use across components
export { useAuthContext as useAuth };
