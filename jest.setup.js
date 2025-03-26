'use strict';

/**
 * This global afterAll exists to help jest clean up some memory
 * after each test file, since the only way to do this natively is
 * using the --logHeapUsage flag, and passing this flag incurs a
 * performance hit
 */
afterAll(() => {
  if (global.gc) {
    global.gc();
  }
});

expect.extend({
  toHaveBeenSent(received) {
    const expressResponseSendMethods = [
      'download',
      'end',
      'json',
      'jsonp',
      'redirect',
      'render',
      'send',
      'sendFile',
      'sendStatus',
    ];

    expressResponseSendMethods.forEach((method) => {
      if (this.isNot) {
        // eslint-disable-next-line security/detect-object-injection
        expect(received[method]).not.toHaveBeenCalled();
      } else {
        // eslint-disable-next-line security/detect-object-injection
        expect(received[method]).toHaveBeenCalled();
      }
    });
    return { pass: !this.isNot };
  },
});
