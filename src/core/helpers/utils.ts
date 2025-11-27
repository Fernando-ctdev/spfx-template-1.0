/**
 * Helpers utilitários
 */

/**
 * Formata uma data para exibição
 * @param date Data a ser formatada
 * @param locale Localidade (padrão: pt-BR)
 */
export const formatDate = (date: Date | string, locale: string = 'pt-BR'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale);
};

/**
 * Formata data e hora para exibição
 * @param date Data a ser formatada
 * @param locale Localidade (padrão: pt-BR)
 */
export const formatDateTime = (date: Date | string, locale: string = 'pt-BR'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString(locale);
};

/**
 * Trunca um texto em um número específico de caracteres
 * @param text Texto a ser truncado
 * @param maxLength Comprimento máximo
 * @param suffix Sufixo (padrão: ...)
 */
export const truncateText = (text: string, maxLength: number, suffix: string = '...'): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Debounce function
 * @param func Função a ser executada
 * @param wait Tempo de espera em ms
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Copia texto para a área de transferência
 * @param text Texto a ser copiado
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Erro ao copiar para clipboard:', error);
    return false;
  }
};

/**
 * Gera um ID único
 */
export const generateUniqueId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
