import { useEffect, useState } from 'react';

export function useIsWebview() {
  const [isWebview, setIsWebview] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isInstagramWebview = userAgent.includes('instagram');
    const isFacebookWebview =
      userAgent.includes('fban') || userAgent.includes('fbav');
    const isWebview = isInstagramWebview || isFacebookWebview;

    setIsWebview(isWebview);
  }, []);

  return isWebview;
}
