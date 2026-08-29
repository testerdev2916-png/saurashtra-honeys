
CREATE TABLE public.form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_type TEXT NOT NULL CHECK (form_type IN ('bulk_order','contact','partner','newsletter')),
  name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  city TEXT,
  subject TEXT,
  message TEXT,
  quantity TEXT,
  product_interest TEXT,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.form_submissions TO anon;
GRANT INSERT, SELECT ON public.form_submissions TO anon;
GRANT ALL ON public.form_submissions TO service_role;

ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a form (public site)
CREATE POLICY "public can insert submissions"
ON public.form_submissions FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- No public reads (admin uses service role via backend UI)
CREATE POLICY "no public reads"
ON public.form_submissions FOR SELECT TO anon, authenticated
USING (false);

CREATE INDEX form_submissions_created_at_idx ON public.form_submissions (created_at DESC);
CREATE INDEX form_submissions_form_type_idx ON public.form_submissions (form_type);
