# syntax=docker/dockerfile:1
#
# Calico web panel: the Vite build served as static files by an unprivileged Nginx.
#
#   docker build --secret id=npm_token,env=NPM_TOKEN -t calico-web .
#
# NPM_TOKEN (read:packages) reaches only the install step as a build secret: it is never in an
# image layer, the build history or the final image.

# Static output: the build runs on the builder's own platform for every target architecture.
FROM --platform=$BUILDPLATFORM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN --mount=type=secret,id=npm_token,env=NPM_TOKEN \
    --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.30-alpine

ARG VERSION=dev
LABEL org.opencontainers.image.title="Calico web panel" \
      org.opencontainers.image.source="https://github.com/harunmarangoz/calico.frontend" \
      org.opencontainers.image.version="${VERSION}"

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html

# Runs as the image's unprivileged nginx user on 8080; TLS ends at Cloudflare.
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
