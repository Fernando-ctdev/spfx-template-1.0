import * as React from 'react';
import * as ReactDom from 'react-dom';
import { override } from '@microsoft/decorators';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import { HashRouter as Router } from 'react-router-dom';

import { Navbar } from '../../webparts/app/components/Navbar';
import { Sidebar } from '../../webparts/app/components/Sidebar';
import { SidebarProvider } from '../../webparts/app/contexts/SidebarContext';
import { getSPExtension } from "../../config/pnpConfig";
import { hideUiConfig } from './hideUiConfig';

import "../../webparts/app/shared/css/tailwind.generated.css";

const TOP_WRAPPER_ID = "app-appcustomizer-top";
const STYLE_ID = "app-appcustomizer-ui-overrides";
const FULL_HIDE_CLASS = "app-full-hide";

const BASE_HIDE_SELECTORS: string[] = [
  "#SuiteNavWrapper",
  "#SuiteNavPlaceholder",
  "#O365_SuiteBranding_container",
  "#sp-appBar",
  ".sp-appBar",
  "#spSiteHeader",
  "div[data-automation-id='SiteHeader']",
  "div[data-automationid='SiteHeader']",
  "div[data-automation-id='SimpleFooter']",
  "div[data-automationid='SimpleFooter']",
  "#FooterEditLink",
];

const COMMENTS_SELECTORS: string[] = [
  "#CommentsWrapper",
  "div[data-automation-id='CommentsWrapper']",
  "div[data-automationid='CommentsWrapper']",
];

const SOCIAL_BAR_SELECTORS: string[] = [
  "div[data-automation-id='socialBar']",
  "div[data-automationid='socialBar']",
  "div[data-automation-id='SocialBar']",
  "div[data-automationid='SocialBar']",
  "div[data-automation-id='bottomSocialBar']",
  "div[data-automationid='bottomSocialBar']",
  "div[class*='socialBar']",
  "div[class*='SocialBar']",
];

const COMMAND_BAR_SELECTORS: string[] = [
  "div[data-automation-id='pageCommandBar']",
  "div[data-automation-id='commandBar']",
  "div[data-automationid='pageCommandBar']",
  "div[data-automationid='commandBar']",
  "div[class*='commandBarWrapper']",
  "div[class*='pageCommandBar']",
  ".ms-CommandBar",
];

const HIDE_PROPERTIES = `
  display: none !important;
  visibility: hidden !important;
  height: 0 !important;
  min-height: 0 !important;
  max-height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  border: 0 !important;
  overflow: hidden !important;
`;

function normalizePath(pathName: string): string {
  return pathName.trim().toLowerCase();
}

function toBodyScopedSelectors(bodyClass: string, selectors: string[]): string {
  return selectors.map(selector => `body.${bodyClass} ${selector}`).join(',\n      ');
}

function buildHideCss(bodyClass: string, selectors: string[]): string {
  if (!selectors.length) {
    return '';
  }

  return `
    ${toBodyScopedSelectors(bodyClass, selectors)} {
      ${HIDE_PROPERTIES}
    }
  `;
}

const TopShell: React.FC = () => {
  if (hideUiConfig.shellLayout === 'sidebar') {
    return (
      <Router>
        <SidebarProvider>
          <Sidebar />
        </SidebarProvider>
      </Router>
    );
  }

  if (hideUiConfig.shellLayout === 'blank') {
    return null;
  }

  return (
    <Router>
      <Navbar />
    </Router>
  );
};

export interface IApplicationCustomizerProperties {}

export default class ApplicationCustomizer extends BaseApplicationCustomizer<IApplicationCustomizerProperties> {
  private _topPlaceholder?: PlaceholderContent;
  private readonly _targetPageSlug = normalizePath(hideUiConfig.targetPageSlug || '');

