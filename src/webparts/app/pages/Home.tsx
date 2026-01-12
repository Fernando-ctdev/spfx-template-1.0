import * as React from 'react';
import { mergeStyleSets } from '@fluentui/react';
import { Rocket, FolderOpen, Puzzle, Wrench, Database, Sparkles, ExternalLink } from 'lucide-react';

// Cores para ícones de estrutura
const iconColors = {
  pages: { bg: '#e3f2fd', color: '#1976d2' },
  components: { bg: '#f3e5f5', color: '#7b1fa2' },
  services: { bg: '#e8f5e9', color: '#388e3c' },
  models: { bg: '#fff3e0', color: '#f57c00' },
};

// Estilos da Home
const homeStyles = mergeStyleSets({
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '24px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    maxWidth: '600px',
    width: '100%',
    overflow: 'hidden',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '32px',
    textAlign: 'center' as const,
    color: '#ffffff',
  },
  headerIcon: {
    display: 'inline-flex',
    padding: '12px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.2)',
    marginBottom: '16px',
  },
  headerTitle: {
    fontSize: '28px',
    fontWeight: 600,
    margin: '0 0 8px 0',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: '14px',
    opacity: 0.9,
    margin: 0,
    color: '#ffffff',
  },
  body: {
    padding: '32px',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#323130',
    marginBottom: '12px',
  },
  structureList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  structureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: '#f9f9f9',
    borderRadius: '8px',
    border: '1px solid #edebe9',
    transition: 'all 0.2s',
    selectors: {
      ':hover': {
        background: '#f3f2f1',
        transform: 'translateX(4px)',
      },
    },
  },
  structureIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  structureText: {
    flex: 1,
  },
  structureLabel: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#323130',
    margin: '0 0 2px 0',
  },
  structurePath: {
    fontSize: '12px',
    color: '#605e5c',
    margin: 0,
    fontFamily: 'Monaco, Consolas, monospace',
  },
  stackBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    background: '#f3f2f1',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#323130',
    marginRight: '8px',
    marginBottom: '8px',
  },
  footer: {
    padding: '16px 32px',
    background: '#f9f9f9',
    borderTop: '1px solid #edebe9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: '12px',
    color: '#605e5c',
  },
  footerLink: {
    fontSize: '12px',
    color: '#0078d4',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    selectors: {
      ':hover': {
        textDecoration: 'underline',
      },
    },
  },
});

interface IHomeProps {
  userName?: string;
}

const Home: React.FC<IHomeProps> = ({ userName }) => {
  const structureItems = [
    { icon: FolderOpen, label: 'Páginas', path: 'src/webparts/app/pages/', colors: iconColors.pages },
    { icon: Puzzle, label: 'Componentes', path: 'src/webparts/app/components/', colors: iconColors.components },
    { icon: Wrench, label: 'Serviços', path: 'src/core/services/', colors: iconColors.services },
    { icon: Database, label: 'Models', path: 'src/models/', colors: iconColors.models },
  ];

  return (
    <div className={homeStyles.container}>
      <div className={homeStyles.card}>
        {/* Header */}
        <div className={homeStyles.header}>
          <div className={homeStyles.headerIcon}>
            <Rocket size={32} color="#ffffff" />
          </div>
          <h1 className={homeStyles.headerTitle}>
            {userName ? `Olá, ${userName}!` : 'Bem-vindo!'}
          </h1>
          <p className={homeStyles.headerSubtitle}>
            Seu template SPFx está pronto para desenvolvimento
          </p>
        </div>

        {/* Body */}
        <div className={homeStyles.body}>
          {/* Estrutura do Projeto */}
          <div className={homeStyles.section}>
            <div className={homeStyles.sectionTitle}>
              <FolderOpen size={18} color="#0078d4" />
              <span>Estrutura do Projeto</span>
            </div>
            <div className={homeStyles.structureList}>
              {structureItems.map((item, index) => (
                <div key={index} className={homeStyles.structureItem}>
                  <div 
                    className={homeStyles.structureIcon}
                    style={{ background: item.colors.bg }}
                  >
                    <item.icon size={18} color={item.colors.color} />
                  </div>
                  <div className={homeStyles.structureText}>
                    <p className={homeStyles.structureLabel}>{item.label}</p>
                    <p className={homeStyles.structurePath}>{item.path}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stack de UI */}
          <div className={homeStyles.section} style={{ marginBottom: 0 }}>
            <div className={homeStyles.sectionTitle}>
              <Sparkles size={18} color="#0078d4" />
              <span>Stack de UI</span>
            </div>
            <div>
              <span className={homeStyles.stackBadge}>
                <span style={{ fontSize: '16px' }}>🎨</span> Fluent UI v8
              </span>
              <span className={homeStyles.stackBadge}>
                <span style={{ fontSize: '16px' }}>⚡</span> Radix UI
              </span>
              <span className={homeStyles.stackBadge}>
                <span style={{ fontSize: '16px' }}>📦</span> PnPjs 4.x
              </span>
              <span className={homeStyles.stackBadge}>
                <span style={{ fontSize: '16px' }}>🔄</span> TanStack Query
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={homeStyles.footer}>
          <span className={homeStyles.footerText}>
            SPFx 1.21.0 • React 17 • TypeScript
          </span>
          <a 
            href="https://learn.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview" 
            target="_blank" 
            rel="noopener noreferrer"
            className={homeStyles.footerLink}
          >
            Documentação <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
