import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getInstagramSettings, saveInstagramSettings, syncInstagramPosts } from "@/lib/instagram.functions";
import { PageHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { RefreshCw, Instagram, AlertCircle, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/admin/instagram")({
  component: AdminInstagramSettings,
  loader: async () => {
    return await getInstagramSettings();
  },
});

function AdminInstagramSettings() {
  const initialData = Route.useLoaderData();
  const [formData, setFormData] = useState({
    is_enabled: initialData.is_enabled,
    post_count: initialData.post_count,
    instagram_token: initialData.instagram_token || "",
  });

  const { refetch } = useQuery({
    queryKey: ["instagramSettings"],
    queryFn: () => getInstagramSettings(),
    initialData,
  });

  const saveMutation = useMutation({
    mutationFn: (data: typeof formData) =>
      saveInstagramSettings({
        data: {
          is_enabled: data.is_enabled,
          post_count: data.post_count,
          instagram_token: data.instagram_token || null,
        },
      }),
    onSuccess: () => {
      toast.success("Settings saved successfully.");
      refetch();
    },
    onError: (err: any) => toast.error(err.message || "Failed to save settings."),
  });

  const syncMutation = useMutation({
    mutationFn: () => syncInstagramPosts(),
    onSuccess: (res) => {
      toast.success(`Successfully synced ${res.count} posts from Instagram.`);
      refetch();
    },
    onError: (err: any) => toast.error(err.message || "Failed to sync posts."),
  });

  const isConnected = !!initialData.instagram_token;

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-[1200px] mx-auto w-full">
      <PageHeader title="Instagram Integration" subtitle="Connect and manage your Follow Our Hive section." />
      <div className="max-w-4xl space-y-6">
        
        {/* Connection Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Instagram className="size-5" />
              Connection Status
            </CardTitle>
            <CardDescription>
              Connect your brand's official Instagram account using a Long-Lived Access Token.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
              <div className="flex items-center gap-3">
                {isConnected ? (
                  <CheckCircle2 className="size-6 text-green-500" />
                ) : (
                  <AlertCircle className="size-6 text-yellow-500" />
                )}
                <div>
                  <p className="font-semibold">{isConnected ? "Connected to Instagram" : "Not Connected"}</p>
                  <p className="text-sm text-muted-foreground">
                    {initialData.last_synced 
                      ? `Last synced: ${new Date(initialData.last_synced).toLocaleString()}`
                      : "No sync history available."}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => syncMutation.mutate()}
                disabled={!isConnected || syncMutation.isPending}
                className="gap-2"
              >
                <RefreshCw className={`size-4 ${syncMutation.isPending ? "animate-spin" : ""}`} />
                {syncMutation.isPending ? "Syncing..." : "Sync Now"}
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Instagram Access Token</Label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Paste your Meta Graph API Long-Lived Token here..."
                  value={formData.instagram_token}
                  onChange={(e) => setFormData({ ...formData, instagram_token: e.target.value })}
                />
                {isConnected && (
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      setFormData({ ...formData, instagram_token: "" });
                      saveMutation.mutate({ ...formData, instagram_token: "" });
                    }}
                  >
                    Disconnect
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Generate this token in your Meta Developer Dashboard. Never share this token publicly.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Display Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Display Settings</CardTitle>
            <CardDescription>
              Configure how the Instagram feed appears on the "Follow Our Hive" section.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable "Follow Our Hive" Section</Label>
                <p className="text-sm text-muted-foreground">
                  Show the Instagram feed on the homepage.
                </p>
              </div>
              <Switch
                checked={formData.is_enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, is_enabled: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label>Number of Posts to Display</Label>
              <Select
                value={String(formData.post_count)}
                onValueChange={(val) => setFormData({ ...formData, post_count: Number(val) })}
              >
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="Select post count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 Posts</SelectItem>
                  <SelectItem value="9">9 Posts</SelectItem>
                  <SelectItem value="12">12 Posts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="mt-4"
              onClick={() => saveMutation.mutate(formData)}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? "Saving..." : "Save Settings"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
