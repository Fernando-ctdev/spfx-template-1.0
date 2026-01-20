import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'AppWebPartStrings';
import App from './App';
import { IAppProps } from './App';
import { getSP } from '../../config/pnpConfig';
import './shared/css/tailwind.css';
import './shared/css/global.module.scss';
// Mantemos o import do CSS para garantir que estilos específicos do app sejam carregados
import './shared/css/page-layout.css';

export interface IAppWebPartProps {
  description: string;
}

export default class AppWebPart extends BaseClientSideWebPart<IAppWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IAppProps> = React.createElement(
      App,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    // Inicializar SP com o contexto da webpart
    getSP(this.context);
    
    // Atribuir contexto ao window para acesso global em casos de erro
    (window as any)._spfxContext = this.context;

    // Injetar estilos globais para forçar ocultação de elementos do SharePoint
    this._injectGlobalStyles();
    
    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }

  /**
   * Injeta estilos globais diretamente no head do documento
   * Essa abordagem é mais agressiva e eficaz para esconder elementos nativos
   * que são carregados fora do ciclo de vida do WebPart
   */
  private _injectGlobalStyles(): void {
    const styleId = 'spfx-app-global-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      /* Ocultar Suite Bar e Header de forma agressiva */
      #SuiteNavWrapper,
      #SuiteNavPlaceholder,
      #O365_SuiteBranding_container,
      .ms-SuiteNav-wrapper,
      div[data-automationid="SiteHeader"],
      div[class*="headerRow-"],
      div[class*="mainHeader-"],
      #spSiteHeader,
      .sp-page-header,
      #sp-appBar,
      .sp-appBar,
      #HeaderButtonRegion,
      .od-TopBar-header {
        display: none !important;
        height: 0 !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
        position: absolute !important;
        z-index: -9999 !important;
      }

      /* Reset de margens e paddings do conteiner */
      #contentBox,
      #workbenchPageContent,
      .CanvasZone,
      .CanvasComponent,
      #spPageCanvasContent {
        margin: 0 !important;
        padding: 0 !important;
        max-width: 100% !important;
        border: none !important;
      }
      
      /* Ajuste específico para remover o espaço superior deixado pelos elementos ocultos */
      body {
        margin: 0 !important;
        padding: 0 !important;
      }
      
      .CanvasZone {
        padding-left: 0px !important;
        padding-right: 0px !important;
      }
    `;
    document.head.appendChild(style);
  }

  private _getEnvironmentMessage(): Promise<string> {
    if (this.context.sdks.microsoftTeams) {
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams':
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }
          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const { semanticColors } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
