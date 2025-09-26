import { notificationValidator } from './notification.validator';

describe('NotificationValidator', () => {
  describe('findAll', () => {
    let params;

    beforeEach(() => {
      params = {
        page: 1,
        limit: 10,
      };
    });

    it('should successfully validate with valid date', () => {
      const result = notificationValidator.findAll.safeParse(params);
      expect(result.success).toBe(true);
    });

    describe('page', () => {
      it('should fail validation if page is missing', () => {
        delete params.page;
        const invalidData = { ...params };
        const result: any = notificationValidator.findAll.safeParse(invalidData);

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
        const result: any = notificationValidator.findAll.safeParse(invalidData);

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
        const result: any = notificationValidator.findAll.safeParse(invalidData);

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
        const result: any = notificationValidator.findAll.safeParse(invalidData);

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
        const result: any = notificationValidator.findAll.safeParse(invalidData);

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
        const result: any = notificationValidator.findAll.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('limit');
          expect(error.issues[0].message).toBe('limit must be ≥0');
        }
      });
    });

  });
})