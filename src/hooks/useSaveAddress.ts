import { useMutation } from "@tanstack/react-query";

interface Address {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export const useSaveAddress = () => {
  return useMutation({
    mutationFn: (address: Address) => {
      localStorage.setItem("savedAddress", JSON.stringify(address));
      return Promise.resolve({ message: "Endereço salvo com sucesso!" });
    },
  });
};