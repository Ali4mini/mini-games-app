#!/bin/bash

# CONFIGURATION
# ----------------
# The name of your database container (check 'docker ps', usually supabase-db)
CONTAINER_NAME="supabase-db" 
# Where to save backups
BACKUP_DIR="./backups"
# Date format for filename
DATE=$(date +%Y-%m-%d_%H-%M-%S)
FILENAME="$BACKUP_DIR/supabase_backup_$DATE.sql"

# 1. Create backup dir if not exists
mkdir -p $BACKUP_DIR

# 2. Run pg_dumpall inside the container
# This dumps ALL databases (postgres), ALL schemas (public, auth, storage), and ALL roles.
echo "Creating backup: $FILENAME..."
docker exec -t $CONTAINER_NAME pg_dumpall -c -U postgres > $FILENAME

# 3. Compress it (Optional, saves space)
gzip $FILENAME

# 4. Delete backups older than 7 days (Prevents disk filling up)
find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: $FILENAME.gz"
