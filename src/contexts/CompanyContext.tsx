import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Empresa {
  id_empresa: number;
  nome_empresa: string;
  cnpj: string;
  token_api: string;
}

interface EmpresaContextType {
  empresas: Empresa[];
  addEmpresa: (empresa: Omit<Empresa, 'id_empresa' | 'token_api'>) => Empresa;
  updateEmpresa: (id_empresa: number, empresa: Omit<Empresa, 'id_empresa' | 'token_api'>) => void;
  deleteEmpresa: (id_empresa: number) => void;
  getEmpresa: (id_empresa: number) => Empresa | undefined;
}

const EmpresaContext = createContext<EmpresaContextType | undefined>(undefined);

const STORAGE_KEY = 'easy_empresas';

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setEmpresas(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(empresas));
  }, [empresas]);

  const addEmpresa = (empresa: Omit<Empresa, 'id_empresa' | 'token_api'>): Empresa => {
    const newEmpresa: Empresa = {
      ...empresa,
      id_empresa: Date.now(),
      token_api: Math.random().toString(36).slice(2) + Date.now().toString(36)
    };
    setEmpresas(prev => [...prev, newEmpresa]);
    return newEmpresa;
  };

  const updateEmpresa = (id_empresa: number, updatedData: Omit<Empresa, 'id_empresa' | 'token_api'>) => {
    setEmpresas(prev =>
      prev.map(empresa =>
        empresa.id_empresa === id_empresa
          ? { ...empresa, ...updatedData }
          : empresa
      )
    );
  };

  const deleteEmpresa = (id_empresa: number) => {
    setEmpresas(prev => prev.filter(empresa => empresa.id_empresa !== id_empresa));
  };

  const getEmpresa = (id_empresa: number) => {
    return empresas.find(empresa => empresa.id_empresa === id_empresa);
  };

  return (
    <EmpresaContext.Provider value={{ empresas, addEmpresa, updateEmpresa, deleteEmpresa, getEmpresa }}>
      {children}
    </EmpresaContext.Provider>
  );
};

export const useEmpresas = () => {
  const context = useContext(EmpresaContext);
  if (context === undefined) {
    throw new Error('useEmpresas must be used within a CompanyProvider');
  }
  return context;
};
