import { useState, useEffect } from 'react';
import { useEmpresas } from '@/contexts/CompanyContext';
import { useUsuarios } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCompanyId: number | null;
}

const CompanyModal = ({ isOpen, onClose, editingCompanyId }: CompanyModalProps) => {
  const { empresas, addEmpresa, updateEmpresa, getEmpresa } = useEmpresas();
  const { addUsuariosForEmpresa, getUsuariosByEmpresa, setTelefonesForEmpresa } = useUsuarios();
  const [formData, setFormData] = useState({
    nome_empresa: '',
    cnpj: '',
    phoneNumbers: [''],
  });

  useEffect(() => {
    if (editingCompanyId !== null) {
      const empresa = getEmpresa(editingCompanyId);
      if (empresa) {
        const usuarios = getUsuariosByEmpresa(editingCompanyId);
        const telefones = usuarios.map(u => u.telefone ?? '').filter(t => t);
        setFormData({
          nome_empresa: empresa.nome_empresa,
          cnpj: empresa.cnpj,
          phoneNumbers: telefones.length ? telefones : [''],
        });
      }
    } else {
      setFormData({
        nome_empresa: '',
        cnpj: '',
        phoneNumbers: [''],
      });
    }
  }, [editingCompanyId, getEmpresa, getUsuariosByEmpresa, isOpen]);

  const handleAddPhoneNumber = () => {
    setFormData(prev => ({ ...prev, phoneNumbers: [...prev.phoneNumbers, ''] }));
  };

  const handleRemovePhoneNumber = (index: number) => {
    setFormData(prev => ({ ...prev, phoneNumbers: prev.phoneNumbers.filter((_, i) => i !== index) }));
  };

  const handlePhoneNumberChange = (index: number, value: string) => {
    const formatted = value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, phoneNumbers: prev.phoneNumbers.map((p, i) => (i === index ? formatted : p)) }));
  };

  const formatCNPJInput = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.slice(0, 14);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação
    if (!formData.nome_empresa.trim()) {
      toast.error('Nome da empresa é obrigatório');
      return;
    }

    if (formData.cnpj.length !== 14) {
      toast.error('CNPJ deve conter 14 dígitos');
      return;
    }

    const duplicate = empresas.some(e => e.cnpj === formData.cnpj && e.id_empresa !== editingCompanyId);
    if (duplicate) {
      toast.error('CNPJ já cadastrado');
      return;
    }
    const validPhones = formData.phoneNumbers.filter(p => p.length >= 10);
    if (validPhones.length === 0) {
      toast.error('Adicione pelo menos um telefone válido (mínimo 10 dígitos)');
      return;
    }
    const empresaData = { nome_empresa: formData.nome_empresa, cnpj: formData.cnpj };

    if (editingCompanyId !== null) {
      updateEmpresa(editingCompanyId, empresaData);
      setTelefonesForEmpresa(validPhones, editingCompanyId);
      toast.success('Empresa atualizada com sucesso!');
    } else {
      const created = addEmpresa(empresaData);
      addUsuariosForEmpresa(validPhones, created.id_empresa);
      toast.success('Empresa adicionada com sucesso!');
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingCompanyId ? 'Editar Empresa' : 'Adicionar Nova Empresa'}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da empresa. Todos os campos são obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="nome_empresa">Nome da Empresa *</Label>
            <Input
              id="nome_empresa"
              value={formData.nome_empresa}
              onChange={(e) => setFormData(prev => ({ ...prev, nome_empresa: e.target.value }))}
              placeholder="Ex: Empresa XPTO Ltda"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ *</Label>
            <Input
              id="cnpj"
              value={formData.cnpj}
              onChange={(e) => setFormData(prev => ({ ...prev, cnpj: formatCNPJInput(e.target.value) }))}
              placeholder="00000000000000"
              maxLength={14}
              required
            />
            <p className="text-xs text-muted-foreground">Somente números (14 dígitos)</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Números de Telefone *</Label>
              <Button type="button" size="sm" variant="outline" onClick={handleAddPhoneNumber}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar número
              </Button>
            </div>

            <div className="space-y-2">
              {formData.phoneNumbers.map((phone, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={phone}
                    onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
                    placeholder="Ex: 11999999999"
                    maxLength={11}
                  />
                  {formData.phoneNumbers.length > 1 && (
                    <Button type="button" size="icon" variant="outline" onClick={() => handleRemovePhoneNumber(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Somente números (mínimo 10 dígitos)</p>
          </div>

          

          

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingCompanyId ? 'Atualizar' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyModal;
