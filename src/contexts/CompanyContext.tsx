import React, { createContext, useContext, useState, useEffect } from 'react';
import api from "@/services/api";

export interface Empresa {
  id_empresa: number;
  nome_empresa: string;
  cnpj: string;
  token_api?: string;
  app_Key?: string;
  app_Secret?: string;
}

interface EmpresaContextType {
  empresas: Empresa[];
  reloadEmpresas: () => Promise<void>;
  addEmpresa: (empresa: Partial<Empresa>) => Promise<Empresa>;
  updateEmpresa: (id: number, empresa: Partial<Empresa>) => Promise<void>;
  deleteEmpresa: (id: number) => Promise<void>;
  getEmpresa: (id: number) => Empresa | undefined;
}

const EmpresaContext = createContext<EmpresaContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  const reloadEmpresas = async () => {
    try {
      const res = await api.get("/empresas/listarEmpresa");
      const data = Array.isArray(res.data) ? res.data : [];

      const empresasNormalizadas = data.map((e: any) => ({
        id_empresa: Number(e.id_empresa),
        nome_empresa: e.nome_empresa,
        cnpj: e.cnpj,
        token_api: e.token_api ?? e.app_Key,
        app_Key: e.app_Key,
        app_Secret: e.app_Secret,
      }));

      setEmpresas(empresasNormalizadas);

    } catch (err) {
      console.error("Erro ao carregar empresas:", err);
      setEmpresas([]);
    }
  };

  const getEmpresa = (id: number) => {
    return empresas.find(e => e.id_empresa === id);
  };


const addEmpresa = async (empresa: Partial<Empresa>) => {
  const res = await api.post("/empresas/criarempresa", empresa);

  await reloadEmpresas(); 
  return res.data; 
};


  const updateEmpresa = async (id: number, empresa: Partial<Empresa>) => {
    await api.put(`/empresas/uempresa/${id}`, empresa);
    await reloadEmpresas();
  };


  const deleteEmpresa = async (id: number) => {
    await api.delete(`/empresa/dempresa/${id}`);
    await reloadEmpresas();
  };

  useEffect(() => {
    reloadEmpresas();
  }, []);

  return (
    <EmpresaContext.Provider 
      value={{ 
        empresas, 
        reloadEmpresas, 
        addEmpresa, 
        updateEmpresa, 
        deleteEmpresa, 
        getEmpresa 
      }}
    >
      {children}
    </EmpresaContext.Provider>
  );
};

export const useEmpresas = () => {
  const ctx = useContext(EmpresaContext);
  if (!ctx) throw new Error("useEmpresas must be used within CompanyProvider");
  return ctx;
};
