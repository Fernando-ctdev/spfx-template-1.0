module.exports = (name, options) => {
  return `import * as React from 'react';
import { makeStyles, shorthands } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    width: '100%',
    minHeight: '80vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc', // slate-50
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // shadow-md
    ...shorthands.padding('48px'),
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
  },
  iconContainer: {
    width: '64px',
    height: '64px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', // blue-500 to violet-500
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '32px',
    marginBottom: '16px',
  },
  title: {
    fontSize: '30px',
    fontWeight: '700',
    color: '#0f172a', // slate-900
    margin: 0,
    lineHeight: 1.2,
  },
  description: {
    fontSize: '16px',
    color: '#64748b', // slate-500
    margin: 0,
    lineHeight: 1.6,
  },
  badge: {
    display: 'inline-block',
    padding: '6px 16px',
    borderRadius: '9999px',
    backgroundColor: '#dbeafe', // blue-100
    color: '#1e40af', // blue-800
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '0.025em',
  }
});

export const ${name}: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          ✨
        </div>
        
        <h1 className={styles.title}>
          ${name}
        </h1>
        
        <span className={styles.badge}>
          Gerada com Sucesso
        </span>

        <p className={styles.description}>
          Esta página foi gerada automaticamente pelo CLI SPFx Enterprise .
          Agora você pode editar este componente em:
          <br/>
          <code style={{ 
            marginTop: '12px', 
            display: 'block', 
            background: '#f1f5f9', 
            padding: '8px', 
            borderRadius: '6px', 
            fontSize: '13px',
            fontFamily: 'monospace' 
          }}>
            src/webparts/app/pages/${name}.tsx
          </code>
        </p>
      </div>
    </div>
  );
};

export default ${name};
`;
};
