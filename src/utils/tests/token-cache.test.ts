import { anonymousTokenCache } from '../token-cache';

const token = 'sadfkj;lsadkf;saldjfdskfj';
const refreshToken = 'adfafaskldflskdajf;kjdsa;flk';
const expirationTime = 123424;

// save token
const savedRealToken = anonymousTokenCache.get();

describe('token cache', () => {
  test('set and get works right', () => {
    anonymousTokenCache.set({ token, refreshToken, expirationTime });
    const gottenToken = anonymousTokenCache.get();
    expect(gottenToken.token).toBe(token);
    expect(gottenToken.refreshToken).toBe(refreshToken);
    expect(gottenToken.expirationTime).toBe(expirationTime);
  });

  test('remove works right', () => {
    anonymousTokenCache.remove();
    const gottenToken = anonymousTokenCache.get();
    expect(gottenToken.token).toBe(undefined);
    expect(gottenToken.refreshToken).toBe(undefined);
    expect(gottenToken.expirationTime).toBe(undefined);
  });
});

// return token
if (savedRealToken.token) {
  anonymousTokenCache.set(savedRealToken);
}
