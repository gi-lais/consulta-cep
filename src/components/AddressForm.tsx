"use client";

import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Button, Alert } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import Image from "next/image";
import logo from "../assets/logo.png";
import { Input } from "./Input";
import { useAddress } from "@/hooks/useAddress";
import { useSaveAddress } from "@/hooks/useSaveAddress";

const AddressForm = () => {
  const [isClient, setIsClient] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      cep: "",
      logradouro: "",
      complemento: "",
      bairro: "",
      localidade: "",
      uf: "",
    },
  });

  const cep = watch("cep");

  const isFormValid = Object.values(watch()).every(
    (value) => value.trim() !== ""
  );

  const { data: address } = useAddress(cep, setValue);
  const { mutate: saveAddress } = useSaveAddress();

  useEffect(() => {
    if (address) {
      setValue("logradouro", address.logradouro || "");
      setValue("bairro", address.bairro || "");
      setValue("localidade", address.localidade || "");
      setValue("uf", address.uf || "");
    }
  }, [address, setValue]);

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newCep = e.target.value.replace(/\D/g, "");
    if (newCep.length > 8) {
      newCep = newCep.slice(0, 8);
    }
    setValue("cep", newCep);
  };

  const onSubmit = async (data: any) => {
    try {
      await saveAddress(data);
      setSuccessMessage("Endereço salvo com sucesso!");
      setErrorMessage("");
      reset();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("Erro ao salvar o endereço.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  // Evita erro de hidratação no Next.js
  if (!isClient) return null;

  return (
    <Container
      maxWidth="md"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(54, 224, 161, 0.5)",
          background: "#fff",
          overflow: "hidden",
          maxWidth: "800px",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#36E0A1",
            flex: 1,
            padding: "20px",
          }}
        >
          <Image src={logo} alt="Instivo Logo" width={150} height={150} />
        </Box>
        <Box sx={{ flex: 2, padding: "30px" }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#333", textAlign: "center" }}
          >
            Consulta de Endereço
          </Typography>

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="cep"
              control={control}
              render={({ field }) => (
                <Input
                  label="CEP"
                  placeholder="XXXXXXXX"
                  {...field}
                  onChange={(e) => {
                    handleCepChange(e);
                    field.onChange(e);
                  }}
                  error={cep.length > 8 || cep.match(/\D/) ? true : false}
                  helperText={
                    cep.length > 8
                      ? "O CEP deve ter no máximo 8 números"
                      : cep.match(/\D/)
                      ? "Digite apenas números"
                      : ""
                  }
                />
              )}
            />

            {(
              [
                "logradouro",
                "complemento",
                "bairro",
                "localidade",
                "uf",
              ] as const
            ).map((fieldName) => (
              <Controller
                key={fieldName}
                name={fieldName}
                control={control}
                render={({ field }) => (
                  <Input
                    label={
                      fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
                    }
                    {...field}
                    disabled={[
                      "logradouro",
                      "bairro",
                      "localidade",
                      "uf",
                    ].includes(fieldName)}
                  />
                )}
              />
            ))}

            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                p: 1.5,
                backgroundColor: "#000000",
                border: "2px solid transparent",
                borderImage:
                  "linear-gradient(to right, transparent, #36E0A1, transparent) 1",
                fontWeight: "bold",
              }}
              type="submit"
              disabled={!isFormValid}
            >
              SALVAR
            </Button>
            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                p: 1.5,
                backgroundColor: "#E1FDF2",
                border: "2px solid transparent",
                borderImage:
                  "linear-gradient(to right, transparent, #000000, transparent) 1",
                fontWeight: "bold",
                color: "#000000",
              }}
              onClick={() => reset()}
            >
              LIMPAR
            </Button>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default AddressForm;
