import { userValidator } from './user.validator';

describe('UserValidator', () => {
  describe('createUser', () => {
    let validCreateUserData;

    beforeEach(() => {
      validCreateUserData = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        businessPartnersId: [1],
        contactPreference: ['SMS'],
        contacts: [
          { contact: '123456789', isWhatsapp: true },
          { contact: '987654321', isWhatsapp: false },
        ],
        groupId: 1,
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

    it('should fail validation if contacts have invalid structure', () => {
      validCreateUserData.contacts = [
        { contact: '123456789' }, // Missing `isWhatsapp` field
      ];

      const result: any =
        userValidator.createUser.safeParse(validCreateUserData);
      expect(result.success).toBe(false);

      if (!result.success) {
        const { issues } = result.error;
        expect(issues[0].path).toEqual(['contacts', 0, 'isWhatsapp']);
        expect(issues[0].message).toBe('Required');
      }
    });
  });

  describe('updateUser', () => {
    let validUpdateUserData;

    beforeEach(() => {
      validUpdateUserData = {
        id: 1,
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        businessPartnersId: [1],
        contactPreference: ['SMS'],
        contacts: [
          { id: 1, contact: '123456789', isWhatsapp: true },
          { contact: '987654321', isWhatsapp: false },
        ],
        groupId: 1,
      };
    });

    it('should successfully pass the validation with valid data', () => {
      const result = userValidator.updateUser.safeParse(validUpdateUserData);
      expect(result.success).toBe(true);
    });

    it('should fail validation if a contact is missing required fields', () => {
      validUpdateUserData.contacts = [
        { contact: '123456789' }, // Missing `isWhatsapp`
      ];

      const result: any =
        userValidator.updateUser.safeParse(validUpdateUserData);
      expect(result.success).toBe(false);

      if (!result.success) {
        const { issues } = result.error;
        expect(issues[0].path).toEqual(['contacts', 0, 'isWhatsapp']);
        expect(issues[0].message).toBe('Required');
      }
    });
  });
});
