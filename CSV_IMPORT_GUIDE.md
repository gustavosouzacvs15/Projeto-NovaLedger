# 📥 Importação de CSV - Guia de Uso

## Sobre
A funcionalidade de importação de CSV permite que você importe múltiplas transações de uma vez usando um arquivo de planilha no formato CSV (Comma Separated Values).

## Como Usar

1. **Clicar no botão "📥 Importar CSV"** localizado na seção de Transações
2. **Selecione um arquivo CSV** do seu computador
3. **Aguarde o processamento** - o sistema validará todas as linhas
4. **Veja os resultados** - será exibido quantas transações foram importadas e se houve erros

## Formato do CSV

O arquivo CSV deve usar **ponto e vírgula (;)** como separador de campos.

### Estrutura esperada:
```
Descrição;Categoria;Valor;Data;Observações
```

### Campos obrigatórios:
- **Descrição**: Texto descritivo da transação (obrigatório)
- **Categoria**: Uma de: `Receita`, `Despesa` ou `Investimento` (obrigatório)
- **Valor**: Número (pode usar ponto ou vírgula como decimal) (obrigatório)
- **Data**: No formato `YYYY-MM-DD` ou `DD/MM/YYYY` (obrigatório)
- **Observações**: Anotações adicionais (opcional)

## Exemplos de CSV

### Exemplo 1 - Formato com datas brasileiras:
```
Descrição;Categoria;Valor;Data;Observações
Consultoria;Receita;5000;22/05/2026;Projeto novo
Aluguel;Despesa;-3500;20/05/2026;Maio 2026
Aplicação;Investimento;-10000;21/05/2026;CDB
```

### Exemplo 2 - Formato com datas ISO:
```
Descrição;Categoria;Valor;Data;Observações
Salário;Receita;8000;2026-05-01;Mês maio
Internet;Despesa;-150;2026-05-05;Mensal
```

## Validações

O sistema realiza as seguintes validações:

✅ **Descrição obrigatória** - Cada transação deve ter uma descrição
✅ **Categoria válida** - Deve ser Receita, Despesa ou Investimento
✅ **Valor válido** - Deve ser um número válido
✅ **Data válida** - Deve estar em YYYY-MM-DD ou DD/MM/YYYY
✅ **Mínimo de campos** - Cada linha deve ter pelo menos 4 campos

## Tratamento de Erros

Se ocorrerem erros durante a importação:
- As transações válidas serão importadas
- Os erros serão listados com o número da linha
- Máximo 5 erros são exibidos no alertar
- Você pode revisar o arquivo e tentar novamente

## Dicas

💡 **Exportar e depois importar**: Use o botão "Exportar CSV" para gerar um arquivo no formato correto. Depois edite-o em qualquer editor de planilhas (Excel, Google Sheets, etc) e importe novamente.

💡 **Valores negativos**: Para despesas e investimentos, use valores negativos (ex: -3500)

💡 **Observações opcionais**: O campo de observações pode ser deixado em branco

💡 **Bulk imports**: Importe dezenas ou centenas de transações de uma vez

## Arquivo de Exemplo

Um arquivo de exemplo chamado `exemplo_importacao.csv` está incluído neste projeto.

