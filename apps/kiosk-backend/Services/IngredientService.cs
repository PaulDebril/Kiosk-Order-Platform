public class IngredientService : IIngredientService
{
    private readonly FakeDb _db;

    public IngredientService(FakeDb db)
    {
        _db = db;
    }

    public IEnumerable<Ingredient> GetAll() => _db.Ingredients;

    public Ingredient Create(Ingredient ingredient)
    {
        ingredient.Id = Guid.NewGuid();
        _db.Ingredients.Add(ingredient);
        return ingredient;
    }
}
