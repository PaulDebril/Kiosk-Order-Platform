public class ProductService : IProductService
{
    private readonly FakeDb _db;

    public ProductService(FakeDb db)
    {
        _db = db;
    }

    public IEnumerable<Product> GetAll() => _db.Products;

    public Product? GetById(Guid id) =>
        _db.Products.FirstOrDefault(p => p.Id == id);

    public Product Create(Product p)
    {
        p.Id = Guid.NewGuid();
        _db.Products.Add(p);
        return p;
    }

    public Product? Update(Guid id, Product p)
    {
        var existing = GetById(id);
        if (existing == null) return null;

        existing.Name = p.Name;
        existing.Description = p.Description;
        existing.BasePrice = p.BasePrice;
        existing.CategoryId = p.CategoryId;
        existing.Ingredients = p.Ingredients;
        existing.Options = p.Options;
        existing.ExtraIds = p.ExtraIds;

        return existing;
    }

    public bool Delete(Guid id)
    {
        var product = GetById(id);
        return product != null && _db.Products.Remove(product);
    }
}
