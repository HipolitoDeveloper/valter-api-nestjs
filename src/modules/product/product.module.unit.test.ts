import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user/user.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { ProductModule } from './product.module';
import { JwtService } from '@nestjs/jwt';

describe('ProductModule', () => {
  let productService: ProductService;
  let productController: ProductController;
  let productRepository: ProductRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProductModule],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productController = module.get<ProductController>(ProductController);
    productRepository = module.get<ProductRepository>(ProductRepository);
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
    expect(productController).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  it('should provide ProductService', () => {
    expect(productService).toBeInstanceOf(ProductService);
  });

  it('should provide ProductController', () => {
    expect(productController).toBeInstanceOf(ProductController);
  });

  it('should provide ProductRepository', () => {
    expect(productRepository).toBeInstanceOf(ProductRepository);
  });
});
