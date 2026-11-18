import { useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import { emailExists, saveUser } from "../types/userStorage";
import type { User } from "../types/user";
import "./cadastro.css";



interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "O nome é obrigatório.";
  if (!values.email.trim()) errors.email = "O e-mail é obrigatório.";
  else if (!EMAIL_PATTERN.test(values.email)) errors.email = "Informe um e-mail válido.";
  else if (emailExists(values.email)) errors.email = "Este e-mail já está cadastrado.";
  if (!values.password) errors.password = "A senha é obrigatória.";
  else if (values.password.length < 6) errors.password = "Use ao menos 6 caracteres.";
  if (!values.confirmPassword) errors.confirmPassword = "Confirme sua senha.";
  else if (values.confirmPassword !== values.password) errors.confirmPassword = "As senhas não coincidem.";
  return errors;
}

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const UserIcon = () => (
  <svg {...iconProps}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
);
const MailIcon = () => (
  <svg {...iconProps}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);
const LockIcon = () => (
  <svg {...iconProps}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
);
const EyeIcon = ({ off }: { off: boolean }) => (
  <svg {...iconProps}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="M4 4l16 16" />}
  </svg>
);
const BookIcon = () => (
  <svg {...iconProps} width={22} height={22}><path d="M12 6v14M12 6C10 4.5 7 4 3 4v14c4 0 7 .5 9 2 2-1.5 5-2 9-2V4c-4 0-7 .5-9 2z" /></svg>
);

interface FieldProps {
  id: keyof FormValues;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  error?: string;
  icon: ReactNode;
  autoComplete?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  toggle?: { visible: boolean; onToggle: () => void };
}

function Field({ id, label, type = "text", placeholder, value, error, icon, autoComplete, onChange, toggle }: FieldProps) {
  const inputType = toggle ? (toggle.visible ? "text" : "password") : type;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className={`input-wrapper${error ? " has-error" : ""}`}>
        <span className="input-icon">{icon}</span>
        <input
          id={id}
          name={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={onChange}
        />
        {toggle && (
          <button
            type="button"
            className="toggle-visibility"
            onClick={toggle.onToggle}
            aria-label={toggle.visible ? "Ocultar senha" : "Mostrar senha"}
          >
            <EyeIcon off={toggle.visible} />
          </button>
        )}
      </div>
      {error && <p id={`${id}-error`} className="field-error" role="alert">{error}</p>}
    </div>
  );
}

export default function SignUpView() {
  const navigate = useNavigate();
  const [values, setValues] = useState<FormValues>({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validate(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    const newUser: User = {
      id: crypto.randomUUID(),
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
    };
    saveUser(newUser);
    navigate("/login", { state: { registered: true } });
  };

  return (
    <main className="signup-page">
      <section className="signup-card">
        <div className="brand">
          <span className="brand-logo"><BookIcon /></span>
          <span className="brand-name">Biblioteca Virtual</span>
        </div>

        <h1>Criar uma conta</h1>
        <p className="subtitle">Preencha seus dados para começar.</p>

        <form onSubmit={handleSubmit} noValidate>
          <Field id="name" label="Nome completo" placeholder="Seu nome completo" icon={<UserIcon />}
            value={values.name} error={errors.name} autoComplete="name" onChange={handleChange} />
          <Field id="email" label="E-mail" type="email" placeholder="seu@email.com" icon={<MailIcon />}
            value={values.email} error={errors.email} autoComplete="email" onChange={handleChange} />
          <Field id="password" label="Senha" placeholder="Crie uma senha" icon={<LockIcon />}
            value={values.password} error={errors.password} autoComplete="new-password" onChange={handleChange}
            toggle={{ visible: showPassword, onToggle: () => setShowPassword((v) => !v) }} />
          <Field id="confirmPassword" label="Confirmar senha" placeholder="Repita sua senha" icon={<LockIcon />}
            value={values.confirmPassword} error={errors.confirmPassword} autoComplete="new-password" onChange={handleChange}
            toggle={{ visible: showConfirm, onToggle: () => setShowConfirm((v) => !v) }} />

          <button type="submit" className="submit-button">Cadastrar</button>
        </form>

        <p className="login-link">
          Já possui uma conta? <Link to="/login">Faça login</Link>
        </p>
      </section>
    </main>
  );
}
