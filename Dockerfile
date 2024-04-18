FROM --platform=linux/amd64 node:18.16.0-alpine3.18

WORKDIR /app

# enable pnpm
RUN corepack enable

# A wildcard is used to ensure both package.json AND pnpm-lock.yaml are copied
COPY prisma/package.json ./
COPY prisma/pnpm-lock.yaml ./
COPY prisma/.npmrc ./

# use npmmirror
RUN pnpm config set registry https://registry.npmmirror.com/

# Install app dependencies.
RUN pnpm i

COPY prisma ./prisma/

COPY .output ./

EXPOSE 3000

CMD ["pnpm", "deploy:prod"]
