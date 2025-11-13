import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Usuario {
  id_user: number;
  nome: string;
  telefone: string | null;
  papel: 'administrador' | 'funcionario';
  atividade: 'ativo' | 'inativo';
  id_empresa: number;
  created_at: string | null;
  updated_at: string | null;
}

interface UsuarioContextType {
  usuarios: Usuario[];
  addUsuario: (usuario: Omit<Usuario, 'id_user' | 'created_at' | 'updated_at'>) => Usuario;
  addUsuariosForEmpresa: (telefones: string[], id_empresa: number) => Usuario[];
  getUsuariosByEmpresa: (id_empresa: number) => Usuario[];
  setTelefonesForEmpresa: (telefones: string[], id_empresa: number) => void;
  deleteUsuario: (id_user: number) => void;
}

const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined);

const STORAGE_KEY = 'easy_usuarios';

export const UsuarioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setUsuarios(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
  }, [usuarios]);

  const addUsuario = (usuario: Omit<Usuario, 'id_user' | 'created_at' | 'updated_at'>): Usuario => {
    const now = new Date().toISOString();
    const novo: Usuario = {
      ...usuario,
      id_user: Date.now(),
      created_at: now,
      updated_at: now,
    };
    setUsuarios(prev => [...prev, novo]);
    return novo;
  };

  const addUsuariosForEmpresa = (telefones: string[], id_empresa: number): Usuario[] => {
    const created: Usuario[] = telefones.map((t, i) =>
      addUsuario({
        nome: `Contato ${i + 1}`,
        telefone: t,
        papel: 'funcionario',
        atividade: 'ativo',
        id_empresa,
      })
    );
    return created;
  };

  const getUsuariosByEmpresa = (id_empresa: number): Usuario[] => {
    return usuarios.filter(u => u.id_empresa === id_empresa);
  };

  const setTelefonesForEmpresa = (telefones: string[], id_empresa: number) => {
    const desired = Array.from(new Set(telefones.map(t => t.replace(/\D/g, '')))).filter(t => t.length >= 10);
    const existing = usuarios.filter(u => u.id_empresa === id_empresa && !!u.telefone);
    const existingPhones = new Set(existing.map(u => (u.telefone ?? '')));

    const toAdd = desired.filter(t => !existingPhones.has(t));
    const toRemove = existing.filter(u => !desired.includes(u.telefone ?? ''));

    if (toRemove.length) {
      setUsuarios(prev => prev.filter(u => !(u.id_empresa === id_empresa && toRemove.some(r => r.id_user === u.id_user))));
    }

    toAdd.forEach((t, i) => {
      addUsuario({
        nome: `Contato ${existing.length + i + 1}`,
        telefone: t,
        papel: 'funcionario',
        atividade: 'ativo',
        id_empresa,
      });
    });
  };

  const deleteUsuario = (id_user: number) => {
    setUsuarios(prev => prev.filter(u => u.id_user !== id_user));
  };

  return (
    <UsuarioContext.Provider value={{ usuarios, addUsuario, addUsuariosForEmpresa, getUsuariosByEmpresa, setTelefonesForEmpresa, deleteUsuario }}>
      {children}
    </UsuarioContext.Provider>
  );
};

export const useUsuarios = () => {
  const ctx = useContext(UsuarioContext);
  if (!ctx) throw new Error('useUsuarios must be used within a UsuarioProvider');
  return ctx;
};