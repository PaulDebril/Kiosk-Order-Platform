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
                Image = "https://www.momasushi.fr/wp-content/uploads/2023/03/MOMA-SUSHI-SAUMON-SNACKE-NOV24-PDANIEL-043-scaled.jpg",
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
                Image = "https://www.momasushi.fr/wp-content/uploads/2023/03/MOMA-SUSHI-THON-NIKKEI-NOV24-PDANIEL-048-scaled.jpg",
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
                Image = "https://www.momasushi.fr/wp-content/uploads/2023/03/MOMA-SUSHI-CREVETTE-NOV24-PDANIEL-042-scaled.jpg",
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
                Image = "https://medias.cotesushi.com/products/149/large_514c1.webp",
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
                Image = "https://odelices.ouest-france.fr/images/recettes/california-rolls-saumon-avocat-makis-california.jpg",
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
                Image = "https://cdn.shopify.com/s/files/1/0353/5621/files/Dragon_Rolls_1024x1024.jpg?v=1627460696",
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
                Image = "https://img.cuisineaz.com/660x660/2013/12/20/i27594-recette-de-sashimis.jpeg",
                CategoryId = catSashimi,
                Calories = 220
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Sashimi Thon (6 pcs)",
                Description = "Fines tranches de thon rouge",
                Price = 9.90m,
                Image = "https://medias.cotesushi.com/products/178/large_d86d1.webp",
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
                Image = "https://glebekitchen.com/wp-content/uploads/2017/04/tonkotsuramenfront.jpg",
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
                Image = "https://blog.umamiparis.com/wp-content/uploads/2019/08/Gyudon.jpg",
                CategoryId = catRamen,
                Calories = 750
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Gyoza (5 pcs)",
                Description = "Raviolis japonais grillés au poulet et légumes",
                Price = 6.50m,
                Image = "https://adc-dev-images-recipes.s3.eu-west-1.amazonaws.com/shutterstock_588814973.jpg",
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
                Image = "https://img.freepik.com/photos-premium/belle-tasse-matcha-latte-feuille-the-vert-fond-sombre-vue-dessus-place-pour-texte_655456-142.jpg",
                CategoryId = catDrinks,
                Calories = 80
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Soda Ramune",
                Description = "Limonade japonaise traditionnelle",
                Price = 3.90m,
                Image = "https://cdnimg.webstaurantstore.com/images/products/large/821779/2835972.jpg",
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
                Image = "https://osakapoissy.fr/images/thumbs/0000474_mochi-glace-vanille-2-pieces_510.jpeg",
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
                Image = "https://sudachirecipes.com/wp-content/uploads/2025/10/dorayaki-new-thumb.jpg",
                CategoryId = catDesserts,
                Calories = 280
            }
        );
        
        // Loyalty
        modelBuilder.Entity<LoyaltyAccount>().HasData(
            new LoyaltyAccount {
                Id = Guid.NewGuid(),
                LoyaltyNumber = "111111",
                NickName = "Paul",
                FullName = "Paul Debril",
                Email = "paul@example.com",
                PhoneNumber = "0612345678",
                Points = 150,
                OrderHistory = new List<Guid>()
            }
        );
    }
}


