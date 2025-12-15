public interface IProductService
{
    Task<List<Product>> GetAllAsync();
    Task<List<Product>> GetByCategoryAsync(Guid categoryId);
    Task<Product?> GetByIdAsync(Guid id);
    Task<Product> CreateAsync(Product product);
    Task<bool> UpdateAsync(Guid id, Product product);
    Task<bool> DeleteAsync(Guid id);
}
