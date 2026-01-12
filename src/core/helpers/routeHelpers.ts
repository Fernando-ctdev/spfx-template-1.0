/**
 * ===============================================
 * 🔗 HELPERS DE NAVEGAÇÃO E ROTEAMENTO
 * ===============================================
 * 
 * Utilitários para sincronizar React Router com querystrings
 * Resolve problemas de deep linking em SPFx
 * 
 * ===============================================
 */

/**
 * Extrai parâmetros de rota da URL atual
 * Útil para restaurar estado após reload
 */
export const getRouteParams = (): Record<string, string> => {
  const params: Record<string, string> = {};
  
  if (typeof window === 'undefined') return params;
  
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
};

/**
 * Constrói URL com querystring para compartilhamento
 * @param route - Rota atual (ex: '/dashboard')
 * @param additionalParams - Parâmetros extras
 */
export const buildShareableUrl = (
  route: string,
  additionalParams?: Record<string, string>
): string => {
  if (typeof window === 'undefined') return '';
  
  const baseUrl = window.location.origin + window.location.pathname;
  const params = new URLSearchParams();
  
  // Adiciona a página como parâmetro
  const pageName = route.replace('/', '') || 'home';
  params.set('page', pageName);
  
  // Adiciona parâmetros extras
  if (additionalParams) {
    Object.entries(additionalParams).forEach(([key, value]) => {
      params.set(key, value);
    });
  }
  
  return `${baseUrl}?${params.toString()}`;
};

/**
 * Obtém a rota inicial baseada na querystring
 * Usar no componente raiz para restaurar navegação
 */
export const getInitialRouteFromUrl = (): string => {
  if (typeof window === 'undefined') return '/';
  
  const params = new URLSearchParams(window.location.search);
  const page = params.get('page');
  
  if (!page || page === 'home') return '/';
  return `/${page}`;
};

/**
 * Atualiza a URL sem navegar (para manter sincronizado)
 * @param route - Rota atual
 */
export const updateUrlWithoutNavigation = (route: string): void => {
  if (typeof window === 'undefined') return;
  
  const url = buildShareableUrl(route);
  window.history.replaceState({}, '', url);
};

/**
 * Hook para copiar URL compartilhável para clipboard
 */
export const copyShareableUrl = async (route: string): Promise<boolean> => {
  try {
    const url = buildShareableUrl(route);
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
};
