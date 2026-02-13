# Claude Code Instructions - Valter API

## Response Pattern (MANDATORY)

Before writing ANY code, explain your plan:

### Overview & Context
[Brief explanation of WHAT needs to be done and WHY]

### Proposed Approach
[Explain the technical approach and WHY this is the best solution]

### Files Affected

#### Created Files:
- `path/to/file.ts`
    - **Purpose**: [What this file does]
    - **Why needed**: [Reason for creating it]

#### Modified Files:
- `path/to/existing-file.ts`
    - **What changes**: [Specific modifications]
    - **Why changing**: [Reason for the change]

### Implementation Steps
1. **[Action Name]**
    - Location: `path/to/file`
    - What: [Specific changes]
    - Why: [Reason for this step]

### Testing Strategy
- **Unit Tests**: `file.unit.test.ts`
    - What will be tested: [Scope]

### Database Changes (if needed)
- **Migration**: Prisma schema changes
    - What changes: [Schema modifications]
    - Rollback plan: [How to undo]

### Any questions for me before implementing?
[List doubts or clarifications needed]

**Only proceed with code after I confirm the plan.**

---

## Tech Stack

- **Framework**: NestJS 11 + Fastify
- **Language**: TypeScript 5.7
- **ORM**: Prisma 5.9
- **Database**: PostgreSQL
- **Auth**: JWT (Passport.js) with access + refresh tokens
- **Validation**: Zod
- **Testing**: Jest
- **Deployment**: Docker, Vercel (serverless)

---

## Architecture

```
src/
├── main.ts                         # Entry point (Fastify + global filters)
├── app.module.ts                   # Root module (registers all feature modules)
├── common/                         # Cross-cutting concerns
│   ├── decorators/                 # @Public(), @Roles()
│   ├── enum.ts                     # Global enums (ERRORS, PROFILES)
│   ├── exceptions/                 # ErrorException, NotFound, Forbidden, etc.
│   ├── filters/                    # Global exception filters
│   ├── guards/                     # JwtAuthGuard, RolesGuard
│   │   └── strategies/            # JWT strategy (Passport)
│   ├── interceptors/               # Exception, Cache interceptors
│   ├── permission/                 # RESOURCES & ACTIONS enums, types
│   ├── pipe/                       # ZodValidationPipe
│   └── types/                      # Request type (with currentUser)
├── helper/                         # Utility functions
│   ├── action-resource.grouper.ts
│   ├── hash.handler.ts
│   └── timezone.converter.ts
└── modules/                        # Feature modules
    ├── auth/
    ├── user/
    ├── pantry/
    ├── shoplist/
    ├── product/
    ├── item-transaction/
    ├── notification/
    │   └── notification-expires/
    └── job/
```

### Module Structure (each feature module)

```
src/modules/{feature}/
├── {feature}.module.ts             # NestJS module definition
├── {feature}.controller.ts         # HTTP handlers
├── {feature}.service.ts            # Business logic
├── {feature}.repository.ts         # Prisma database access
├── {feature}.validator.ts          # Zod schemas
├── {feature}.type.ts               # TypeScript namespaces/types
├── {feature}.enum.ts               # Module-specific enums (if needed)
└── {feature}.{layer}.unit.test.ts  # Unit tests per layer
```

**CRITICAL**:
- Models are defined ONLY in `prisma/schema.prisma` — NEVER create model files inside modules
- All modules registered in `src/app.module.ts`

---

## Naming Standards

| Element | Convention | Example |
|---------|-----------|---------|
| Module files | `{module}.{layer}.ts` | `pantry.service.ts` |
| Test files | `{module}.{layer}.unit.test.ts` | `pantry.service.unit.test.ts` |
| Common files | `kebab-case.{descriptor}.ts` | `auth-jwt.guard.ts` |
| Classes | `PascalCase` | `PantryService` |
| Functions/Vars | `camelCase` | `findAllPantries` |
| Constants/Enums | `UPPER_SNAKE_CASE` | `ITEM_STATE` |
| DB tables | `lower_snake_case` (singular) | `pantry_item` |
| DB columns | `lower_snake_case` | `valid_for_days` |

