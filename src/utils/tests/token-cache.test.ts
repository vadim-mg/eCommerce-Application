import { anonymousTokenCache } from '../token-cache';

const token = 'sadfkj;lsadkf;saldjfdskfj';
const refreshToken = 'adfafaskldflskdajf;kjdsa;flk';
const expirationTime = 123424;

// save token
const savedRealToken = anonymousTokenCache.get();

describe('token cache', () => {
  test('set and get works right', () => {
    anonymousTokenCache.set({ token, refreshToken, expirationTime });
    const gettedToken = anonymousTokenCache.get();
    expect(gettedToken.token).toBe(token);
    expect(gettedToken.refreshToken).toBe(refreshToken);
    expect(gettedToken.expirationTime).toBe(expirationTime);
  });

  test('remove works right', () => {
    anonymousTokenCache.remove();
    const gettedToken = anonymousTokenCache.get();
    expect(gettedToken.token).toBe(undefined);
    expect(gettedToken.refreshToken).toBe(undefined);
    expect(gettedToken.expirationTime).toBe(undefined);
  });
});

// return token
if (savedRealToken.token) {
  anonymousTokenCache.set(savedRealToken);
}
