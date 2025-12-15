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
                v => JsonSerializer.Deserialize<List<ProductIngredient>>(v, (JsonSerializerOptions)null));

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

        // Seed data
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // Categories
        var catBurgerId = Guid.NewGuid();
        var catDrinkId = Guid.NewGuid();
        var catSideId = Guid.NewGuid();
        var catDessertId = Guid.NewGuid();

        modelBuilder.Entity<Category>().HasData(
            new Category { Id = catBurgerId, Name = "Burgers" },
            new Category { Id = catDrinkId, Name = "Boissons" },
            new Category { Id = catSideId, Name = "Accompagnements" },
            new Category { Id = catDessertId, Name = "Desserts" }
        );

        // Ingredients
        var ingSteak = Guid.NewGuid();
        var ingChicken = Guid.NewGuid();
        var ingLettuce = Guid.NewGuid();
        var ingTomato = Guid.NewGuid();
        var ingOnion = Guid.NewGuid();
        var ingCheddar = Guid.NewGuid();
        var ingSauceBurger = Guid.NewGuid();

        modelBuilder.Entity<Ingredient>().HasData(
            new Ingredient { Id = ingSteak, Name = "Steak" },
            new Ingredient { Id = ingChicken, Name = "Poulet croustillant" },
            new Ingredient { Id = ingLettuce, Name = "Salade" },
            new Ingredient { Id = ingTomato, Name = "Tomate" },
            new Ingredient { Id = ingOnion, Name = "Oignons" },
            new Ingredient { Id = ingCheddar, Name = "Cheddar" },
            new Ingredient { Id = ingSauceBurger, Name = "Sauce Burger" }
        );

        // Extras
        var exCheddar = Guid.NewGuid();
        var exBacon = Guid.NewGuid();
        var exSauceBBQ = Guid.NewGuid();

        modelBuilder.Entity<Extra>().HasData(
            new Extra { Id = exCheddar, Name = "Cheddar Supplément", Price = 1.00m },
            new Extra { Id = exBacon, Name = "Bacon", Price = 1.50m },
            new Extra { Id = exSauceBBQ, Name = "Sauce BBQ", Price = 0.50m }
        );

        // Products
        var bigBurgerId = Guid.NewGuid();
        var chickenBurgerId = Guid.NewGuid();
        var friesId = Guid.NewGuid();
        var cokeId = Guid.NewGuid();

        modelBuilder.Entity<Product>().HasData(
            new Product { Id = bigBurgerId, Name = "Big Burger", BasePrice = 8.50m, CategoryId = catBurgerId },
            new Product { Id = chickenBurgerId, Name = "Chicken Burger", BasePrice = 7.50m, CategoryId = catBurgerId },
            new Product { Id = friesId, Name = "Frites", BasePrice = 3.00m, CategoryId = catSideId },
            new Product { Id = cokeId, Name = "Coca-Cola", BasePrice = 2.50m, CategoryId = catDrinkId }
        );

        // Loyalty Account
        var marineLoyaltyId = Guid.NewGuid();
        modelBuilder.Entity<LoyaltyAccount>().HasData(
            new LoyaltyAccount
            {
                Id = marineLoyaltyId,
                FullName = "Marine L",
                Email = "marine@example.com",
                PhoneNumber = "0612345678",
                LoyaltyNumber = "QR-MARINE-001",
                Points = 320
            }
        );
    }
}
