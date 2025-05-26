JOÃO VICTOR ALVES DE LIMA SANTOS - LANDING PAGE / VIDEO | DAVID SOUZA SILVA - PROTÓTIPO / BANCO DE DADOS | WILGNER CHAGAS DE SOUZA - FRONT-END/BACK-END|

O UrbanAccess se posiciona como uma ferramenta essencial para a melhoria da infraestrutura urbana, promovendo maior transparência e eficiência na resolução de problemas relatados pela população, com um foco especial em garantir a acessibilidade para pessoas com mobilidade reduzida.

link para landing page: https://joaocode93.github.io/Landing-Page/


# UrbanAcess App

UrbanAcess é um aplicativo móvel para registrar e visualizar ocorrências relacionadas à acessibilidade urbana.

## Estrutura do Projeto

O projeto é dividido em duas partes principais:

1.  **Frontend:** Aplicativo móvel desenvolvido com React Native e Expo (localizado na pasta raiz `urbanacess-app` após descompactar).
2.  **Backend:** API RESTful desenvolvida com ASP.NET Core (localizada na subpasta `UrbanAccess.API`).

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

*   **Node.js e npm/yarn:** Para gerenciar as dependências e executar o frontend Expo. ([https://nodejs.org/](https://nodejs.org/))
*   **Expo Go App:** No seu dispositivo móvel (Android/iOS) para testar o aplicativo. ([https://expo.dev/go](https://expo.dev/go))
*   **Expo CLI:** (Opcional, mas recomendado) `npm install -g expo-cli`
*   **.NET SDK:** (Versão 6.0 ou superior) Para construir e executar o backend. ([https://dotnet.microsoft.com/download](https://dotnet.microsoft.com/download))
*   **SQL Server:** (ou SQL Server Express/Developer Edition) Como banco de dados para a API. ([https://www.microsoft.com/sql-server/sql-server-downloads](https://www.microsoft.com/sql-server/sql-server-downloads))
*   **Git:** Para clonar o repositório.

## Instruções de Instalação e Execução

1.  **Clonar o Repositório:**

    ```bash
    git clone <https://github.com/Will082/urbanacess-app.git>
    cd <NOME_DA_PASTA_DO_PROJETO> # Ex: cd urbanacess-app
    ```

2.  **Configurar e Executar o Backend (API):**

    *   Navegue até o diretório da API:
        ```bash
        cd UrbanAccess.API
        ```
    *   **Restaurar Dependências:**
        ```bash
        dotnet restore
        ```
    *   **Configurar a String de Conexão:**
        *   Abra o arquivo `appsettings.json` (ou `appsettings.Development.json`).
        *   Localize a seção `ConnectionStrings`.
        *   Atualize o valor de `DefaultConnection` com a string de conexão correta para o seu servidor SQL Server.
            *Exemplo:* `"Server=localhost\SQLEXPRESS;Database=UrbanAccessDB;Trusted_Connection=True;MultipleActiveResultSets=true"`
    *   **Aplicar Migrations (se houver e for necessário):**
        *   O `DbInitializer.Initialize(context)` no `Program.cs` tenta criar o banco (`EnsureCreated`) e popular dados iniciais em ambiente de desenvolvimento. Se você precisar de migrations mais complexas:
        ```bash
        # Instalar ferramenta de migrations (se ainda não tiver)
        # dotnet tool install --global dotnet-ef
        dotnet ef database update
        ```
    *   **Executar a API:**
        ```bash
        dotnet run
        ```
        *   A API estará rodando (por padrão, em `https://localhost:xxxx` e `http://localhost:yyyy`, verifique a saída do console).
        *   Anote a URL base da sua API local (ex: `https://localhost:7123` ou `http://localhost:5123`).

3.  **Configurar e Executar o Frontend (Aplicativo Expo):**

    *   Navegue de volta para a pasta raiz do frontend (se necessário):
        ```bash
        # Se você estava em UrbanAccess.API
        cd ..
        ```
    *   **Instalar Dependências:**
        ```bash
        npm install
        # ou
        # yarn install
        ```
    *   **Configurar a URL da API:**
        *   Abra o arquivo `src/services/api.js`.
        *   Localize a constante `API_URL`.
        *   **Importante:** Altere o valor da URL mockada (`https://urbanaccess-api.example.com/api`) para a URL base da sua API backend local que você anotou no passo anterior (incluindo `/api`).
            *Exemplo:* `const API_URL = 'https://localhost:7123/api';`
            *(Certifique-se de usar `http` ou `https` conforme a configuração do seu backend e, em caso de `https` com certificado autoassinado em desenvolvimento, pode ser necessário configurar o emulador/dispositivo ou o Axios para aceitá-lo).* 
            *Para desenvolvimento Android com emulador, use o IP da sua máquina ou `http://10.0.2.2:porta` em vez de `localhost`.*
    *   **Executar o Aplicativo:**
        ```bash
        npx expo start --dev-client
        # ou
        # yarn start
        ```
        *   Isso iniciará o Metro Bundler.
        *   Abra o aplicativo Expo Go no seu dispositivo móvel.
        *   Escaneie o QR Code exibido no terminal ou na página web do Metro Bundler.
        *   Alternativamente, você pode tentar rodar diretamente em um emulador/simulador conectado:
            ```bash
            npx expo run:android
            # ou
            npx expo run:ios
            ```

## Observações

*   O backend é configurado para inicializar e popular o banco de dados (`DbInitializer`) apenas quando executado em ambiente de desenvolvimento (`app.Environment.IsDevelopment()`).
*   Certifique-se de que o servidor SQL Server esteja em execução antes de iniciar a API.
*   A comunicação entre o aplicativo móvel (rodando no dispositivo/emulador) e a API (rodando no seu computador) pode exigir configurações de rede específicas, especialmente ao usar `localhost`. Considere usar o IP da sua máquina na rede local ou ferramentas como ngrok para expor sua API localmente se encontrar problemas de conexão.

