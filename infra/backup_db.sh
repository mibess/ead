#!/bin/bash

# Configuration
CONTAINER_NAME="ead-postgres"
DB_USER="ead_db_user"
DB_NAME="ead_db_main"
BACKUP_DIR="./backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Run pg_dump inside the container and save to host
docker exec $CONTAINER_NAME pg_dump -U $DB_USER $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Optional: Remove backups older than 7 days to save space
find $BACKUP_DIR -type f -mtime +7 -name "*.sql" -delete

echo "Backup completed: $BACKUP_DIR/db_backup_$DATE.sql"