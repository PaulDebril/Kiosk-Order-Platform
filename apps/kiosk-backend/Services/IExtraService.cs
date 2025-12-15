public interface IExtraService
{
    Task<List<Extra>> GetAllAsync();
    Task<Extra?> GetByIdAsync(Guid id);
    Task<Extra> CreateAsync(Extra extra);
    Task<bool> UpdateAsync(Guid id, Extra extra);
    Task<bool> DeleteAsync(Guid id);
}
