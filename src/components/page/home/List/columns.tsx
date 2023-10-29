'use client'

import { Column } from '@/src/components/common/Table/types'
import { FamilyList } from '@/src/schemas'
import { formatPhoneNumber } from '@/src/utils/format/formatPhone'
import { formatStatus } from '@/src/utils/format/status'
import { format } from 'date-fns'

export const columns = 
  [
    {
      label: 'Nome',
      field: 'name'
    },
    {
      label: 'Celular',
      field: 'phone',
      valueFormatter: formatPhoneNumber
    },
    {
      label: 'Email',
      field: 'email'
    },
    {
      label: 'Agente',
      field: 'createdByUserName'
    },
    {
      label: 'Membros',
      field: 'members_familie',
      cellClassName: 'text-center',
      renderCell(value, rowData: FamilyList) {
        return rowData.dependents.length
      }
    },
    {
      label: 'Renda Percapta',
      field: 'income_dependent',
      renderCell(_, rowData: FamilyList) {
        const totalIncome = rowData.dependents
          .map(dep => parseFloat(dep.income_dependent))
          .reduce((acc, curr) => acc + curr, 0);
      
        const perCapitaIncome = totalIncome / (rowData.dependents.length || 1); 
           
        return perCapitaIncome.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });
      }
      
    },
     {
      label: 'Data Entrada',
      field: 'startDate',
      renderCell(value, rowData: FamilyList) {
        if (rowData.periodBenefit.length > 0) {
              const sortedPeriods = rowData.periodBenefit.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
    
              const mostRecentPeriod = sortedPeriods[0];
    
          const date = new Date(mostRecentPeriod.startDate);
          return format(date, 'dd/MM/yyyy');
        }
        return 'N/A';
      }
    },
    {
      label: 'Data Saída',
      field: 'endDate',
      renderCell(value, rowData: FamilyList) {
        if (rowData.periodBenefit.length > 0) {
                 const sortedPeriods = rowData.periodBenefit.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
    
          const mostRecentPeriod = sortedPeriods[0];
    
          const date = new Date(mostRecentPeriod.endDate);
          return format(date, 'dd/MM/yyyy');
        }
        return 'N/A';
      }
    }, 

    {
      label: 'Endereço',
      field: 'adress',
      renderCell(value, rowData: FamilyList) {
        return `${rowData.street}, ${rowData.number} - ${rowData.neighborhood}, CEP ${rowData.zip_code}`
      }
    },
    {
      label: 'Status',
      field: 'status',
      valueFormatter: formatStatus
    }
  ] as Column<FamilyList>[]
