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
        const result: any =
          notificationValidator.findAll.safeParse(invalidData);

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
        const result: any =
          notificationValidator.findAll.safeParse(invalidData);

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
        const result: any =
          notificationValidator.findAll.safeParse(invalidData);

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
        const result: any =
          notificationValidator.findAll.safeParse(invalidData);

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
        const result: any =
          notificationValidator.findAll.safeParse(invalidData);

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
        const result: any =
          notificationValidator.findAll.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('limit');
          expect(error.issues[0].message).toBe('limit must be ≥0');
        }
      });
    });
  });

  describe('updateNotificationDetails', () => {
    let validUpdateDetailsData;

    beforeEach(() => {
      validUpdateDetailsData = {
        id: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
        isOut: false,
        isExpired: true,
      };
    });

    it('should successfully validate with valid data', () => {
      const result = notificationValidator.updateNotificationDetails.safeParse(
        validUpdateDetailsData,
      );
      expect(result.success).toBe(true);
    });

    describe('id', () => {
      it('should fail validation if notification id is missing', () => {
        delete validUpdateDetailsData.id;
        const invalidData = { ...validUpdateDetailsData };
        const result: any =
          notificationValidator.updateNotificationDetails.safeParse(
            invalidData,
          );

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('id');
          expect(error.issues[0].message).toBe('Required');
        }
      });

      it('should fail validation if notification id is empty', () => {
        validUpdateDetailsData.id = '';
        const invalidData = { ...validUpdateDetailsData };
        const result: any =
          notificationValidator.updateNotificationDetails.safeParse(
            invalidData,
          );

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('id');
          expect(error.issues[0].message).toBe('Invalid uuid');
        }
      });

      it('should fail validation if notification id is not a valid uuid', () => {
        validUpdateDetailsData.id = 'invalid-uuid';
        const invalidData = { ...validUpdateDetailsData };
        const result: any =
          notificationValidator.updateNotificationDetails.safeParse(
            invalidData,
          );

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('id');
          expect(error.issues[0].message).toBe('Invalid uuid');
        }
      });
    });

    describe('isOut', () => {
      it('should pass validation with valid boolean value', () => {
        validUpdateDetailsData.isOut = true;
        const result =
          notificationValidator.updateNotificationDetails.safeParse(
            validUpdateDetailsData,
          );
        expect(result.success).toBe(true);
      });

      it('should pass validation when isOut is not provided but isExpired is', () => {
        delete validUpdateDetailsData.isOut;
        const result =
          notificationValidator.updateNotificationDetails.safeParse(
            validUpdateDetailsData,
          );
        expect(result.success).toBe(true);
      });

      it('should fail validation if isOut is not a boolean', () => {
        validUpdateDetailsData.isOut = 1;
        const invalidData = { ...validUpdateDetailsData };
        const result: any =
          notificationValidator.updateNotificationDetails.safeParse(
            invalidData,
          );

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('isOut');
          expect(error.issues[0].message).toBe(
            'Expected boolean, received number',
          );
        }
      });
    });

    describe('isExpired', () => {
      it('should pass validation with valid boolean value', () => {
        validUpdateDetailsData.isExpired = false;
        const result =
          notificationValidator.updateNotificationDetails.safeParse(
            validUpdateDetailsData,
          );
        expect(result.success).toBe(true);
      });

      it('should pass validation when isExpired is not provided but isOut is', () => {
        delete validUpdateDetailsData.isExpired;
        const result =
          notificationValidator.updateNotificationDetails.safeParse(
            validUpdateDetailsData,
          );
        expect(result.success).toBe(true);
      });

      it('should fail validation if isExpired is not a boolean', () => {
        validUpdateDetailsData.isExpired = 'false';
        const invalidData = { ...validUpdateDetailsData };
        const result: any =
          notificationValidator.updateNotificationDetails.safeParse(
            invalidData,
          );

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('isExpired');
          expect(error.issues[0].message).toBe(
            'Expected boolean, received string',
          );
        }
      });
    });

    it('should pass validation with only isOut provided', () => {
      const dataWithOnlyIsOut = {
        id: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
        isOut: true,
      };
      const result =
        notificationValidator.updateNotificationDetails.safeParse(
          dataWithOnlyIsOut,
        );
      expect(result.success).toBe(true);
    });

    it('should pass validation with only isExpired provided', () => {
      const dataWithOnlyIsExpired = {
        id: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
        isExpired: false,
      };
      const result = notificationValidator.updateNotificationDetails.safeParse(
        dataWithOnlyIsExpired,
      );
      expect(result.success).toBe(true);
    });

    it('should fail validation when neither isOut nor isExpired are provided', () => {
      const dataWithoutFields = {
        id: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
      };
      const result: any =
        notificationValidator.updateNotificationDetails.safeParse(
          dataWithoutFields,
        );

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error;
        expect(error.issues[0].message).toBe(
          'At least one field (isExpired or isOut) must be provided',
        );
      }
    });
  });

  describe('handleRead', () => {
    let validHandleReadData;

    beforeEach(() => {
      validHandleReadData = {
        id: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
        isRead: true,
      };
    });

    it('should successfully validate with valid data', () => {
      const result =
        notificationValidator.handleRead.safeParse(validHandleReadData);
      expect(result.success).toBe(true);
    });

    describe('id', () => {
      it('should fail validation if notification id is missing', () => {
        delete validHandleReadData.id;
        const invalidData = { ...validHandleReadData };
        const result: any =
          notificationValidator.handleRead.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('id');
          expect(error.issues[0].message).toBe('Required');
        }
      });

      it('should fail validation if notification id is empty', () => {
        validHandleReadData.id = '';
        const invalidData = { ...validHandleReadData };
        const result: any =
          notificationValidator.handleRead.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('id');
          expect(error.issues[0].message).toBe('Invalid uuid');
        }
      });

      it('should fail validation if notification id is not a valid uuid', () => {
        validHandleReadData.id = 'invalid-uuid';
        const invalidData = { ...validHandleReadData };
        const result: any =
          notificationValidator.handleRead.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('id');
          expect(error.issues[0].message).toBe('Invalid uuid');
        }
      });
    });

    describe('isRead', () => {
      it('should pass validation with valid boolean value', () => {
        validHandleReadData.isRead = false;
        const result =
          notificationValidator.handleRead.safeParse(validHandleReadData);
        expect(result.success).toBe(true);
      });

      it('should fail validation when isRead is not provided', () => {
        delete validHandleReadData.isRead;
        const result =
          notificationValidator.handleRead.safeParse(validHandleReadData);
        expect(result.success).toBe(false);
      });

      it('should fail validation if isRead is not a boolean', () => {
        validHandleReadData.isRead = 'true';
        const invalidData = { ...validHandleReadData };
        const result: any =
          notificationValidator.handleRead.safeParse(invalidData);

        expect(result.success).toBe(false);
        if (!result.success) {
          const error = result.error;
          expect(error.issues[0].path).toContain('isRead');
          expect(error.issues[0].message).toBe(
            'Expected boolean, received string',
          );
        }
      });
    });
  });
});
