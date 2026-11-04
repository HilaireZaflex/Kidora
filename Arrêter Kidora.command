#!/usr/bin/env bash
set -euo pipefail
trap 'echo "L’arrêt a échoué. Consultez le message ci-dessus."; read -r -p "Appuyez sur Entrée pour fermer…"' ERR
cd "$(dirname "$0")"
source macos/docker-desktop.sh
kidora_compose down
echo "Kidora est arrêté. Les données locales sont conservées."
