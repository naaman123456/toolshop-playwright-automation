export function newUser() {
  return {
  
  "first_name": "John",
  "last_name": "Doe",
  "address": {
    "street": "Street 1",
    "house_number": "12",
    "city": "City",
    "state": "State",
    "country": "Country",
    "postal_code": "1234AA"
  },
  "phone": "0987654321",
  "dob": "1970-01-01",
  "password": "12@vocadoTr33ss",
  "email": `ibrahim_${Date.now()}_${Math.floor(Math.random() * 100000)}@example.com`

  };
}