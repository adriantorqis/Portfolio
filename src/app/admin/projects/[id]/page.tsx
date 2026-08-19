import { notFound } from "next/navigation";
import { publicStorageUrl } from "@/lib/data";
import { supabaseAdmin } from "@/lib/supabase";
import type { Project } from "@/lib/types";
import { saveProject } from "../../actions";

const fieldClass =
  "border border-line bg-bg px-3 py-2 text-sm focus:outline-none focus:border-ink";

async function getProjectById(id: string): Promise<Project | null> {
  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("project")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  // 22P02 = invalid input syntax (e.g. a non-UUID id, such as a stale link
  // to a demo/placeholder row) — treat that as "not found", not a crash.
  if (error && error.code !== "22P02") throw error;
  return data;
}

export default async function ProjectFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  const project = isNew ? null : await getProjectById(id);

  if (!isNew && !project) notFound();

  const cover = project ? publicStorageUrl("covers", project.cover_image_path) : null;
  const file = project ? publicStorageUrl("files", project.file_path) : null;

  return (
    <main className="flex-1 px-6 md:px-12 py-12 max-w-2xl">
      <h1 className="display text-3xl mb-10">
        {isNew ? "New project" : "Edit project"}
      </h1>
      <form action={saveProject} className="grid gap-4">
        {project ? <input type="hidden" name="id" value={project.id} /> : null}

        <label className="grid gap-1">
          <span className="eyebrow">Title</span>
          <input
            name="title"
            required
            defaultValue={project?.title}
            className={fieldClass}
          />
        </label>

        <label className="grid gap-1">
          <span className="eyebrow">
            Slug (leave blank to auto-generate from title)
          </span>
          <input name="slug" defaultValue={project?.slug} className={fieldClass} />
        </label>

        <label className="grid gap-1">
          <span className="eyebrow">Description</span>
          <textarea
            name="description"
            rows={8}
            defaultValue={project?.description}
            className={fieldClass}
          />
        </label>

        <label className="grid gap-1">
          <span className="eyebrow">
            Tags (comma separated)
          </span>
          <input
            name="tags"
            defaultValue={project?.tags.join(", ")}
            className={fieldClass}
          />
        </label>

        <label className="grid gap-1">
          <span className="eyebrow">Link URL</span>
          <input
            name="link_url"
            type="url"
            defaultValue={project?.link_url ?? ""}
            className={fieldClass}
          />
        </label>

        <label className="grid gap-1">
          <span className="eyebrow">Sort order</span>
          <input
            name="sort_order"
            type="number"
            defaultValue={project?.sort_order ?? 0}
            className={fieldClass}
          />
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={project?.featured}
          />
          <span className="eyebrow">Featured</span>
        </label>

        <label className="grid gap-1">
          <span className="eyebrow">
            Cover image {cover ? "(replace)" : ""}
          </span>
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" className="w-48 aspect-[4/3] object-cover mb-1" />
          ) : null}
          <input type="file" name="cover_image" accept="image/*" className="text-sm" />
        </label>

        <label className="grid gap-1">
          <span className="eyebrow">
            Attached file {file ? "(replace)" : ""}
          </span>
          {file ? (
            <a
              href={file}
              target="_blank"
              rel="noreferrer"
              className="text-sm link-underline"
            >
              current file
            </a>
          ) : null}
          <input type="file" name="file" className="text-sm" />
        </label>

        <button className="justify-self-start border border-ink px-4 py-2 text-sm transition-colors hover:bg-ink hover:text-bg cursor-pointer">
          Save
        </button>
      </form>
    </main>
  );
}
