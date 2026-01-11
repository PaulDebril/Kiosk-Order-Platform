public class Product
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string Image { get; set; } = "";
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = ""; // To simplify frontend mapping
    public int? Calories { get; set; }
    public bool IsPopular { get; set; }

    public List<string>? Ingredients { get; set; }
    public List<ProductOption>? Options { get; set; }
    public List<Guid>? ExtraIds { get; set; }
    
    [System.Text.Json.Serialization.JsonIgnore]
    public Category? Category { get; set; }
}



