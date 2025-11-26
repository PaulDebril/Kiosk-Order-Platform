public class CategoryService : ICategoryService
{
    private readonly FakeDb _db;

    public CategoryService(FakeDb db)
    {
        _db = db;
    }

    public IEnumerable<Category> GetAll() => _db.Categories;

    public Category Create(Category c)
    {
        c.Id = Guid.NewGuid();
        _db.Categories.Add(c);
        return c;
    }
}
