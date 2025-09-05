import { Test, TestingModule } from '@nestjs/testing';
import { PRODUCT_MOCK } from '../../../test/mocks/product.mock';
import { USER_MOCK } from '../../../test/mocks/user.mock';
import { ExceptionHandler } from '../../common/handler/exception.handler';
import { Request } from '../../common/types/http.type';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductControllerNamespace } from './product.type';
import CreateProductBody = ProductControllerNamespace.CreateProductBody;

describe('ProductController', () => {
  let productController: ProductController;

  const mockProductService = {
    create: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    findAllRecommendedProducts: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
        ExceptionHandler,
      ],
    }).compile();

    productController = module.get<ProductController>(ProductController);
  });

  describe('create', () => {
    let createProductBody: CreateProductBody;

    beforeEach(() => {
      createProductBody = PRODUCT_MOCK.SERVICE.createProductBody;
    });

    it('should create a product', async () => {
      const result = await productController.create(createProductBody);
      expect(result).toEqual(undefined);
      expect(mockProductService.create).toHaveBeenCalledWith(createProductBody);
    });

    it('should throw an error if product creation fails', async () => {
      mockProductService.create.mockRejectedValue(new Error('Error'));
      await expect(productController.create(createProductBody)).rejects.toThrow(
        'Error',
      );
    });
  });

  describe('update', () => {
    let updateProductBody: CreateProductBody;

    beforeEach(() => {
      updateProductBody = PRODUCT_MOCK.SERVICE.updateProductBody;
    });
    it('should update a product', async () => {
      const result = await productController.update(updateProductBody);
      expect(result).toEqual(undefined);
      expect(mockProductService.update).toHaveBeenCalledWith(updateProductBody);
    });

    it('should throw an error if product creation fails', async () => {
      mockProductService.update.mockRejectedValue(new Error('Error'));
      await expect(productController.update(updateProductBody)).rejects.toThrow(
        'Error',
      );
    });
  });

  describe('findOne', () => {
    let productIdMock: string;

    beforeEach(() => {
      productIdMock = PRODUCT_MOCK.SERVICE.productId;
    });
    it('should finddOne product', async () => {
      const result = await productController.findOne({ id: productIdMock });
      expect(result).toEqual(undefined);
      expect(mockProductService.findOne).toHaveBeenCalledWith(productIdMock);
    });

    it('should throw an error if product creation fails', async () => {
      mockProductService.findOne.mockRejectedValue(new Error('Error'));
      await expect(
        productController.findOne({ id: productIdMock }),
      ).rejects.toThrow('Error');
    });
  });

  describe('findAll', () => {
    let paginationMock: { limit: number; page: number };
    let findAllParamsMock;
    beforeEach(() => {
      paginationMock = PRODUCT_MOCK.SERVICE.pagination;

      findAllParamsMock = {
        ...paginationMock,
        productName: '',
      };
    });
    it('should findAll products', async () => {
      const result = await productController.findAll(findAllParamsMock);
      expect(result).toEqual(undefined);
      expect(mockProductService.findAll).toHaveBeenCalledWith(
        findAllParamsMock,
      );
    });

    it('should throw an error if findAll fails', async () => {
      mockProductService.findAll.mockRejectedValue(new Error('Error'));
      await expect(
        productController.findAll(findAllParamsMock),
      ).rejects.toThrow('Error');
    });
  });

  describe('findAllRecommendedProducts', () => {
    let currentUserMock;
    beforeEach(() => {
      currentUserMock = USER_MOCK.currentUser;
    });
    it('should findAll products', async () => {
      const result = await productController.findAllRecommendedProducts({
        currentUser: currentUserMock,
      } as Request);
      expect(result).toEqual(undefined);
      expect(
        mockProductService.findAllRecommendedProducts,
      ).toHaveBeenCalledWith({
        userId: currentUserMock.id,
        pantryId: currentUserMock.pantryId,
      });
    });

    it('should throw an error if findAll fails', async () => {
      mockProductService.findAllRecommendedProducts.mockRejectedValue(new Error('Error'));
      await expect(
        productController.findAllRecommendedProducts({
          currentUser: currentUserMock,
        } as Request),
      ).rejects.toThrow('Error');
    });
  });
});