**Language**: All code and comments in **ENGLISH**.

---

## Core Patterns

### Controller
```typescript
@UseGuards(JwtAuthGuard)
@Controller('pantry')
export class PantryController {
  constructor(private readonly pantryService: PantryService) {}

  @Post('')
  @Roles(RESOURCES.PANTRY, ACTIONS.CREATE)
  @UsePipes(new ZodValidationPipe(pantryValidator.create))
  async create(@Body() pantry: CreatePantryBody) {
    return this.pantryService.create(pantry);
  }

  @Get('')
  @Roles(RESOURCES.PANTRY, ACTIONS.FIND_ALL)
  async findAll(
    @Query(new ZodValidationPipe(pantryValidator.findAll))
    { limit, page }: FindAllQuery,
  ) {
    return this.pantryService.findAll({ limit, page });
  }
}
```

### Service
```typescript
@Injectable()
export class PantryService {
  constructor(private pantryRepository: PantryRepository) {}

  async create(pantry: CreatePantryBody): Promise<PantryServiceNamespace.CreateResponse> {
    try {
      const created = await this.pantryRepository.create({ name: pantry.name });
      return { id: created.id, name: created.name };
    } catch {
      throw new ErrorException(ERRORS.CREATE_ENTITY_ERROR);
    }
  }

  async findAll({ limit, page }: FindAllQuery): Promise<PantryServiceNamespace.FindAllResponse> {
    const offset = limit && page ? limit * (page - 1) : undefined;
    try {
      const result = await this.pantryRepository.findAll({ limit, offset });
      return { data: result.data, totalCount: result.totalCount };
    } catch {
      throw new ErrorException(ERRORS.DATABASE_ERROR);
    }
  }
}
```

### Repository
```typescript
@Injectable()
export class PantryRepository {
  create(data: Prisma.pantryCreateInput) {
    return prisma.pantry.create({
      data,
      select: { id: true, name: true },
    });
  }

  async findAll({ offset, limit }: FindAllParams) {
    const data = await prisma.pantry.findMany({ take: limit, skip: offset });
    const totalCount = await prisma.pantry.count();
    return { data, totalCount };
  }
}
```

### Validator (Zod)
```typescript
export const pantryValidator = {
  create: z.object({
    name: z.string({ message: 'name is required' }).min(2, { message: 'name is too short' }),
  }),
  findAll: z.object({
    page: z.coerce.number().min(1, { message: 'page must be >= 1' }),
    limit: z.coerce.number().min(0, { message: 'limit must be >= 0' }),
  }),
  findOne: z.object({
    id: z.string().uuid({ message: 'id is not a valid uuid' }),
  }),
};
```

### Types (Namespaces)
```typescript
export namespace PantryRepositoryNamespace {
  export type FindAllParams = { limit: number; offset: number };
}

export namespace PantryControllerNamespace {
  export type FindAllQuery = z.infer<typeof pantryValidator.findAll>;
  export type CreatePantryBody = z.infer<typeof pantryValidator.create>;
}

export namespace PantryServiceNamespace {
  export type CreateResponse = { id: string; name: string };
  export type FindAllResponse = { data: { id: string; name: string }[]; totalCount: number };
}
```

---

## Critical Rules

1. **Errors**: Always use `ErrorException` with constants from `ERRORS` enum — never throw raw errors
2. **Validation**: Zod schemas in `{module}.validator.ts`, applied via `ZodValidationPipe`
3. **Authorization**: `@UseGuards(JwtAuthGuard)` on controller + `@Roles(RESOURCE, ACTION)` per route
4. **Public routes**: Use `@Public()` decorator to skip JWT auth
5. **Prisma singleton**: Import from `prisma/prisma.ts` — never instantiate `PrismaClient` directly
6. **Transactions**: Use `prisma.$transaction(async (prisma) => { ... })` and pass `TransactionClient` down
7. **UUIDs**: All IDs are `@db.Uuid` — validate with Zod `.uuid()`
8. **Pagination**: `{ page, limit }` in query → `offset = limit * (page - 1)` → return `{ data, totalCount }`
9. **Types**: Use namespaces per layer: `{Module}ControllerNamespace`, `{Module}ServiceNamespace`, `{Module}RepositoryNamespace`
10. **DI**: Use NestJS constructor injection — use `forwardRef()` for circular dependencies

