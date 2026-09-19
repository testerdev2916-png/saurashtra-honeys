#!/bin/bash

# Ensure the script exits on any error
set -e

# Supabase Connection URL (without password)
DB_URL="postgresql://postgres.buvpytuxbynwprnwftnd@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres"

echo "=================================================="
echo "Saurashtra Honey - Public Schema Migration Script"
echo "=================================================="
echo ""
echo "This script will:"
echo "1. Safely TRUNCATE (empty) all tables in the public schema of the NEW Supabase project."
echo "2. Restore the data from ~/Desktop/saurashtra-honey-public.dump."
echo ""
echo "Please enter your NEW Supabase project database password:"
read -s PGPASSWORD
export PGPASSWORD
echo ""

echo "[1/2] Truncating public schema tables (this only clears data, it does not drop tables)..."
$(brew --prefix libpq)/bin/psql "$DB_URL" -c "DO \$\$ DECLARE r record; BEGIN FOR r IN SELECT tablename FROM pg_tables WHERE schemaname='public' LOOP EXECUTE format('TRUNCATE TABLE public.%I CASCADE', r.tablename); END LOOP; END \$\$;"
echo "✅ Public schema truncated successfully."
echo ""

echo "[2/2] Restoring public schema data from dump..."
$(brew --prefix libpq)/bin/pg_restore -d "$DB_URL" --data-only --schema=public ~/Desktop/saurashtra-honey-public.dump
echo "✅ Public schema data restored successfully."
echo ""

echo "=================================================="
echo "Migration completed successfully!"
echo "Please reply to the assistant to generate the final verification report."
echo "=================================================="
