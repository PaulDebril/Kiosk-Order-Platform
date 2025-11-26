public class Product
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public decimal BasePrice { get; set; }
    public Guid CategoryId { get; set; }

    public List<ProductIngredient>? Ingredients { get; set; }
    public List<ProductOption>? Options { get; set; }
    public List<Guid>? ExtraIds { get; set; }
}
