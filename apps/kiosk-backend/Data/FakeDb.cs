public class FakeDb
{
    public List<Product> Products { get; set; } = new();
    public List<Category> Categories { get; set; } = new();
    public List<MenuItem> MenuItems { get; set; } = new();
    public List<Order> Orders { get; set; } = new();

    public FakeDb()
    {

        var burgers = new Category { Id = Guid.NewGuid(), Name = "Burgers" };
        var drinks = new Category { Id = Guid.NewGuid(), Name = "Boissons" };
        var sides = new Category { Id = Guid.NewGuid(), Name = "Accompagnements" };
        var desserts = new Category { Id = Guid.NewGuid(), Name = "Desserts" };

        Categories.AddRange(new[] { burgers, drinks, sides, desserts });


        var bigBurger = new Product
        {
            Id = Guid.NewGuid(),
            Name = "Big Burger",
            Description = "Steak + cheddar + sauce maison",
            Price = 8.50m,
            CategoryId = burgers.Id
        };

        var chickenBurger = new Product
        {
            Id = Guid.NewGuid(),
            Name = "Chicken Burger",
            Description = "Poulet croustillant + mayo",
            Price = 7.50m,
            CategoryId = burgers.Id
        };

        var coke = new Product
        {
            Id = Guid.NewGuid(),
            Name = "Coca-Cola",
            Description = "33cl",
            Price = 2.50m,
            CategoryId = drinks.Id
        };

        var fanta = new Product
        {
            Id = Guid.NewGuid(),
            Name = "Fanta",
            Description = "33cl",
            Price = 2.50m,
            CategoryId = drinks.Id
        };

        var fries = new Product
        {
            Id = Guid.NewGuid(),
            Name = "Frites",
            Description = "Portion moyenne",
            Price = 3.00m,
            CategoryId = sides.Id
        };

        var bigFries = new Product
        {
            Id = Guid.NewGuid(),
            Name = "Grande Frites",
            Description = "Portion grande",
            Price = 4.00m,
            CategoryId = sides.Id
        };

        var iceCream = new Product
        {
            Id = Guid.NewGuid(),
            Name = "Sundae Vanille",
            Description = "Avec nappage chocolat",
            Price = 3.50m,
            CategoryId = desserts.Id
        };

        Products.AddRange(new[]
        {
            bigBurger, chickenBurger, coke, fanta, fries, bigFries, iceCream
        });


        MenuItems.Add(new MenuItem
        {
            Id = Guid.NewGuid(),
            Title = "Menu Big Burger",
            Price = 12.50m,
            ProductIds = new List<Guid> { bigBurger.Id, fries.Id, coke.Id }
        });

        MenuItems.Add(new MenuItem
        {
            Id = Guid.NewGuid(),
            Title = "Menu Chicken",
            Price = 11.50m,
            ProductIds = new List<Guid> { chickenBurger.Id, bigFries.Id, fanta.Id }
        });

        MenuItems.Add(new MenuItem
        {
            Id = Guid.NewGuid(),
            Title = "Menu Maxi Gourmand",
            Price = 15.00m,
            ProductIds = new List<Guid> { bigBurger.Id, bigFries.Id, coke.Id, iceCream.Id }
        });


        Orders.Add(new Order
        {
            Id = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow.AddMinutes(-15),
            Items = new List<OrderItem>
            {
                new OrderItem { ProductId = bigBurger.Id, Quantity = 1 },
                new OrderItem { ProductId = fries.Id, Quantity = 1 },
                new OrderItem { ProductId = coke.Id, Quantity = 1 }
            },
            TotalPrice = 8.50m + 3.00m + 2.50m
        });

        Orders.Add(new Order
        {
            Id = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow.AddMinutes(-5),
            Items = new List<OrderItem>
            {
                new OrderItem { ProductId = chickenBurger.Id, Quantity = 1 },
                new OrderItem { ProductId = bigFries.Id, Quantity = 1 },
                new OrderItem { ProductId = fanta.Id, Quantity = 1 },
                new OrderItem { ProductId = iceCream.Id, Quantity = 1 },
            },
            TotalPrice = 7.50m + 4.00m + 2.50m + 3.50m
        });
    }
}
