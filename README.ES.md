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
- **BitnouCoin (BNOU)**: El token BEP-20 principal con mecanismos de liquidez y comisiones integrados
- **BNOUSafe**: Contrato de tesorería para gestión segura de tokens
- **MasterChef**: Contrato de distribución de recompensas de staking
- **BNOUPool**: Pool de staking fijo con integración MasterChef
- **BNOUFlexiblePool**: Pool de staking flexible para tokens BNOU

## Contratos

| Contrato | Descripción |
|----------|-------------|
| `BitnouCoin.sol` | Token BEP-20 principal con auto-liquidez, comisiones de staking, mecanismo de quema y protección anti-ballenas |
| `BNOUSafe.sol` | Caja fuerte de tesorería para mantener y distribuir tokens BNOU |
| `MasterChef.sol` | Sistema de distribución de recompensas para pools de staking |
| `BNOUPool.sol` | Pool de staking a plazo fijo integrado con MasterChef |
| `BNOUFlexiblePool.sol` | Pool de staking flexible sin períodos de bloqueo |
| `mocks/dummyToken.sol` | MockBEP20 para propósitos de prueba |
| `mocks/Mocks.sol` | Contratos mock para router/factory de PancakeSwap (solo testing) |

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

### Desarrollo Local (Hardhat)

| Parámetro | Valor |
|-----------|-------|
| Nombre de Red | `hardhat` |
| Chain ID | `1337` |
| Tipo | `edr-simulated` |

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm compile` | Compilar todos los contratos Solidity |
| `pnpm test` | Ejecutar suite de pruebas Mocha |
| `pnpm test:all` | Ejecutar todos los runners de prueba (Mocha + Node.js) |
| `pnpm node` | Iniciar nodo local de Hardhat |

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

- **MockBEP20**: Despliegue, gestión, transferencias
- **BitnouCoin**: Metadata, configuración inicial, configuración de router

## Despliegue

### Usando Hardhat Ignition

El proyecto incluye un módulo de despliegue Ignition para el ecosistema completo:

```bash
# Desplegar en BSC Testnet
pnpm hardhat ignition deploy ignition/modules/BitnouModule.ts --network bscTestnet

# Desplegar en BSC Mainnet
pnpm hardhat ignition deploy ignition/modules/BitnouModule.ts --network bsc
```

### Orden de Despliegue Manual

1. **BitnouCoin** - Token principal (requiere router de PancakeSwap en dirección hardcodeada)
2. **BNOUSafe** - Tesorería (requiere dirección de BitnouCoin)
3. **MasterChef** - Recompensas de staking (requiere direcciones de BitnouCoin y BNOUSafe)
4. **Token de Pool** - Token LP o de staking
5. **Agregar Pool a MasterChef** - `masterChef.add(allocPoint, lpToken, isRegular, withUpdate)`
6. **BNOUPool** - Staking fijo (requiere token de pool, MasterChef e ID de pool)
7. **BNOUFlexiblePool** - Staking flexible (requiere BitnouCoin y BNOUPool)

### Notas Importantes

⚠️ **Dirección del Router**: BitnouCoin tiene una dirección de router de PancakeSwap hardcodeada:
- **Testnet**: `0xD99D1c33F9fC3444f8101754aBC46c52416550D1`
- **Mainnet**: `0x10ED43C718714eb63d5aA57B78B54704E256024E`

Asegúrate de desplegar en la red correcta que coincida con la dirección del router en el contrato.

## Verificación de Contratos

Verificar contratos en BscScan después del despliegue:

```bash
# Verificar un contrato
pnpm hardhat verify --network bscTestnet <DIRECCION_CONTRATO> <ARGS_CONSTRUCTOR>

# Ejemplo: Verificar BitnouCoin
pnpm hardhat verify --network bscTestnet 0x1234...5678 0xTuDireccionInicializadora
```

## Consideraciones de Seguridad

1. **Seguridad de Clave Privada**: Nunca commits archivos `.env` ni expongas claves privadas
2. **Dirección del Router**: Verificar que la dirección del router de PancakeSwap coincida con tu red objetivo
3. **Ownership**: BitnouCoin transfiere la propiedad al `_initializer` en el constructor
4. **Exclusiones de Comisiones**: El constructor automáticamente excluye al owner, contrato e inicializador de comisiones
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
│   ├── BitnouCoin.sol
│   ├── BNOUSafe.sol
│   ├── MasterChef.sol
│   ├── BNOUPool.sol
│   ├── BNOUFlexiblePool.sol
│   └── mocks/
│       ├── dummyToken.sol
│       └── Mocks.sol
├── ignition/
│   └── modules/
│       └── BitnouModule.ts   # Módulo de despliegue Ignition
├── scripts/
│   └── deployDummyToken.ts   # Script de despliegue
├── test/
│   ├── BitnouCoin.test.ts
│   └── MockBEP20.test.ts
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
