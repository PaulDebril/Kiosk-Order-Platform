public interface IExtraService
{
    IEnumerable<Extra> GetAll();
    Extra Create(Extra e);
}
