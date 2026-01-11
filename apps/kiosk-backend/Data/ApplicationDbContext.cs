using Microsoft.EntityFrameworkCore;
using System.Text.Json;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Category> Categories { get; set; }
    public DbSet<Ingredient> Ingredients { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Extra> Extras { get; set; }
    public DbSet<Menu> Menus { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<LoyaltyAccount> LoyaltyAccounts { get; set; }
    public DbSet<LoyaltyTransaction> LoyaltyTransactions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuration Product
        modelBuilder.Entity<Product>()
            .HasOne<Category>()
            .WithMany()
            .HasForeignKey(p => p.CategoryId);

        modelBuilder.Entity<Product>()
            .Property(p => p.Ingredients)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null));

        modelBuilder.Entity<Product>()
            .Property(p => p.ExtraIds)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                v => JsonSerializer.Deserialize<List<Guid>>(v, (JsonSerializerOptions)null));

        modelBuilder.Entity<Product>()
            .Property(p => p.Options)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                v => JsonSerializer.Deserialize<List<ProductOption>>(v, (JsonSerializerOptions)null));

        // Configuration OrderItem
        modelBuilder.Entity<OrderItem>()
            .HasKey(oi => oi.Id);

        modelBuilder.Entity<OrderItem>()
            .Property(oi => oi.RemovedIngredients)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                v => JsonSerializer.Deserialize<List<Guid>>(v, (JsonSerializerOptions)null));

        modelBuilder.Entity<OrderItem>()
            .Property(oi => oi.ExtraIds)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                v => JsonSerializer.Deserialize<List<Guid>>(v, (JsonSerializerOptions)null));

        modelBuilder.Entity<OrderItem>()
            .Property(oi => oi.SelectedOptions)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                v => JsonSerializer.Deserialize<List<OptionChoice>>(v, (JsonSerializerOptions)null));

        // Configuration Order
        modelBuilder.Entity<Order>()
            .HasMany(o => o.Items)
            .WithOne()
            .OnDelete(DeleteBehavior.Cascade);

        // Configuration LoyaltyAccount
        modelBuilder.Entity<LoyaltyAccount>()
            .Property(la => la.OrderHistory)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                v => JsonSerializer.Deserialize<List<Guid>>(v, (JsonSerializerOptions)null));

        modelBuilder.Entity<LoyaltyTransaction>()
            .HasOne<LoyaltyAccount>()
            .WithMany()
            .HasForeignKey(lt => lt.AccountId);

        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        var catSushi = Guid.NewGuid();
        var catMaki = Guid.NewGuid();
        var catSashimi = Guid.NewGuid();
        var catRamen = Guid.NewGuid();
        var catYakitori = Guid.NewGuid();
        var catDrinks = Guid.NewGuid();
        var catDesserts = Guid.NewGuid();

        modelBuilder.Entity<Category>().HasData(
            new Category { Id = catSushi, Name = "Sushi", Icon = "sushi" },
            new Category { Id = catMaki, Name = "Maki", Icon = "maki" },
            new Category { Id = catSashimi, Name = "Sashimi", Icon = "fish" },
            new Category { Id = catRamen, Name = "Ramen & Plats", Icon = "ramen" },
            new Category { Id = catYakitori, Name = "Yakitori", Icon = "kebab" },
            new Category { Id = catDrinks, Name = "Boissons", Icon = "drink" },
            new Category { Id = catDesserts, Name = "Desserts", Icon = "dessert" }
        );

        modelBuilder.Entity<Product>().HasData(
            // --- Sushi ---
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Sushi Saumon",
                Description = "Riz vinaigré, tranche de saumon frais premium",
                Price = 4.50m,
                Image = "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop",
                CategoryId = catSushi,
                Calories = 140,
                IsPopular = true,
                Ingredients = new List<string> { "Riz vinaigré", "Saumon Label Rouge", "Wasabi" },
                Options = new List<ProductOption> {
                    new ProductOption {
                        Id = "sauces",
                        Name = "Sauces & Accompagnements",
                        Type = "multiple",
                        MaxQuantity = 2,
                        Options = new List<OptionChoice> {
                             new OptionChoice { Id = "wasabi_extra", Name = "Wasabi Extra", Price = 0m },
                             new OptionChoice { Id = "sauce_sucree", Name = "Sauce Soja Sucrée", Price = 0.50m }
                        }
                    }
                }
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Sushi Thon",
                Description = "Riz vinaigré et tranche de thon rouge frais",
                Price = 5.00m,
                Image = "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
                CategoryId = catSushi,
                Calories = 130,
                Ingredients = new List<string> { "Riz vinaigré", "Thon Rouge", "Wasabi" }
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Sushi Crevette",
                Description = "Riz vinaigré et crevette papillon",
                Price = 4.80m,
                Image = "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&h=300&fit=crop",
                CategoryId = catSushi,
                Calories = 120
            },

            // --- Maki ---
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Maki Avocat",
                Description = "Rouleau d'algue, riz, avocat frais",
                Price = 3.90m,
                Image = "https://images.unsplash.com/photo-1623341214825-9f4f963727da?w=400&h=300&fit=crop",
                CategoryId = catMaki,
                Calories = 180,
                Ingredients = new List<string> { "Riz", "Algue Nori", "Avocat" }
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "California Saumon",
                Description = "Saumon, avocat, sésame, riz à l'extérieur",
                Price = 5.50m,
                Image = "https://images.unsplash.com/photo-1625244695851-1fc873f942bc?w=400&h=300&fit=crop",
                CategoryId = catMaki,
                Calories = 250,
                Ingredients = new List<string> { "Riz", "Saumon", "Avocat", "Sésame" }
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Dragon Roll",
                Description = "Tempura de crevette, avocat, sauce unagi",
                Price = 12.90m,
                Image = "https://images.unsplash.com/photo-1615361200141-f45040f367be?w=400&h=300&fit=crop",
                CategoryId = catMaki,
                Calories = 450,
                IsPopular = true
            },

            // --- Sashimi ---
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Sashimi Saumon (6 pcs)",
                Description = "Fines tranches de saumon frais",
                Price = 8.90m,
                Image = "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&h=300&fit=crop",
                CategoryId = catSashimi,
                Calories = 220
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Sashimi Thon (6 pcs)",
                Description = "Fines tranches de thon rouge",
                Price = 9.90m,
                Image = "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400&h=300&fit=crop",
                CategoryId = catSashimi,
                Calories = 200
            },

            // --- Ramen & Plats ---
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Ramen Tonkotsu",
                Description = "Bouillon d'os de porc riche, nouilles, chashu",
                Price = 13.90m,
                Image = "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop",
                CategoryId = catRamen,
                Calories = 600,
                IsPopular = true,
                Ingredients = new List<string> { "Bouillon Tonkotsu", "Nouilles", "Chashu" }
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Bœuf Gyu Don",
                Description = "Bol de riz surmonté de bœuf mijoté et oignons",
                Price = 12.50m,
                Image = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
                CategoryId = catRamen,
                Calories = 750
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Gyoza (5 pcs)",
                Description = "Raviolis japonais grillés au poulet et légumes",
                Price = 6.50m,
                Image = "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop",
                CategoryId = catRamen,
                Calories = 320
            },

            // --- Yakitori ---
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Yakitori Poulet (2 pcs)",
                Description = "Brochettes de poulet grillé sauce teriyaki",
                Price = 4.90m,
                Image = "https://www.kokomorestaurant.fr/wp-content/uploads/2024/01/yakitori-chicken-balls-kokomo.jpg",
                CategoryId = catYakitori,
                Calories = 280
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Yakitori Bœuf Fromage (2 pcs)",
                Description = "Brochettes de bœuf au fromage fondant",
                Price = 5.50m,
                Image = "https://www.kokomorestaurant.fr/wp-content/uploads/2024/01/yakitori-boeuf-fromage-kokomo.jpg",
                CategoryId = catYakitori,
                Calories = 320,
                IsPopular = true
            },

            // --- Boissons ---
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Thé Vert Matcha",
                Description = "Thé vert japonais glacé",
                Price = 3.50m,
                Image = "https://www.kokomorestaurant.fr/wp-content/uploads/2024/01/tea-green-matcha-kokomo.jpg",
                CategoryId = catDrinks,
                Calories = 80
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Soda Ramune",
                Description = "Limonade japonaise traditionnelle",
                Price = 3.90m,
                Image = "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop",
                CategoryId = catDrinks,
                Calories = 90
            },

            // --- Desserts ---
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Mochi Glacé (2 pcs)",
                Description = "Pâte de riz gluant fourrée à la glace",
                Price = 4.90m,
                Image = "https://images.unsplash.com/photo-1579306093888-251f2f01f465?w=400&h=300&fit=crop",
                CategoryId = catDesserts,
                Calories = 220,
                IsPopular = true,
                Options = new List<ProductOption> {
                    new ProductOption {
                        Id = "flavors",
                        Name = "Parfums",
                        Type = "multiple",
                        Required = true,
                        MaxQuantity = 2,
                        Options = new List<OptionChoice> {
                             new OptionChoice { Id = "vanilla", Name = "Vanille", Price = 0m },
                             new OptionChoice { Id = "mango", Name = "Mangue", Price = 0m },
                             new OptionChoice { Id = "matcha_tea", Name = "Matcha", Price = 0m }
                        }
                    }
                }
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Dorayaki",
                Description = "Pancakes japonais à la pâte de haricot rouge",
                Price = 4.20m,
                Image = "https://images.unsplash.com/photo-1596450849206-ca7b65349e5d?w=400&h=300&fit=crop",
                CategoryId = catDesserts,
                Calories = 280
            }
        );
        
        // Loyalty
        modelBuilder.Entity<LoyaltyAccount>().HasData(
            new LoyaltyAccount {
                Id = Guid.NewGuid(),
                FullName = "Marine L",
                Email = "marine@example.com",
                PhoneNumber = "0612345678",
                LoyaltyNumber = "QR-MARINE-001",
                Points = 320
            }
        );
    }
}


