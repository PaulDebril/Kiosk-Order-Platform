using Microsoft.EntityFrameworkCore;
using Xunit;

namespace kiosk_backend.Tests.Services;

public class ProductServiceTests
{
    private ApplicationDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsProductWithCategoryName()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var service = new ProductService(context);

        var category = new Category { Id = Guid.NewGuid(), Name = "Burgers", Icon = "🍔" };
        var product = new Product 
        { 
            Id = Guid.NewGuid(), 
            Name = "Cheeseburger",
            Price = 8.99m,
            CategoryId = category.Id,
            Category = category
        };

        context.Categories.Add(category);
        context.Products.Add(product);
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetByIdAsync(product.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Cheeseburger", result.Name);
        Assert.Equal(8.99m, result.Price);
        Assert.Equal("Burgers", result.CategoryName);
    }

    [Fact]
    public async Task GetByCategoryAsync_ReturnsOnlyProductsInCategory()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var service = new ProductService(context);

        var burgerCategory = new Category { Id = Guid.NewGuid(), Name = "Burgers", Icon = "🍔" };
        var pizzaCategory = new Category { Id = Guid.NewGuid(), Name = "Pizzas", Icon = "🍕" };

        var burger1 = new Product { Id = Guid.NewGuid(), Name = "Burger 1", Price = 9.99m, CategoryId = burgerCategory.Id, Category = burgerCategory };
        var burger2 = new Product { Id = Guid.NewGuid(), Name = "Burger 2", Price = 10.99m, CategoryId = burgerCategory.Id, Category = burgerCategory };
        var pizza = new Product { Id = Guid.NewGuid(), Name = "Pizza 1", Price = 12.99m, CategoryId = pizzaCategory.Id, Category = pizzaCategory };

        context.Categories.AddRange(burgerCategory, pizzaCategory);
        context.Products.AddRange(burger1, burger2, pizza);
        await context.SaveChangesAsync();

        // Act
        var result = await service.GetByCategoryAsync(burgerCategory.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count);
        Assert.All(result, p => Assert.Equal("Burgers", p.CategoryName));
        Assert.Contains(result, p => p.Name == "Burger 1");
        Assert.Contains(result, p => p.Name == "Burger 2");
        Assert.DoesNotContain(result, p => p.Name == "Pizza 1");
    }
}
