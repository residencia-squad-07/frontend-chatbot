import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import logoEasy from '@/assets/logo-easy.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState<'plataforma_admin' | 'empresa_admin'>('plataforma_admin');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(email, senha, role);

    if (success) {
      toast.success('Login realizado com sucesso!');

      // Agora verificamos o usuário REAL vindo do backend
      const savedUser = localStorage.getItem("easy_admin_user");
      if (savedUser) {
        const user = JSON.parse(savedUser);

        if (user.role === "plataforma_admin") {
          navigate("/dashboard");
        } else {
          navigate("/empresa");
        }
      }
    } else {
      toast.error('Usuário ou senha inválidos');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 bg-black overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle at 50% 40%, rgba(80,80,160,0.45) 0%, rgba(0,0,0,0.95) 70%)' }} />

      <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-br from-blue-500 via-blue-800 to-black opacity-80 
                      rounded-full blur-2xl pointer-events-none animate-pulse 
                      shadow-[0_0_80px_20px_rgba(80,80,255,0.5)]"
        style={{ transform: 'translate(-50%, -50%)' }} />

      <div className="w-full max-w-md space-y-8 animate-fade-in relative z-10">
        <div className="text-center space-y-6">
          <img src={logoEasy} alt="EASY Logo" className="h-16 mx-auto" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Painel Administrativo</h1>
            <p className="text-muted-foreground mt-2">
              Faça login para gerenciar as empresas
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="bg-card rounded-lg border border-border p-8 space-y-6 shadow-2xl shadow-blue-900/80 backdrop-blur-md">

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-secondary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="bg-secondary"
              />
            </div>

            <div className="space-y-2">
              <Label>Papel de acesso</Label>
              <Select value={role} onValueChange={(value: 'plataforma_admin' | 'empresa_admin') => setRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o papel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plataforma_admin">Administrador da Plataforma</SelectItem>
                  <SelectItem value="empresa_admin">Administrador da Empresa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Use suas credenciais reais. O sistema verificará sua permissão.
            </p>

          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
