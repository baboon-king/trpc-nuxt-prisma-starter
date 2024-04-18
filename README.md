# trpc-nuxt-prisma-starter

## About

// TODO

## 开发

### 基础环境

- node 18
- pnpm 8
- docker

### 安装依赖

```shell
pnpm i
```

### 数据库相关

#### 准备数据库

1. 启动数据库镜像

   ```shell
   docker-compose up -d
   ```

2. 创建 .env

   ```shell
   touch .env.local
   ```

   - Recommended context

   ```properties
   # Since .env is gitignored, you can use .env.example to build a new `.env` file when you clone the repo.
   # Keep this file up-to-date when you add new variables to \`.env\`.

   # This file will be committed to version control, so make sure not to have any secrets in it.
   # If you are cloning this repo, create a copy of this file named `.env` and populate it with your secrets.

   # We use dotenv to load Prisma from Next.js' .env file
   # @see https://www.prisma.io/docs/reference/database-reference/connection-urls
   DATABASE_URL=postgresql://johndoe:LAaiVZ3xwKkR@localhost:5432/trpc_nuxt_prisma_starter?schema=public
   AUTH_ORIGIN=http://localhost:3000
   AUTH_SECRET=MoYvopp9A84V
   IdentityServer4_Issuer=https://xxx.aaaa.com:5500
   IdentityServer4_CLIENT_ID=SINTHTT1112323232CODE
   IdentityServer4_CLIENT_SECRET=SGTSKT-h6g8-7eba-1d18323232a

   ```

3. 推送 Prisma 设计到 数据库

   ```shell
   pnpm db:push
   ```

4. 数据库模型变更后执行迁移 (可选)

   ```shell
   # 事例
   pnpm --filter prisma migrate dev --name "add_star_field_to_user_table"
   ```

## References

The stack originates from [create-t3-app](https://github.com/t3-oss/create-t3-app).

A [blog post](https://jumr.dev/blog/t3-turbo) where I wrote how to migrate a T3 app into this.
