"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

const fetchAddress = async (cep: string) => {
  if (!cep || cep.length !== 8) return null;
  const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  if (!res.ok) throw new Error("Erro ao buscar CEP");
  return res.json();
};

export const useAddress = (cep: string, setValue: any) => {
  const { data, isSuccess } = useQuery({
    queryKey: ["address", cep],
    queryFn: () => fetchAddress(cep),
    enabled: Boolean(cep && cep.length === 8), 
  });

  useEffect(() => {
    if (isSuccess && data) {
      setValue("logradouro", data.logradouro || "");
      setValue("bairro", data.bairro || "");
      setValue("localidade", data.localidade || "");
      setValue("uf", data.uf || "");
    }
  }, [data, isSuccess, setValue]);

  return { data };
};
