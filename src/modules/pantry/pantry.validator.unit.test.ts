import { pantryValidator } from './pantry.validator';

describe('pantryValidator', () => {
  describe('createPantry', () => {
    let pantryData;

    beforeEach(() => {
      pantryData = {
        name: 'Test Pantry',
      };
    });

    it('should successfully validate with valid date', () => {
      const result = pantryValidator.createPantry.safeParse(pantryData);
      expect(result.success).toBe(true);
    });

    it('should fail validation if pantry name is missing', () => {
      delete pantryData.name;
      const invalidData = { ...pantryData };
      const result: any = pantryValidator.createPantry.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error;
        expect(error.issues[0].path).toContain('name');
        expect(error.issues[0].message).toBe('name is required');
      }
    });

    it('should fail validation if pantry name is empty', () => {
      pantryData.name = '';
      const invalidData = { ...pantryData };
      const result: any = pantryValidator.createPantry.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error;
        expect(error.issues[0].path).toContain('name');
        expect(error.issues[0].message).toBe('name is required');
      }
    });

    it('should fail validation if pantry name is too short', () => {
      pantryData.name = 'a';
      const invalidData = { ...pantryData };
      const result: any = pantryValidator.createPantry.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error;
        expect(error.issues[0].path).toContain('name');
        expect(error.issues[0].message).toBe('name is too short');
      }
    });

    it('should fail validation if pantry name is not a string', () => {
      pantryData.name = 1;
      const invalidData = { ...pantryData };
      const result: any = pantryValidator.createPantry.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error;
        expect(error.issues[0].path).toContain('name');
        expect(error.issues[0].message).toBe('name is required');
      }
    });
  });
});
