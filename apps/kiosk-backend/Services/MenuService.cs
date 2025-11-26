public class MenuService : IMenuService
{
    private readonly FakeDb _db;

    public MenuService(FakeDb db)
    {
        _db = db;
    }

    public IEnumerable<MenuItem> GetAll() => _db.MenuItems;

    public MenuItem? GetById(Guid id) =>
        _db.MenuItems.FirstOrDefault(m => m.Id == id);
}
