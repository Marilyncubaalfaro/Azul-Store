import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useScrollOnRouteChange() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    let timeoutId;

    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);

      if (element) {
        timeoutId = window.setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        window.scrollTo(0, 0);
      }
    } else {
      window.scrollTo(0, 0);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [pathname, hash]);
}
