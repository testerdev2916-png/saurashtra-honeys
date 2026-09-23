import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { 
  listAchievements, 
  upsertAchievement, 
  deleteAchievement, 
  reorderAchievements 
} from "@/lib/admin-achievements.functions";
import { BtnGhost, BtnPrimary, Card, Field, inp, PageHeader, StatusPill, TableWrap, Td, Th } from "@/components/admin/ui";
import { ArrowUp, ArrowDown, ImageOff, Plus, RefreshCcw, Trash2, Video, Pencil, Play, Pause } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

export const Route = createFileRoute("/admin/achievements")({ component: AchievementsPage });

type AchievementRow = {
  id: string;
  media_type: "image" | "video";
  media_url: string;
  thumbnail_url: string | null;
  title: string | null;
  description: string | null;
  display_order: number;
  is_active: boolean;
};

const EMPTY: Partial<AchievementRow> = {
  media_type: "image",
  media_url: "",
  thumbnail_url: "",
  title: "",
  description: "",
  display_order: 1,
  is_active: true,
};

function AchievementsPage() {
  const listFn = useServerFn(listAchievements);
  const delFn = useServerFn(deleteAchievement);
  const reorderFn = useServerFn(reorderAchievements);
  const [rows, setRows] = useState<AchievementRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState<Partial<AchievementRow> | null>(null);

  async function load() {
    setLoading(true);
    try {
      const r = await listFn({});
      setRows((r.rows as unknown) as AchievementRow[]);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function moveRow(index: number, direction: -1 | 1) {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= rows.length) return;
    const clone = [...rows];
    const tempOrder = clone[index].display_order;
    clone[index].display_order = clone[targetIdx].display_order;
    clone[targetIdx].display_order = tempOrder;

    // Swap position in array
    const temp = clone[index];
    clone[index] = clone[targetIdx];
    clone[targetIdx] = temp;
    setRows(clone);

    try {
      await reorderFn({
        data: {
          items: clone.map((r, i) => ({ id: r.id, display_order: i + 1 })),
        },
      });
      toast.success("Order updated");
    } catch (e) {
      toast.error((e as Error).message);
      void load();
    }
  }

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
        title="CMS → Achievements & Awards"
        subtitle={`${rows.length} items in the gallery`}
        actions={
          <>
            <BtnGhost onClick={load}>
              <RefreshCcw className="size-3.5" /> REFRESH
            </BtnGhost>
            <BtnPrimary onClick={() => setEdit({ ...EMPTY, display_order: rows.length + 1 })}>
              <Plus className="size-3.5" /> NEW ACHIEVEMENT
            </BtnPrimary>
          </>
        }
      />

      <TableWrap>
        <thead>
          <tr>
            {["Order", "Media", "Title", "Type", "Status", "Order Move", ""].map((h) => (
              <Th key={h}>{h}</Th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {loading && (
            <tr>
              <Td className="text-center py-12 text-muted-foreground">Loading achievements...</Td>
            </tr>
          )}
          {!loading && rows.length === 0 && (
            <tr>
              <Td className="text-center py-12 text-muted-foreground">No achievements found. Click "New Achievement" to create one.</Td>
            </tr>
          )}
          {!loading &&
            rows.map((r, idx) => (
              <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                <Td className="text-center font-mono text-xs w-16">{r.display_order}</Td>
                <Td>
                  <div className="w-20 h-20 rounded-md overflow-hidden bg-muted flex items-center justify-center relative">
                    {r.media_type === "image" && r.media_url ? (
                      <img src={r.media_url} className="w-full h-full object-cover" alt="" />
                    ) : r.media_type === "video" && (r.thumbnail_url || r.media_url) ? (
                      <>
                        {r.thumbnail_url ? (
                          <img src={r.thumbnail_url} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <video src={r.media_url} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Play className="text-white size-6 drop-shadow-md" />
                        </div>
                      </>
                    ) : (
                      <ImageOff className="size-5 text-muted-foreground/50" />
                    )}
                  </div>
                </Td>
                <Td>
                  <div className="font-medium text-foreground">{r.title || <span className="text-muted-foreground italic">Untitled</span>}</div>
                  {r.description && <div className="text-xs text-muted-foreground truncate max-w-[250px]">{r.description}</div>}
                </Td>
                <Td>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${r.media_type === 'video' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {r.media_type === 'video' ? <Video className="w-3 h-3 mr-1" /> : <ImageOff className="w-3 h-3 mr-1" />}
                    {r.media_type}
                  </span>
                </Td>
                <Td>
                  <StatusPill s={r.is_active ? "active" : "inactive"} />
                </Td>
                <Td>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveRow(idx, -1)}
                      disabled={idx === 0}
                      className="p-1 hover:bg-muted rounded disabled:opacity-30 transition"
                      title="Move up"
                    >
                      <ArrowUp className="size-4" />
                    </button>
                    <button
                      onClick={() => moveRow(idx, 1)}
                      disabled={idx === rows.length - 1}
                      className="p-1 hover:bg-muted rounded disabled:opacity-30 transition"
                      title="Move down"
                    >
                      <ArrowDown className="size-4" />
                    </button>
                  </div>
                </Td>
                <Td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEdit(r)}
                      className="p-2 hover:bg-muted rounded transition"
                      title="Edit"
                    >
                      <Pencil className="size-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm("Are you sure you want to delete this achievement?")) return;
                        try {
                          await delFn({ data: { id: r.id } });
                          toast.success("Deleted");
                          void load();
                        } catch (e) {
                          toast.error((e as Error).message);
                        }
                      }}
                      className="p-2 hover:bg-red-500/10 rounded transition text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
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
  initial: Partial<AchievementRow>;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const saveFn = useServerFn(upsertAchievement);
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!form.media_url) {
      toast.error("Media URL is required");
      return;
    }
    setSaving(true);
    try {
      await saveFn({
        data: {
          id: form.id,
          media_type: form.media_type as "image" | "video",
          media_url: form.media_url,
          thumbnail_url: form.thumbnail_url || undefined,
          title: form.title || undefined,
          description: form.description || undefined,
          display_order: form.display_order,
          is_active: form.is_active,
        } as any
      });
      toast.success("Saved successfully");
      onSaved();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl text-forest-dark">{form.id ? "Edit Achievement" : "New Achievement"}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-6 space-y-6">
            <Field label="Media Type">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="media_type"
                    checked={form.media_type === "image"}
                    onChange={() => setForm({ ...form, media_type: "image" })}
                    className="accent-brand-orange"
                  />
                  <span className="text-sm font-medium">Image</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="media_type"
                    checked={form.media_type === "video"}
                    onChange={() => setForm({ ...form, media_type: "video" })}
                    className="accent-brand-orange"
                  />
                  <span className="text-sm font-medium">Video</span>
                </label>
              </div>
            </Field>

            <Field label={form.media_type === "video" ? "Upload Video (MP4/WebM)" : "Upload Image"}>
              <ImageUpload
                value={form.media_url || null}
                onChange={(url) => setForm({ ...form, media_url: url || "" })}
                folder="achievements"
                mediaType={form.media_type}
              />
            </Field>

            {form.media_type === "video" && (
              <Field label="Video Thumbnail (Optional but Recommended)">
                <ImageUpload
                  value={form.thumbnail_url || null}
                  onChange={(url) => setForm({ ...form, thumbnail_url: url || "" })}
                  folder="achievements"
                  mediaType="image"
                />
              </Field>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 space-y-6">
            <Field label="Title (Optional)">
              <input
                type="text"
                className={inp}
                value={form.title || ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Best Honey Award 2026"
              />
            </Field>
            
            <Field label="Description (Optional)">
              <textarea
                className={`${inp} min-h-[100px] py-2`}
                value={form.description || ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="A short description about this achievement..."
              />
            </Field>

            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border">
              <div>
                <div className="font-semibold text-sm">Active Status</div>
                <div className="text-xs text-muted-foreground mt-1">If disabled, it will be hidden from the public gallery.</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-forest-dark"></div>
              </label>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <BtnPrimary onClick={handleSave} disabled={saving}>
          {saving ? "SAVING..." : "SAVE ACHIEVEMENT"}
        </BtnPrimary>
        <BtnGhost onClick={onCancel} disabled={saving}>
          CANCEL
        </BtnGhost>
      </div>
    </div>
  );
}
