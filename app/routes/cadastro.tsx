import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import {
  BookOpen,
  Calendar,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User as UserIcon,
  Users,
} from "lucide-react";
import type { Route } from "./+types/cadastro";
import { ApiError, usersApi } from "../lib/api";
import { toApiDate } from "../lib/date";
import { getStoredUser, getToken } from "../lib/session";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cadastro | Biblioteca Virtual" },
    {
      name: "description",
      content: "Crie sua conta de aluno na Biblioteca Virtual",
    },
  ];
}

interface FormValues {
  name: string;
  email: string;
  birthDate: string;
  motherName: string;
  fatherName: string;
  password: string;
  confirmPassword: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "O nome é obrigatório.";
  if (!values.email.trim()) errors.email = "O e-mail é obrigatório.";
  else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Informe um e-mail válido.";
  }
  if (!values.birthDate) {
    errors.birthDate = "A data de nascimento é obrigatória.";
  }
  if (!values.motherName.trim()) {
    errors.motherName = "O nome da mãe é obrigatório.";
  }
  if (!values.fatherName.trim()) {
    errors.fatherName = "O nome do pai é obrigatório.";
  }
  if (!values.password) errors.password = "A senha é obrigatória.";
  else if (values.password.length < 6) {
    errors.password = "Use ao menos 6 caracteres.";
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirme sua senha.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "As senhas não coincidem.";
  }
  return errors;
}

export default function SignUpView() {
  const navigate = useNavigate();
  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    birthDate: "",
    motherName: "",
    fatherName: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (getToken() && getStoredUser()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(null);

    const validation = validate(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    try {
      await usersApi.register({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        birthDate: toApiDate(values.birthDate),
        motherName: values.motherName.trim(),
        fatherName: values.fatherName.trim(),
      });
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(err.message);
        if (err.fieldErrors) {
          setErrors((prev) => ({ ...prev, ...err.fieldErrors }));
        }
      } else {
        setServerError("Não foi possível concluir o cadastro.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase =
    "w-full rounded-md border border-[#193653] bg-[#0d2138] py-2.5 pr-4 pl-10 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

  return (
    <main className="min-h-screen bg-[#061426] text-white">
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=2000&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-[#061426]/80" />

        <section className="relative z-10 w-full max-w-md rounded-xl border border-[#193653] bg-[#08182b]/95 p-8 shadow-2xl backdrop-blur-sm">
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1D7BF5]/15 text-[#1D7BF5]">
              <BookOpen className="h-6 w-6" />
            </span>
            <span className="text-lg font-semibold">Biblioteca Virtual</span>
          </div>

          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold">Criar uma conta</h1>
            <p className="mt-1.5 text-sm text-slate-400">
              Preencha os dados abaixo para se cadastrar.
            </p>
          </div>

          {serverError && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-[#EF4444]/40 bg-[#EF4444]/10 px-4 py-3 text-xs text-[#FCA5A5]"
            >
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-xs font-medium text-slate-300"
              >
                Nome completo
              </label>
              <div className="relative">
                <UserIcon className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Seu nome completo"
                  value={values.name}
                  onChange={handleChange}
                  className={inputBase}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-[#FCA5A5]">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-medium text-slate-300"
              >
                E-mail
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  value={values.email}
                  onChange={handleChange}
                  className={inputBase}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-[#FCA5A5]">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="birthDate"
                className="mb-1.5 block text-xs font-medium text-slate-300"
              >
                Data de nascimento
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={values.birthDate}
                  onChange={handleChange}
                  className={inputBase}
                />
              </div>
              {errors.birthDate && (
                <p className="mt-1 text-xs text-[#FCA5A5]">
                  {errors.birthDate}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="motherName"
                  className="mb-1.5 block text-xs font-medium text-slate-300"
                >
                  Nome da mãe
                </label>
                <div className="relative">
                  <Users className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="motherName"
                    name="motherName"
                    type="text"
                    placeholder="Nome da mãe"
                    value={values.motherName}
                    onChange={handleChange}
                    className={inputBase}
                  />
                </div>
                {errors.motherName && (
                  <p className="mt-1 text-xs text-[#FCA5A5]">
                    {errors.motherName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="fatherName"
                  className="mb-1.5 block text-xs font-medium text-slate-300"
                >
                  Nome do pai
                </label>
                <div className="relative">
                  <Users className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="fatherName"
                    name="fatherName"
                    type="text"
                    placeholder="Nome do pai"
                    value={values.fatherName}
                    onChange={handleChange}
                    className={inputBase}
                  />
                </div>
                {errors.fatherName && (
                  <p className="mt-1 text-xs text-[#FCA5A5]">
                    {errors.fatherName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-medium text-slate-300"
              >
                Senha
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                  value={values.password}
                  onChange={handleChange}
                  className={`${inputBase} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-[#FCA5A5]">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-xs font-medium text-slate-300"
              >
                Confirmar senha
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repita sua senha"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  className={`${inputBase} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-[#FCA5A5]">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full rounded-md bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-400">
            Já possui uma conta?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-500 hover:text-blue-400"
            >
              Fazer login
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
