import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  status: 'Ativa' | 'Inativa';
  phoneNumbers: string[];
  chatbotAccess: boolean;
  createdAt: string;
}

interface CompanyContextType {
  companies: Company[];
  addCompany: (company: Omit<Company, 'id' | 'createdAt'>) => void;
  updateCompany: (id: string, company: Omit<Company, 'id' | 'createdAt'>) => void;
  deleteCompany: (id: string) => void;
  getCompany: (id: string) => Company | undefined;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

const STORAGE_KEY = 'easy_companies';

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setCompanies(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
  }, [companies]);

  const addCompany = (company: Omit<Company, 'id' | 'createdAt'>) => {
    const newCompany: Company = {
      ...company,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setCompanies(prev => [...prev, newCompany]);
  };

  const updateCompany = (id: string, updatedData: Omit<Company, 'id' | 'createdAt'>) => {
    setCompanies(prev =>
      prev.map(company =>
        company.id === id
          ? { ...company, ...updatedData }
          : company
      )
    );
  };

  const deleteCompany = (id: string) => {
    setCompanies(prev => prev.filter(company => company.id !== id));
  };

  const getCompany = (id: string) => {
    return companies.find(company => company.id === id);
  };

  return (
    <CompanyContext.Provider value={{ companies, addCompany, updateCompany, deleteCompany, getCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompanies = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompanies must be used within a CompanyProvider');
  }
  return context;
};
