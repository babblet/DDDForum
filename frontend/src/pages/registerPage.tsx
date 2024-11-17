import { ToastContainer, toast } from "react-toastify";
import { Layout } from "../components/layout";
import {
  RegistrationForm,
} from "../components/registrationForm";
import type {
  RegistrationInput 
} from "../interfaces"
import { api } from "../api";
import { useUser } from "../contexts/userContext";
import { useNavigate } from "react-router-dom";

type ValidationResult = {
  success: boolean;
  errorMessage?: string;
}

function validateForm (input: RegistrationInput): ValidationResult {
  if (input.email.indexOf('@') === -1) return { success: false, errorMessage: "Email invalid" };
  if (input.username.length < 2) return { success: false, errorMessage: "Username invalid" };
  return { success: true }
}

export const RegisterPage: React.FC = () => {
  const user = useUser();
  const navigate = useNavigate();

  const handleSubmitRegistrationForm = (input: RegistrationInput) => {
    const validationResult = validateForm(input);
    if (validationResult.success === false) {
      toast.error(validationResult.errorMessage);
      return;
    }

    toast.promise( async () => {
      try {
        const result = await api.register(input);

        if (result.status !== 200) {
          throw new Error("Failed to create account");
        }

        user.setUser(input);
        toast.success("Account created!, redirecting to home page...");
        setTimeout(() => {
          navigate("/")
        }, 3000)
      } catch (err: unknown) {
        toast.error("Unknown error");
      }
    }, {
      pending: "Creating account..."
    })
  };

  return <Layout>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      closeOnClick
    />
    <div>Create Account</div>
      <RegistrationForm
        onSubmit={(input: RegistrationInput) =>
          handleSubmitRegistrationForm(input)
        }
      />
  </Layout>;
}