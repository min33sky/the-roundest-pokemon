import { createReactQueryHooks } from '@trpc/react';
import type { AppRouter } from '@/backend/router';

/**
 ** trpc에서 제공하는 Hook들을 내보낸다.
 *? ex) { useQuery: ..., useMutation: ...}
 */
export const trpc = createReactQueryHooks<AppRouter>();
