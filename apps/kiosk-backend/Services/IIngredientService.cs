public interface IIngredientService
{
    Task<List<Ingredient>> GetAllAsync();
    Task<Ingredient?> GetByIdAsync(Guid id);
    Task<Ingredient> CreateAsync(Ingredient ingredient);
    Task<bool> UpdateAsync(Guid id, Ingredient ingredient);
    Task<bool> DeleteAsync(Guid id);
}
