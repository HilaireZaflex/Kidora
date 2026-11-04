#!/usr/bin/env bash
# Sourced by the Mac launchers. Use only a local Docker Desktop context.
set -euo pipefail
kidora_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$kidora_root"
if [ "$(uname -s)" != Darwin ]; then
  echo "Ce lanceur est prévu pour macOS. Consultez README.md pour les autres systèmes."
  exit 1
fi
kidora_docker="$(command -v docker || true)"
if [ -z "$kidora_docker" ] && [ -x /Applications/Docker.app/Contents/Resources/bin/docker ]; then
  kidora_docker=/Applications/Docker.app/Contents/Resources/bin/docker
fi
if [ -z "$kidora_docker" ]; then
  echo "Installez Docker Desktop pour Mac depuis https://www.docker.com/products/docker-desktop/ puis relancez ce fichier."
  exit 1
fi
kidora_docker_local() {
  env -u DOCKER_HOST -u DOCKER_CONTEXT -u DOCKER_TLS -u DOCKER_TLS_VERIFY -u DOCKER_CERT_PATH "$kidora_docker" "$@"
}
open -a Docker
kidora_context=desktop-linux
for kidora_attempt in $(seq 1 120); do
  if kidora_docker_local context inspect desktop-linux >/dev/null 2>&1; then
    kidora_context=desktop-linux
  else
    kidora_context=default
  fi
  kidora_endpoint="$(kidora_docker_local context inspect "$kidora_context" --format '{{.Endpoints.docker.Host}}' 2>/dev/null || true)"
  case "$kidora_endpoint" in
    unix://*)
      if kidora_docker_local --context "$kidora_context" info >/dev/null 2>&1; then break; fi
      ;;
    *) kidora_endpoint= ;;
  esac
  if [ "$kidora_attempt" -eq 120 ]; then
    echo "Docker Desktop n’est pas prêt. Terminez sa configuration et relancez le fichier. Aucun serveur Docker distant n’est utilisé."
    exit 1
  fi
  if [ $((kidora_attempt % 10)) -eq 1 ]; then echo "En attente de Docker Desktop…"; fi
  sleep 2
done
kidora_compose() {
  kidora_docker_local --context "$kidora_context" compose -f "$kidora_root/compose.macos.yaml" "$@"
}
