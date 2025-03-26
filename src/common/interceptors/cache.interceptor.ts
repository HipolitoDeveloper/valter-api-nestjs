// import {
//   CallHandler,
//   ExecutionContext,
//   Inject,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';
// import { Reflector } from '@nestjs/core';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import keys from '../decorators/keys';
// import { CACHE_KEYS } from '../enum';
// import { ErrorException } from '../exceptions/error.exception';
//
// @Injectable()
// export class CacheInterceptor implements NestInterceptor {
//   constructor(
//     @Inject(CACHE_MANAGER)
//     private cacheManager: any,
//     private reflector: Reflector,
//   ) {}
//
//   async intercept(
//     context: ExecutionContext,
//     next: CallHandler,
//   ): Promise<Observable<any>> {
//     const request = context.switchToHttp().getRequest();
//     const cacheEntityKey = this.reflector.get<string>(
//       keys.CACHE,
//       context.getHandler(),
//     );
//
//     if (!cacheEntityKey) {
//       return next.handle();
//     }
//
//     let entityId;
//     switch (cacheEntityKey) {
//       case CACHE_KEYS.PROGRAM:
//         entityId = request.query.programCode;
//         break;
//     }
//
//     const cacheKey = `${cacheEntityKey}_${entityId}`;
//
//     let entity = await this.cacheManager.get(cacheKey);
//
//     if (!entity) {
//       try {
//         switch (cacheEntityKey) {
//           case CACHE_KEYS.PROGRAM:
//             const program = await this.programService.findByCode(
//               Number(entityId),
//             );
//
//             entity = {
//               program: {
//                 id: program.id,
//                 code: program.code,
//                 businessPartners: program.businessPartners,
//               },
//             };
//             break;
//         }
//       } catch (error) {
//         throw new ErrorException(error.message);
//       }
//
//       await this.cacheManager.set(cacheKey, entity, { ttl: 300 });
//     }
//
//     request['cache'] = { ...entity };
//
//     return next.handle().pipe(
//       tap(() => {
//         // Optionally, do something with the response here if needed
//       }),
//     );
//   }
// }
