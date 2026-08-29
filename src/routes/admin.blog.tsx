import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { listPosts, upsertPost, deletePost } from "@/lib/admin-cms.functions";
import { BtnGhost, BtnPrimary, Card, Field, inp, PageHeader, StatusPill, TableWrap, Td, Th } from "@/components/admin/ui";
import { ArrowLeft, Pencil, Plus, RefreshCcw, Trash2, Star, Sparkles, Upload, Heading2, Heading3, Bold, Italic, List, Quote, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/blog")({ component: BlogPage });

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body_markdown: string | null;
  cover_image_url: string | null;
  category_id: string | null;
  category_name: string | null;
  author_name: string | null;
  reading_time: string | null;
  is_featured: boolean;
  is_popular: boolean;
  seo_title: string | null;
  seo_description: string | null;
  tags: string[];
  status: "draft" | "published" | "archived";
  published_at: string | null;
  updated_at: string;
};

const CATEGORIES = [
  "Honey & Health",
  "Ayurveda & Remedies",
  "Beekeeping Stories",
  "Recipes & Pairings",
  "Sustainability",
];

const EMPTY: Partial<Post> = {
  slug: "",
  title: "",
  excerpt: "",
  body_markdown: "",
  cover_image_url: "",
  category_name: "Honey & Health",
  author_name: "Saurashtra Honey Editorial Team",
  reading_time: "5 min read",
  is_featured: false,
  is_popular: false,
  tags: [],
  status: "draft",
};

