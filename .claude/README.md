# Claude Code - Valter API

## Como usar o contexto base

Este projeto possui um contexto customizado que define padroes, arquitetura e convencoes do Valter API.

### Opcao 1: Comando slash (Recomendado)

Digite `/project` no inicio de qualquer conversa para carregar automaticamente todas as instrucoes do projeto.
```
/project

Agora crie um novo modulo para gerenciar categorias
```

### Opcao 2: Referencia manual

Voce tambem pode referenciar o arquivo diretamente:

```
Leia .claude/commands/project.md e use essas instrucoes para criar um novo modulo
```

## Estrutura

```
.claude/
├── README.md              ← Este arquivo
└── commands/
    ├── project.md         ← Instrucoes base do projeto (arquitetura, padroes, convencoes)
    └── create_pr.md       ← Instrucoes para criacao de PRs
```

## O que o contexto inclui

- Padrao de resposta obrigatorio (planejamento antes do codigo)
- Tech stack (NestJS, Fastify, Prisma, Zod, JWT)
- Arquitetura do projeto (modules, common, helper)
- Padroes de codigo (Controller, Service, Repository, Validator, Types)
- Regras criticas (ErrorException, RBAC, Prisma singleton, transactions)
- Padroes de teste (Jest, NestJS TestingModule, mocks)
- Checklist para novas features
- Sistema de permissoes (RBAC)

## Dica

Para melhores resultados, sempre inicie suas conversas com `/project` para garantir que o Claude Code entenda os padroes do projeto.