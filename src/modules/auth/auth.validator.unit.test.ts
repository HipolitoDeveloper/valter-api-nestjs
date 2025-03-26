import { authValidator } from './auth.validator';

describe('authValidator', () => {
  describe('signIn', () => {
    let validSignInData: { email: string; password: string };

    beforeEach(() => {
      validSignInData = {
        email: 'test@example.com',
        password: 'password123',
      };
    });

    it('should successfully validate with valid data', () => {
      const result = authValidator.signIn.safeParse(validSignInData);
      expect(result.success).toBe(true);
    });

    it('should fail validation if email is missing', () => {
      delete validSignInData.email;
      const invalidData = { ...validSignInData };
      const result: any = authValidator.signIn.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error;
        expect(error.issues[0].path).toContain('email');
        expect(error.issues[0].message).toBe('email is required');
      }
    });

    it('should fail validation if email is not valid', () => {
      const invalidData = { ...validSignInData, email: 'invalid-email' };
      const result: any = authValidator.signIn.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error;
        expect(error.issues[0].path).toContain('email');
        expect(error.issues[0].message).toBe('Invalid email');
      }
    });

    it('should fail validation if password is missing', () => {
      delete validSignInData.password;
      const invalidData = { ...validSignInData };
      const result: any = authValidator.signIn.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error;
        expect(error.issues[0].path).toContain('password');
      }
    });
  });

  describe('finishRegister', () => {
    let validFinishRegisterData: { email: string; password: string };

    beforeEach(() => {
      validFinishRegisterData = {
        email: 'test@example.com',
        password: 'password123',
      };
    });

    it('should successfully validate with valid data', () => {
      const result = authValidator.finishRegister.safeParse(
        validFinishRegisterData,
      );
      expect(result.success).toBe(true);
    });

    it('should fail validation if email is missing', () => {
      delete validFinishRegisterData.email;
      const invalidData = { ...validFinishRegisterData };
      const result: any = authValidator.finishRegister.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error;
        expect(error.issues[0].path).toContain('email');
        expect(error.issues[0].message).toBe('email is required');
      }
    });

    it('should fail validation if email is not valid', () => {
      const invalidData = {
        ...validFinishRegisterData,
        email: 'invalid-email',
      };
      const result: any = authValidator.finishRegister.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error;
        expect(error.issues[0].path).toContain('email');
        expect(error.issues[0].message).toBe('Invalid email');
      }
    });

    it('should fail validation if password is missing', () => {
      delete validFinishRegisterData.password;
      const invalidData = { ...validFinishRegisterData };
      const result: any = authValidator.finishRegister.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error;
        expect(error.issues[0].path).toContain('password');
      }
    });
  });
});
