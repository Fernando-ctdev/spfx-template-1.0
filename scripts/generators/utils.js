/**
 * ===============================================
 * UTILITÁRIOS DE CONVERSÃO DE NOMES
 * ===============================================
 *
 * Funções auxiliares para conversão entre diferentes
 * formatos de nomes (PascalCase, camelCase, kebab-case).
 *
 * ===============================================
 */

/**
 * Converte uma string para PascalCase
 * @param {string} str - String a ser convertida
 * @returns {string} String em PascalCase
 */
function toPascalCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter) => letter.toUpperCase())
    .replace(/\s+/g, '')
    .replace(/-/g, '');
}

/**
 * Converte uma string para camelCase
 * @param {string} str - String a ser convertida
 * @returns {string} String em camelCase
 */
function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Converte uma string para kebab-case
 * @param {string} str - String a ser convertida
 * @returns {string} String em kebab-case
 */
function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

module.exports = {
  toPascalCase,
  toCamelCase,
  toKebabCase
};
