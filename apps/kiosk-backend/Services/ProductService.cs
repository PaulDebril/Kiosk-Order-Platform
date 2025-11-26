public class ProductService : IProductService
{
    private readonly List<Product> _products = new();

    public IEnumerable<Product> GetAll() => _products;

    public Product? GetById(Guid id) =>
        _products.FirstOrDefault(p => p.Id == id);

    public Product Create(Product p)
    {
        p.Id = Guid.NewGuid();
        _products.Add(p);
        return p;
    }

    public Product Update(Guid id, Product p)
    {
        var existing = GetById(id);
        if (existing == null) return null;

        existing.Name = p.Name;
        existing.Description = p.Description;
        existing.Price = p.Price;
        existing.CategoryId = p.CategoryId;

        return existing;
    }

    public bool Delete(Guid id)
    {
        var p = GetById(id);
        return p != null && _products.Remove(p);
    }
}
