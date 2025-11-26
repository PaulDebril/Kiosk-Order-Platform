public interface ICategoryService
{
    IEnumerable<Category> GetAll();
    Category Create(Category c);
}
