import { useCallback } from 'react';
import { toast as hotToast } from 'sonner';

export function useToast() {
  const toast = useCallback((options: { title?: string; description?: string; variant?: 'default' | 'destructive' }) => {
    hotToast(options.title || '', {
      description: options.description,
      className:
        options.variant === 'destructive'
          ? 'bg-red-600 text-white'
          : 'bg-zinc-800 text-white',
    });
  }, []);

  return { toast };
}
