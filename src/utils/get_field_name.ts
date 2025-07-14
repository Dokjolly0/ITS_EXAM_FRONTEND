export function getFieldName(field: string): string {
  switch (field) {
    case 'firstName':
      return 'Nome';
    case 'lastName':
      return 'Cognome';
    case 'username':
      return 'Email';
    case 'password':
      return 'Password';
    case 'checkpassword':
      return 'Conferma password';
    default:
      return field;
  }
}
