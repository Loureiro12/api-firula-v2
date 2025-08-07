#!/bin/bash

# Exemplo de uso da API de criação de usuários

API_URL="http://localhost:3000"

echo "=== Testando API de Criação de Usuários ==="
echo

# 1. Teste de criação bem-sucedida
echo "1. Criando usuário válido..."
curl -X POST "$API_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao.silva@exemplo.com",
    "password": "minhasenha123"
  }' | jq '.'

echo
echo "---"
echo

# 2. Teste de email duplicado
echo "2. Tentando criar usuário com email duplicado..."
curl -X POST "$API_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Santos",
    "email": "joao.silva@exemplo.com",
    "password": "outrasenha456"
  }' | jq '.'

echo
echo "---"
echo

# 3. Teste de validação - email inválido
echo "3. Testando validação - email inválido..."
curl -X POST "$API_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pedro Oliveira",
    "email": "email-invalido",
    "password": "senha123"
  }' | jq '.'

echo
echo "---"
echo

# 4. Teste de validação - campos obrigatórios
echo "4. Testando validação - campos faltando..."
curl -X POST "$API_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "email": "",
    "password": "12"
  }' | jq '.'

echo
echo "---"
echo

# 5. Teste de campos extras (devem ser removidos)
echo "5. Testando remoção de campos não permitidos..."
curl -X POST "$API_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana Costa",
    "email": "ana.costa@exemplo.com",
    "password": "senha789",
    "role": "admin",
    "extraField": "valor"
  }' | jq '.'

echo
echo "=== Fim dos Testes ==="
