using Microsoft.EntityFrameworkCore;

public class ProductService : IProductService
{
    private readonly ApplicationDbContext _context;

    public ProductService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Product>> GetAllAsync()
    {
        var products = await _context.Products
            .Include(p => p.Category)
            .ToListAsync();
            
        // Populate mapped property
        products.ForEach(p => p.CategoryName = p.Category?.Name ?? "");
        return products;
    }

    public async Task<List<Product>> GetByCategoryAsync(Guid categoryId)
    {
        var products = await _context.Products
            .Include(p => p.Category)
            .Where(p => p.CategoryId == categoryId)
            .ToListAsync();
            
        products.ForEach(p => p.CategoryName = p.Category?.Name ?? "");
        return products;
    }

    public async Task<Product?> GetByIdAsync(Guid id)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);
            
        if (product != null)
        {
            product.CategoryName = product.Category?.Name ?? "";
        }
        return product;
    }

    public async Task<Product> CreateAsync(Product product)
    {
        product.Id = Guid.NewGuid();
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return product;
    }

    public async Task<bool> UpdateAsync(Guid id, Product product)
    {
        var existing = await _context.Products.FindAsync(id);
        if (existing == null) return false;

        existing.Name = product.Name;
        existing.Description = product.Description;
        existing.Price = product.Price;
        existing.Image = product.Image;
        existing.CategoryId = product.CategoryId;
        existing.Calories = product.Calories;
        existing.IsPopular = product.IsPopular;
        existing.Ingredients = product.Ingredients;
        existing.ExtraIds = product.ExtraIds;
        existing.Options = product.Options;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return false;

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return true;
    }
}

