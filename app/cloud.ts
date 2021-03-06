import { createClient } from '@supabase/supabase-js'


const key = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNTAxNzMxMCwiZXhwIjoxOTMwNTkzMzEwfQ.-6jZbQvj_myt3YrEo2AEU2wsGcX2vAEaMj-3OaH36a8`;

export const client = createClient("https://atfucjxpvmfcoeynxfig.supabase.co", key);
