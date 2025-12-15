public interface ICategoryService
{
    Task<List<Category>> GetAllAsync();
    Task<Category?> GetByIdAsync(Guid id);
    Task<Category> CreateAsync(Category category);
    Task<bool> UpdateAsync(Guid id, Category category);
    Task<bool> DeleteAsync(Guid id);
}
