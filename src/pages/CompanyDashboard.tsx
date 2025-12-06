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

  const [newPhone, setNewPhone] = useState("");

  const empresaId = user?.idEmpresa ? Number(user.idEmpresa) : null;
  const empresa = empresas.find(e => Number(e.id_empresa) === empresaId) || null;

  const usuarios = useMemo(() => {
    if (!empresa) return [];
    return getUsuariosByEmpresa(empresa.id_empresa);
  }, [empresa, getUsuariosByEmpresa]);

  const handleAddPhone = () => {
    const numbers = newPhone.replace(/\D/g, "");

    if (numbers.length < 10 || !empresa) return;

    addUsuario({
      nome: `Contato ${usuarios.length + 1}`,
      telefone: numbers,
      papel: "funcionario",
      atividade: "ativo",
      id_empresa: empresa.id_empresa,
    });

    setNewPhone("");
  };

  return (
    <div className="min-h-screen bg-background flex">

      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r flex flex-col">
        <div className="p-6 border-b">
          <img src={logoEasy} alt="EASY Logo" className="h-10" />
        </div>

        <nav className="flex-1 p-4">
          <Button
            variant="ghost"
            className="w-full justify-start bg-sidebar-accent text-sidebar-accent-foreground"
          >
            <Building2 className="mr-3 h-5 w-5" />
            Minha Empresa
          </Button>
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full justify-start"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sair
          </Button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-card border-b flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-foreground">Visão do Cliente</h1>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Bem-vindo, <span className="font-medium">{user?.nome}</span>
            </span>
            <Button size="sm" variant="outline" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </header>

        <main className="flex-1 p-8">
          {!empresa ? (
            <div className="p-12 border rounded-lg text-center bg-card">
              <p className="text-muted-foreground">
                Nenhuma empresa vinculada ao seu usuário.
              </p>
            </div>
          ) : (
            <div className="bg-card border rounded-lg p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">{empresa.nome_empresa}</h2>

              {/* INFORMAÇÕES DA EMPRESA */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary p-4 rounded">
                  <p className="text-sm text-muted-foreground">CNPJ</p>
                  <p>{empresa.cnpj}</p>
                </div>

                <div className="bg-secondary p-4 rounded">
                  <p className="text-sm text-muted-foreground">App Key</p>
                  <p>{empresa.app_Key}</p>
                </div>

                <div className="bg-secondary p-4 rounded">
                  <p className="text-sm text-muted-foreground">App Secret</p>
                  <p>{empresa.app_Secret}</p>
                </div>
              </div>

              {/* TELEFONES */}
              <div className="mt-6 p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Números com acesso ao chatbot</h3>

                <div className="flex gap-3 mb-4">
                  <div className="flex-1">
                    <Label>Adicionar Telefone</Label>
                    <Input
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="11999999999"
                    />
                  </div>

                  <Button variant="outline" onClick={handleAddPhone}>
                    Adicionar
                  </Button>
                </div>

                {!usuarios.length ? (
                  <p className="text-muted-foreground">Nenhum telefone cadastrado.</p>
                ) : (
                  <ul className="space-y-2">
                    {usuarios.map((u) => (
                      <li key={u.id_user} className="flex justify-between p-2 bg-secondary rounded">
                        <span>{u.telefone}</span>
                        <Button size="sm" variant="outline" onClick={() => deleteUsuario(u.id_user)}>
                          Remover
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

    </div>
  );
};

export default CompanyDashboard;