---

## Testing

```typescript
describe('PantryService', () => {
  let pantryService: PantryService;
  let pantryRepository: PantryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PantryService,
        {
          provide: PantryRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    pantryService = module.get<PantryService>(PantryService);
    pantryRepository = module.get<PantryRepository>(PantryRepository);
    jest.resetAllMocks();
  });

  it('should create a pantry', async () => {
    jest.spyOn(pantryRepository, 'create').mockResolvedValue(mockPantry);
    const result = await pantryService.create({ name: 'My Pantry' });
    expect(result).toEqual({ id: mockPantry.id, name: mockPantry.name });
  });

  it('should throw ErrorException on failure', async () => {
    jest.spyOn(pantryRepository, 'create').mockRejectedValue(new Error());
    await expect(pantryService.create({ name: 'fail' })).rejects.toThrow(
      new ErrorException(ERRORS.CREATE_ENTITY_ERROR),
    );
  });
});
```

**Test conventions**:
- Mock files in `test/mocks/` — import via `import mocks from '../../../test/mocks'`
- Use `Test.createTestingModule` with mock providers
- Use `jest.spyOn` for mocking repository/service methods
- Always test both happy path and error scenarios
- File pattern: `{module}.{layer}.unit.test.ts`

---

## Database (Prisma)

- **Schema**: `prisma/schema.prisma`
- **Client singleton**: `prisma/prisma.ts`
- **Seeds**: `prisma/seeds/` (resources, actions, profiles, users, categories, products)
- **Commands**:
  - `yarn prisma:migrate` — create migration
  - `yarn prisma:push` — push schema without migration
  - `yarn seed` — run seed scripts

### Key Prisma enums
- `PortionType`: GRAMS, UNITS, LITERS, MILLILITERS
- `ItemState`: IN_CART, REMOVED, IN_PANTRY, PURCHASED, UPDATED, EXPIRED, OUT
- `NotificationType`: PRODUCT_EXPIRES

---

## Permission System (RBAC)

Resources and actions defined in `src/common/permission/permission.enum.ts`:

```typescript
RESOURCES = { PANTRY, USER, SHOPLIST, PRODUCT, NOTIFICATION }
ACTIONS = { FIND_ALL, FIND_ONE, CREATE, UPDATE, REMOVE, ME, ADD_ITEMS, FIND_ALL_RECOMMENDED_PRODUCTS }
```

Stored in database via `profile` → `profile_actions` → `action` → `resources` tables.

---

## New Feature Checklist

- [ ] Module folder: `src/modules/{name}/`
- [ ] Files: `module.ts`, `controller.ts`, `service.ts`, `repository.ts`, `validator.ts`, `type.ts`
- [ ] Module registered in `src/app.module.ts`
- [ ] Tests: `*.unit.test.ts` for controller, service, validator
- [ ] Prisma model in `prisma/schema.prisma` (if new entity)
- [ ] Permission entries: resource + actions in seed files
- [ ] RBAC: `@Roles(RESOURCES.X, ACTIONS.Y)` on each route
- [ ] Zod validation on all inputs
- [ ] Types with namespaces per layer
- [ ] All code in English

---

## Common Mistakes

1. Creating model files inside modules — models live ONLY in `prisma/schema.prisma`
2. Instantiating `PrismaClient` directly — always import from `prisma/prisma.ts`
3. Throwing raw errors — always use `ErrorException(ERRORS.X)`
4. Missing `@Roles` decorator — every authenticated route needs RBAC
5. Forgetting to register module in `app.module.ts`
6. Using Express types — this project uses **Fastify**, import `Request` from `common/types/http.type`
7. Not using namespaces for types — follow the `{Module}{Layer}Namespace` convention

---

**Suggest improvements** respecting KISS, DRY, SRP, YAGNI when reviewing code.