# Next.js API and Prisma

```tsx
import { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  return new Response(JSON.stringify({ message: "Hello World" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
```

# Next.js API and Prisma

Next.js is a React framework that provides features such as server-side rendering and static site generation. Prisma is an open-source database toolkit that makes it easy to work with databases in your applications.

## Installation and Setup

Before you can use Next.js and Prisma, you need to install them in your project. You can do this by running the following commands in your terminal:

```bash
npx create-next-app@latest
npm install @prisma/client
npx prisma init
```

## Prisma

### Prisma Client

```tsx
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

### Prisma Schema

The Prisma schema is a declarative data modeling language that describes your application models and their relations to each other. It is used to generate the Prisma Client, which is a type-safe database client that can be used in your application code.

The Prisma schema is defined in a file called `schema.prisma` in the root directory of your project, but for cleaner folder structure, you can also put it in a subfolder called `prisma`. It is written in the Prisma schema language, which is a subset of the GraphQL schema language.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Prisma Generate

```bash
npx prisma generate
```

### Prisma Push

```bash
npx prisma db push
```

### Prisma Seed

The seed data is defined in a file called `seed.ts` in the `prisma` folder. It is written in TypeScript and uses the Prisma Client to create the seed data.

```tsx
import prisma from "lib/prisma";

async function main() {
  await prisma.user.create({
    data: {
      email: "jhon@doe.com",
      name: "Jhon Doe",
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

To seed the database with some initial data, you can use the Prisma CLI:

```bash
npx prisma db seed
```

## Next.js API with Prisma

```tsx
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
```

```tsx
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
  return new Response(JSON.stringify(users), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
```

```tsx
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { email, name } = req.body;
  const user = await prisma.user.create({
    data: {
      email,
      name,
    },
  });
  return new Response(JSON.stringify(user), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
```

```tsx
export async function PUT(req: NextApiRequest, res: NextApiResponse) {
  const { id, email, name } = req.body;
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      email,
      name,
    },
  });
  return new Response(JSON.stringify(user), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
```

```tsx
export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.body;
  const user = await prisma.user.delete({
    where: {
      id,
    },
  });
  return new Response(
    JSON.stringify({
      message: "User deleted",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
```

## Error Handling

```tsx
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
```

## BCryptJS

BCryptJS is a JavaScript implementation of BCrypt, a password hashing function that is designed to be slow and difficult to crack. It is used to hash passwords before storing them in the database.

```bash
npm install bcryptjs
npm i --save-dev @types/bcryptjs
```

```tsx
import { hash, compare } from "bcryptjs";
```

```tsx
const hashPassword = async (password: string) => {
  const hashedPassword = await hash(password, 10);
  return hashedPassword;
};

export default hashPassword;
```

```tsx
const verifyPassword = async (password: string, hashedPassword: string) => {
  const isValid = await compare(password, hashedPassword);
  return isValid;
};

export default verifyPassword;
```

## JWT

JSON Web Tokens (JWT) are an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed.

```bash
npm install jsonwebtoken@8.5.1
npm i --save-dev @types/jsonwebtoken
```

```tsx
import { sign, verify } from "jsonwebtoken";
```

```tsx
const createToken = async (payload: any) => {
  const token = await sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

export default createToken;
```

```tsx
const verifyToken = async (token: string) => {
  const payload = await verify(token, process.env.JWT_SECRET);
  return payload;
};

export default verifyToken;
```

## Next.js API with Prisma, BCryptJS and JWT

```tsx
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import hashPassword from "lib/hashPassword";
import verifyPassword from "lib/verifyPassword";
import createToken from "lib/createToken";
import verifyToken from "lib/verifyToken";
```

```tsx
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { email, password, name } = req.body;
  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
  return new Response(JSON.stringify(user), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
```

```tsx
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return new Response(
      JSON.stringify({
        message: "Invalid email or password",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return new Response(
      JSON.stringify({
        message: "Invalid email or password",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  const token = await createToken({
    id: user.id,
    email: user.email,
    name: user.name,
  });
  return new Response(JSON.stringify({ token }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
```

```tsx
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return new Response(
      JSON.stringify({
        message: "Unauthorized",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  const token = authorization.split(" ")[1];
  const payload = await verifyToken(token);
  const user = await prisma.user.findUnique({
    where: {
      id: payload.id,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
  if (!user) {
    return new Response(
      JSON.stringify({
        message: "Unauthorized",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  return new Response(JSON.stringify(user), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
```

```tsx
export async function PUT(req: NextApiRequest, res: NextApiResponse) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return new Response(
      JSON.stringify({
        message: "Unauthorized",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  const token = authorization.split(" ")[1];
  const payload = await verifyToken(token);
  const { email, name } = req.body;
  const user = await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      email,
      name,
    },
  });
  return new Response(JSON.stringify(user), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
```

```tsx
export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return new Response(
      JSON.stringify({
        message: "Unauthorized",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  const token = authorization.split(" ")[1];
  const payload = await verifyToken(token);
  const user = await prisma.user.delete({
    where: {
      id: payload.id,
    },
  });
  return new Response(
    JSON.stringify({
      message: "User deleted",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
```
