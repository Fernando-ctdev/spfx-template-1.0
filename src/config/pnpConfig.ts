import { spfi, SPFI, SPFx } from "@pnp/sp";
import { LogLevel, PnPLogging } from "@pnp/logging";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/lists";
import "@pnp/sp/presets/all";
import "@pnp/sp/items";
import "@pnp/sp/attachments";
import "@pnp/sp/batching";
import "@pnp/sp/site-users";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";

// Variável global para armazenar a instância SPFI
export let _sp: SPFI | null = null;

// Flag para controlar se já tentamos inicializar com o contexto de página
let _hasTriedPageContextInit = false;

/**
 * Obtém uma instância do objeto SPFI inicializada com o contexto fornecido
 * @param context Contexto WebPart opcional
 * @returns Instância SPFI inicializada
 */
export const getSP = (context?: WebPartContext): SPFI | null => {
  // Se temos um contexto, inicializamos o SP com ele
  if (context != null) {
    _sp = spfi().using(SPFx(context)).using(PnPLogging(LogLevel.Warning));
    // Expor para debug global
    (window as any)._spPnP = _sp;
    return _sp;
  }
  
  // Se já temos um SP inicializado, retornamos ele
  if (_sp !== null) {
    return _sp;
  }
  
  // Se não temos um contexto, mas temos o contexto de página, tentamos inicializar com ele
  if (!_hasTriedPageContextInit && !_sp && (window as any)._spPageContextInfo) {
    try {
      _hasTriedPageContextInit = true;
      
      const mockContext = {
        pageContext: {
          web: {
            absoluteUrl: (window as any)._spPageContextInfo.webAbsoluteUrl
          }
        }
      };
      
      _sp = spfi().using(SPFx(mockContext as any)).using(PnPLogging(LogLevel.Warning));
      // Expor para debug global
      (window as any)._spPnP = _sp;
    } catch (error) {
      console.error('Erro ao inicializar SP com _spPageContextInfo:', error);
    }
  }
  
  return _sp;
};

/**
 * Obtém uma instância do objeto SPFI inicializada com o contexto de extensão
 * @param context Contexto de extensão opcional
 * @returns Instância SPFI inicializada
 */
export const getSPExtension = (context?: ApplicationCustomizerContext): SPFI | null => {
  if (context != null) {
    _sp = spfi().using(SPFx(context)).using(PnPLogging(LogLevel.Warning));
    // Expor para debug global
    (window as any)._spPnP = _sp;
  }
  return _sp;
};
