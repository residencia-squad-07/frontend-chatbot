import { useEmpresas } from '@/contexts/CompanyContext';
import { useUsuarios } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Phone } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CompanyTableProps {
  onEdit: (id_empresa: number) => void;
}

const CompanyTable = ({ onEdit }: CompanyTableProps) => {
  const { empresas, deleteEmpresa } = useEmpresas();
  const { getUsuariosByEmpresa } = useUsuarios();

  const handleDelete = (id_empresa: number, nome_empresa: string) => {
    deleteEmpresa(id_empresa);
    toast.success(`Empresa "${nome_empresa}" removida com sucesso`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  };

  if (empresas.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground">Nenhuma empresa cadastrada ainda.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Clique em "Adicionar Empresa" para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome da Empresa</TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead>Token API</TableHead>
            <TableHead>Usuários (telefones)</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {empresas.map((empresa) => (
            <TableRow key={empresa.id_empresa}>
              <TableCell className="font-medium">{empresa.nome_empresa}</TableCell>
              <TableCell className="text-muted-foreground">{formatCNPJ(empresa.cnpj)}</TableCell>
              <TableCell className="text-muted-foreground">{empresa.token_api}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-sm">{getUsuariosByEmpresa(empresa.id_empresa).length}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(empresa.id_empresa)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja remover a empresa "{empresa.nome_empresa}"? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(empresa.id_empresa, empresa.nome_empresa)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Remover
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompanyTable;
