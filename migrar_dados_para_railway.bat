@echo off
setlocal enabledelayedexpansion
color 0B
echo ==============================================================
echo       FERRAMENTA DE MIGRACAO DE DADOS: LOCAL -^> RAILWAY
echo ==============================================================
echo.
echo Esta ferramenta ira exportar o banco de dados PostgreSQL do seu 
echo computador e envia-lo de forma segura para o servidor Railway.
echo.

set /p LOCAL_DB="1. Qual e o nome do seu banco de dados LOCAL (ex: angolastay)? "
set /p LOCAL_USER="2. Qual e o seu usuario do banco LOCAL (ex: postgres)? "

echo.
echo 3. Agora, va ao painel do Railway, abra o servico Postgres.
echo    Va ate "Connect", copie a "Postgres Connection URL" (Public)
echo    e cole-a aqui em baixo (comeca com postgresql://...):
set /p RAILWAY_URL="URL do Railway: "

echo.
echo Verificando as ferramentas necessarias...
set PGDUMP_CMD="pg_dump"
set PSQL_CMD="psql"

where pg_dump >nul 2>nul
if %errorlevel% neq 0 (
    echo Comando nao encontrado nas Variaveis de Ambiente. A procurar na pasta padrao do Windows...
    for /d %%i in ("C:\Program Files\PostgreSQL\*") do (
        if exist "%%i\bin\pg_dump.exe" (
            set PGDUMP_CMD="%%i\bin\pg_dump.exe"
            set PSQL_CMD="%%i\bin\psql.exe"
        )
    )
)

if !PGDUMP_CMD!=="pg_dump" (
    where pg_dump >nul 2>nul
    if %errorlevel% neq 0 (
        echo [ERRO] Nao foi possivel encontrar o PostgreSQL instalado no seu computador.
        pause
        exit /b
    )
)

echo.
echo Iniciando a Extracao dos Dados Locais (digite a sua senha LOCAL se pedida)...
!PGDUMP_CMD! -U %LOCAL_USER% -h localhost -d %LOCAL_DB% -F p -f dump_local.sql --clean --if-exists
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao exportar os dados locais.
    pause
    exit /b
)

echo.
echo Extracao local concluida com sucesso!
echo Enviando os dados para o servidor Railway...
!PSQL_CMD! %RAILWAY_URL% -f dump_local.sql
if %errorlevel% neq 0 (
    echo [ERRO] Ocorreu um problema ao enviar os dados para o Railway.
    pause
    exit /b
)

echo.
echo ==============================================================
echo [SUCESSO] Os dados foram transferidos para a Cloud com sucesso!
echo ==============================================================
echo Limpando ficheiros temporarios...
del dump_local.sql
pause
