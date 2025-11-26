public interface IMenuService
{
    IEnumerable<MenuItem> GetAll();
    MenuItem? GetById(Guid id);
}
