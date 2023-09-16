import { ManagementAgentsList } from "@/components/page"



export default async function ManagementAgents() {

  const data = [
    {
      name: 'Jane Cooper',
      phone: '(55) 99152-8235',
      email: 'jane@microsoft.com',
      agent: 'Jane Cooper',
      members_familie: '8',
      income: 'R$ 1.000',
      check_in_date: '13/09/2023',
      check_out_date: '13/09/2023',
      adress: 'Alameda Vicente Pinzon, 144 - Vila Olímpia, CEP 04547-130',
      status: 'ACTIVE'
    },
    {
      name: 'Jane Cooper',
      phone: '(55) 99152-8235',
      email: 'jane@microsoft.com',
      agent: 'Jane Cooper',
      members_familie: '8',
      income: 'R$ 1.000',
      check_in_date: '13/09/2023',
      check_out_date: '13/09/2023',
      adress: 'Alameda Vicente Pinzon, 144 - Vila Olímpia, CEP 04547-130',
      status: 'ACTIVE'
    },
    {
      name: 'Jane Cooper',
      phone: '(55) 99152-8235',
      email: 'jane@microsoft.com',
      agent: 'Jane Cooper',
      members_familie: '8',
      income: 'R$ 1.000',
      check_in_date: '13/09/2023',
      check_out_date: '13/09/2023',
      adress: 'Alameda Vicente Pinzon, 144 - Vila Olímpia, CEP 04547-130',
      status: 'ACTIVE'
    },
    {
      name: 'Jane Cooper',
      phone: '(55) 99152-8235',
      email: 'jane@microsoft.com',
      agent: 'Jane Cooper',
      members_familie: '8',
      income: 'R$ 1.000',
      check_in_date: '13/09/2023',
      check_out_date: '13/09/2023',
      adress: 'Alameda Vicente Pinzon, 144 - Vila Olímpia, CEP 04547-130',
      status: 'ACTIVE'
    },
    {
      name: 'Jane Cooper',
      phone: '(55) 99152-8235',
      email: 'jane@microsoft.com',
      agent: 'Jane Cooper',
      members_familie: '8',
      income: 'R$ 1.000',
      check_in_date: '13/09/2023',
      check_out_date: '13/09/2023',
      adress: 'Alameda Vicente Pinzon, 144 - Vila Olímpia, CEP 04547-130',
      status: 'ACTIVE'
    },
    {
      name: 'Jane Cooper',
      phone: '(55) 99152-8235',
      email: 'jane@microsoft.com',
      agent: 'Jane Cooper',
      members_familie: '8',
      income: 'R$ 1.000',
      check_in_date: '13/09/2023',
      check_out_date: '13/09/2023',
      adress: 'Alameda Vicente Pinzon, 144 - Vila Olímpia, CEP 04547-130',
      status: 'ACTIVE'
    },
    {
      name: 'Jane Cooper',
      phone: '(55) 99152-8235',
      email: 'jane@microsoft.com',
      agent: 'Jane Cooper',
      members_familie: '8',
      income: 'R$ 1.000',
      check_in_date: '13/09/2023',
      check_out_date: '13/09/2023',
      adress: 'Alameda Vicente Pinzon, 144 - Vila Olímpia, CEP 04547-130',
      status: 'ACTIVE'
    },
    {
      name: 'Jane Cooper',
      phone: '(55) 99152-8235',
      email: 'jane@microsoft.com',
      agent: 'Jane Cooper',
      members_familie: '8',
      income: 'R$ 1.000',
      check_in_date: '13/09/2023',
      check_out_date: '13/09/2023',
      adress: 'Alameda Vicente Pinzon, 144 - Vila Olímpia, CEP 04547-130',
      status: 'ACTIVE'
    },
    {
      name: 'Jane Cooper',
      phone: '(55) 99152-8235',
      email: 'jane@microsoft.com',
      agent: 'Jane Cooper',
      members_familie: '8',
      income: 'R$ 1.000',
      check_in_date: '13/09/2023',
      check_out_date: '13/09/2023',
      adress: 'Alameda Vicente Pinzon, 144 - Vila Olímpia, CEP 04547-130',
      status: 'ACTIVE'
    },
    {
      name: 'Jane Cooper',
      phone: '(55) 99152-8235',
      email: 'jane@microsoft.com',
      agent: 'Jane Cooper',
      members_familie: '8',
      income: 'R$ 1.000',
      check_in_date: '15/09/2023',
      check_out_date: '13/09/2023',
      adress: 'victor Vicente Pinzon, 144 - Vila Olímpia, CEP 04547-130',
      status: 'DESACTIVE'
    },
    {
      name: 'Jane Cooper',
      phone: '(55) 99152-8235',
      email: 'jane@microsoft.com',
      agent: 'Jane Cooper',
      members_familie: '8',
      income: 'R$ 1.000',
      check_in_date: '13/09/2023',
      check_out_date: '13/09/2023',
      adress: 'Alameda Vicente Pinzon, 144 - Vila Olímpia, CEP 04547-130',
      status: 'ACTIVE'
    },
    {
      name: 'Jane avila',
      phone: '(55) 99152-8235',
      email: 'jane@microsoft.com',
      agent: 'Jane Cooper',
      members_familie: '8',
      income: 'R$ 1.000',
      check_in_date: '13/09/2023',
      check_out_date: '13/09/2023',
      adress: 'Alameda Vicente Pinzon, 144 - Vila Olímpia, CEP 04547-130',
      status: 'ACTIVE'
    },
    {
      name: 'Jane Cooper',
      phone: '(55) 99152-8235',
      email: 'jane@microsoft.com',
      agent: 'Jane Cooper',
      members_familie: '8',
      income: 'R$ 1.000',
      check_in_date: '13/09/2023',
      check_out_date: '13/09/2023',
      adress: 'Alameda Vicente Pinzon, 144 - Vila Olímpia, CEP 04547-130',
      status: 'ACTIVE'
    },
    {
      name: 'Jane Cooper',
      phone: '(55) 99152-8235',
      email: 'jane@microsoft.com',
      agent: 'Jane Cooper',
      members_familie: '8',
      income: 'R$ 1.000',
      check_in_date: '13/09/2023',
      check_out_date: '13/09/2023',
      adress: 'Alameda Vicente Pinzon, 144 - Vila Olímpia, CEP 04547-130',
      status: 'ACTIVE'
    },
    {
      name: 'Jane Cooper',
      phone: '(55) 99152-8235',
      email: 'jane@microsoft.com',
      agent: 'Jane Cooper',
      members_familie: '8',
      income: 'R$ 1.000',
      check_in_date: '13/09/2023',
      check_out_date: '13/09/2023',
      adress: 'Alameda Vicente Pinzon, 144 - Vila Olímpia, CEP 04547-130',
      status: 'ACTIVE'
    },
    {
      name: 'Jane Cooper',
      phone: '(55) 99152-8235',
      email: 'jane@microsoft.com',
      agent: 'Jane Cooper',
      members_familie: '8',
      income: 'R$ 1.000',
      check_in_date: '13/09/2023',
      check_out_date: '13/09/2023',
      adress: 'Alameda Vicente Pinzon, 144 - Vila Olímpia, CEP 04547-130',
      status: 'ACTIVE'
    },
    {
      name: 'Jane Cooper',
      phone: '(55) 99152-8235',
      email: 'jane@microsoft.com',
      agent: 'Jane Cooper',
      members_familie: '8',
      income: 'R$ 1.000',
      check_in_date: '13/09/2023',
      check_out_date: '13/09/2023',
      adress: 'Alameda Vicente Pinzon, 144 - Vila Olímpia, CEP 04547-130',
      status: 'ACTIVE'
    },
    {
      name: 'Jane Cooper',
      phone: '(55) 99152-8235',
      email: 'jane@microsoft.com',
      agent: 'Jane Cooper',
      members_familie: '8',
      income: 'R$ 1.000',
      check_in_date: '13/09/2023',
      check_out_date: '13/09/2023',
      adress: 'Alameda Vicente Pinzon, 144 - Vila Olímpia, CEP 04547-130',
      status: 'ACTIVE'
    },
    {
      name: 'Jane Cooper',
      phone: '(55) 99152-8235',
      email: 'jane@microsoft.com',
      agent: 'Jane Cooper',
      members_familie: '8',
      income: 'R$ 1.000',
      check_in_date: '13/09/2023',
      check_out_date: '13/09/2023',
      adress: 'Alameda Vicente Pinzon, 144 - Vila Olímpia, CEP 04547-130',
      status: 'ACTIVE'
    },
    {
      name: 'Jane Cooper',
      phone: '(55) 99152-8235',
      email: 'jane@microsoft.com',
      agent: 'Jane Cooper',
      members_familie: '8',
      income: 'R$ 1.000',
      check_in_date: '13/09/2023',
      check_out_date: '13/09/2023',
      adress: 'Alameda Vicente Pinzon, 144 - Vila Olímpia, CEP 04547-130',
      status: 'ACTIVE'
    },
    {
      name: 'Jane Cooper',
      phone: '(55) 99152-8235',
      email: 'jane@microsoft.com',
      agent: 'Jane Cooper',
      members_familie: '8',
      income: 'R$ 1.000',
      check_in_date: '13/09/2023',
      check_out_date: '13/09/2023',
      adress: 'Alameda Vicente Pinzon, 144 - Vila Olímpia, CEP 04547-130',
      status: 'ACTIVE'
    },
    {
      name: 'Jane Cooper',
      phone: '(55) 99152-8235',
      email: 'jane@microsoft.com',
      agent: 'Jane Cooper',
      members_familie: '8',
      income: 'R$ 1.000',
      check_in_date: '13/09/2023',
      check_out_date: '13/09/2023',
      adress: 'Alameda Vicente Pinzon, 144 - Vila Olímpia, CEP 04547-130',
      status: 'ACTIVE'
    },
    {
      name: 'Jane Cooper',
      phone: '(55) 99152-8235',
      email: 'jane@microsoft.com',
      agent: 'Jane Cooper',
      members_familie: '8',
      income: 'R$ 1.000',
      check_in_date: '13/09/2023',
      check_out_date: '13/09/2023',
      adress: 'Alameda Vicente Pinzon, 144 - Vila Olímpia, CEP 04547-130',
      status: 'ACTIVE'
    },
    {
      name: 'Jane avila',
      phone: '(55) 99152-8235',
      email: 'jane@microsoft.com',
      agent: 'Jane Cooper',
      members_familie: '8',
      income: 'R$ 1.000',
      check_in_date: '13/09/2023',
      check_out_date: '13/09/2023',
      adress: 'Alameda Vicente Pinzon, 144 - Vila Olímpia, CEP 04547-130',
      status: 'ACTIVE'
    }
  ]
  return (
    <div className="w-full">
      <ManagementAgentsList items={data} />
    </div>
  )
}
