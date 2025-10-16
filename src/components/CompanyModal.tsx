import { useState, useEffect } from 'react';
import { useCompanies, Company } from '@/contexts/CompanyContext';
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
  editingCompanyId: string | null;
}

const CompanyModal = ({ isOpen, onClose, editingCompanyId }: CompanyModalProps) => {
  const { addCompany, updateCompany, getCompany } = useCompanies();
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    status: 'Ativa' as 'Ativa' | 'Inativa',
    phoneNumbers: [''],
    chatbotAccess: true,
  });

  useEffect(() => {
    if (editingCompanyId) {
      const company = getCompany(editingCompanyId);
      if (company) {
        setFormData({
          name: company.name,
          cnpj: company.cnpj,
          status: company.status,
          phoneNumbers: company.phoneNumbers,
          chatbotAccess: company.chatbotAccess,
        });
      }
    } else {
      setFormData({
        name: '',
        cnpj: '',
        status: 'Ativa',
        phoneNumbers: [''],
        chatbotAccess: true,
      });
    }
  }, [editingCompanyId, getCompany, isOpen]);

  const handleAddPhoneNumber = () => {
    setFormData(prev => ({
      ...prev,
      phoneNumbers: [...prev.phoneNumbers, '']
    }));
  };

  const handleRemovePhoneNumber = (index: number) => {
    setFormData(prev => ({
      ...prev,
      phoneNumbers: prev.phoneNumbers.filter((_, i) => i !== index)
    }));
  };

  const handlePhoneNumberChange = (index: number, value: string) => {
    const formatted = value.replace(/\D/g, '');
    setFormData(prev => ({
      ...prev,
      phoneNumbers: prev.phoneNumbers.map((phone, i) => i === index ? formatted : phone)
    }));
  };

  const formatCNPJInput = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.slice(0, 14);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação
    if (!formData.name.trim()) {
      toast.error('Nome da empresa é obrigatório');
      return;
    }

    if (formData.cnpj.length !== 14) {
      toast.error('CNPJ deve conter 14 dígitos');
      return;
    }

    const validPhones = formData.phoneNumbers.filter(phone => phone.length >= 10);
    if (validPhones.length === 0) {
      toast.error('Adicione pelo menos um telefone válido (mínimo 10 dígitos)');
      return;
    }

    const companyData = {
      ...formData,
      phoneNumbers: validPhones
    };

    if (editingCompanyId) {
      updateCompany(editingCompanyId, companyData);
      toast.success('Empresa atualizada com sucesso!');
    } else {
      addCompany(companyData);
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
            <Label htmlFor="name">Nome da Empresa *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'Ativa' | 'Inativa') => 
                setFormData(prev => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ativa">Ativa</SelectItem>
                <SelectItem value="Inativa">Inativa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Números de Telefone *</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAddPhoneNumber}
              >
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
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => handleRemovePhoneNumber(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Somente números (mínimo 10 dígitos)</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="chatbot">Acesso ao Chatbot</Label>
              <p className="text-sm text-muted-foreground">
                Permitir que esta empresa use o chatbot
              </p>
            </div>
            <Switch
              id="chatbot"
              checked={formData.chatbotAccess}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, chatbotAccess: checked }))
              }
            />
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
