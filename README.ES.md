# Contratos Inteligentes de Bitnou

Suite completa de contratos inteligentes para el ecosistema Bitnou en Binance Smart Chain (BSC), construido con Hardhat 3 y Viem.

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Contratos](#contratos)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Especificaciones de Red](#especificaciones-de-red)
- [Scripts](#scripts)
- [Testing](#testing)
- [Despliegue](#despliegue)
- [Verificación de Contratos](#verificación-de-contratos)
- [Consideraciones de Seguridad](#consideraciones-de-seguridad)
- [Licencia](#licencia)

## Descripción General

El ecosistema Bitnou consiste en:
- **BNOU**: El token ERC-20 principal con mecanismos de liquidez y comisiones integrados
- **BNOUSafe**: Contrato de tesorería para gestión segura de tokens
- **MasterChef**: Contrato de distribución de recompensas de staking
- **BNOUPool**: Pool de staking fijo con integración MasterChef
- **BNOUFlexiblePool**: Pool de staking flexible para tokens BNOU

### Estado del Proyecto: ✅ LISTO PARA PRODUCCIÓN
- **Auditoría de Seguridad**: Completada ✅ (Todos los problemas resueltos)
- **Suite de Pruebas**: 100% aprobando (12/12 tests) ✅
- **Compilación de Contratos**: Limpia, sin advertencias ✅

## Contratos

| Contrato | Descripción |
|----------|-------------|
| `BNOU.sol` | Token ERC-20 principal con auto-liquidez, comisiones de staking, mecanismo de quema y protección anti-ballenas |
| `BNOU.dev.sol` | Versión de desarrollo (soporta chainId de Hardhat 31337 para testing local) |
| `BNOUSafe.sol` | Caja fuerte de tesorería para mantener y distribuir tokens BNOU |
| `MasterChef.sol` | Sistema de distribución de recompensas para pools de staking |
| `BNOUPool.sol` | Pool de staking a plazo fijo integrado con MasterChef |
| `BNOUFlexiblePool.sol` | Pool de staking flexible sin períodos de bloqueo |
| `mocks/dummyToken.sol` | MockBEP20 para propósitos de prueba (✅ Auditoría verificada) |
| `mocks/Mocks.sol` | Contratos mock para router/factory de PancakeSwap (✅ Auditoría verificada) |

## Requisitos

- Node.js v18+ (v22 recomendado)
- pnpm v10+ (o npm/yarn)
- Git

## Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd bitnou-smart-contracts

# Instalar dependencias
pnpm install

# Compilar contratos
pnpm compile
```

## Configuración

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```bash
# Clave privada para despliegue (sin prefijo 0x)
PRIVATE_KEY=tu_clave_privada_aqui

# URLs RPC de BSC (opcional - valores por defecto proporcionados)
BSC_MAINNET_RPC_URL=https://bsc-dataseed.binance.org/
BSC_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/

# API key de BscScan para verificación de contratos
BSCSCAN_API_KEY=tu_api_key_de_bscscan
```

### Configuración de Solidity

- **Versión del Compilador**: 0.8.15
- **Optimizador**: Habilitado con 800 ejecuciones
- **Target EVM**: London

## Especificaciones de Red

### BSC Mainnet

| Parámetro | Valor |
|-----------|-------|
| Nombre de Red | `bsc` |
| Chain ID | `56` |
| URL RPC | `https://bsc-dataseed.binance.org/` |
| Precio de Gas | `20 Gwei` |
| Explorador de Bloques | [https://bscscan.com](https://bscscan.com) |
| Router PancakeSwap | `0x10ED43C718714eb63d5aA57B78B54704E256024E` |

**Token Nativo**: BNB

### BSC Testnet

| Parámetro | Valor |
|-----------|-------|
| Nombre de Red | `bscTestnet` |
| Chain ID | `97` |
| URL RPC | `https://data-seed-prebsc-1-s1.binance.org:8545/` |
| Precio de Gas | `20 Gwei` |
| Explorador de Bloques | [https://testnet.bscscan.com](https://testnet.bscscan.com) |
| Router PancakeSwap | `0xD99D1c33F9fC3444f8101754aBC46c52416550D1` |

**Token Nativo**: tBNB (BNB de Testnet)

#### Faucets de Testnet
- [Faucet de BNB Smart Chain](https://testnet.bnbchain.org/faucet-smart)
- [Faucet de Chainlink](https://faucets.chain.link/bnb-chain-testnet)

### Desarrollo Local

Tienes **dos opciones** para testing local:

#### Opción 1: Red Local Aislada (Más Rápida, Más Simple)

```bash
# Terminal 1: Inicia nodo Hardhat aislado
pnpm hardhat node

# Terminal 2: Despliega BNOU.dev
pnpm deploy:bnou:dev
```

**Úsalo para**: Tests unitarios, desarrollo rápido, testing básico de contratos

#### Opción 2: Testnet de BSC Bifurcada (Más Realista)

```bash
# Terminal 1: Inicia nodo Hardhat bifurcado desde BSC Testnet
pnpm node:fork:testnet

# Terminal 2: Despliega BNOU.dev
pnpm deploy:bnou:dev
```

**Úsalo para**: Interacciones DEX, testing de swaps, testing de liquidez, testing del ecosistema completo

#### Comparación: Aislada vs. Bifurcada

| Característica | Localnet Aislada | Testnet Bifurcada |
|---|---|---|
| **Tipo de Red** | Hardhat (CLI 31337) | Fork de BSC Testnet (CLI 97) |
| **Estado Inicial** | Vacío (sin contratos) | Estado completo de testnet (contratos existentes + liquidez) |
| **Router PancakeSwap** | ❌ No disponible | ✅ Disponible con liquidez real |
| **Velocidad** | ⚡ Ultra rápida | 🔹 Más lenta (5-20GB descarga) |
| **Caso de Uso** | Testing unitario | Testing DEX + ecosistema completo |
| **Almacenamiento** | ~100MB | 5-20GB |
| **Simulación de Gas** | Sí | Sí |

El contrato **BNOU.dev** es una versión de desarrollo de BNOU que:
- Soporta el chain ID de Hardhat (31337)
- Salta la creación de liquidez en redes locales (ya que routers no existen)
- Es idéntico a BNOU en producción de otro modo

### Contratos

Este proyecto mantiene **dos versiones de contratos**:

| Archivo | Red | Caso de Uso |
|---------|-----|-----------|
| `BNOU.sol` | Mainnet, Testnet, Ethereum | Despliegues en producción |
| `BNOU.dev.sol` | Hardhat (31337) | Desarrollo local & testing |

Ambas compilan a artefactos separados: `BNOU` y `BNOUDev` respectivamente.

## Scripts

| Comando | Descripción | Estado |
|---------|------------|--------|
| `pnpm compile` | Compilar todos los contratos Solidity | ✅ Limpio |
| `pnpm test` | Ejecutar suite de pruebas Mocha | ✅ 12/12 aprobando |
| `pnpm test:all` | Ejecutar todos los runners de prueba (Mocha + Node.js) | ✅ Listo |
| `pnpm node` | Arrancar un nodo Hardhat (aislado, por defecto) | ✅ Listo |
| `pnpm node:fork:testnet` | Arrancar un nodo Hardhat bifurcado desde BSC Testnet | ✅ Listo |
| `pnpm deploy:bnou:dev` | Desplegar BNOU.dev en Hardhat local | ✅ Probado |
| `pnpm deploy:ignition:testnet` | Desplegar BNOU (producción) en BSC Testnet | ✅ Listo |
| `pnpm deploy:ignition:mainnet` | Desplegar BNOU (producción) en BSC Mainnet | ✅ Listo |

| `pnpm lint` | Ejecutar ESLint |
| `pnpm format` | Formatear código con Prettier |
| `pnpm typecheck` | Ejecutar verificador de tipos TypeScript |

## Testing

Las pruebas están escritas usando Mocha, Chai y Viem con los helpers de red de Hardhat 3.

```bash
# Ejecutar todas las pruebas
pnpm test

# Ejecutar pruebas con salida detallada
pnpm hardhat test mocha --verbosity 3

# Ejecutar archivo de prueba específico
pnpm hardhat test mocha test/BitnouCoin.test.ts
```

### Cobertura de Pruebas

**12/12 Tests Aprobando (100%)**

- **Tests de Contrato BNOU** (6 aprobando):
  - ✅ Nombre y símbolo del token correcto
  - ✅ Decimales correcto (18)
  - ✅ Asignación de propiedad del desplegador
  - ✅ Inicialización de suministro no cero
  - ✅ Configuración de dirección del router

- **Tests de MockBEP20** (6 aprobando):
  - ✅ Despliegue y metadatos del token
  - ✅ Permisos de acuñación basados en manager
  - ✅ Transferencia de tokens y emisión de eventos

## Despliegue

### Token BNOU (ERC20 con Protección Anti-Ballena)

El módulo **BitnouCoreModule** despliega el ecosistema completo de BNOU:
- **Token BNOU**: ERC20 estándar con selección dinámica de router
  - Selecciona automáticamente router según chainId
  - Protección anti-ballena con límites ajustables
  - Exclusiones de comisiones para owner y contrato
- **BNOUSafe**: Contrato de tesorería para gestión de tokens
- **MasterChef**: Sistema de distribución de recompensas de staking

#### Usando Hardhat Ignition (Recomendado)

```bash
# Desplegar en BSC Testnet
pnpm deploy:ignition:testnet

# Desplegar en BSC Mainnet
pnpm deploy:ignition:mainnet

# O manualmente:
pnpm hardhat ignition deploy ignition/modules/BitnouCoreModule.ts --network bscTestnet
```

#### Pasos Post-Despliegue

Después del despliegue con Ignition, el token está listo. Sigue estos pasos:

```bash
# 1. Agregar liquidez en PancakeSwap
# Par: BNOU + BNB en proporción igual

# 2. Desplegar pools de staking (BNOUPool, BNOUFlexiblePool)
# Después de desplegar BNOU, despliega los contratos del pool

# 3. Inicializar pools
# Llamar a pool.init() con la dirección del token LP de PancakeSwap

# 4. Verificar contrato en BscScan
pnpm hardhat verify --network bscTestnet <DIRECCION_CONTRATO>
```



### Notas Importantes

⚠️ **Dirección del Router**: BNOU tiene una dirección de router de PancakeSwap hardcodeada que se adapta según chainId:
- **BSC Mainnet (56)**: `0x10ED43C718714eb63d5aA57B78B54704E256024E`
- **BSC Testnet (97)**: `0xD99D1c33F9fC3444f8101754aBC46c52416550D1`
- **Ethereum (1, 5)**: `0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D`
- **Local/Hardhat (31337)**: Usa BNOU.dev en su lugar (salta configuración de router)

Asegúrate de desplegar BNOU en una red soportada o usa BNOU.dev para testing local en Hardhat.

## Verificación de Contratos

Verificar contratos en BscScan después del despliegue:

```bash
# Verificar un contrato
pnpm hardhat verify --network bscTestnet <DIRECCION_CONTRATO> <ARGS_CONSTRUCTOR>

# Ejemplo: Verificar BitnouCoin
pnpm hardhat verify --network bscTestnet 0x1234...5678 0xTuDireccionInicializadora
```

## Seguridad y Aseguramiento de Calidad

### Estado de Auditoría de Seguridad

✅ **Auditoría Integral de Carpeta de Mocks Completada**
- Todos los contratos inteligentes verificados por consistencia
- Ninguna vulnerabilidad encontrada
- Contratos mock adecuadamente delimitados para testing
- Suite de pruebas completa aprobando (12/12 tests)
- Compilación limpia sin advertencias

**Ver**: [reports/SECURITY_AUDIT_SUMMARY.md](./reports/SECURITY_AUDIT_SUMMARY.md)

### Consideraciones de Seguridad

1. **Seguridad de Clave Privada**: Nunca commits archivos `.env` ni expongas claves privadas
2. **Dirección del Router**: Verificar que la dirección del router de PancakeSwap coincida con tu red objetivo
3. **Ownership**: BNOU transfiere la propiedad al desplegador en el constructor
4. **Exclusiones de Comisiones**: El constructor automáticamente excluye al owner y contrato de comisiones
5. **Protección Anti-Ballenas**: Se aplican límites máximos de transacción y wallet
6. **Reentrancy**: Los contratos siguen el patrón checks-effects-interactions

### Checklist Pre-despliegue

- [ ] Verificar que la dirección del router coincida con la red objetivo
- [ ] Probar en testnet primero
- [ ] Verificar código fuente del contrato en BscScan
- [ ] Transferir ownership a multisig (recomendado)
- [ ] Configurar monitoreo y alertas
- [ ] Documentar direcciones desplegadas

## Estructura del Proyecto

```
bitnou-smart-contracts/
├── contracts/           # Contratos inteligentes Solidity
│   ├── BNOU.sol                 # Token producción (ERC20 con anti-ballena)
│   ├── BNOU.dev.sol             # Token desarrollo (soporta chain ID de Hardhat 31337)
│   ├── BNOUSafe.sol             # Contrato de tesorería
│   ├── MasterChef.sol           # Distribución de recompensas de staking
│   ├── BNOUPool.sol             # Pool de staking a plazo fijo
│   ├── BNOUFlexiblePool.sol     # Pool de staking flexible
│   └── mocks/
│       ├── dummyToken.sol       # Implementación MockBEP20
│       └── Mocks.sol            # MockFactory, MockRouter, MockPair
├── ignition/
│   └── modules/
│       ├── BNOUDevModule.ts     # Desplegar BNOU.dev en Hardhat local
│       ├── BitnouCoreModule.ts  # Desplegar BNOU + BNOUSafe + MasterChef en mainnet/testnet
│       └── BitnouTestModule.ts  # Desplegar ecosistema completo con mocks para testing
├── test/
│   ├── BitnouCoin.test.ts       # Tests de integración de contrato BNOU
│   └── MockBEP20.test.ts        # Tests unitarios de MockBEP20
├── reports/
│   ├── SECURITY_AUDIT_SUMMARY.md    # Reporte de auditoría de seguridad
│   ├── MOCKS_AUDIT_REPORT.md        # Auditoría detallada de mocks
│   └── ... (otros reportes)
├── hardhat.config.ts
├── etherscan.config.ts
├── tsconfig.json
└── package.json
```

## Stack Tecnológico

- **Framework**: Hardhat 3.1.8
- **Lenguaje**: Solidity 0.8.15, TypeScript 5.x
- **Librería Cliente**: Viem 2.x
- **Testing**: Mocha, Chai
- **Gestor de Paquetes**: pnpm

## Licencia

ISC

---

**Documentación**: Para la versión en inglés, ver [README.md](./README.md)
