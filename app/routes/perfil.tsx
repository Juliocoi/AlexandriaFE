import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router";
import { ArrowRight, Edit3, Loader2, Save, X } from "lucide-react";
import type { Route } from "./+types/perfil";
import { BookCover } from "../components/BookCover";
import { SessionGuard } from "../components/SessionGuard";
import { ApiError, loansApi, usersApi } from "../lib/api";
import { toApiDate, toInputDate } from "../lib/date";
import { updateStoredUser } from "../lib/session";
import type { Loan, User } from "../types/api";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Meu Perfil | Biblioteca Virtual" },
    {
      name: "description",
      content: "Visualize e edite seus dados cadastrais e empréstimos.",
    },
  ];
}

function PerfilContent({ user: sessionUser }: { user: User }) {
  const [profile, setProfile] = useState<User>(sessionUser);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: sessionUser.name,
    email: sessionUser.email,
    birthDate: toInputDate(sessionUser.birthDate),
    motherName: sessionUser.motherName,
    fatherName: sessionUser.fatherName,
    password: "",
  });

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [freshUser, userLoans] = await Promise.all([
          usersApi.getById(sessionUser.id),
          loansApi.listByUser(sessionUser.id),
        ]);
        if (!active) return;
        setProfile(freshUser);
        updateStoredUser(freshUser);
        setForm({
          name: freshUser.name,
          email: freshUser.email,
          birthDate: toInputDate(freshUser.birthDate),
          motherName: freshUser.motherName,
          fatherName: freshUser.fatherName,
          password: "",
        });
        setLoans(userLoans);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof ApiError
            ? err.message
            : "Não foi possível carregar os dados do perfil."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [sessionUser.id]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setFeedback(null);
    setFieldErrors({});

    try {
      const updated = await usersApi.update(profile.id, {
        name: form.name.trim(),
        email: form.email.trim(),
        birthDate: toApiDate(form.birthDate),
        motherName: form.motherName.trim(),
        fatherName: form.fatherName.trim(),
        ...(form.password.trim() ? { password: form.password } : {}),
      });
      setProfile(updated);
      updateStoredUser(updated);
      setEditing(false);
      setForm((prev) => ({ ...prev, password: "" }));
      setFeedback("Perfil atualizado com sucesso!");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        if (err.fieldErrors) setFieldErrors(err.fieldErrors);
      } else {
        setError("Não foi possível atualizar o perfil.");
      }
    } finally {
      setSaving(false);
    }
  };

  const firstInitial = profile.name.trim().charAt(0).toUpperCase() || "U";

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Meu Perfil</h1>

        {!editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(true);
              setFeedback(null);
              setError(null);
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-[#1F3352] bg-[#0F1E33] px-4 py-2 text-sm font-medium text-white transition-colors hover:border-[#1D7BF5]"
          >
            <Edit3 className="h-4 w-4" />
            Editar perfil
          </button>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-[#EF4444]/40 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]"
        >
          {error}
        </div>
      )}

      {feedback && (
        <div
          role="status"
          className="rounded-xl border border-[#22C55E]/40 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#86EFAC]"
        >
          {feedback}
        </div>
      )}

      <section className="rounded-xl border border-[#1A2B45] bg-[#0F1E33] p-6">
        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Editar dados</h2>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-lg p-1.5 text-[#8A9AB1] hover:bg-[#13243D] hover:text-white"
                aria-label="Cancelar edição"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs text-[#A9B6C9]">
                  Nome completo
                </label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#1F3352] bg-[#0B1729] px-3 py-2.5 text-sm text-white outline-none focus:border-[#1D7BF5]"
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-[#FCA5A5]">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs text-[#A9B6C9]">
                  E-mail
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#1F3352] bg-[#0B1729] px-3 py-2.5 text-sm text-white outline-none focus:border-[#1D7BF5]"
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-[#FCA5A5]">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs text-[#A9B6C9]">
                  Data de nascimento
                </label>
                <input
                  name="birthDate"
                  type="date"
                  value={form.birthDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#1F3352] bg-[#0B1729] px-3 py-2.5 text-sm text-white outline-none focus:border-[#1D7BF5]"
                />
                {fieldErrors.birthDate && (
                  <p className="mt-1 text-xs text-[#FCA5A5]">
                    {fieldErrors.birthDate}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs text-[#A9B6C9]">
                  Nova senha (opcional)
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Deixe em branco para manter"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#1F3352] bg-[#0B1729] px-3 py-2.5 text-sm text-white outline-none focus:border-[#1D7BF5]"
                />
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-[#FCA5A5]">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs text-[#A9B6C9]">
                  Nome da mãe
                </label>
                <input
                  name="motherName"
                  type="text"
                  value={form.motherName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#1F3352] bg-[#0B1729] px-3 py-2.5 text-sm text-white outline-none focus:border-[#1D7BF5]"
                />
                {fieldErrors.motherName && (
                  <p className="mt-1 text-xs text-[#FCA5A5]">
                    {fieldErrors.motherName}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs text-[#A9B6C9]">
                  Nome do pai
                </label>
                <input
                  name="fatherName"
                  type="text"
                  value={form.fatherName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#1F3352] bg-[#0B1729] px-3 py-2.5 text-sm text-white outline-none focus:border-[#1D7BF5]"
                />
                {fieldErrors.fatherName && (
                  <p className="mt-1 text-xs text-[#FCA5A5]">
                    {fieldErrors.fatherName}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-lg border border-[#1F3352] px-4 py-2 text-sm text-[#A9B6C9] hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1D7BF5] px-5 py-2 text-sm font-medium text-white hover:bg-[#1668D6] disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#1D7BF5]/20 text-2xl font-bold text-[#6FAEFF]">
              {firstInitial}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold text-white">
                  {profile.name}
                </h2>
                <span className="rounded-full bg-[#1D7BF5]/20 px-2.5 py-0.5 text-[11px] font-semibold text-[#6FAEFF]">
                  {profile.role === "STAFF" ? "Funcionário" : "Aluno"}
                </span>
              </div>
              <p className="mt-1 text-sm text-[#8A9AB1]">{profile.email}</p>

              <div className="mt-4 grid gap-3 text-xs text-[#A9B6C9] sm:grid-cols-3">
                <div>
                  <span className="block text-[#6F819B]">Nascimento</span>
                  <span className="text-white">{profile.birthDate}</span>
                </div>
                <div>
                  <span className="block text-[#6F819B]">Nome da mãe</span>
                  <span className="text-white">{profile.motherName}</span>
                </div>
                <div>
                  <span className="block text-[#6F819B]">Nome do pai</span>
                  <span className="text-white">{profile.fatherName}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Meus empréstimos</h2>
          <Link
            to="/meus-livros"
            className="flex items-center gap-1 text-xs text-[#1D7BF5] hover:underline"
          >
            Ver todos <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 py-4 text-sm text-[#8A9AB1]">
            <Loader2 className="h-4 w-4 animate-spin text-[#1D7BF5]" />
            <span>Carregando empréstimos...</span>
          </div>
        ) : loans.length === 0 ? (
          <div className="rounded-xl border border-[#1A2B45] bg-[#0F1E33]/60 p-6 text-sm text-[#8A9AB1]">
            Você ainda não possui empréstimos.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {loans.slice(0, 4).map((loan) => {
              const isActive = loan.status === "ACTIVE";
              return (
                <Link
                  key={loan.id}
                  to={`/livro/${loan.bookId}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-[#1A2B45] bg-[#0F1E33] p-4 transition-colors hover:border-[#1D7BF5]"
                >
                  <div className="flex items-center gap-4">
                    <BookCover
                      coverUrl={loan.bookCoverUrl}
                      title={loan.bookTitle}
                      author={loan.bookAuthor}
                      className="h-16 w-12"
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {loan.bookTitle}
                      </h3>
                      <p className="text-xs text-[#8A9AB1]">
                        {loan.bookAuthor}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                        isActive
                          ? "bg-[#22C55E]/15 text-[#4ADE80]"
                          : "bg-[#1A2B45] text-[#A9B6C9]"
                      }`}
                    >
                      {isActive ? "Ativo" : "Devolvido"}
                    </span>
                    <p className="mt-1 text-xs text-[#8A9AB1]">
                      Vence em: {loan.dueDate}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

export default function Perfil() {
  return (
    <SessionGuard>{({ user }) => <PerfilContent user={user} />}</SessionGuard>
  );
}
