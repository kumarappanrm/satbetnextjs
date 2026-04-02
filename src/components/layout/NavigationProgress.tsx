'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/** Thin top bar on client route changes (non-blocking). */
export default function NavigationProgress() {
  const pathname = usePathname();
  const prev = useRef(pathname);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (prev.current === pathname) return;
    prev.current = pathname;
    setActive(true);
    const t = window.setTimeout(() => setActive(false), 380);
    return () => clearTimeout(t);
  }, [pathname]);

  return <div className="next-route-progress" aria-hidden="true" data-active={active ? 'true' : 'false'} />;
}
