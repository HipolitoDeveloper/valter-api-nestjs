import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';
import { ZodException } from '../exceptions/zod.exception';

export class ZodValidationPipe implements PipeTransform {
  constructor(
    private schema: ZodSchema,
    private mappings?: Record<string, string[]>,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      let mappedValue = value;
      if (this.mappings) {
        Object.keys(this.mappings).forEach((key) => {
          const nestedObject: Record<string, any> = {};
          this.mappings[key].forEach((nestedKey) => {
            if (value[nestedKey]) {
              const propertyName = nestedKey.split('[')[1].split(']')[0];
              nestedObject[propertyName] = value[nestedKey];
              delete value[nestedKey];
            }
          });
          if (Object.keys(nestedObject).length > 0) {
            value[key] = nestedObject;
          }
        });
        mappedValue = value;
      }
      if (mappedValue) {
        Object.keys(mappedValue).forEach((key) => {
          if (key.endsWith('[]')) {
            const newKey = key.slice(0, -2); // Remove the `[]` suffix
            mappedValue[newKey] = Array.isArray(mappedValue[key])
              ? mappedValue[key]
              : [mappedValue[key]]; // Ensure it's always an array
            delete mappedValue[key]; // Remove the old key
          }
        });
      } else {
        this.schema.parse(mappedValue);
      }

      const parsedValue = this.schema.parse(mappedValue);
      return parsedValue;
    } catch (error) {
      throw new ZodException(JSON.parse(error));
    }
  }
}
