import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddressForm from "../components/AddressForm";
import { useAddress } from "../hooks/useAddress";
import "@testing-library/jest-dom";

// Mock dos hooks
jest.mock("../hooks/useAddress", () => ({
  useAddress: jest.fn(() => ({ data: null })),
}));

jest.mock("../hooks/useSaveAddress", () => ({
  useSaveAddress: jest.fn(() => ({ mutate: jest.fn() })),
}));

describe("AddressForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza os campos corretamente", () => {
    render(<AddressForm />);

    expect(screen.getByLabelText(/CEP/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Logradouro/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Complemento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bairro/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Localidade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/UF/i)).toBeInTheDocument();
  });

  it("preenche os campos ao buscar endereço", async () => {
    (useAddress as jest.Mock).mockReturnValue({
      data: {
        logradouro: "Rua Teste",
        bairro: "Bairro Teste",
        localidade: "Cidade Teste",
        uf: "TS",
      },
    });

    render(<AddressForm />);

    const cepInput = screen.getByLabelText(/CEP/i);
    await userEvent.type(cepInput, "12345678");

    await waitFor(() => {
      expect(screen.getByLabelText(/Logradouro/i)).toHaveValue("Rua Teste");
      expect(screen.getByLabelText(/Bairro/i)).toHaveValue("Bairro Teste");
      expect(screen.getByLabelText(/Localidade/i)).toHaveValue("Cidade Teste");
      expect(screen.getByLabelText(/UF/i)).toHaveValue("TS");
    });
  });

  it("desabilita o botão SALVAR se o formulário estiver incompleto", async () => {
    render(<AddressForm />);

    const salvarButton = screen.getByRole("button", { name: /salvar/i });
    expect(salvarButton).toBeDisabled();

    const cepInput = screen.getByLabelText(/CEP/i);
    await userEvent.type(cepInput, "12345678");

    expect(salvarButton).toBeDisabled();

    const logradouroInput = screen.getByLabelText(/Logradouro/i);
    await userEvent.type(logradouroInput, "Rua Teste");

    await waitFor(() => {
      expect(salvarButton).toBeDisabled();
    });
  });

  it("o botão SALVAR deve estar habilitado quando o formulário estiver completo", async () => {
    render(<AddressForm />);

    const salvarButton = screen.getByRole("button", { name: /salvar/i });
    expect(salvarButton).toBeDisabled();

    const cepInput = screen.getByLabelText(/CEP/i);
    await userEvent.type(cepInput, "12345678");

    expect(salvarButton).toBeDisabled();

    const logradouroInput = screen.getByLabelText(/Logradouro/i);
    await userEvent.type(logradouroInput, "Rua Teste");

    const complementoInput = screen.getByLabelText(/Complemento/i);
    await userEvent.type(complementoInput, "Complemento Teste");

    const bairroInput = screen.getByLabelText(/Bairro/i);
    await userEvent.type(bairroInput, "Bairro Teste");

    const localidadeInput = screen.getByLabelText(/Localidade/i);
    await userEvent.type(localidadeInput, "Cidade Teste");

    const ufInput = screen.getByLabelText(/UF/i);
    await userEvent.type(ufInput, "TS");

    await waitFor(() => {
      expect(salvarButton).toBeEnabled();
    });
  });

  it("limpa o formulário ao clicar no botão LIMPAR", async () => {
    render(<AddressForm />);

    const cepInput = screen.getByLabelText(/CEP/i);
    await userEvent.type(cepInput, "12345678");

    const logradouroInput = screen.getByLabelText(/Logradouro/i);
    await userEvent.type(logradouroInput, "Rua Teste");

    const limparButton = screen.getByRole("button", { name: /limpar/i });
    fireEvent.click(limparButton);

    expect(cepInput).toHaveValue("");
    expect(logradouroInput).toHaveValue("");
  });
});
