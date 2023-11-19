import { FC } from 'react';

import { SVGProps } from '@/components/svg/svg.types';
import { ETHSVG, UnknownCoinSVG, USDCSVG } from '@/svg';

export const MAX_NUMBER_INPUT_VALUE = 9000000000000000;

export enum Network {
  DEVNET = 'sui:devnet',
  TESTNET = 'sui:testnet',
  MAINNET = 'sui:mainnet',
}
export const DEX_STORAGE_ID =
  '0x6912d83e2c4868386511fe3f6f18aff9399b9ad5cae2d97943766e2ff160ab25';
export const METASCHOOL_SET_UP_KEY = 'metaschool-dex-demo.setup';
export const METASCHOOL_ACCOUNT_KEY = 'metaschool-dex-demo.accounts';

export const MAX_EPOCH = 2; // keep ephemeral keys active for this many Sui epochs from now (1 epoch ~= 24h)

export const EXPLORER_URL = {
  [Network.MAINNET]: 'https://suivision.xyz',
  [Network.TESTNET]: 'https://testnet.suivision.xyz',
  [Network.DEVNET]: '',
};

export const PACKAGE_ID =
  '0xa1dce324bcf781692a358adb27bd105844231d35863b5c99f94e54801d653788';

export const ETH_TYPE = `${PACKAGE_ID}::eth::ETH`;
export const USDC_TYPE = `${PACKAGE_ID}::usdc::USDC`;

export const DEX_COIN_TYPE = `${PACKAGE_ID}::dex::DEX`;

export const TOKENS_SVG_MAP_V2 = {
  default: UnknownCoinSVG,
  [ETH_TYPE]: ETHSVG,
  [USDC_TYPE]: USDCSVG,
} as Record<string, FC<SVGProps & { filled?: boolean }>>;

export const TOAST_DURATION = 10000;

export const COIN_TYPE_TO_SYMBOL = {
  [ETH_TYPE]: 'ETH',
  [USDC_TYPE]: 'USDC',
  [DEX_COIN_TYPE]: 'DEXC',
} as Record<string, string>;

export const COIN_DECIMALS = {
  [ETH_TYPE]: 9,
  [USDC_TYPE]: 9,
  [DEX_COIN_TYPE]: 9,
};