function BlogPage() {
  const list = useServerFn(listPosts);
  const del = useServerFn(deletePost);
  const [rows, setRows] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState<Partial<Post> | null>(null);

  async function load() {
    setLoading(true);
    try {
      const r = await list({});
      setRows(r.rows as unknown as Post[]);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    /* eslint-disable-next-line */
  }, []);

  if (edit) {
    return (
      <Editor
        initial={edit}
        onCancel={() => setEdit(null)}
        onSaved={async () => {
          setEdit(null);
          await load();
        }}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Journal Management"
        subtitle={`${rows.length} total articles across D2C Journal`}
        actions={
          <>
            <BtnGhost onClick={load}>
              <RefreshCcw className="size-3.5 mr-1" /> REFRESH
            </BtnGhost>
            <BtnPrimary onClick={() => setEdit(EMPTY)}>
              <Plus className="size-3.5 mr-1" /> NEW ARTICLE
            </BtnPrimary>
          </>
        }
      />
      <TableWrap>
        <thead>
          <tr>
            {["Title", "Category", "Status", "Published", "Featured / Popular", "Updated", ""].map((h) => (
              <Th key={h}>{h}</Th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {loading && (
            <tr>
              <Td className="text-center py-12 text-muted-foreground">Loading articles…</Td>
            </tr>
          )}
          {!loading && rows.length === 0 && (
            <tr>
              <Td className="text-center py-12 text-muted-foreground">No journal articles found. Click &quot;New Article&quot; to create one.</Td>
            </tr>
          )}
          {!loading &&
            rows.map((r) => (
              <tr key={r.id} className="hover:bg-cream/40">
                <Td className="font-medium text-forest-dark max-w-xs">
                  <div className="font-serif font-bold text-sm leading-snug">{r.title}</div>
                  <div className="text-[11px] text-muted-foreground font-mono mt-0.5">{r.slug}</div>
                </Td>
                <Td>
                  <span className="inline-block bg-cream-deep text-espresso text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border border-border/80">
                    {r.category_name || "Uncategorized"}
                  </span>
                </Td>
                <Td>
                  <StatusPill s={r.status} />
                </Td>
                <Td className="text-xs">
                  {r.published_at ? new Date(r.published_at).toLocaleDateString() : "—"}
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    {r.is_featured && (
                      <span className="inline-flex items-center gap-1 bg-gold-deep/15 text-gold-deep text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-gold-deep/30">
                        <Sparkles className="size-3" /> FEATURED
                      </span>
                    )}
                    {r.is_popular && (
                      <span className="inline-flex items-center gap-1 bg-burnt-orange/15 text-burnt-orange text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-burnt-orange/30">
                        <Star className="size-3" /> POPULAR
                      </span>
                    )}
                    {!r.is_featured && !r.is_popular && (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </div>
                </Td>
                <Td className="text-xs text-muted-foreground">
                  {new Date(r.updated_at).toLocaleDateString()}
                </Td>
                <Td className="text-right">
                  <button
                    onClick={() => setEdit(r)}
                    className="text-gold-deep hover:underline text-xs font-bold mr-4 inline-flex items-center gap-1"
                  >
                    <Pencil className="size-3.5 inline" /> EDIT
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm("Delete article? This cannot be undone.")) return;
                      try {
                        await del({ data: { id: r.id } });
                        toast.success("Article deleted");
                        void load();
                      } catch (e) {
                        toast.error((e as Error).message);
                      }
                    }}
                    className="text-destructive hover:underline text-xs font-bold inline-flex items-center gap-1"
                  >
                    <Trash2 className="size-3.5 inline" /> DELETE
                  </button>
                </Td>
              </tr>
            ))}
        </tbody>
      </TableWrap>
    </div>
  );
}

function Editor({
  initial,
  onCancel,
  onSaved,
}: {
  initial: Partial<Post>;
  onCancel: () => void;
  onSaved: () => Promise<void> | void;
}) {
  const [f, setF] = useState<Partial<Post>>({
    ...initial,
    tags: initial.tags ?? [],
    category_name: initial.category_name || "Honey & Health",
    author_name: initial.author_name || "Saurashtra Honey Editorial Team",
    reading_time: initial.reading_time || "5 min read",
    is_featured: initial.is_featured || false,
    is_popular: initial.is_popular || false,
  });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const save = useServerFn(upsertPost);

  function insertMarkdown(syntax: string) {
    const current = f.body_markdown ?? "";
    setF({ ...f, body_markdown: current ? `${current}\n\n${syntax}` : syntax });
  }

  async function handleImageUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a valid image file (JPG, PNG, WebP)");
      return;
    }
    setUploading(true);
    try {
      const safeName = file.name.replace(/[^\w.\-]+/g, "_");
      const path = `blog/covers/${Date.now()}_${safeName}`;
      const { data, error } = await supabase.storage.from("media").upload(path, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: true,
      });
      if (error) throw new Error(error.message);

      const { data: pubData } = supabase.storage.from("media").getPublicUrl(data.path);
      setF((prev) => ({ ...prev, cover_image_url: pubData.publicUrl }));
      toast.success("Featured image uploaded successfully");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <button
        onClick={onCancel}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-dark mb-4 hover:text-burnt-orange transition-colors"
      >
        <ArrowLeft className="size-4" /> BACK TO ARTICLES
      </button>
      <Card className="p-6">
        <h2 className="font-serif text-2xl text-forest-dark mb-4">
          {f.id ? "Edit Journal Article" : "New Journal Article"}
        </h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <Field label="Title *">
            <input
              value={f.title ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                const nextSlug = f.id
                  ? f.slug
                  : val
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-|-$/g, "");
                setF({ ...f, title: val, slug: nextSlug || f.slug });
              }}
              className={inp}
              placeholder="e.g. 7 Health Benefits of Raw Honey"
            />
          </Field>
          <Field label="Slug (URL Path) *">
            <input
              value={f.slug ?? ""}
              onChange={(e) => setF({ ...f, slug: e.target.value })}
              className={inp}
              placeholder="7-health-benefits-of-raw-honey"
            />
          </Field>
          <Field label="Category *">
            <select
              value={f.category_name || "Honey & Health"}
              onChange={(e) => setF({ ...f, category_name: e.target.value })}
              className={inp}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Author Name">
            <input
              value={f.author_name || ""}
              onChange={(e) => setF({ ...f, author_name: e.target.value })}
              className={inp}
              placeholder="Saurashtra Honey Editorial Team"
            />
          </Field>
          <Field label="Reading Time">
            <input
              value={f.reading_time || ""}
              onChange={(e) => setF({ ...f, reading_time: e.target.value })}
              className={inp}
              placeholder="5 min read"
            />
          </Field>
          <Field label="Status *">
            <select
              value={f.status ?? "draft"}
              onChange={(e) => setF({ ...f, status: e.target.value as never })}
              className={inp}
            >
              <option value="draft">Draft (Hidden from customers)</option>
              <option value="published">Published (Publicly visible)</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
          <Field label="Publish Date (optional)">
            <input
              type="datetime-local"
              value={f.published_at ? f.published_at.slice(0, 16) : ""}
              onChange={(e) =>
                setF({
                  ...f,
                  published_at: e.target.value ? new Date(e.target.value).toISOString() : null,
                })
              }
              className={inp}
            />
          </Field>
          <div className="flex items-center gap-6 pt-6">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-espresso">
              <input
                type="checkbox"
                checked={f.is_featured || false}
                onChange={(e) => setF({ ...f, is_featured: e.target.checked })}
                className="size-4 rounded border-border text-burnt-orange focus:ring-burnt-orange"
              />
              Mark as Featured Article
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-espresso">
              <input
                type="checkbox"
                checked={f.is_popular || false}
                onChange={(e) => setF({ ...f, is_popular: e.target.checked })}
                className="size-4 rounded border-border text-burnt-orange focus:ring-burnt-orange"
              />
              Mark as Popular Article
            </label>
          </div>
          <div className="md:col-span-2">
            <Field label="Short Excerpt">
              <textarea
                rows={2}
                value={f.excerpt ?? ""}
                onChange={(e) => setF({ ...f, excerpt: e.target.value })}
                className={inp}
                placeholder="A concise summary of the article for cards and meta descriptions..."
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Featured Image URL">
              <div className="flex gap-2">
                <input
                  value={f.cover_image_url ?? ""}
                  onChange={(e) => setF({ ...f, cover_image_url: e.target.value })}
                  className={inp}
                  placeholder="https://..."
                />
                <label className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-cream-deep border border-border rounded-xl text-xs font-bold text-espresso hover:bg-cream transition-colors cursor-pointer">
                  <Upload className="size-3.5" />
                  {uploading ? "UPLOADING..." : "UPLOAD"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleImageUpload(file);
                    }}
                  />
                </label>
              </div>
            </Field>
          </div>
          {f.cover_image_url && (
            <div className="md:col-span-2">
              <div className="text-xs font-bold text-muted-foreground mb-1.5">IMAGE PREVIEW</div>
              <img
                src={f.cover_image_url}
                alt="Featured preview"
                className="h-40 rounded-xl object-cover border border-border"
              />
            </div>
          )}
          <Field label="SEO Title">
            <input
              value={f.seo_title ?? ""}
              onChange={(e) => setF({ ...f, seo_title: e.target.value })}
              className={inp}
              placeholder="SEO optimized title..."
            />
          </Field>
          <Field label="SEO Description">
            <input
              value={f.seo_description ?? ""}
              onChange={(e) => setF({ ...f, seo_description: e.target.value })}
              className={inp}
              placeholder="SEO meta description..."
            />
          </Field>
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-espresso">Full Article Content (Markdown / Rich Formatting)</label>
              <div className="flex items-center gap-1.5 bg-cream-deep p-1 rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => insertMarkdown("## Heading 2")}
                  title="Heading 2"
                  className="p-1 hover:bg-cream rounded text-espresso text-xs font-bold"
                >
                  <Heading2 className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("### Heading 3")}
                  title="Heading 3"
                  className="p-1 hover:bg-cream rounded text-espresso text-xs font-bold"
                >
                  <Heading3 className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("**Bold Text**")}
                  title="Bold"
                  className="p-1 hover:bg-cream rounded text-espresso text-xs font-bold"
                >
                  <Bold className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("*Italic Text*")}
                  title="Italic"
                  className="p-1 hover:bg-cream rounded text-espresso text-xs font-bold"
                >
                  <Italic className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("- List item 1\n- List item 2")}
                  title="List"
                  className="p-1 hover:bg-cream rounded text-espresso text-xs font-bold"
                >
                  <List className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("> Blockquote quotation")}
                  title="Quote"
                  className="p-1 hover:bg-cream rounded text-espresso text-xs font-bold"
                >
                  <Quote className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("[Link text](https://example.com)")}
                  title="Link"
                  className="p-1 hover:bg-cream rounded text-espresso text-xs font-bold"
                >
                  <LinkIcon className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("![Image description](https://example.com/image.jpg)")}
                  title="Image"
                  className="p-1 hover:bg-cream rounded text-espresso text-xs font-bold"
                >
                  <ImageIcon className="size-3.5" />
                </button>
              </div>
            </div>
            <textarea
              rows={14}
              value={f.body_markdown ?? ""}
              onChange={(e) => setF({ ...f, body_markdown: e.target.value })}
              className={`${inp} font-mono text-xs`}
              placeholder="Write your article content using Markdown formatting (headings, paragraphs, lists, bold, links, images)..."
            />
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <BtnPrimary
            disabled={busy}
            onClick={async () => {
              if (!f.title || !f.slug) {
                toast.error("Title and Slug are required.");
                return;
              }
              setBusy(true);
              try {
                await save({
                  data: {
                    id: f.id,
                    slug: f.slug,
                    title: f.title,
                    excerpt: f.excerpt ?? null,
                    body_markdown: f.body_markdown ?? null,
                    cover_image_url: f.cover_image_url ?? null,
                    category_name: f.category_name ?? "Honey & Health",
                    author_name: f.author_name ?? "Saurashtra Honey Editorial Team",
                    reading_time: f.reading_time ?? "5 min read",
                    is_featured: f.is_featured ?? false,
                    is_popular: f.is_popular ?? false,
                    seo_title: f.seo_title ?? null,
                    seo_description: f.seo_description ?? null,
                    tags: f.tags ?? [],
                    status: f.status ?? "draft",
                    published_at:
                      f.status === "published" && !f.published_at
                        ? new Date().toISOString()
                        : f.published_at ?? null,
                  },
                });
                toast.success("Journal article saved");
                await onSaved();
              } catch (e) {
                toast.error((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "SAVING…" : "SAVE ARTICLE"}
          </BtnPrimary>
          <BtnGhost onClick={onCancel}>CANCEL</BtnGhost>
        </div>
      </Card>
    </div>
  );
}
