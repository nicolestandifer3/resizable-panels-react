import { useLayoutEffect } from "../vendor/react";

const canUseEffectHooks = !!(
  typeof window !== "undefined" &&
  typeof window.document !== "undefined" &&
  typeof window.document.createElement !== "undefined"
);

const useIsomorphicLayoutEffect = canUseEffectHooks
  ? useLayoutEffect
  : () => {};

export default useIsomorphicLayoutEffect;
