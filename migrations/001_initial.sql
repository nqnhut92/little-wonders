BEGIN;
CREATE TABLE IF NOT EXISTS schema_migrations(version integer PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS parents(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),google_sub text NOT NULL UNIQUE,created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS profiles(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),parent_id uuid NOT NULL REFERENCES parents(id) ON DELETE CASCADE,nickname varchar(24) NOT NULL,world jsonb NOT NULL DEFAULT '{"schema":1,"discoveries":[],"fields":{}}',revision bigint NOT NULL DEFAULT 0,created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS profiles_parent ON profiles(parent_id);
CREATE TABLE IF NOT EXISTS rate_limits(bucket text PRIMARY KEY,hits integer NOT NULL,expires_at timestamptz NOT NULL);
CREATE INDEX IF NOT EXISTS rate_limits_expiry ON rate_limits(expires_at);
-- Discoveries and creations are compact, versioned members of the profile world document.
CREATE OR REPLACE FUNCTION merge_world(a jsonb,b jsonb) RETURNS jsonb LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE fields jsonb:=coalesce(a->'fields','{}'); k text; v jsonb; old jsonb; ds jsonb;
BEGIN
 FOR k,v IN SELECT * FROM jsonb_each(coalesce(b->'fields','{}')) LOOP
 old:=fields->k;
 IF old IS NULL OR (v->>'clock')::numeric>(old->>'clock')::numeric OR ((v->>'clock')::numeric=(old->>'clock')::numeric AND (v->>'device') COLLATE "C">(old->>'device') COLLATE "C") THEN fields:=jsonb_set(fields,ARRAY[k],v);END IF;
 END LOOP;
 SELECT coalesce(jsonb_agg(x ORDER BY x),'[]') INTO ds FROM (SELECT DISTINCT jsonb_array_elements_text(coalesce(a->'discoveries','[]')||coalesce(b->'discoveries','[]')) AS x) t;
 RETURN jsonb_build_object('schema',1,'discoveries',ds,'fields',fields);
END $$;
INSERT INTO schema_migrations(version) VALUES(1) ON CONFLICT DO NOTHING;
COMMIT;
