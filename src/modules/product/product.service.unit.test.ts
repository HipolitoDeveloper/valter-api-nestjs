import { Test, TestingModule } from '@nestjs/testing';
import mocks from '../../../test/mocks';
import { ERRORS } from '../../common/enum';
import { ErrorException } from '../../common/exceptions/error.exception';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findOne: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<ProductRepository>(ProductRepository);
  });

  describe('create', () => {
    let productCreateMock;
    let createdProductMock;

    beforeEach(() => {
      productCreateMock = mocks.PRODUCT_MOCK.SERVICE.createProductBody;
      createdProductMock = mocks.PRODUCT_MOCK.REPOSITORY.create;
    });
    it('should create a product and return the creation', async () => {
      jest
        .spyOn(productRepository, 'create')
        .mockResolvedValue(createdProductMock);

      const result = await productService.create(productCreateMock);

      expect(productRepository.create).toHaveBeenCalledWith({
        name: productCreateMock.name,
        category: {
          connect: {
            id: productCreateMock.categoryId,
          },
        },
        valid_until: new Date(productCreateMock.validUntil),
      });
      expect(result).toEqual({
        id: createdProductMock.id,
        name: createdProductMock.name,
      });
    });

    it('should throw ErrorException "CREATE_ENTITY_ERROR" if creation doesnt work', async () => {
      jest.spyOn(productRepository, 'create').mockRejectedValue(new Error());

      await expect(productService.create(productCreateMock)).rejects.toThrow(
        new ErrorException(ERRORS.CREATE_ENTITY_ERROR),
      );
    });
  });

  describe('update', () => {
    let productUpdateMock;
    let updatedProductMock;

    beforeEach(() => {
      productUpdateMock = mocks.PRODUCT_MOCK.SERVICE.updateProductBody;
      updatedProductMock = mocks.PRODUCT_MOCK.REPOSITORY.update;
    });
    it('should update a product and return data updated', async () => {
      jest
        .spyOn(productRepository, 'update')
        .mockResolvedValue(updatedProductMock);

      const result = await productService.update(productUpdateMock);

      expect(productRepository.update).toHaveBeenCalledWith({
        id: productUpdateMock.id,
        name: productUpdateMock.name,
      });
      expect(result).toEqual({
        id: updatedProductMock.id,
        name: updatedProductMock.name,
      });
    });

    it('should throw ErrorException "UPDATE_ENTITY_ERROR" if creation doesnt work', async () => {
      jest.spyOn(productRepository, 'update').mockRejectedValue(new Error());

      await expect(productService.update(productUpdateMock)).rejects.toThrow(
        new ErrorException(ERRORS.UPDATE_ENTITY_ERROR),
      );
    });
  });

  describe('findOne', () => {
    let productIdMock;
    let productMock;

    beforeEach(() => {
      productIdMock = mocks.PRODUCT_MOCK.SERVICE.productId;
      productMock = mocks.PRODUCT_MOCK.REPOSITORY.findOne;
    });
    it('should findOne product', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(productMock);

      const result = await productService.findOne(productIdMock);

      expect(productRepository.findOne).toHaveBeenCalledWith(productIdMock);
      expect(result).toEqual({
        id: productMock.id,
        name: productMock.name,
        category: {
          id: productMock.category.id,
          name: productMock.category.name,
        }
      });
    });

    it('should throw ErrorException "DATAVASE_ERROR" if findOne fails', async () => {
      jest.spyOn(productRepository, 'findOne').mockRejectedValue(new Error());

      await expect(productService.findOne(productIdMock)).rejects.toThrow(
        new ErrorException(ERRORS.DATABASE_ERROR),
      );
    });

    it('should throw ErrorException "NOT_FOUND_ENTITY" if any product was found', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

      await expect(productService.findOne(productIdMock)).rejects.toThrow(
        new ErrorException(ERRORS.NOT_FOUND_ENTITY),
      );
    });
  });

  describe('findAll', () => {
    let productsMock;
    let paginationMock;
    let findAllProductsMock;

    beforeEach(() => {
      paginationMock = mocks.PRODUCT_MOCK.SERVICE.pagination;
      productsMock = mocks.PRODUCT_MOCK.SERVICE.findAllResponse;
      findAllProductsMock = mocks.PRODUCT_MOCK.REPOSITORY.findAll;
    });
    it('should findAll products', async () => {
      jest
        .spyOn(productRepository, 'findAll')
        .mockResolvedValue(findAllProductsMock);

      const result = await productService.findAll(paginationMock);

      expect(productRepository.findAll).toHaveBeenCalledWith({
        limit: paginationMock.limit,
        offset: 0,
      });
      expect(result).toEqual(productsMock);
    });

    it('should throw ErrorException "DATABASE_ERROR" if findAll fails', async () => {
      jest.spyOn(productRepository, 'findAll').mockRejectedValue(new Error());

      await expect(productService.findAll(paginationMock)).rejects.toThrow(
        new ErrorException(ERRORS.DATABASE_ERROR),
      );
    });
  });
});
