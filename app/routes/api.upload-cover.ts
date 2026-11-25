import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Route } from "./+types/api.upload-cover";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return Response.json(
      { message: "Método não permitido." },
      { status: 405 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { message: "Dados de formulário inválidos." },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  const title = formData.get("title");

  if (!(file instanceof File) || file.size === 0) {
    return Response.json(
      { message: "Selecione uma imagem válida para a capa do livro." },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return Response.json(
      { message: "A imagem deve ter no máximo 5 MB." },
      { status: 400 }
    );
  }

  const extFromMime = MIME_TO_EXT[file.type.toLowerCase()];
  const extFromName = path.extname(file.name).toLowerCase();
  const validExts = new Set(Object.values(MIME_TO_EXT));
  const ext =
    extFromMime ?? (validExts.has(extFromName) ? extFromName : undefined);

  if (!ext) {
    return Response.json(
      { message: "Formato inválido. Use JPG, PNG, WEBP ou GIF." },
      { status: 400 }
    );
  }

  const rawBaseName =
    typeof title === "string" && title.trim()
      ? title
      : path.basename(file.name, path.extname(file.name));
  const baseSlug = slugify(rawBaseName) || "capa-livro";
  const filename = `${baseSlug}-${Date.now()}${ext}`;

  const booksDir = path.resolve(process.cwd(), "public", "images", "books");
  await mkdir(booksDir, { recursive: true });

  const filePath = path.join(booksDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return Response.json(
    { coverUrl: `/images/books/${filename}` },
    { status: 201 }
  );
}