  @override
  public onInit(): Promise<void> {
    getSPExtension(this.context);
    const placeholderNames = this.context.placeholderProvider.placeholderNames;
    console.info('AppCustomizer ativo', {
      location: window.location.href,
      topPlaceholderAvailable: placeholderNames.indexOf(PlaceholderName.Top) !== -1,
      bottomPlaceholderAvailable: placeholderNames.indexOf(PlaceholderName.Bottom) !== -1
    });

    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
    this._renderPlaceHolders();
    this._injectUiOverrideStyles();
    this._applyPageModeClass();

    window.addEventListener("popstate", this._applyPageModeClass);
    window.addEventListener("hashchange", this._applyPageModeClass);

    return Promise.resolve();
  }

  private _renderPlaceHolders = (): void => {
    if (!this._shouldRenderShellInCustomizer()) {
      const existingWrapper = document.getElementById(TOP_WRAPPER_ID);
      if (existingWrapper) {
        ReactDom.unmountComponentAtNode(existingWrapper);
        existingWrapper.remove();
      }
      return;
    }

    if (!this._topPlaceholder) {
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { onDispose: this._onDisposeTop }
      );
    }

    const hasWrapper = document.getElementById(TOP_WRAPPER_ID);
    if (!hasWrapper && this._topPlaceholder?.domElement) {
      const topWrapper = document.createElement('div');
      topWrapper.id = TOP_WRAPPER_ID;
      topWrapper.className = '-scope';
      topWrapper.setAttribute('data-shell-source', '-appcustomizer');
      this._topPlaceholder.domElement.appendChild(topWrapper);

      ReactDom.render(<TopShell />, topWrapper);
    }
  };

  private _shouldRenderShellInCustomizer(): boolean {
    if (hideUiConfig.navigationMount !== 'app-customizer' || hideUiConfig.shellLayout === 'blank') {
      return false;
    }

    const normalizedPath = normalizePath(window.location.pathname);
    return normalizedPath.includes('/sitepages/');
  }

  private _shouldApplyHideOnCurrentPage(): boolean {
    if (!hideUiConfig.enabled) {
      return false;
    }

    const normalizedPath = normalizePath(window.location.pathname);
    if (hideUiConfig.scope === 'sitepages') {
      return normalizedPath.includes('/sitepages/');
    }

    if (!this._targetPageSlug) {
      return false;
    }

    return normalizedPath.endsWith(`/${this._targetPageSlug}`);
  }

  private _resolveEnabledSelectors(): string[] {
    const selectors: string[] = [];

    if (hideUiConfig.hideLevels.base) {
      selectors.push(...BASE_HIDE_SELECTORS);
    }

    if (hideUiConfig.hideLevels.commandBar) {
      selectors.push(...COMMAND_BAR_SELECTORS);
    }

    if (hideUiConfig.hideLevels.socialBar) {
      selectors.push(...SOCIAL_BAR_SELECTORS);
    }

    if (hideUiConfig.hideLevels.comments) {
      selectors.push(...COMMENTS_SELECTORS);
    }

    return selectors.filter((selector, index) => selectors.indexOf(selector) === index);
  }

  private _applyPageModeClass = (): void => {
    document.body.classList.remove(FULL_HIDE_CLASS);

    if (this._shouldApplyHideOnCurrentPage()) {
      document.body.classList.add(FULL_HIDE_CLASS);
    }
  };

  private _injectUiOverrideStyles(): void {
    if (!hideUiConfig.enabled || document.getElementById(STYLE_ID)) {
      return;
    }

    const enabledSelectors = this._resolveEnabledSelectors();
    if (!enabledSelectors.length) {
      return;
    }

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = buildHideCss(FULL_HIDE_CLASS, enabledSelectors);

    document.head.appendChild(style);
  }

  private _onDisposeTop = (): void => {
    const topWrapper = document.getElementById(TOP_WRAPPER_ID);
    if (topWrapper) {
      ReactDom.unmountComponentAtNode(topWrapper);
      topWrapper.remove();
    }

    window.removeEventListener("popstate", this._applyPageModeClass);
    window.removeEventListener("hashchange", this._applyPageModeClass);
    document.body.classList.remove(FULL_HIDE_CLASS);
  };
}
