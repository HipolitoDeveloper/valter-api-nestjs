import { productValidator } from './product.validator';

describe('ProductValidator', () => {
  describe('create', () => {
    let productData;

    beforeEach(() => {
      productData = {
        name: 'Test product',
        pantryId: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
      };
    });

    it('should successfully validate with valid date', () => {
      const result = productValidator.create.safeParse(productData);
      expect(result.success).toBe(true);
    });

    it('should fail validation if product name is missing', () => {
      delete productData.name;
      const invalidData = { ...productData };
      const result: any = productValidator.create.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error;
        expect(error.issues[0].path).toContain('name');
        expect(error.issues[0].message).toBe('name is required');
      }
    });

    it('should fail validation if product name is empty', () => {
      productData.name = undefined;
      const invalidData = { ...productData };
      const result: any = productValidator.create.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error;
        expect(error.issues[0].path).toContain('name');
        expect(error.issues[0].message).toBe('name is required');
      }
    });

    it('should fail validation if product name is too short', () => {
      productData.name = 'a';
      const invalidData = { ...productData };
      const result: any = productValidator.create.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error;
        expect(error.issues[0].path).toContain('name');
        expect(error.issues[0].message).toBe('name is too short');
      }
    });

    it('should fail validation if product name is not a string', () => {
      productData.name = 1;
      const invalidData = { ...productData };
      const result: any = productValidator.create.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error;
        expect(error.issues[0].path).toContain('name');
        expect(error.issues[0].message).toBe('name is required');
      }
    });
  });

  describe('update', () => {
    let productData;

    beforeEach(() => {
      productData = {
        id: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
        name: 'Test product',
      };
    });

    it('should successfully validate with valid date', () => {
      const result = productValidator.update.safeParse(productData);
      expect(result.success).toBe(true);
    });

    describe('product name', () => {
      it('should fail validation if product name is missing', () => {
        delete productData.name;
        const invalidData = { ...productData };
        const result: any = productValidator.update.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('name');
          expect(error.issues[0].message).toBe('name is required');
        }
      });

      it('should fail validation if product name is empty', () => {
        productData.name = undefined;
        const invalidData = { ...productData };
        const result: any = productValidator.update.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('name');
          expect(error.issues[0].message).toBe('name is required');
        }
      });

      it('should fail validation if product name is too short', () => {
        productData.name = 'a';
        const invalidData = { ...productData };
        const result: any = productValidator.update.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('name');
          expect(error.issues[0].message).toBe('name is too short');
        }
      });

      it('should fail validation if product name is not a string', () => {
        productData.name = 1;
        const invalidData = { ...productData };
        const result: any = productValidator.update.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('name');
          expect(error.issues[0].message).toBe('name is required');
        }
      });
    });

    describe('product id', () => {
      it('should fail validation if product id is missing', () => {
        delete productData.id;
        const invalidData = { ...productData };
        const result: any = productValidator.update.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('id');
          expect(error.issues[0].message).toBe('id is required');
        }
      });

      it('should fail validation if product id is empty', () => {
        productData.id = undefined;
        const invalidData = { ...productData };
        const result: any = productValidator.update.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('id');
          expect(error.issues[0].message).toBe('id is required');
        }
      });

      it('should fail validation if product id is not a string', () => {
        productData.id = 1;
        const invalidData = { ...productData };
        const result: any = productValidator.update.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('id');
          expect(error.issues[0].message).toBe('id is required');
        }
      });

      it('should fail validation if product id is not a valid uuid', () => {
        productData.id = '12312312wsss';
        const invalidData = { ...productData };
        const result: any = productValidator.update.safeParse(invalidData);

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
      const result = productValidator.findOne.safeParse(params);
      expect(result.success).toBe(true);
    });

    describe('id', () => {
      it('should fail validation if product id is missing', () => {
        delete params.id;
        const invalidData = { ...params };
        const result: any = productValidator.findOne.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('id');
          expect(error.issues[0].message).toBe('id is required');
        }
      });

      it('should fail validation if product id is empty', () => {
        params.id = undefined;
        const invalidData = { ...params };
        const result: any = productValidator.findOne.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('id');
          expect(error.issues[0].message).toBe('id is required');
        }
      });

      it('should fail validation if product id is not a string', () => {
        params.id = 1;
        const invalidData = { ...params };
        const result: any = productValidator.findOne.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('id');
          expect(error.issues[0].message).toBe('id is required');
        }
      });

      it('should fail validation if product id is not a valid uuid', () => {
        params.id = '12312312wsss';
        const invalidData = { ...params };
        const result: any = productValidator.findOne.safeParse(invalidData);

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
      const result = productValidator.findAll.safeParse(params);
      expect(result.success).toBe(true);
    });

    describe('page', () => {
      it('should fail validation if page is missing', () => {
        delete params.page;
        const invalidData = { ...params };
        const result: any = productValidator.findAll.safeParse(invalidData);

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
        const result: any = productValidator.findAll.safeParse(invalidData);

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
        const result: any = productValidator.findAll.safeParse(invalidData);

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
        const result: any = productValidator.findAll.safeParse(invalidData);

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
        const result: any = productValidator.findAll.safeParse(invalidData);

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
        const result: any = productValidator.findAll.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('limit');
          expect(error.issues[0].message).toBe(
            'limit must be ≥0',
          );
        }
      });
    });
  });
});
