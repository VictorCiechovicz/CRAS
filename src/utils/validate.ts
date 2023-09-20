export function validCPF(cpf: string | undefined): string | undefined {
  if (!cpf) return 'CPF é obrigatório';

  const cpfSemFormatacao = cpf.replace(/[^\d]/g, '');

  if (cpfSemFormatacao.length !== 11 || /^(\d)\1+$/.test(cpfSemFormatacao)) {
    return 'Formato de CPF inválido';
  }

  let soma = 0;
  let resto;
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpfSemFormatacao.charAt(i - 1)) * (11 - i);
  }
  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) {
    resto = 0;
  }

  if (resto !== parseInt(cpfSemFormatacao.charAt(9))) {
    return 'Formato de CPF inválido';
  }

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpfSemFormatacao.charAt(i - 1)) * (12 - i);
  }
  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) {
    resto = 0;
  }

  if (resto !== parseInt(cpfSemFormatacao.charAt(10))) {
    return 'Formato de CPF inválido';
  }

  return undefined;
}