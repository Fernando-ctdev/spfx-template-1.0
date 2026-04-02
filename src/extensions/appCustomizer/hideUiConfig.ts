export type HideScope = 'sitepages' | 'specific-page';
export type NavigationScope = 'spa-only' | 'spa-and-sitepages';
export type NavigationMount = 'layout' | 'app-customizer';
export type NavigationShell = 'navbar' | 'sidebar' | 'blank';

export interface IHideUiConfig {
  enabled: boolean;
  scope: HideScope;
  targetPageSlug: string;
  navigationScope: NavigationScope;
  navigationMount: NavigationMount;
  shellLayout: NavigationShell;
  hideLevels: {
    base: boolean;
    commandBar: boolean;
    socialBar: boolean;
    comments: boolean;
  };
}

export const hideUiConfig: IHideUiConfig = {
  enabled: false,
  scope: 'sitepages',
  targetPageSlug: '',
  navigationScope: 'spa-only',
  navigationMount: 'layout',
  shellLayout: 'navbar',
  hideLevels: {
    base: true,
    commandBar: true,
    socialBar: false,
    comments: false
  }
};
