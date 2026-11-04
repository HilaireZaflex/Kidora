#!/usr/bin/env bash
set -euo pipefail
trap 'echo; echo "Le démarrage a été interrompu. Consultez le message ci-dessus ou macos/LIRE-MOI.md."; read -r -p "Appuyez sur Entrée pour fermer…"' ERR
cd "$(dirname "$0")"
source macos/docker-desktop.sh
echo "Préparation de Kidora. Le premier démarrage télécharge les composants ; gardez une connexion Internet."
kidora_compose up --detach --build --wait --wait-timeout 600
kidora_port="${KIDORA_WEB_PORT:-3000}"
kidora_address="http://localhost:$kidora_port"
curl --fail --silent --show-error "$kidora_address" >/dev/null
open "$kidora_address"
echo "Kidora est prêt dans votre navigateur. Pour l’arrêter : double-cliquez sur Arrêter Kidora.command."
