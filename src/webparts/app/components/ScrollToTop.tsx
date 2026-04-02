import * as React from 'react';
import { useLocation } from 'react-router-dom';

const SP_SCROLL_CONTAINER_SELECTORS: string[] = [
  '.spPageCanvasContent',
  '.sp-page-canvas',
  '#workbenchPageContent',
  '#spPageChromeAppDiv',
  '.CanvasZone',
  '.CanvasComponent',
  '.SPCanvas',
  '.mainContent',
  '.od-TopLevelHost',
  '.Files-rightPane-content',
  '#app-root',
];

const scrollContainerToTop = (container: Element): void => {
  if (container instanceof HTMLElement) {
    container.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }
};

const isScrollableElement = (element: Element): element is HTMLElement => {
  if (!(element instanceof HTMLElement)) {
    return false;
  }

  const style = window.getComputedStyle(element);
  const hasScrollableOverflow =
    style.overflowY === 'auto' ||
    style.overflowY === 'scroll' ||
    style.overflowY === 'overlay';

  return hasScrollableOverflow && element.scrollHeight > element.clientHeight + 20;
};

const resolveDynamicScrollableContainer = (): HTMLElement | null => {
  const allElements = Array.from(document.querySelectorAll('*'));
  let bestCandidate: HTMLElement | null = null;
  let bestScrollableDelta = -1;

  allElements.forEach((element) => {
    if (!isScrollableElement(element)) {
      return;
    }

    const scrollableDelta = element.scrollHeight - element.clientHeight;
    if (scrollableDelta > bestScrollableDelta) {
      bestScrollableDelta = scrollableDelta;
      bestCandidate = element;
    }
  });

  return bestCandidate;
};

const resolveScrollableAncestors = (): HTMLElement[] => {
  const appRoot = document.querySelector('.nipmais-scope');
  if (!(appRoot instanceof HTMLElement)) {
    return [];
  }

  const ancestors: HTMLElement[] = [];
  let current: HTMLElement | null = appRoot;

  while (current) {
    if (isScrollableElement(current)) {
      ancestors.push(current);
    }

    current = current.parentElement;
  }

  return ancestors;
};

const resolveScrollContainers = (): Element[] => {
  const found = SP_SCROLL_CONTAINER_SELECTORS
    .map((selector) => document.querySelector(selector))
    .filter((element): element is Element => element !== null);

  const unique = new Set<Element>(found);
  return Array.from(unique);
};

export const ScrollToTop: React.FC = () => {
  const { pathname, search, hash } = useLocation();

  React.useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  React.useEffect(() => {
    const containers = resolveScrollContainers();
    const dynamicScrollableContainer = resolveDynamicScrollableContainer();
    const ancestorContainers = resolveScrollableAncestors();

    if (dynamicScrollableContainer) {
      containers.push(dynamicScrollableContainer);
    }

    containers.push(...ancestorContainers);

    const uniqueContainers = Array.from(new Set(containers));

    const resetScrollPosition = (): void => {
      uniqueContainers.forEach(scrollContainerToTop);

      if (document.scrollingElement instanceof HTMLElement) {
        document.scrollingElement.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }

      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };

    resetScrollPosition();
    window.requestAnimationFrame(resetScrollPosition);
    window.setTimeout(resetScrollPosition, 0);
    window.setTimeout(resetScrollPosition, 50);
    window.setTimeout(resetScrollPosition, 150);
    window.setTimeout(resetScrollPosition, 300);
  }, [pathname, search, hash]);

  return null;
};
