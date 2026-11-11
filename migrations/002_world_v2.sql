BEGIN;
-- World v2: schema number is kept (larger wins), an epoch is added, and n.* counters take the larger value.
-- Must match mergeWorld in src/game/engine.ts; tests/parity.test.ts runs both on shared fixtures.
-- Old API code may call this function with v1 payloads while the deploy is in progress, so v1 input stays valid.
CREATE OR REPLACE FUNCTION merge_world(a jsonb,b jsonb) RETURNS jsonb LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE fields jsonb; k text; v jsonb; old jsonb; ds jsonb; win jsonb;
 ea numeric:=coalesce((a->>'epoch')::numeric,0); eb numeric:=coalesce((b->>'epoch')::numeric,0);
 sch numeric:=greatest(coalesce((a->>'schema')::numeric,1),coalesce((b->>'schema')::numeric,1));
 newer boolean;
BEGIN
 IF ea<>eb THEN
  win:=CASE WHEN ea>eb THEN a ELSE b END;
  SELECT coalesce(jsonb_agg(x ORDER BY x COLLATE "C"),'[]') INTO ds FROM (SELECT DISTINCT jsonb_array_elements_text(coalesce(win->'discoveries','[]')) AS x) t;
  RETURN jsonb_build_object('schema',sch,'epoch',greatest(ea,eb),'discoveries',ds,'fields',coalesce(win->'fields','{}'));
 END IF;
 fields:=coalesce(a->'fields','{}');
 FOR k,v IN SELECT * FROM jsonb_each(coalesce(b->'fields','{}')) LOOP
  old:=fields->k;
  newer:=old IS NULL OR (v->>'clock')::numeric>(old->>'clock')::numeric OR ((v->>'clock')::numeric=(old->>'clock')::numeric AND (v->>'device') COLLATE "C">(old->>'device') COLLATE "C");
  IF old IS NOT NULL AND k LIKE 'n.%' THEN
   IF (v->>'value')::numeric<>(old->>'value')::numeric THEN newer:=(v->>'value')::numeric>(old->>'value')::numeric; END IF;
  END IF;
  IF newer THEN fields:=jsonb_set(fields,ARRAY[k],v); END IF;
 END LOOP;
 SELECT coalesce(jsonb_agg(x ORDER BY x COLLATE "C"),'[]') INTO ds FROM (SELECT DISTINCT jsonb_array_elements_text(coalesce(a->'discoveries','[]')||coalesce(b->'discoveries','[]')) AS x) t;
 RETURN jsonb_build_object('schema',sch,'epoch',ea,'discoveries',ds,'fields',fields);
END $$;
ALTER TABLE profiles ALTER COLUMN world SET DEFAULT '{"schema":2,"epoch":0,"discoveries":[],"fields":{}}';
INSERT INTO schema_migrations(version) VALUES(2) ON CONFLICT DO NOTHING;
COMMIT;
