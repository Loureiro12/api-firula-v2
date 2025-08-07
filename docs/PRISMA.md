# Configuração do Prisma

Este projeto está configurado com o Prisma ORM para gerenciamento de banco de dados.

## Configuração Atual

- **Banco de dados**: SQLite (desenvolvimento)
- **Arquivo do banco**: `prisma/dev.db`
- **Schema**: `prisma/schema.prisma`

## Modelo User

O projeto inclui um modelo básico de usuário com os seguintes campos:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("users")
}
```

## Comandos Disponíveis

### Gerar o cliente Prisma
```bash
npx prisma generate
```

### Criar uma nova migração
```bash
npx prisma migrate dev --name nome_da_migracao
```

### Aplicar migrações
```bash
npx prisma migrate deploy
```

### Visualizar dados no Prisma Studio
```bash
npx prisma studio
```

### Reset do banco de dados (desenvolvimento)
```bash
npx prisma migrate reset
```

## API Endpoints

O projeto inclui endpoints básicos para CRUD de usuários:

- `POST /users` - Criar usuário
- `GET /users` - Listar usuários
- `GET /users/:id` - Buscar usuário por ID
- `PATCH /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Deletar usuário

## Estrutura dos Arquivos

```
src/
├── prisma/
│   ├── prisma.module.ts   # Módulo do Prisma
│   └── prisma.service.ts  # Serviço do Prisma
├── users/
│   ├── dto/
│   │   └── create-user.dto.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
prisma/
├── schema.prisma          # Schema do banco
├── dev.db                 # Arquivo SQLite
└── migrations/            # Histórico de migrações
```

## Mudança para PostgreSQL (Produção)

Para mudar para PostgreSQL, edite o `schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

E configure a `DATABASE_URL` no arquivo `.env`:

```
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```
