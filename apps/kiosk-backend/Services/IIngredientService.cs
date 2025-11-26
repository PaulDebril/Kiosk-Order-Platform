public interface IIngredientService
{
    IEnumerable<Ingredient> GetAll();
    Ingredient Create(Ingredient ingredient);
}
