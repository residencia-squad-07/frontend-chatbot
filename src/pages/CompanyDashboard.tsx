import { useAuth } from '@/contexts/AuthContext';
import { useEmpresas } from '@/contexts/CompanyContext';
import { useUsuarios } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogOut, Building2 } from 'lucide-react';
import logoEasy from '@/assets/logo-easy.png';
import { useState, useMemo } from 'react';

const CompanyDashboard = () => {
  const { user, logout } = useAuth();
  const { empresas } = useEmpresas();
  const { getUsuariosByEmpresa, addUsuario, deleteUsuario } = useUsuarios();
  const [newPhone, setNewPhone] = useState('');

  const empresa = empresas[0] || null;
  const usuarios = useMemo(() => (empresa ? getUsuariosByEmpresa(empresa.id_empresa) : []), [empresa, getUsuariosByEmpresa]);

  const handleAddPhone = () => {
    const numbers = newPhone.replace(/\D/g, '');
    if (numbers.length < 10) return;
    if (!empresa) return;
    addUsuario({
      nome: `Contato ${usuarios.length + 1}`,
      telefone: numbers,
      papel: 'funcionario',
      atividade: 'ativo',
      id_empresa: empresa.id_empresa,
    });
    setNewPhone('');
  };

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <img src={logoEasy} alt="EASY Logo" className="h-10" />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80">
            <Building2 className="mr-3 h-5 w-5" />
            Minha Empresa
          </Button>
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" onClick={logout}>
            <LogOut className="mr-3 h-5 w-5" />
            Sair
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-foreground">Visão do Cliente</h1>
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

        <main className="flex-1 p-8">
          {!empresa ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <p className="text-muted-foreground">Nenhuma empresa cadastrada.</p>
              <p className="text-sm text-muted-foreground mt-2">Peça ao administrador da plataforma para cadastrar sua empresa.</p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">{empresa.nome_empresa}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-secondary rounded">
                  <p className="text-sm text-muted-foreground">CNPJ</p>
                  <p className="text-foreground">{empresa.cnpj}</p>
                </div>
                <div className="p-4 bg-secondary rounded">
                  <p className="text-sm text-muted-foreground">Token API</p>
                  <p className="text-foreground">{empresa.token_api}</p>
                </div>
              </div>

              <div className="mt-6 p-4 border rounded-lg">
                <h3 className="text-lg font-semibold text-foreground mb-4">Números com acesso ao chatbot</h3>
                <div className="flex items-end gap-3 mb-4">
                  <div className="flex-1">
                    <Label htmlFor="novo-telefone">Adicionar telefone</Label>
                    <Input
                      id="novo-telefone"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="Ex: 11999999999"
                      maxLength={11}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Somente números (mínimo 10 dígitos)</p>
                  </div>
                  <Button type="button" variant="outline" onClick={handleAddPhone}>Adicionar</Button>
                </div>

                {usuarios.length === 0 ? (
                  <p className="text-muted-foreground">Nenhum telefone cadastrado.</p>
                ) : (
                  <ul className="space-y-2">
                    {usuarios.map((u) => (
                      <li key={u.id_user} className="flex items-center justify-between bg-secondary p-2 rounded">
                        <span className="text-foreground text-sm">{u.telefone}</span>
                        <Button size="sm" variant="outline" onClick={() => deleteUsuario(u.id_user)}>Remover</Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </main>

        <footer className="bg-card border-t border-border py-4 px-8">
          <p className="text-sm text-muted-foreground text-center">2025 Desenvolvido por SQUAD-07 UNIT</p>
        </footer>
      </div>
    </div>
  );
};

export default CompanyDashboard;