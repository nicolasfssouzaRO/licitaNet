#!/bin/bash

# Script para executar os testes do SaaS de integração com o Compranet

# Cria diretório para relatórios de teste se não existir
mkdir -p test-reports

echo "=== Iniciando testes do SaaS de integração com o Compranet ==="
echo "Data e hora: $(date)"
echo ""

# Instala dependências necessárias para os testes
echo "Instalando dependências..."
npm install --no-save mocha chai axios

# Executa os testes unitários da API
echo ""
echo "=== Executando testes unitários da API ==="
node tests/api.test.js
API_TEST_RESULT=$?

# Executa os testes unitários da UI
echo ""
echo "=== Executando testes unitários da UI ==="
node tests/ui.test.js
UI_TEST_RESULT=$?

# Executa os testes de integração
echo ""
echo "=== Executando testes de integração ==="
node tests/integration.test.js
INTEGRATION_TEST_RESULT=$?

# Verifica os resultados
echo ""
echo "=== Resumo dos resultados ==="
echo "Testes unitários da API: $([ $API_TEST_RESULT -eq 0 ] && echo 'SUCESSO' || echo 'FALHA')"
echo "Testes unitários da UI: $([ $UI_TEST_RESULT -eq 0 ] && echo 'SUCESSO' || echo 'FALHA')"
echo "Testes de integração: $([ $INTEGRATION_TEST_RESULT -eq 0 ] && echo 'SUCESSO' || echo 'FALHA')"

# Resultado final
if [ $API_TEST_RESULT -eq 0 ] && [ $UI_TEST_RESULT -eq 0 ] && [ $INTEGRATION_TEST_RESULT -eq 0 ]; then
  echo ""
  echo "=== TODOS OS TESTES PASSARAM COM SUCESSO ==="
  exit 0
else
  echo ""
  echo "=== ALGUNS TESTES FALHARAM. VERIFIQUE OS LOGS ACIMA ==="
  exit 1
fi
