SELECT 'CREATE DATABASE kidora_test' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'kidora_test')\gexec
