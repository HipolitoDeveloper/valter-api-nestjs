import { Injectable } from '@nestjs/common';
import { ERRORS } from '../../common/enum';
import { ErrorException } from '../../common/exceptions/error.exception';
import { ProductRepository } from './product.repository';
import {
  ProductControllerNamespace,
  ProductRepositoryNamespace,
  ProductServiceNamespace,
} from './product.type';
import Product = ProductRepositoryNamespace.Product;
import CreateProductBody = ProductControllerNamespace.CreateProductBody;
import UpdateProductBody = ProductControllerNamespace.UpdateProductBody;
import FindAllQuery = ProductControllerNamespace.FindAllQuery;
import FindAllRecommendedProductsQuery = ProductControllerNamespace.FindAllRecommendedProductsQuery;
import RecommendedProduct = ProductRepositoryNamespace.RecommendedProduct;

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async create(
    product: CreateProductBody,
  ): Promise<ProductServiceNamespace.CreateResponse> {
    let createdProduct: Product;
    try {
      createdProduct = await this.productRepository.create({
        name: product.name,
        category: {
          connect: {
            id: product.categoryId,
          },
        },
        valid_for_days: product.validForDays,
      });
    } catch (error) {
      throw new ErrorException(ERRORS.CREATE_ENTITY_ERROR, error);
    }

    return {
      id: createdProduct.id,
      name: createdProduct.name,
    };
  }

  async update(
    product: UpdateProductBody,
  ): Promise<ProductServiceNamespace.UpdateResponse> {
    let updatedProduct: Product;
    try {
      updatedProduct = await this.productRepository.update(product);
    } catch (error) {
      throw new ErrorException(ERRORS.UPDATE_ENTITY_ERROR, error);
    }

    return {
      id: updatedProduct.id,
      name: updatedProduct.name,
    };
  }

  async findOne(
    productId: string,
  ): Promise<ProductServiceNamespace.FindOneResponse> {
    let product: Product;
    try {
      product = await this.productRepository.findOne(productId);
    } catch (error) {
      throw new ErrorException(ERRORS.DATABASE_ERROR, error);
    }

    if (!product) {
      throw new ErrorException(ERRORS.NOT_FOUND_ENTITY);
    }

    return {
      id: product.id,
      name: product.name,
      category: {
        id: product.category.id,
        name: product.category.name,
      },
    };
  }

  async findAll({
    limit,
    page,
    productName,
  }: FindAllQuery): Promise<ProductServiceNamespace.FindAllResponse> {
    const offset = limit && page ? limit * (page - 1) : undefined;
    let products: { data: Product[]; totalCount: number };
    try {
      products = await this.productRepository.findAll({
        limit,
        offset,
        productName,
      });
    } catch {
      throw new ErrorException(ERRORS.DATABASE_ERROR);
    }

    return {
      data: products.data.map((product) => ({
        id: product.id,
        name: product.name,
        category: {
          id: product.category.id,
          name: product.category.name,
        },
        defaultPortion: product.default_portion,
        defaultPortionType: product.default_portion_type,
        validForDays: product.valid_for_days,
      })),
      totalCount: products.totalCount,
    };
  }

  async findAllRecommendedProducts({
    userId,
    pantryId,
  }: FindAllRecommendedProductsQuery): Promise<ProductServiceNamespace.FindAllRecommendedProductsResponse> {
    let products: { data: RecommendedProduct[] };
    try {
      products = await this.productRepository.findAllRecommendedProducts(
        userId,
        pantryId,
      );
    } catch {
      throw new ErrorException(ERRORS.DATABASE_ERROR);
    }

    return {
      data: products.data.map((product) => ({
        id: product.id,
        name: product.name,
        defaultPortion: product.default_portion,
        defaultPortionType: product.default_portion_type,
        validForDays: product.valid_for_days,
      })),
    };
  }
}
