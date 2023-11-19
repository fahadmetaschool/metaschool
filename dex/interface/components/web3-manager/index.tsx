import { createContext, FC, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { useReadLocalStorage } from 'usehooks-ts';

import { AccountData } from '@/components/zk-login/zk-login.types';
import {
  clearSetupData,
  completeZkLogin,
  loadAccount,
} from '@/components/zk-login/zk-login.utils';
import { useSuiClient } from '@/hooks';
import { LocalTokenMetadataRecord } from '@/interface';
import { makeSWRKey, noop } from '@/utils';

import { Web3ManagerProps, Web3ManagerState } from './web3-manager.types';
import { getAllCoins, parseCoins } from './web3-manager.utils';

const CONTEXT_DEFAULT_STATE = {
  account: null,
  address: null,
  coins: [],
  coinsMap: {},
  connected: false,
  error: false,
  mutate: noop,
  isFetchingCoinBalances: false,
  setAccount: noop,
};

export const Web3ManagerContext = createContext<Web3ManagerState>(
  CONTEXT_DEFAULT_STATE
);

const Web3Manager: FC<Web3ManagerProps> = ({ children }) => {
  const suiClient = useSuiClient();
  const [account, setAccount] = useState<AccountData | null>(null);

  const { data, error, mutate, isLoading } = useSWR(
    makeSWRKey([account?.userAddr], suiClient.getAllCoins.name),
    async () => {
      if (!account?.userAddr) return;
      return getAllCoins({ suiClient, account: account.userAddr });
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      refreshWhenHidden: false,
      refreshInterval: 10000,
    }
  );

  const { data: suiSystemData } = useSWR(
    makeSWRKey([account?.userAddr], suiClient.getLatestSuiSystemState.name),
    async () => {
      if (!account?.userAddr) return null;
      return suiClient.getLatestSuiSystemState();
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      refreshWhenHidden: false,
      refreshInterval: 10000,
    }
  );

  const tokensMetadataRecord = useReadLocalStorage<LocalTokenMetadataRecord>(
    `metaschool-tokens-metadata`
  );

  const [coins, coinsMap] = useMemo(
    () => parseCoins({ data, localTokens: tokensMetadataRecord ?? {} }),
    [data, tokensMetadataRecord, account?.userAddr, isLoading]
  );

  useEffect(() => {
    if (
      account?.maxEpoch &&
      suiSystemData?.epoch &&
      +suiSystemData.epoch > account.maxEpoch
    ) {
      clearSetupData();
    }
  }, [suiSystemData?.epoch, account?.userAddr]);

  useEffect(() => {
    (async () => {
      await completeZkLogin();
      setAccount(loadAccount());
    })()
      .catch(console.warn)
      .finally(() => mutate().catch(console.warn));
  }, []);

  return (
    <Web3ManagerContext.Provider
      value={{
        address: account?.userAddr || null,
        account: account || null,
        error: !!error,
        connected: !!account,
        coins,
        coinsMap,
        mutate,
        isFetchingCoinBalances: isLoading,
        setAccount,
      }}
    >
      {children}
    </Web3ManagerContext.Provider>
  );
};

export default Web3Manager;
