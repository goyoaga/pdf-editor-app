@echo off
REM ============================================================================
REM FlowPDF - Script de Configuración (Batch)
REM ============================================================================
REM Este archivo .bat inicia el script PowerShell de configuración
REM Simplemente haz doble clic para ejecutar
REM ============================================================================

setlocal enabledelayedexpansion

REM Verificar si se ejecuta como administrador
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo.
    echo ============================================================
    echo ERROR: Este script debe ejecutarse como administrador
    echo ============================================================
    echo.
    echo Solución:
    echo 1. Haz clic derecho en este archivo
    echo 2. Selecciona "Ejecutar como administrador"
    echo.
    pause
    exit /b 1
)

REM Obtener la ruta del script
set scriptPath=%~dp0setup-flowpdf.ps1

REM Verificar si el script PowerShell existe
if not exist "%scriptPath%" (
    echo.
    echo ============================================================
    echo ERROR: No se encontró setup-flowpdf.ps1
    echo ============================================================
    echo.
    echo Asegúrate de que ambos archivos están en la misma carpeta:
    echo - setup-flowpdf.bat
    echo - setup-flowpdf.ps1
    echo.
    pause
    exit /b 1
)

REM Ejecutar el script PowerShell
echo.
echo ============================================================
echo Iniciando FlowPDF Setup...
echo ============================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%scriptPath%"

if %errorLevel% equ 0 (
    echo.
    echo ============================================================
    echo Instalación completada exitosamente
    echo ============================================================
    echo.
) else (
    echo.
    echo ============================================================
    echo Instalación finalizada con errores
    echo ============================================================
    echo.
)

pause
