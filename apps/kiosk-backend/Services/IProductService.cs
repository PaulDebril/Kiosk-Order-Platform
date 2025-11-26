public interface IProductService
{
    IEnumerable<Product> GetAll();
    Product? GetById(Guid id);
    Product Create(Product p);
    Product Update(Guid id, Product p);
    bool Delete(Guid id);
}
