import { pantryValidator } from './pantry.validator';

describe('pantryValidator', () => {
  describe('create', () => {
    let pantryData;

    beforeEach(() => {
      pantryData = {
        name: 'Test Pantry',
      };
    });

    it('should successfully validate with valid date', () => {
      const result = pantryValidator.create.safeParse(pantryData);
      expect(result.success).toBe(true);
    });

    it('should fail validation if pantry name is missing', () => {
      delete pantryData.name;
      const invalidData = { ...pantryData };
      const result: any = pantryValidator.create.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error;
        expect(error.issues[0].path).toContain('name');
        expect(error.issues[0].message).toBe('name is required');
      }
    });

    it('should fail validation if pantry name is empty', () => {
      pantryData.name = undefined;
      const invalidData = { ...pantryData };
      const result: any = pantryValidator.create.safeParse(invalidData);

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
      const result: any = pantryValidator.create.safeParse(invalidData);

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
      const result: any = pantryValidator.create.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error;
        expect(error.issues[0].path).toContain('name');
        expect(error.issues[0].message).toBe('name is required');
      }
    });
  });

  describe('update', () => {
    let pantryData;

    beforeEach(() => {
      pantryData = {
        id: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
        name: 'Test Pantry',
        items: [
          {
            id: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
            productId: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
            portion: 1,
            portionType: 'GRAMS',
            state: 'IN_PANTRY',
          },
        ],
      };
    });

    it('should successfully validate with valid date', () => {
      const result = pantryValidator.update.safeParse(pantryData);
      expect(result.success).toBe(true);
    });

    describe('pantry name', () => {
      it('should fail validation if pantry name is too short', () => {
        pantryData.name = 'a';
        const invalidData = { ...pantryData };
        const result: any = pantryValidator.update.safeParse(invalidData);

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
        const result: any = pantryValidator.update.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('name');
          expect(error.issues[0].message).toBe('name is required');
        }
      });
    });

  });

  describe('findOne', () => {
    let params;

    beforeEach(() => {
      params = {
        id: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
      };
    });

    it('should successfully validate with valid date', () => {
      const result = pantryValidator.findOne.safeParse(params);
      expect(result.success).toBe(true);
    });

    describe('id', () => {
      it('should fail validation if pantry id is missing', () => {
        delete params.id;
        const invalidData = { ...params };
        const result: any = pantryValidator.findOne.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('id');
          expect(error.issues[0].message).toBe('id is required');
        }
      });

      it('should fail validation if pantry id is empty', () => {
        params.id = undefined;
        const invalidData = { ...params };
        const result: any = pantryValidator.findOne.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('id');
          expect(error.issues[0].message).toBe('id is required');
        }
      });

      it('should fail validation if pantry id is not a string', () => {
        params.id = 1;
        const invalidData = { ...params };
        const result: any = pantryValidator.findOne.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('id');
          expect(error.issues[0].message).toBe('id is required');
        }
      });

      it('should fail validation if pantry id is not a valid uuid', () => {
        params.id = '12312312wsss';
        const invalidData = { ...params };
        const result: any = pantryValidator.findOne.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('id');
          expect(error.issues[0].message).toBe('id is not a valid uuid');
        }
      });
    });
  });

  describe('findAll', () => {
    let params;

    beforeEach(() => {
      params = {
        page: 1,
        limit: 10,
      };
    });

    it('should successfully validate with valid date', () => {
      const result = pantryValidator.findAll.safeParse(params);
      expect(result.success).toBe(true);
    });

    describe('page', () => {
      it('should fail validation if page is missing', () => {
        delete params.page;
        const invalidData = { ...params };
        const result: any = pantryValidator.findAll.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('page');
          expect(error.issues[0].message).toBe('page must be a number');
        }
      });

      it('should fail validation if page is empty', () => {
        params.page = undefined;
        const invalidData = { ...params };
        const result: any = pantryValidator.findAll.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('page');
          expect(error.issues[0].message).toBe('page must be a number');
        }
      });

      it('should fail validation if page has a value less than 1', () => {
        params.page = 0;
        const invalidData = { ...params };
        const result: any = pantryValidator.findAll.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('page');
          expect(error.issues[0].message).toBe('page must be ≥1');
        }
      });
    });

    describe('limit', () => {
      it('should fail validation if limit is missing', () => {
        delete params.limit;
        const invalidData = { ...params };
        const result: any = pantryValidator.findAll.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('limit');
          expect(error.issues[0].message).toBe('limit must be a number');
        }
      });

      it('should fail validation if limit is empty', () => {
        params.limit = undefined;
        const invalidData = { ...params };
        const result: any = pantryValidator.findAll.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('limit');
          expect(error.issues[0].message).toBe('limit must be a number');
        }
      });

      it('should fail validation if limit has a value less than 0', () => {
        params.limit = -1;
        const invalidData = { ...params };
        const result: any = pantryValidator.findAll.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('limit');
          expect(error.issues[0].message).toBe('limit must be ≥0');
        }
      });
    });
  });
});
