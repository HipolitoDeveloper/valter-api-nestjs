import { shoplistValidator } from './shoplist.validator';

describe('ShoplistValidator', () => {
  describe('create', () => {
    let shoplistData;

    beforeEach(() => {
      shoplistData = {
        name: 'Test shoplist',
        pantryId: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
      };
    });

    it('should successfully validate with valid date', () => {
      const result = shoplistValidator.create.safeParse(shoplistData);
      expect(result.success).toBe(true);
    });

    it('should fail validation if shoplist name is missing', () => {
      delete shoplistData.name;
      const invalidData = { ...shoplistData };
      const result: any = shoplistValidator.create.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error;
        expect(error.issues[0].path).toContain('name');
        expect(error.issues[0].message).toBe('name is required');
      }
    });

    it('should fail validation if shoplist name is empty', () => {
      shoplistData.name = undefined;
      const invalidData = { ...shoplistData };
      const result: any = shoplistValidator.create.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error;
        expect(error.issues[0].path).toContain('name');
        expect(error.issues[0].message).toBe('name is required');
      }
    });

    it('should fail validation if shoplist name is too short', () => {
      shoplistData.name = 'a';
      const invalidData = { ...shoplistData };
      const result: any = shoplistValidator.create.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error;
        expect(error.issues[0].path).toContain('name');
        expect(error.issues[0].message).toBe('name is too short');
      }
    });

    it('should fail validation if shoplist name is not a string', () => {
      shoplistData.name = 1;
      const invalidData = { ...shoplistData };
      const result: any = shoplistValidator.create.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error;
        expect(error.issues[0].path).toContain('name');
        expect(error.issues[0].message).toBe('name is required');
      }
    });
  });

  describe('update', () => {
    let shoplistData;

    beforeEach(() => {
      shoplistData = {
        id: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
        name: 'Test shoplist',
      };
    });

    it('should successfully validate with valid date', () => {
      const result = shoplistValidator.update.safeParse(shoplistData);
      expect(result.success).toBe(true);
    });

    describe('shoplist name', () => {
      it('should fail validation if shoplist name is missing', () => {
        delete shoplistData.name;
        const invalidData = { ...shoplistData };
        const result: any = shoplistValidator.update.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('name');
          expect(error.issues[0].message).toBe('name is required');
        }
      });

      it('should fail validation if shoplist name is empty', () => {
        shoplistData.name = undefined;
        const invalidData = { ...shoplistData };
        const result: any = shoplistValidator.update.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('name');
          expect(error.issues[0].message).toBe('name is required');
        }
      });

      it('should fail validation if shoplist name is too short', () => {
        shoplistData.name = 'a';
        const invalidData = { ...shoplistData };
        const result: any = shoplistValidator.update.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('name');
          expect(error.issues[0].message).toBe('name is too short');
        }
      });

      it('should fail validation if shoplist name is not a string', () => {
        shoplistData.name = 1;
        const invalidData = { ...shoplistData };
        const result: any = shoplistValidator.update.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('name');
          expect(error.issues[0].message).toBe('name is required');
        }
      });
    });

    describe('shoplist id', () => {
      it('should fail validation if shoplist id is missing', () => {
        delete shoplistData.id;
        const invalidData = { ...shoplistData };
        const result: any = shoplistValidator.update.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('id');
          expect(error.issues[0].message).toBe('id is required');
        }
      });

      it('should fail validation if shoplist id is empty', () => {
        shoplistData.id = undefined;
        const invalidData = { ...shoplistData };
        const result: any = shoplistValidator.update.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('id');
          expect(error.issues[0].message).toBe('id is required');
        }
      });

      it('should fail validation if shoplist id is not a string', () => {
        shoplistData.id = 1;
        const invalidData = { ...shoplistData };
        const result: any = shoplistValidator.update.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('id');
          expect(error.issues[0].message).toBe('id is required');
        }
      });

      it('should fail validation if shoplist id is not a valid uuid', () => {
        shoplistData.id = '12312312wsss';
        const invalidData = { ...shoplistData };
        const result: any = shoplistValidator.update.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('id');
          expect(error.issues[0].message).toBe('id is not a valid uuid');
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
      const result = shoplistValidator.findOne.safeParse(params);
      expect(result.success).toBe(true);
    });

    describe('id', () => {
      it('should fail validation if shoplist id is missing', () => {
        delete params.id;
        const invalidData = { ...params };
        const result: any = shoplistValidator.findOne.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('id');
          expect(error.issues[0].message).toBe('id is required');
        }
      });

      it('should fail validation if shoplist id is empty', () => {
        params.id = undefined;
        const invalidData = { ...params };
        const result: any = shoplistValidator.findOne.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('id');
          expect(error.issues[0].message).toBe('id is required');
        }
      });

      it('should fail validation if shoplist id is not a string', () => {
        params.id = 1;
        const invalidData = { ...params };
        const result: any = shoplistValidator.findOne.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('id');
          expect(error.issues[0].message).toBe('id is required');
        }
      });

      it('should fail validation if shoplist id is not a valid uuid', () => {
        params.id = '12312312wsss';
        const invalidData = { ...params };
        const result: any = shoplistValidator.findOne.safeParse(invalidData);

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
      const result = shoplistValidator.findAll.safeParse(params);
      expect(result.success).toBe(true);
    });

    describe('page', () => {
      it('should fail validation if page is missing', () => {
        delete params.page;
        const invalidData = { ...params };
        const result: any = shoplistValidator.findAll.safeParse(invalidData);

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
        const result: any = shoplistValidator.findAll.safeParse(invalidData);

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
        const result: any = shoplistValidator.findAll.safeParse(invalidData);

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
        const result: any = shoplistValidator.findAll.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('limit');
          expect(error.issues[0].message).toBe('limit is required');
        }
      });

      it('should fail validation if limit is empty', () => {
        params.limit = undefined;
        const invalidData = { ...params };
        const result: any = shoplistValidator.findAll.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('limit');
          expect(error.issues[0].message).toBe('limit is required');
        }
      });

      it('should fail validation if limit is not a number', () => {
        params.limit = '1';
        const invalidData = { ...params };
        const result: any = shoplistValidator.findAll.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('limit');
          expect(error.issues[0].message).toBe('limit is required');
        }
      });

      it('should fail validation if limit has a value less than 0', () => {
        params.limit = -1;
        const invalidData = { ...params };
        const result: any = shoplistValidator.findAll.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('limit');
          expect(error.issues[0].message).toBe(
            'limit must be greater than or equal to 0',
          );
        }
      });
    });
  });
});
