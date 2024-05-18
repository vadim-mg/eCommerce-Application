import {
  TokenCacheOptions,
  TokenStore,
} from '@commercetools/sdk-client-v2/dist/declarations/src/types/sdk';

enum AuthFlow {
  passFlow = 'passFlow',
  anonymFlow = 'anonymFlow',
}

class TokenCache {
  #storage;

  #tokenName;

  constructor(tokenName: AuthFlow) {
    this.#storage = localStorage;
    this.#tokenName = tokenName;
  }

  #getKey = (tokenCacheOptions?: TokenCacheOptions) => {
    const suffix = tokenCacheOptions ? JSON.stringify(tokenCacheOptions) : '';
    const key = `${this.#tokenName}_${suffix}`;
    return key;
  };

  get = (tokenCacheOptions?: TokenCacheOptions) => {
    const key = this.#getKey(tokenCacheOptions);
    // const experationTime = (JSON.parse(this.#storage.getItem(key) ?? '{}') as TokenStore).expirationTime;
    // console.log(`token ${this.#tokenName}:`);
    // console.log(JSON.parse(this.#storage.getItem(key) ?? '{}') as TokenStore);
    // console.log(`experation time ${experationTime}:`);
    // console.log(`experation time ${new Date(experationTime).toString()}:`);
    // console.log(`experation time ${new Date().toString()}:`);
    return JSON.parse(this.#storage.getItem(key) ?? '{}') as TokenStore;
  };

  set = (cache: TokenStore, tokenCacheOptions?: TokenCacheOptions) => {
    const key = this.#getKey(tokenCacheOptions);
    this.#storage.setItem(key, JSON.stringify(cache));
  };

  remove = (tokenCacheOptions?: TokenCacheOptions) => {
    const key = this.#getKey(tokenCacheOptions);
    this.#storage.removeItem(key);
  };
}

export const anonymousTokenCache = new TokenCache(AuthFlow.anonymFlow);
export const passwordTokenCache = new TokenCache(AuthFlow.passFlow);
