import * as React from 'react';
import { Users, TrendingUp, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface IHomeProps {
  userName?: string;
}

const Home: React.FC<IHomeProps> = ({ userName }) => {
  // Dados mockados para os Cards de Estatísticas
  const stats = [
    { 
      title: 'Total de Usuários', 
      value: '2,847', 
      delta: '+12.5%', 
      isPositive: true, 
      icon: Users 
    },
    { 
      title: 'Projetos Ativos', 
      value: '156', 
      delta: '+8.2%', 
      isPositive: true, 
      icon: TrendingUp 
    },
    { 
      title: 'Documentos', 
      value: '1,234', 
      delta: '+3.1%', 
      isPositive: true, 
      icon: FileText 
    },
    { 
      title: 'Tarefas Concluídas', 
      value: '892', 
      delta: '-2.4%', 
      isPositive: false, 
      icon: CheckCircle 
    },
  ];

  // Dados mockados para Atividades Recentes
  const recentActivities = [
    { title: 'Novo relatório financeiro gerado', user: 'Maria Silva', time: 'Há 5 minutos', icon: Clock },
    { title: 'Documento de políticas atualizado', user: 'João Santos', time: 'Há 15 minutos', icon: Clock },
    { title: 'Novo colaborador adicionado', user: 'Admin', time: 'Há 1 hora', icon: Clock },
    { title: 'Backup de dados concluído', user: 'Sistema', time: 'Há 2 horas', icon: Clock },
  ];

  // Dados mockados para Tarefas Pendentes
  const pendingTasks = [
    { title: 'Revisar proposta comercial', due: 'Hoje', priority: 'Alta', color: 'text-red-600 bg-red-50 border-red-100' },
    { title: 'Aprovar férias - Equipe TI', due: 'Amanhã', priority: 'Média', color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { title: 'Atualizar manual de processos', due: 'Esta semana', priority: 'Baixa', color: 'text-green-600 bg-green-50 border-green-100' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Bem-vindo ao seu portal corporativo</p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
              <span className={`inline-flex items-center text-xs font-medium mt-1 ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.delta}
              </span>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Content Section - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Atividades Recentes */}
        <div className="flex flex-col rounded-xl shadow-sm border border-gray-100 overflow-hidden bg-white">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              Atividades Recentes
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex gap-4 group">
                  <div className="mt-1">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <activity.icon size={16} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
                Ver todas as atividades →
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Tarefas Pendentes */}
        <div className="flex flex-col rounded-xl shadow-sm border border-gray-100 overflow-hidden bg-white">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">
              Tarefas Pendentes
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pendingTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 text-gray-400 group-hover:text-blue-600 transition-colors">
                      <div className="w-5 h-5 rounded-full border-2 border-current" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Prazo: {task.due}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${task.color}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
                Ver todas as tarefas →
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
