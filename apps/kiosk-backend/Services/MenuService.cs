public class MenuService : IMenuService
{
    private readonly FakeDb _db;

    public MenuService(FakeDb db)
    {
        _db = db;
    }

    public IEnumerable<Menu> GetAll() => _db.Menus;

    public Menu? GetById(Guid id) =>
        _db.Menus.FirstOrDefault(m => m.Id == id);

    public Menu Create(Menu m)
    {
        m.Id = Guid.NewGuid();
        _db.Menus.Add(m);
        return m;
    }
}
