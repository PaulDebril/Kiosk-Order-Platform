public class FakeDb
{
    public List<Category> Categories { get; set; } = new();
    public List<Ingredient> Ingredients { get; set; } = new();
    public List<Product> Products { get; set; } = new();
    public List<Extra> Extras { get; set; } = new();
    public List<Menu> Menus { get; set; } = new();
    public List<Order> Orders { get; set; } = new();
    public List<LoyaltyAccount> LoyaltyAccounts { get; set; } = new();
    public List<LoyaltyTransaction> LoyaltyTransactions { get; set; } = new();
    public LoyaltyRewardRule LoyaltyRule { get; set; } = new LoyaltyRewardRule();

    public FakeDb()
    {
        Ingredient ING(string name) =>
            new Ingredient { Id = Guid.NewGuid(), Name = name };

        Category CAT(string name) =>
            new Category { Id = Guid.NewGuid(), Name = name };

        Extra EX(string name, decimal price) =>
            new Extra { Id = Guid.NewGuid(), Name = name, Price = price };

        var ingSteak = ING("Steak");
        var ingChicken = ING("Poulet croustillant");
        var ingLettuce = ING("Salade");
        var ingTomato = ING("Tomate");
        var ingOnion = ING("Oignons");
        var ingCheddar = ING("Cheddar");
        var ingSauceBurger = ING("Sauce Burger");

        Ingredients.AddRange(new[]
        {
            ingSteak, ingChicken, ingLettuce, ingTomato,
            ingOnion, ingCheddar, ingSauceBurger
        });

        var catBurger = CAT("Burgers");
        var catDrink = CAT("Boissons");
        var catSide = CAT("Accompagnements");
        var catDessert = CAT("Desserts");

        Categories.AddRange(new[]
        {
            catBurger, catDrink, catSide, catDessert
        });

        var exCheddar = EX("Cheddar Supplément", 1.00m);
        var exBacon = EX("Bacon", 1.50m);
        var exSauceBBQ = EX("Sauce BBQ", 0.50m);

        Extras.AddRange(new[] { exCheddar, exBacon, exSauceBBQ });

        var optSize = new ProductOption
        {
            Name = "Taille",
            Choices = new()
            {
                new OptionChoice { Label = "M", AdditionalPrice = 0 },
                new OptionChoice { Label = "L", AdditionalPrice = 0.50m }
            }
        };

        var optIce = new ProductOption
        {
            Name = "Glaçons",
            Choices = new()
            {
                new OptionChoice { Label = "Avec glaçons", AdditionalPrice = 0 },
                new OptionChoice { Label = "Sans glaçons", AdditionalPrice = 0 }
            }
        };

        Product BURGER(string name, decimal price, params Ingredient[] ings) =>
            new Product
            {
                Id = Guid.NewGuid(),
                Name = name,
                BasePrice = price,
                CategoryId = catBurger.Id,
                Ingredients = ings.Select(i => new ProductIngredient
                {
                    IngredientId = i.Id,
                    IsDefault = true
                }).ToList(),
                ExtraIds = new List<Guid> { exCheddar.Id, exBacon.Id, exSauceBBQ.Id }
            };

        var bigBurger = BURGER("Big Burger", 8.50m,
            ingSteak, ingCheddar, ingLettuce, ingTomato, ingOnion, ingSauceBurger);

        var chickenBurger = BURGER("Chicken Burger", 7.50m,
            ingChicken, ingCheddar, ingLettuce);

        var fries = new Product
        {
            Id = Guid.NewGuid(),
            Name = "Frites",
            BasePrice = 3.00m,
            CategoryId = catSide.Id
        };

        Product DRINK(string name) =>
            new Product
            {
                Id = Guid.NewGuid(),
                Name = name,
                BasePrice = 2.50m,
                CategoryId = catDrink.Id,
                Options = new() { optSize, optIce }
            };

        var coke = DRINK("Coca-Cola");
        var sprite = DRINK("Sprite");

        var sundae = new Product
        {
            Id = Guid.NewGuid(),
            Name = "Sundae Vanille",
            BasePrice = 3.50m,
            CategoryId = catDessert.Id
        };

        Products.AddRange(new[]
        {
            bigBurger, chickenBurger, fries, coke, sprite, sundae
        });

        Menus.Add(new Menu
        {
            Id = Guid.NewGuid(),
            Title = "Menu Big Burger",
            Price = 12.50m,
            MainProductId = bigBurger.Id,
            DrinkProductId = coke.Id,
            SideProductId = fries.Id
        });

        var accMarine = new LoyaltyAccount
        {
            Id = Guid.NewGuid(),
            FullName = "Marine L",
            Email = "marine@example.com",
            PhoneNumber = "0612345678",
            LoyaltyNumber = "QR-MARINE-001",
            Points = 320,
            OrderHistory = new()
        };

        LoyaltyAccounts.Add(accMarine);

        var order1 = new Order
        {
            Id = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow.AddMinutes(-10),
            Items = new List<OrderItem>
            {
                new OrderItem
                {
                    ProductId = bigBurger.Id,
                    Quantity = 1,
                    RemovedIngredients = new List<Guid> { ingOnion.Id },
                    ExtraIds = new List<Guid> { exCheddar.Id }
                },
                new OrderItem
                {
                    ProductId = coke.Id,
                    Quantity = 1,
                    SelectedOptions = new()
                    {
                        new OptionChoice { Label = "L", AdditionalPrice = 0.50m },
                        new OptionChoice { Label = "Sans glaçons", AdditionalPrice = 0 }
                    }
                }
            },
            TotalPrice = 12.50m
        };

        Orders.Add(order1);

        accMarine.OrderHistory.Add(order1.Id);

        LoyaltyTransactions.Add(new LoyaltyTransaction
        {
            Id = Guid.NewGuid(),
            AccountId = accMarine.Id,
            PointsChanged = 45,
            Reason = "Commande",
            Date = DateTime.UtcNow.AddMinutes(-9)
        });

        accMarine.Points += 45;
    }
}
