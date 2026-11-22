# Production image for Cloud Run. Build from the repo root:
#   docker build -f apps/api/Dockerfile -t good-deeds-api .
FROM node:22-slim AS build
RUN corepack enable
WORKDIR /repo
COPY . .
RUN pnpm install --frozen-lockfile --filter @repo/api... \
 && pnpm --filter @repo/database generate \
 && pnpm --filter @repo/api build \
 && pnpm --filter @repo/api deploy --prod --legacy /out

FROM node:22-slim
ENV NODE_ENV=production PORT=8080
WORKDIR /app
COPY --from=build /out/node_modules ./node_modules
COPY --from=build /repo/apps/api/dist ./dist
USER node
EXPOSE 8080
CMD ["node", "dist/index.js"]
