public interface IMenuService
{
    IEnumerable<Menu> GetAll();
    Menu? GetById(Guid id);
    Menu Create(Menu m);
}
