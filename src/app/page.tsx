'use client';

import { useUserStore } from '@/stores/userStore';
import { WelcomePage } from '@/components/WelcomePage';
import { Dashboard } from '@/components/Dashboard';

export default function Home() {
  const { onboardingComplete } = useUserStore((s) => s.profile);

  if (!onboardingComplete) {
    return <WelcomePage />;
  }

  return <Dashboard />;
}
