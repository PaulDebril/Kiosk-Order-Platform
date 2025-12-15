public interface IMenuService
{
    Task<List<Menu>> GetAllAsync();
    Task<Menu?> GetByIdAsync(Guid id);
    Task<Menu> CreateAsync(Menu menu);
    Task<bool> UpdateAsync(Guid id, Menu menu);
    Task<bool> DeleteAsync(Guid id);
}
