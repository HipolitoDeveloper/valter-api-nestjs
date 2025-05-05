import { userValidator } from './user.validator';

describe('UserValidator', () => {
  describe('createUser', () => {
    let validCreateUserData;

    beforeEach(() => {
      validCreateUserData = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        surname: 'Doe',
        birthday: new Date(),
        pantryName: 'SMS',
      };
    });

    it('should successfully pass the validation with valid data', () => {
      const result = userValidator.createUser.safeParse(validCreateUserData);
      expect(result.success).toBe(true);
    });

    it('should fail validation if required fields are missing', () => {
      delete validCreateUserData.email;

      const result: any =
        userValidator.createUser.safeParse(validCreateUserData);
      expect(result.success).toBe(false);

      if (!result.success) {
        const { issues } = result.error;
        expect(issues[0].path).toContain('email');
        expect(issues[0].message).toBe('Required');
      }
    });
  });

  describe('updateUser', () => {
    let validUpdateUserData;

    beforeEach(() => {
      validUpdateUserData = {
        id: 'id',
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        surname: 'Doe',
        birthday: new Date(),
        pantryName: 'SMS',
      };
    });

    it('should successfully pass the validation with valid data', () => {
      const result = userValidator.updateUser.safeParse(validUpdateUserData);
      expect(result.success).toBe(true);
    });

  });
});
