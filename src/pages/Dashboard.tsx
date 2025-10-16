import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompanies } from '@/contexts/CompanyContext';
import { Button } from '@/components/ui/button';
import { Plus, LogOut, Building2, Settings } from 'lucide-react';
import CompanyTable from '@/components/CompanyTable';
import CompanyModal from '@/components/CompanyModal';
import logoEasy from '@/assets/logo-easy.png';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { companies } = useCompanies();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);

  const handleAddCompany = () => {
    setEditingCompanyId(null);
    setIsModalOpen(true);
  };

  const handleEditCompany = (id: string) => {
    setEditingCompanyId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCompanyId(null);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <img src={logoEasy} alt="EASY Logo" className="h-10" />
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
          >
            <Building2 className="mr-3 h-5 w-5" />
            Empresas
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <Settings className="mr-3 h-5 w-5" />
            Configurações
          </Button>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={logout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-foreground">Gerenciamento de Empresas</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Bem-vindo, <span className="text-foreground font-medium">{user?.name}</span>
            </span>
            <Button size="sm" variant="outline" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Empresas Cadastradas</h2>
              <p className="text-muted-foreground mt-1">
                {companies.length} {companies.length === 1 ? 'empresa cadastrada' : 'empresas cadastradas'}
              </p>
            </div>
            <Button onClick={handleAddCompany}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Empresa
            </Button>
          </div>

          <CompanyTable onEdit={handleEditCompany} />
        </main>

        {/* Footer */}
        <footer className="bg-card border-t border-border py-4 px-8">
          <p className="text-sm text-muted-foreground text-center">
            2025 Desenvolvido por SQUAD-07 UNIT
          </p>
        </footer>
      </div>

      <CompanyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingCompanyId={editingCompanyId}
      />
    </div>
  );
};

export default Dashboard;
