import { useState, useEffect } from "react";

export const useDevBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkDevBanner = () => {
      const devBanner = document.querySelector("[data-dev-banner]");
      setIsVisible(!!devBanner);
    };

    // Check immediately
    checkDevBanner();

    // Set up observer to watch for changes
    const observer = new MutationObserver(checkDevBanner);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return isVisible;
};
