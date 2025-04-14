// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ieeignborgohtfsfczyv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllZWlnbmJvcmdvaHRmc2Zjenl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMjU1MTAsImV4cCI6MjA1OTcwMTUxMH0.YEov2btVqxSovm6wIRAs0T0GwEjnbhotVLfu1PkkLhU'

export const supabase = createClient(supabaseUrl, supabaseKey)
