public class ExtraService : IExtraService
{
    private readonly FakeDb _db;

    public ExtraService(FakeDb db)
    {
        _db = db;
    }

    public IEnumerable<Extra> GetAll() => _db.Extras;

    public Extra Create(Extra e)
    {
        e.Id = Guid.NewGuid();
        _db.Extras.Add(e);
        return e;
    }
}
