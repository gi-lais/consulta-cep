import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../components/Input";
import "@testing-library/jest-dom";

describe("Input Component", () => {
  it("renderiza o label corretamente", () => {
    render(<Input label="CEP" value="" />);
    expect(screen.getByLabelText(/CEP/i)).toBeInTheDocument();
  });

  it("atualiza o valor ao digitar", async () => {
    const handleChange = jest.fn();
    render(<Input label="CEP" value="" onChange={handleChange} />);

    const input = screen.getByLabelText(/CEP/i);
    await userEvent.type(input, "12345678");

    expect(handleChange).toHaveBeenCalledTimes(8);
  });

  it("renderiza o placeholder corretamente", () => {
    render(<Input label="CEP" value="" placeholder="XXXXXXXX" />);
    expect(screen.getByPlaceholderText("XXXXXXXX")).toBeInTheDocument();
  });

  it("está desabilitado quando a prop disabled é true", () => {
    render(<Input label="CEP" value="" disabled />);

    const input = screen.getByLabelText(/CEP/i);
    expect(input).toBeDisabled();
  });

  it("está habilitado quando a prop disabled é false", () => {
    render(<Input label="CEP" value="" disabled={false} />);

    const input = screen.getByLabelText(/CEP/i);
    expect(input).toBeEnabled();
  });
});
