export function formatPhoneNumber(value: string) {
  let phoneNumber = value?.toString();
  phoneNumber = phoneNumber?.replace('+55', '');

  const formattedNumber = phoneNumber?.replace(
    /(\d{2})(\d{5})(\d{4})/,
    '$1 $2-$3'
  );
  return formattedNumber;
}
