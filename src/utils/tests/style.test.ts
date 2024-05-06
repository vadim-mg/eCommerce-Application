import classes from '@Src/styles/style.module.scss';

describe('chcke module css', () => {
  test('classes.red === "red"', () => {
    expect(classes.red).toBe('red');
  });
});
